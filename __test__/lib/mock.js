'use strict';

const faker = require('faker');
const User = require('../../model/user-model');
const Tournament = require('../../model/tournament-model');
const Division = require('../../model/division-model');
const debug = require('debug')('http:mock');

debug('mock data');

const mock = module.exports = {};
mock.user = {};

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

mock.newTournamentData = () => ({
  name: `${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
  director: null,
  dateStart: new Date(),
  dateEnd: mock.endDate(3),
});

mock.new_division = (ageGroup, classification) => (
  {
    name: `${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    tournament: null,
    ageGroup: ageGroup,
    classification: classification,
  }
);

mock.removeUsers = () => Promise.all([User.remove()]); 
mock.removeTournaments = () => Promise.all([Tournament.remove()]);
mock.removeDivisions = () => Promise.all([Division.remove()]);