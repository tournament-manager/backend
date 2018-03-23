'use strict';

const mock = require('../lib/mocks');
const server = require('../../lib/server');
const superagent = require('superagent');
const User = require('../../model/user-model');
require('jest');

var newUser = mock.new_user();
var testUser = new User();
beforeAll(() => server.start());
afterAll(() => server.stop());


beforeAll(() => {
  return mock.user.create()
    .then(userData => {
      return this.userData = userData;
    }) 
    .catch(err => console.error(err));
});



describe('simple mock test', () => {
  it('should be correct', () => {
    expect(this.userData).toBeInstanceOf(Object);
  });
  it('should return a 201 code if created', () => {
    return superagent.post(`:${process.env.PORT}/api/v1/signup`)
      .send(newUser)
      .then((response) => {
        expect(response.status).toBe(201);
        
      });  
  });
  it('should return a 200 code if signed in', () => {
    return superagent.get(`:${process.env.PORT}/api/v1/signin`)
      .auth(`${newUser.email}:${newUser.password}`)
      
      .then((response) => {
        expect(response.status).toBe(200);
        
      });  
  });

  it('should return a 400 code if no email', () => {
    return superagent.post(`:${process.env.PORT}/api/v1/signup`)
      .send({
        password: 'hello',
      })
      .catch((response) => {
        expect(response.status).toBe(400);
      });
  });
  it('should should fail if no password password to comparePasswordHash', () =>{
    return testUser.comparePasswordHash()
      .catch(response => {
        expect(response.message).toMatch(/data and hash arguments required/);
      });
  });

});
