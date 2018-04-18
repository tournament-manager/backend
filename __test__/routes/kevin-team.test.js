'use strict';

const mock = require('../lib/mocks');
const server = require('../../lib/server');
const debug = require('debug')('http:kevin-team-tests');

const thisYear = new Date().getFullYear();

debug('kevin-team-test');
const __API_URL__ = `${process.env.API_URL}/api/v1`;

debug('__API_URL__', __API_URL__);

describe('Tournament route POST test', function(){
  beforeAll(() => server.start());
  afterAll(() => server.stop());
 
  describe('Valid input', () => {

    beforeAll(() => {
      return mock.tournament.findByUser()
        .then(tournaments => {
          debug('tournaments', tournaments);
          this.tournamentId = tournaments[0]._id;
        });
    });

    beforeAll(() => {
      return  mock.team.findByTournament(this.tournamentId)
        .then(teams => {
          //debug('Teams by tournament', teams);
          let teamsMap = teams.reduce((teamObj, team) => {
            if (!teamObj[this.tournamentId]) teamObj[this.tournamentId] = {};
            if (!teamObj[this.tournamentId][team.classification]) teamObj[this.tournamentId][team.classification] = {};
            //convert birthyear to ageGroup
            let ageGroup = `U${thisYear - team.birthyear}`;
            if (!teamObj[this.tournamentId][team.classification][ageGroup]) teamObj[this.tournamentId][team.classification][ageGroup] = [];
            teamObj[this.tournamentId][team.classification][ageGroup].push(team);
            return teamObj;
          }, {});
          debug('Teams by tournament  map', teamsMap);
        });
    });


    it('should find teams in a tournament', () => {
      expect(this.TournamentData).not.toBeNull();
    });

  });

});
