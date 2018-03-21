const faker = require('faker');

const loadTest = module.exports =  {};

loadTest.createUserData = (userContext, events, done) => {

  userContext.vars.email = faker.internet.email();
  userContext.vars.password = faker.internet.password() + Math.random();
  userContext.vars.fullname = `${faker.name.firstName()} ${faker.name.lastName()}`;
  userContext.vars.notification = true;
  userContext.vars.name = `${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`;

  return done();
};


loadTest.getToken = (requestParams, response, context, ee, next) => {
  context.vars.token = response.body;
  return next();
};

loadTest.createTournament = (userContext, events, done) => {
  userContext.vars.name = `${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`;
  return done();
};
