'use strict';

const superagent = require('superagent');
const mock = require('../lib/mocks');
const server = require('../../lib/server');
const debug = require('debug')('http:kevin-tournament-create-demo-test');
const DemoTournament = require('../../src/create-tournament-demo');

//const thisYear = new Date().getFullYear();

debug('kevin-tournament-create-demo-test');
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

  describe('create tournament', () => {

    beforeAll(() => {
      this.demo = new DemoTournament(this.userData.user._id);
      return this.demo.createTournament()
        .then(tournament => {
          debug('tournament', tournament);
          return this.tournament = tournament;
        })
        .catch(err => console.error(err));
    });

    it('should create a new tournament with the current user', () => {
      expect(this.tournament.director).toEqual(this.userData.user._id);
    });

  });

  describe('create division', () => {
   
    beforeAll(() =>{
      return this.demo.createDivision('U11', 'boys')
        .then(division => {
          debug('division', division);
          this.division = division;
        });
    });

    beforeAll(() =>{
      return this.demo.addDivision()
        .then(tournament => {
          debug('tournament', tournament);
          this.tournament = tournament;
        });
    });
    
    it('should create a new division', () => {
      expect(this.division.tournament).toEqual(this.tournament._id);
    });

    it('should add division id to tournament', () => {
      expect(this.tournament.divisions).toEqual(expect.arrayContaining([this.division._id]));
    });

  });

  describe('add teams', () => {

    beforeAll(() => {
      return this.demo.createTeams()
        .then(allTeams => {
          //debug('All Teams', allTeams);
          return this.allTeams = allTeams;
        });
    });

    beforeAll(() => {
      return this.demo.addTeams('2007', 'boys')
        .then(bulkWrite_status => {
          debug('bulkWrite_status', bulkWrite_status);
          return this.bulkWrite_status = bulkWrite_status;
        });
    });

    it('should create teams', () => {
      expect(this.allTeams.length).toEqual(192);
    });

    it('should add teams to tournament', () => {
      expect(this.bulkWrite_status.modifiedCount).toEqual(16);
    });

  });

  describe('populate division with games with teams', () => {
    
    beforeAll(() => {
      return this.demo.populateDivision()
        .then(division => {
         // debug('division', division);
          return this.division = division;
        });
    });

    it('should add games and teams to the division', () => {
      expect(this.division.groupA).toBeInstanceOf(Array);
    });

  });

  describe('create team points documents', () => {
  
    beforeAll(() => {
      return this.demo.createTeamPointsDocuments()
        .then(teamPointsDocs => this.teamPointsDocs = teamPointsDocs);
    });

    it('should create 16 documents', () => {
      expect(this.teamPointsDocs.length).toEqual(16);
      expect(this.teamPointsDocs[0].division).toEqual(this.division._id);
    });

  });

  describe('randomly score each group game except for the last ones in each group', () => {
    beforeAll(() => {
      return this.demo.scoreGroupGames()
        .then(pointsGames => {
          debug('pointsGames[1]', pointsGames[1]);
          debug('teamPoints_status', pointsGames[0]);
          this.teamPoints_status =  pointsGames[0];
          this.scoredGames_status =  pointsGames[1];
        })
        .catch(console.error);
    });

    beforeAll(() => {
      console.log('this.division._id', this.division._id);
      return mock.division.find(this.division._id)
        .then(division => {
          return this.division = division;
        });
    });

    it('should modify games and teamPoints', () => {
      expect(this.teamPoints_status.matchedCount).toEqual(16);
      expect(this.scoredGames_status.modifiedCount).toEqual(20);
    });

    it('should complete games', () => {
      expect(this.division.groupA[0].complete).toBe(true);
    });
 
  }); 

  describe('Should create demo tournament data', () => {
    
    beforeAll(() => {
      return this.demo = new DemoTournament(this.userData.user._id).createTournamentDemoData()
        .then(tournament => {
          return mock.tournament.find(tournament._id);
        })
        .then(tournament => {
          return this.tournament = tournament;
        });

    });

    it('should create a new tournament', () => {
      expect(this.tournament.divisions[0].groupA[0].complete).toBe(true);
    });
    
  });

  describe('Should create demo tournament data when hitting the post route', () => {

    beforeAll(() => {
      return superagent.post(`${ __API_URL__}/tournament/create_demo`)
        .set({'Authorization' : `Bearer ${this.userData.token}`})
        .then(response => {
          debug('response.body', response.body);
          return this.tournament = response.body;
        });
    });

    it('should create a new tournament', () => {
      expect(this.tournament.director).toEqual(this.userData.user._id.toString());
    });

  });
 
});
