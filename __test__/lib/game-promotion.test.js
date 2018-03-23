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
var token;
const arrayofGames = [
  
  '5ab4ca04cd19ab509db41373',
  '5ab4ca04cd19ab509db41374',
  '5ab4ca04cd19ab509db41375',
  '5ab4ca04cd19ab509db41376',
];
const teams = [
  '5ab4059c50d3d8c6d51ed7ec',
  '5ab405c52eb8fbc6e1308455',
  '5ab405c8d8e780c6ede542fe',
  '5ab405cb386d0ec6f943830c',
  '5ab405ce5f2813c7050672bf',
  '5ab405d2a5b983c711ff9272',
  '5ab405d53c9db4c71d6ba8c7',
  '5ab405d837580ec7296ab737',
  '5ab405dca9c964c7356d0413',
  '5ab405dfbdfee9c741c86470',
  '5ab405e2db7dabc74d1858b9',
  '5ab405e7d87f6ec7592b4491',
  '5ab405ea867f25c7657ccab5',
  '5ab405ed171c60c7711f0575',
  '5ab405f1fe431ec77ddb7be1',
  '5ab405f4a0ae00c789704a8b',
];


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
  it('should return a 201 code if created', () => {
    
    return superagent.post(`:${process.env.PORT}/api/v1/division/populate/${divisionNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .send(teams)
      .then((response) => {
        expect(response.status).toBe(204);
        expect(response.body).toBeInstanceOf(Object);        
      });  
  });

  
 
  // it('should return a 200 code if a game is updated', () => {
    
  //   return superagent.get(`:${process.env.PORT}/api/v1/testgames/${divisionNumber}`)
     
  //     .then((response) => {
  //       expect(response.status).toBe(200);
  //       var testgames = response.body;
  //       console.log('testgames', testgames);
        
  //     })
  //   })
     
   
  

  it('should return an array of games from the divison ', () => {

    return gamePromo(`${divisionNumber}`)
      .then(response => {
        expect(response).toBeInstanceOf(Object);

      });

  });
  
            
  


  });
