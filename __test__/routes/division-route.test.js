'use strict';

const mock = require('../lib/mocks');
const server = require('../../lib/server');
const superagent = require('superagent');
require('jest');
var divisionNumber;
var newUser = mock.new_user();
var newDivision = mock.new_division('U10', 'boys');

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
    
    return superagent.post(`:${process.env.PORT}/api/v1/division/create`)
      .set('Authorization', `Bearer ${token}`)
      .send(newDivision)
      .then((response) => {
        expect(response.status).toBe(201);
        divisionNumber = response.body._id;        
      });  
  });
  it('should return a division when division number supplied', () => {
    
    return superagent.get(`:${process.env.PORT}/api/v1/division/${divisionNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        
      });  
  });
  it('should return all divisions when division number is not supplied', () => {
    
    return superagent.get(`:${process.env.PORT}/api/v1/division`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(200);
        
        expect(response.body).not.toBe(null);
        
      });  
  });
  it('should return a 204 code if a division is updated', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/division/${divisionNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .send({name: 'new name for test'})
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  it('should return a 404 code if a division update is not successfull', () => {
    
    return superagent.put(`:${process.env.PORT}/api/v1/division/999999`)
      .set('Authorization', `Bearer ${token}`)
      .send({name: 'new name for test'})
      .catch((response) => {
        expect(response.status).toBe(404);
      
        
      });  
  });
  it('should return a 204 code when a division is deleted', () => {
    
    return superagent.delete(`:${process.env.PORT}/api/v1/division/${divisionNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });
  
  it('should return a 404 code when a division is not found', () => {
    
    return superagent.delete(`:${process.env.PORT}/api/v1/division/777777`)
      .set('Authorization', `Bearer ${token}`)
      .catch((response) => {
        expect(response.status).toBe(404);
      
        
      });  
  });

});
