'use strict';

const mock = require('../lib/mocks');
const server = require('../../lib/server');
const superagent = require('superagent');
require('jest');

var newUser = mock.new_user();
var newTeam = mock.new_team('2008', 'boys');
var teamNumber;
var token;

beforeAll(() => server.start());
beforeAll(() => {
  return superagent.post(`:${process.env.PORT}/api/v1/signup`)
    .send(newUser)
    .then((response) => {
      token = response.body;        
    });  
});
afterAll(() => server.stop());





describe('simple mock test', () => {
  
  it('should return a 201 code if created', () => {
    
    return superagent.post(`:${process.env.PORT}/api/v1/team/signup`)
      .set('Authorization', `Bearer ${token}`)
      .send(newTeam)
      .then((response) => {
        expect(response.status).toBe(201);
        teamNumber = response.body._id;        
      });  
  });
  it('should return a team when team number supplied', () => {
    
    return superagent.get(`:${process.env.PORT}/api/v1/teams/${teamNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        
      });  
  });
  it('should return all teams when no team number is supplied', () => {
    
    return superagent.get(`:${process.env.PORT}/api/v1/teams`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).not.toBe(null);
        
      });  
  });
  it('should return a 204 code if a team is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/teams/${teamNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .send({classification: 'not boys or girls'})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 404 code if a team is updated without a team id', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/teams/8888888`)
      .set('Authorization', `Bearer ${token}`)
      .send({classification: 'not boys or girls'})
      .catch((response) => {
        expect(response.status).toBe(404);
      
        
      });  
  });
  it('should return a 204 code when a team is deleted', () => {
    
    return superagent.delete(`:${process.env.PORT}/api/v1/teams/${teamNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(204);

      });  
  });
  it('should return a 404 code on delete route when incorrect team id ', () => {
    
    return superagent.delete(`:${process.env.PORT}/api/v1/teams/77777777`)
      .set('Authorization', `Bearer ${token}`)
      .catch((response) => {
        expect(response.status).toBe(404);

      });  
  });

});