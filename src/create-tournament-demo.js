'use strict';

const faker = require('faker');
const Tournament = require('../model/tournament-model');
const Division = require('../model/division-model');
const Team = require('../model//team-model');
const gamesPopulate = require('../src/games-for-division');
const TeamPoints = require('../model/team-points');
const pointTally = require('../src/point_tally');
const Game = require('../model/game-model');

module.exports = class TournamentDemo {
  constructor(userId){
    this.userId = userId;
    this.tournament = null;
  }
  createTournamentDemoData(){
    return this.createTournament()
      .then(() => this.createDivision('U11', 'boys'))
      .then(() => this.addDivision())
      .then(() => this.createTeams())
      .then(() => this.addTeams('2007', 'boys'))
      .then(() => this.populateDivision())
      .then(() => this.createTeamPointsDocuments())
      .then(() => this.scoreGroupGames())
      .then(() => this.tournament);
  }

  createTournament(){
    let tournament = {
      name: `${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      director: this.userId,
      dateStart: new Date(),
      dateEnd: new Date(new Date().setDate(new Date().getDate() + 3)),
    };

    return new Tournament(tournament).save()
      .then(tournament => {
        return this.tournament = tournament;
      })
      .catch(err => err);
  }

  createDivision(ageGroup, classification){
    let division = {
      name: `${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      tournament: this.tournament._id,
      agegroup: ageGroup,
      classification: classification,
    };

    return new Division(division).save()
      .then(division => {
        return  this.division = division;
      })
      .catch(err => err);
  }

  addDivision(){
    return Tournament.findById(this.tournament._id)
      .then(tournament => {
        tournament.divisions.push(this.division._id);
        return tournament.save();
      })
      .catch(err => err);
  }

  _newTeamData(birthyear, classification){
    return (
      {
        name: `${faker.hacker.adjective()} ${faker.hacker.noun()}s`,
        birthyear: birthyear,
        classification: classification,
      }
    );
  }

  createTeams(){
    let teams = ['boys', 'girls'].map(classify => [2009, 2008, 2007, 2006, 2005, 2004].reduce((acc, birthYear) => {     acc = [ ...acc, ...[...Array(16)].map(() => this._newTeamData(birthYear, classify))];
      return acc;
    }, []));

    let allTeams = [...teams[0], ...teams[1]];
    return Promise.all(allTeams.map(team =>
      Team(team).save()
    ))
      .then(teams => this.teams = teams)
      .catch(err => err);
  }

  addTeams(birthyear, classification){
    this.teams = this.teams.filter(team => team.classification === classification && team.birthyear === birthyear);
    let team_bulkUpdate = this.teams.reduce((acc, cur) => {
      acc.push(
        {
          updateOne: {
            filter: {_id: cur._id},
            update: {tournaments: [...cur.tournaments, this.tournament._id]},
          },
        });
      return acc;
    },[]);

    return Team.bulkWrite(team_bulkUpdate)
      .catch(err => err);
  }

  populateDivision(){
    return gamesPopulate(this.teams, this.division._id)
      .then(returnArray => {
        return  Division.findById(this.division._id)
          .then(division => {
            if(division._id.toString() === this.division._id.toString()){
              division.groupA = returnArray[0];
              division.groupB = returnArray[1];
              division.groupC = returnArray[2];
              division.groupD = returnArray[3];
              division.consolidation = returnArray[4];
              division.semiFinal = returnArray[5];
              division.final = returnArray[6];

              return division.save()
                .then(division => this._findDivision(division._id));
            }
            return null;
          });
      });
  }

  createTeamPointsDocuments(){
    let teamPoint_schemas = this.teams.reduce((teamPointsArray, team) => {
      teamPointsArray.push({
        division: this.division._id,
        team: team,
      });
      return teamPointsArray;
    }, []);
    return TeamPoints.create(teamPoint_schemas);
  }

  _findDivision(divId){
    return Division.findById(divId)
      .populate({
        path:'groupA groupB groupC groupD',
        populate: {
          path: 'teamA teamB',
        },
      })
      .then(division => {
        return this.division = division;
      });
  }

  scoreGroupGames(){
    let games = ['groupA', 'groupB', 'groupC', 'groupD'].reduce((gamesList, round) => gamesList.concat(this.division[round]),[]);

    //bulkwrite array for games
    let gamesUpdate = [];
    //bulkwrite array for teamPoints
    let teamPointsUpdate = [];
    //map of team point totals;
    let teamPointsTotals = {};

    //sort games asscending by game number
    games = games.sort((a,b) => a.gamenumber - b.gamenumber);

    //create update objects for game bulkwrite
    games.forEach(game => {
      //don't score the last games in each group
      if (!(game.gamenumber % 6)) return;

      //randomly generate scores for each team
      let [teamAResult, teamBResult] = ['teamAResult', 'teamBResult'].map(() =>   Math.floor(Math.random() * 4));
      //tally points for each team
      let {a: pointsA, b: pointsB} = pointTally(teamAResult, teamBResult);

      if (!teamPointsTotals[game.teamA._id]) teamPointsTotals[game.teamA._id] = 0;
      if (!teamPointsTotals[game.teamB._id]) teamPointsTotals[game.teamB._id] = 0;

      teamPointsTotals[game.teamA._id] += pointsA + game.teamARollingTotal;
      teamPointsTotals[game.teamB._id] += pointsB + game.teamBRollingTotal;

      gamesUpdate.push(
        {
          updateOne: {
            filter: {_id: game._id},
            update: {
              teamAResult: teamAResult,
              teamBResult: teamBResult,
              teamAPoints: pointsA,
              teamBPoints: pointsB,
              teamARollingTotal: teamPointsTotals[game.teamA._id],
              teamBRollingTotal: teamPointsTotals[game.teamB._id],
              complete: true,
            },
          },
        });
    });

    //create update objects for teamPoints bulkwrite
    Object.keys(teamPointsTotals).forEach(team => {
      teamPointsUpdate.push(
        {
          updateOne: {
            filter: {team: team, division: this.division._id},
            update: {
              points: teamPointsTotals[team],
            },
          },
        }
      );
    });

    return Promise.all([
      TeamPoints.bulkWrite(teamPointsUpdate),
      Game.bulkWrite(gamesUpdate),
    ]);

  }
};