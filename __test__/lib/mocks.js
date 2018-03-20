'use strict';

const faker = require('faker');
const User = require('../../model/user-model');
const Tournament = require('../../model/tournament-model');
const Division = require('../../model/division-model');
const Game = require('../../model/game-model');
const debug = require('debug')('http:mock');

debug('mock data');

const mock = module.exports = {};
mock.user = {};
mock.game = {};

mock.new_user = () => ({
  fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  password: `${faker.internet.password()}_${Math.random()}`,
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
    name: `${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    birthyear: birthyear,
    classification: classification,
  }
);

mock.game.create = () => {
   
  let newGame = new Game();
  newGame.division = '5aaf248169009747716ed73d';
  newGame.gamenumber = 1;
    
  return newGame.save()
    .then(game => {
      console.log(game);
      return game;
    })
    .catch(console.error);
};

mock.removeUsers = () => Promise.all([User.remove()]); 
mock.removeTournaments = () => Promise.all([Tournament.remove()]);
mock.removeDivisions = () => Promise.all([Division.remove()]);