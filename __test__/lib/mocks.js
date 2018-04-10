'use strict';

const faker = require('faker');
const User = require('../../model/user-model');
const Tournament = require('../../model/tournament-model');
const Division = require('../../model/division-model');
const Team = require('../../model//team-model');
const Game = require('../../model/game-model');
const TeamPoints = require('../../model/team-points');
const debug = require('debug')('http:mock');
const gamesPopulate = require('../../src/games-for-division');
const pointTally = require('../../src/point_tally');
const advanceTeams = require('../../src/advance-teams');

debug('mock data');

const mock = module.exports = {};
mock.user = {};
mock.game = {};
mock.division = {};
mock.team = {};
mock.tournament = {};
mock.teamPoints = {};

// mock.new_user = () => ({
//   fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
//   email: faker.internet.email(),
//   password: `${faker.internet.password()}_${Math.random()}`,
//   notification: true,
// });

mock.new_user = () => ({
  fullname: 'Kevin Miller',
  email: 'kevin@kevin.com',
  password: 'password',
  notification: true,
});

mock.user.create = () => {
  let userData = {};
  mock.user.user = mock.new_user();
  mock.user.user.username = mock.user.user.email;
  userData.password = mock.user.user.password;
  let newUser = User(mock.user.user);
  debug('unsaved newUser', newUser);
  return newUser.generatePasswordHash(mock.user.user.password)
    .then(newUser => {
      debug(newUser, 'newUser');
      return newUser.save();
    }) 
    .then(newUser => newUser.generateToken())
    .then(token => {
      userData.user = newUser;
      userData.token = token;
      return userData;
    })
    .catch(console.error);
};


mock.endDate = (days) => {
  let today = new Date();
  return new Date(today.setDate(today.getDate() + days));
};

mock.new_tournament = () => ({
  name: `${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
  director: null,
  dateStart: new Date(),
  dateEnd: mock.endDate(3),
});

mock.tournament.find = (id) =>{
  return Tournament.findById(id)
    .populate({
      path: 'divisions',
      populate: {
        path: 'groupA groupB groupC groupD consolidation semiFinal final',
        populate: {
          path: 'teamA teamB',
        },
      },
    }); 
};

mock.tournament.findByUser = (username) => {
  return Tournament.find()
    .populate({
      path : 'director' , 
      match : { username : username },
    });
};

mock.new_division = (ageGroup, classification) => (
  {
    name: `${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    tournament: null,
    agegroup: ageGroup,
    classification: classification,
  }
);
mock.new_team = (birthyear, classification) => (
  {
    name: `${faker.hacker.adjective()} ${faker.hacker.noun()}s`,
    birthyear: birthyear,
    classification: classification,
  }
);

mock.team.create = (team) => {
  return Team(team).save();
};

mock.team.findByTournament = (id) => {
  return Team.find({tournaments: id});
};

mock.division.create = (tournamentId, division) =>{
  division.tournament = tournamentId;
  return Division(division).save()
    .then(division => {
      let divId = division._id;
      Tournament.findById(tournamentId)
        .then(tournament => {
          tournament.divisions.push(divId);
          tournament.save();
        });
      return division;
    });
};

mock.division.populate = (teamsArray, divisionId) => {
  return gamesPopulate(teamsArray, divisionId)
    .then(returnArray => {
      // console.log('return from fn', returnArray);

      return  Division.findById(divisionId)
        .then(division => {
          // console.log(division);
          if(division._id.toString() === divisionId.toString()){
            division.groupA = returnArray[0];
            division.groupB = returnArray[1];
            division.groupC = returnArray[2];
            division.groupD = returnArray[3];
            division.consolidation = returnArray[4];
            division.semiFinal = returnArray[5];
            division.final = returnArray[6];
          
            return division.save();
          }
          return null;
        });
    });
};

mock.division.find = (id) => {
  return Division.findById(id)
    .populate({
      path: 'groupA groupB groupC groupD consolidation semiFinal final',
      populate: {
        path: 'teamA teamB',
      },
    });
};

mock.team.bulk_write = (data) => {
  return Team.bulkWrite(data);
};

mock.game.create = () => {
   
  let newGame = new Game();
  newGame.division = `5ab4e754c5eef667e4ba048e`;
  newGame.gamenumber = 1;
    
  return newGame.save()
    .then(game => {
      return game;
    })
    .catch(console.error);
};

mock.game.scorecard = (games) => {

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
    if (game.gamenumber > 24) return;

    //randomly generate scores for each team
    let [teamAResult, teamBResult] = ['teamAResult', 'teamBResult'].map(() =>   Math.floor(Math.random() * 4));
    //tally points for each team
    let {a: pointsA, b: pointsB} = pointTally(teamAResult, teamBResult);

    debug('game', game);

    if (!teamPointsTotals[game.teamA._id]) teamPointsTotals[game.teamA._id] = 0;
    if (!teamPointsTotals[game.teamB._id]) teamPointsTotals[game.teamB._id] = 0;

    teamPointsTotals[game.teamA._id] += pointsA;
    teamPointsTotals[game.teamB._id] += pointsB;

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

  debug('gamesUpdate', gamesUpdate[0]);

  //create update objects for teamPoints bulkwrite
  Object.keys(teamPointsTotals).forEach(team => {
    teamPointsUpdate.push(
      { 
        updateOne: {
          filter: {team: team, division: games[0].division},
          update: {
            points: teamPointsTotals[team],
          },
        },
      }
    );
  });

  debug('teamPointsUpdate', teamPointsUpdate[0]);

  return Promise.all([
    TeamPoints.bulkWrite(teamPointsUpdate),
    Game.bulkWrite(gamesUpdate),
  ]);
  
};   

mock.game.advanceTeams = (game) =>{
  debug('game', game);
  return advanceTeams(game);
};

mock.teamPoints.createAll = (divisionTeams) => {
  let teamPoint_schemas = Object.keys(divisionTeams).reduce((teamPointsArray, division) => {
    divisionTeams[division].forEach(team => {
      teamPointsArray.push({
        division: division,
        team: team,
      });
    });
    return teamPointsArray;
  }, []);

  return TeamPoints.create(teamPoint_schemas);

};

mock.removeUsers = () => Promise.all([User.remove()]); 
mock.removeTournaments = () => Promise.all([Tournament.remove()]);
mock.removeDivisions = () => Promise.all([Division.remove()]);