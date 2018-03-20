'use strict';

const mock = require('../lib/mocks');
const server = require('../../lib/server');
const superagent = require('superagent');
require('jest');

var newUser = mock.new_user();
var token;


beforeAll(() => server.start());
beforeAll(() => {
  return mock.game.create()
    .then(gameData => {
      return this.gameData = gameData;
    })
    .catch(err => console.error(err));
});

beforeAll(() => {
  return superagent.post(`:${process.env.PORT}/api/v1/signup`)
    .send(newUser)
    .then((response) => {
      token = response.body;        
    });  
});
afterAll(() => server.stop());





describe('simple mock test', () => {
  
  
  it('should return a 200 code if found', () => {
    
    return superagent.get(`:${process.env.PORT}/api/v1/game/${this.gameData._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(200);
              
      });  
  });
  it('should return a 200 code if found', () => {
    
    return superagent.get(`:${process.env.PORT}/api/v1/game`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).not.toBe(null);
              
      });  
  });
  
  it('should return a 204 code if a game is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/${this.gameData._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 0})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 404 code if a game is updated with incorrect id', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/game/8888888888`)
      .set('Authorization', `Bearer ${token}`)
      .send({teamAResult: 1, teamBResult: 0})
      .catch((response) => {
        expect(response.status).toBe(404);
      
        
      });  
  });
  
});