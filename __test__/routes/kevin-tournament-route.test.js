'use strict';

const superagent = require('superagent');
const mock = require('../lib/mocks');
const server = require('../../lib/server');
const debug = require('debug')('http:kevin-tournament-route-post-test');
//const User = require('../../model/user-model');
//const Tournament = require('../../model/tournament-model');

const thisYear = new Date().getFullYear();

debug('kevin-tournament-route-post-test');
const __API_URL__ = `${process.env.API_URL}/api/v1`;

debug('__API_URL__', __API_URL__);

describe('Tournament route POST test', function(){
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  beforeAll(() => mock.removeUsers());
  beforeAll(() => mock.removeTournaments());
  beforeAll(() => mock.removeDivisions());

  beforeAll(() => {
    return mock.user.create()
      .then(userData => {
        debug('userData', userData);
        return this.userData = userData;
      })
      .catch(err => console.error(err));
  });

  beforeAll(() => {
    let divisionsData = ['boys', 'girls'].map(classify => [9, 10, 11, 12, 13, 14].map(age => mock.new_division(`U${age}`, classify)));
    this.divisionsData = [...divisionsData[0], ...divisionsData[1]];
    this.tournamentData = mock.new_tournament();
  });

  describe('Valid input', () => {

    beforeAll(() => {
      debug('userData token', this.userData.token);
      debug('this.TournamentData', this.tournamentData);
      //let postData = {};
      //postData.tournament = this.tournamentData;
      //postData.divisions = this.divisionsData;
      return superagent.post(`${__API_URL__}/tournament/create`)
        .set('Authorization', `Bearer ${this.userData.token}`)
        .send(this.tournamentData)
        .then(res => {
          this.tournamentPost = res.body;
          this.tournamentId = res.body._id;
          debug('Tournament post', res.body);
        })
        .catch(err => console.error('tournament', err));
    });

    beforeAll(() => {
      return Promise.all(this.divisionsData.map(div => 
        mock.division.create(this.tournamentId, div)
      ))
        .then(divs => {
         // debug('divisions created', divs);
          this.CreatedDivisions = divs;

          let divMap = {};
          this.CreatedDivisions.forEach(div => {
            if (!divMap[div.classification]) divMap[div.classification] = {};
            let birthYear = thisYear - parseInt(div.agegroup.substr(1));
            divMap[div.classification][birthYear] = div._id;
          });
          debug('divMap', divMap);
          this.divMap = divMap;
        })
        .catch(console.error);
    });

    beforeAll(() => {
      // let teams = ['boys', 'girls'].map(classify => [2009, 2008, 2007, 2006, 2005, 2004].map(birthYear => mock.new_team(birthYear, classify)));
      let teams = ['boys', 'girls'].map(classify => [2009, 2008, 2007, 2006, 2005, 2004].reduce((acc, birthYear) => {     acc = [ ...acc, ...[...Array(16)].map(() => mock.new_team(birthYear, classify))];
        return acc;
      }, []));
    //  debug('teams', teams[0]);
      this.teams = [...teams[0], ...teams[1]];
      return Promise.all(this.teams.map(team => 
        mock.team.create(team)
      ))
        .then(teams => {
         // debug('teams created', teams);

          this.CreatedTeams = teams;
          let divisionTeams = {};
          this.CreatedTeams.forEach(team => {
            if (!divisionTeams[this.divMap[team.classification][team.birthyear]]) divisionTeams[this.divMap[team.classification][team.birthyear]] = [];
            divisionTeams[this.divMap[team.classification][team.birthyear]].push(team._id);
          });
         // debug('divisionTeams', divisionTeams);
          this.divisionTeams = divisionTeams;

          let team_bulkUpdate = teams.reduce((acc, cur) => {
            acc.push(
              { 
                updateOne: {
                  filter: {_id: cur._id},
                  update: {tournaments: [...cur.tournaments, this.tournamentId]},
                },
              });
            return acc;
          },[]);
          debug('bulkUpdate', team_bulkUpdate[0].updateOne.update.tournaments);
          return mock.team.bulk_write(team_bulkUpdate);
        })
        .catch(console.error);
    });

    // beforeAll(() => {
    //   return  mock.teams.findByTournament(this.tournamentI)
    //     .then(teams => {
    //       debug('Teams by tournamnet', teams);
    //     });
    // });

    beforeAll(() => {
      return Promise.all(Object.keys(this.divisionTeams).map(divId => mock.division.populate(this.divisionTeams[divId], divId)))
        .then(games => {
         // debug('games', games);
        })
        .catch(console.error);
    });

    beforeAll(() => {
      return  Promise.all(Object.keys(this.divisionTeams).map(divId =>  mock.division.find(divId)))
        .then(divisions => {
        //  debug('divisions', divisions[0]);
        //  debug('teamA', divisions[0].groupA[0].teamA.name);
        });
    });

    beforeAll(() => {
      return mock.teamPoints.createAll(this.divisionTeams);
    });

  

    // beforeAll(() => {
    //   return mock.tournament.find(this.tournamentId)
    //     .then(tournament => {
    //       debug('tournment', tournament);
    //       debug('division 1 game 1', tournament.divisions[0].groupA[0]);
    //     });
    // });

    beforeAll(() => {
      return superagent.get(`${__API_URL__}/tournamentowner/user`)
        .set('Authorization', `Bearer ${this.userData.token}`)
        .then(res => {
          this.tournaments = res.body;
          debug('tournments', this.tournaments);
          debug('division[0]', this.tournaments[0].divisions[0]);
        });
    });


    it('should create a new tournament', () => {
      expect(this.TournamentData).not.toBeNull();
    });

  });
});