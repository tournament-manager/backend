'use strict';

const mock = require('../lib/mocks');
const server = require('../../lib/server');
const superagent = require('superagent');
require('jest');
var divisionNumber;
var newUser = mock.new_user();
var newDivision = mock.new_division('U10', 'boys');
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
        expect(response.body).toBeInstanceOf(Array);
        
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
  
  it('should return a 404 code when a division is not found', () => {
    
    return superagent.delete(`:${process.env.PORT}/api/v1/division/777777`)
      .set('Authorization', `Bearer ${token}`)
      .catch((response) => {
        expect(response.status).toBe(404);
      
        
      });  
  });

  it('Should return a list of games when populate route is targeted ', () => {
    
    return superagent.post(`:${process.env.PORT}/api/v1/division/populate/${divisionNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .send(teams)
      .then((response) => {
        console.log('division populates div', divisionNumber);
        expect(response.status).toBe(204);
           
      });  
  });
  
  it('should return a 204 code when a division is deleted', () => {
    
    return superagent.delete(`:${process.env.PORT}/api/v1/division/${divisionNumber}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(204);
      
        
      });  
  });


});
