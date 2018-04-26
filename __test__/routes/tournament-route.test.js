'use strict';

const mock = require('../lib/mocks');
const server = require('../../lib/server');
const superagent = require('superagent');
require('jest');
var tournamentNumber;
var newUser = mock.new_user();
var newTournament = mock.new_tournament();

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
    
    return superagent.post(`:${process.env.PORT}/api/v1/tournament/create`)
      .set('Authorization', `Bearer ${token}`)
      .send(newTournament)
      .then((response) => {
        expect(response.status).toBe(201);
        tournamentNumber = response.body._id;        
      });  
  });
  
  it('should return a tournament when tournament number supplied', () => {
    
    return superagent.get(`:${process.env.PORT}/api/v1/tournament/${tournamentNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        
      });  
  });

  it('should return all tournaments when no tournament id supplied', () => {
    
    return superagent.get(`:${process.env.PORT}/api/v1/tournament`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).not.toBe(null);
      });  
  });

  it('should return a 204 code if a tournament is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/tournament/${tournamentNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .send({name: 'we all want a summer holiday'})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 404 code if a tournament is updated with incorrect id', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/tournament/7777777777`)
      .set('Authorization', `Bearer ${token}`)
      .send({name: 'we all want a summer holiday'})
      .catch((response) => {
        expect(response.status).toBe(404);
      
        
      });  
  });
  it('should return a 204 code when a tournament is deleted', () => {
    
    return superagent.delete(`:${process.env.PORT}/api/v1/tournament/${tournamentNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 404 code when a tournament is deleted but incorrect id supplied', () => {
    
    return superagent.delete(`:${process.env.PORT}/api/v1/tournament/7777777`)
      .set('Authorization', `Bearer ${token}`)
      .catch((response) => {
        expect(response.status).toBe(404);
      
        
      });  
  });
  it('should return a 404 code when a tournament is not found', () => {
    
    return superagent.get(`:${process.env.PORT}/api/v1/tournament/667776676776`)
      .set('Authorization', `Bearer ${token}`)
      .catch((response) => {
        expect(response.status).toBe(404);
      
        
      });  
  });
});