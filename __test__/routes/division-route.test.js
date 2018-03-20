'use strict';

const mock = require('../lib/mocks');
const server = require('../../lib/server');
const superagent = require('superagent');
require('jest');
var divisionNumber;
var newUser = mock.new_user();
var newDivision = mock.new_division('U10', 'boys');
console.log('new ivision before anything else', newDivision)

var token;

beforeAll(() => server.start());
beforeAll(() => {
  return superagent.post(`:${process.env.PORT}/api/v1/signup`)
    .send(newUser)
    .then((response) => {
      console.log('response from post', response.body);
      token = response.body;        
    });  
});
afterAll(() => server.stop());





describe('simple mock test', () => {
  
  it('should return a 201 code if created', () => {
    console.log('this token', token);
    return superagent.post(`:${process.env.PORT}/api/v1/division/create`)
      .set('Authorization', `Bearer ${token}`)
      .send(newDivision)
      .then((response) => {
        expect(response.status).toBe(201);
        divisionNumber = response.body._id;
        console.log('division number after post', divisionNumber);
        
      });  
  });
  it('should return a 201 code if created', () => {
    console.log('this token', token);
    return superagent.post(`:${process.env.PORT}/api/v1/division/create`)
      .set('Authorization', `Bearer ${token}`)
      .send(newDivision)
      .then((response) => {
        expect(response.status).toBe(201);
        divisionNumber = response.body._id;
        console.log('division number after post', divisionNumber);
        
      });  
  });

  


});
