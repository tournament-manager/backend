'use strict';

const faker = require('faker');
const User = require('../../model/user-model');
const Tournament = require('../../model/tournament-model');

const mock = module.exports = {};
mock.user = {};

mock.new_user = () => ({
  email: faker.internet.email,
  password: `${faker.internet.password()}_${Math.random()}`,
  notification: true,
});

mock.user.create = () => {
  let userData = {};
  mock.user.user = mock.new_user();
  mock.user.user.username = mock.new_user.email;
  userData.password = mock.user.user.password;
  let newUser = User(mock.new_user);
  newUser.generatePasswordHash()
    .then(newUser => newUser.save()) 
    .then(newUser => newUser.generateToken())
    .then(token => {
      userData.user = newUser;
      userData.token = token;
      return userData;
    })
    .catch(console.error);
};

mock.removeUsers = () => Promise.all([User.remove()]); 
mock.removeTournaments = () => Promise.all([Tournament.remove()]);