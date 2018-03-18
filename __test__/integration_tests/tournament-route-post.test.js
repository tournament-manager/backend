'use strict';

const superagent = require('superagent');
const mock = require('../lib/mock');
const server = require('../../lib/server');
const User = require('../../model/user-model');
const Tournament = require('../../model/tournament-model');

const __API_URL__ = process.env.API_URL;

describe('Tournament route POST test', function(){

  beforeAll(() => server.start());
  afterAll(() => server.stop());
  afterAll(() => mock.removeUsers());
  afterAll(() => mock.removeTournaments());

  beforeAll(() => {
    this.userData = mock.user.create();
  });

  describe('Valid input', () => {

    it('should create a new tournament', () => {
      return superagent.post(`${__API_URL__}/tournament`)
        .auth('Authorization', `Bearer ${this.userData.token}`)
        .send()
        .then(res => this.res = res)
        .catch();
    });

  });
});