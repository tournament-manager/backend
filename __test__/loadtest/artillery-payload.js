const faker = require('faker');

const loadTest = module.exports =  {};

loadTest.createUserData = (userContext, events, done) => {

  userContext.vars.email = faker.internet.email();
  userContext.vars.password = faker.internet.password() + Math.random();
  userContext.vars.fullname = `${faker.name.firstName()} ${faker.name.lastName()}`;
  userContext.vars.notification = true;

  return done();
};


loadTest.getToken = (requestParams, response, context, ee, next) => {
  context.vars.token = response.body;
  return next();
};
