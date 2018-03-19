'use strict';

const superagent = require('superagent');
const mock = require('../lib/mock');
const server = require('../../lib/server');
const debug = require('debug')('http:tournament-route-post-test');
//const User = require('../../model/user-model');
//const Tournament = require('../../model/tournament-model');

debug('tournament-route-post-test');
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
    this.tournamentData = mock.newTournamentData();
  });

  describe('Valid input', () => {

    beforeAll(() => {
      debug('userData token', this.userData.token);
      debug('this.TournamentData', this.TournamentData);
      let postData = {};
      postData.tournament = this.tournamentData;
      postData.divisions = this.divisionsData;
      return superagent.post(`${__API_URL__}/tournament`)
        .set('Authorization', `Bearer ${this.userData.token}`)
        .send(postData)
        .then(res => {
          this.tournamentPost = res.body;
          debug(res.body);
        })
        .catch(err => console.error('tournament', err));
    });

    it('should create a new tournament', () => {
      expect(this.TournamentData).not.toBeNull();
    });

  });
});