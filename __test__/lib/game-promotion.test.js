'use strict';

const gamePromo = require('../../src/game-promotion');
const Division = require('../../model/division-model');
const mock = require('../lib/mocks');
const server = require('../../lib/server');
var token;
var divisionNumber;
const superagent = require('superagent');
require('jest');
var newUser = mock.new_user();
var newDivision = mock.new_division('U10', 'boys');


beforeAll(() => server.start());
beforeAll(() => {
  return superagent.post(`:${process.env.PORT}/api/v1/signup`)
    .send(newUser)
    .then((response) => {
      token = response.body;        
    });  
});
afterAll(() => server.stop());


describe('testing the game promotion unit', () => {
  
  it('should return a 201 code if created', () => {
    
    return superagent.post(`:${process.env.PORT}/api/v1/division/create`)
      .set('Authorization', `Bearer ${token}`)
      .send(newDivision)
      .then((response) => {
        expect(response.status).toBe(201);
        divisionNumber = response.body._id;        
      });  
  });
  
  it('should return an array of games from the divison ', () => {
    
    gamePromo('5ab1cc7c099bbc09e047971e')
      .then(response => {
        expect(response).toBeInstanceOf(Array);

      });
    
  });


});

