'use strict';

const Division = require('../model/division-model');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');

const ERROR_MESSAGE = 'Authorization Failed';


module.exports = function (router){



  router.route('/division/create')
    .post(bearerAuthMiddleware,bodyParser,(request,response) => {
      console.log('in division create');
     
      console.log(request.body.name);
      return new Division(request.body).save()
        .then(createdDivision => response.status(201).json(createdDivision))
        .catch(error => errorHandler(error,response));
    });
  
  router.route('/division/:_id?')
      
    .get(bearerAuthMiddleware,(request,response) => {
      //  returns one team
      console.log('in get route division');
      if(request.params._id){
        return Division.findById(request.params._id)
          .then(division => response.status(200).json(division))
          .catch(error => errorHandler(error,response));
      }

      // returns all the team
      
      return Division.find()
        .then(divisions => {
          let divisionIds = divisions.map(division => division._id);

          response.status(200).json(divisionIds);
        })
        .catch(error => errorHandler(error,response));
      
    })
    .put(bearerAuthMiddleware,bodyParser,(request,response) => {
      Division.findById(request.params._id)
        .then(division => {
          console.log(division);
          if(division._id.toString() === request.params._id.toString()){
            division.name = request.body.name || division.name;
            division.tournament = request.body.tournament || division.tournament;
            division.agegroup = request.body.agegroup || division.agegroup;
            division.classification = request.body.classification || division.classification;
            
            return division.save();
          }

          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    })

    .delete(bearerAuthMiddleware,(request,response) => {
      return Division.findById(request.params._id)
        .then(division => {
          if(division._id.toString() === request.params._id.toString())
            return division.remove();
          
          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    });
};