'use strict';

const gamePromo = require('../../src/game-promotion');
const Division = require('../../model/division-model');
const mock = require('../lib/mocks');
const server = require('../../lib/server');
const popTest = require('../../src/populate-test');
var token;
var divisionNumber;
const superagent = require('superagent');
require('jest');
var newUser = mock.new_user();
var newDivision = mock.new_division('U10', 'boys');

const arrayofGames = [
  
  '5ab4ca04cd19ab509db41373',
  '5ab4ca04cd19ab509db41374',
  '5ab4ca04cd19ab509db41375',
  '5ab4ca04cd19ab509db41376',
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
  
  // it('should return a 201 code if created', () => {
    
  //   return superagent.post(`:${process.env.PORT}/api/v1/division/create`)
  //     .set('Authorization', `Bearer ${token}`)
  //     .send(newDivision)
  //     .then((response) => {
  //       expect(response.status).toBe(201);
  //       divisionNumber = response.body._id;        
  //     });  
  // });
  //------------update game 1
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  //----------------update game 2
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[1]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 1, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  //-------------------update game 3
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[2]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 2, teamBResult: 1, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
    //-----------------update game 4
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[3]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 3, teamBResult: 1, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  // -----------------update game 5
  // it('should return a 204 code if a game is updated', () => {
    
  //   return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[4]}`)
  //     .set('Authorization', `Bearer ${token}`)
  //     .send({teamAResult: 4, teamBResult: 3, complete: true})
  //     .then((response) => {
  //       expect(response.status).toBe(204);
      
        
  //     });  
  // });
  // // -----------------update game 6
  // it('should return a 204 code if a game is updated', () => {
    
  //   return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[5]}`)
  //     .set('Authorization', `Bearer ${token}`)
  //     .send({teamAResult: 4, teamBResult: 3, complete: true})
  //     .then((response) => {
  //       expect(response.status).toBe(204);
      
        
  //     });  
  // });
  
  
  it.only('should return an array of games from the divison ', () => {
    
    return gamePromo('5ab4ca04cd19ab509db4135a')
      .then(response => {
        expect(response).toBeInstanceOf(Array);

      });
    
  });
  // it('should return console log my test ', () => {
    
  //   popTest('5ab1cc7c099bbc09e047971e');
      
    
  // });


});

