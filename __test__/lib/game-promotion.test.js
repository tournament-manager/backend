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
  '5ab43e45af5bc5ff28a5c732',
  '5ab43e45af5bc5ff28a5c733',
  '5ab43e45af5bc5ff28a5c734',
  '5ab43e45af5bc5ff28a5c735',
  '5ab43e45af5bc5ff28a5c736',
  '5ab43e45af5bc5ff28a5c737',
  '5ab43e45af5bc5ff28a5c738',
  '5ab43e45af5bc5ff28a5c739',
  '5ab43e45af5bc5ff28a5c73a',
  '5ab43e45af5bc5ff28a5c73b',
  '5ab43e45af5bc5ff28a5c73c',
  '5ab43e45af5bc5ff28a5c73d',
  '5ab43e45af5bc5ff28a5c73e',
  '5ab43e45af5bc5ff28a5c73f',
  '5ab43e45af5bc5ff28a5c740',
  '5ab43e45af5bc5ff28a5c741',
  '5ab43e45af5bc5ff28a5c742',
  '5ab43e45af5bc5ff28a5c743',
  '5ab43e45af5bc5ff28a5c744',
  '5ab43e45af5bc5ff28a5c745',
  '5ab43e45af5bc5ff28a5c746',
  '5ab43e45af5bc5ff28a5c747',
  '5ab43e45af5bc5ff28a5c748',
  '5ab43e45af5bc5ff28a5c749',
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
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[1]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 1, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[2]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[3]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 0, teamBResult: 3, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[4]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 4, teamBResult: 3, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[5]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 3, teamBResult: 0, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[6]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 0, teamBResult: 1, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[7]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 2, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[8]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 0, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[9]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 2, teamBResult: 1, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[10]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 1, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[11]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 3, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[12]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 3, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[13]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 4, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[14]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 0, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[15]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 2, teamBResult: 1, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[16]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 2, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[17]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 4, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[18]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 0, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[19]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[20]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 1, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[21]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 3, teamBResult: 2, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[22]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 0, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${arrayofGames[23]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 3, complete: true})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  
  it('should return an array of games from the divison ', () => {
    
    gamePromo('5ab43e45af5bc5ff28a5c731')
      .then(response => {
        expect(response).toBeInstanceOf(Array);

      });
    
  });
  // it('should return console log my test ', () => {
    
  //   popTest('5ab1cc7c099bbc09e047971e');
      
    
  // });


});

