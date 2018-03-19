'use strict';

const Tournament = require('../model/tournament-model');
const User = require('../model/user-model');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');

const ERROR_MESSAGE = 'Authorization Failed';


module.exports = function (router){
  
  router.route('/tournament/create')
    .post(bearerAuthMiddleware,bodyParser,(request,response) => {
     
      console.log(request.user);
      

      request.director = request.user._id;

      return new Tournament(request.body).save()
        .then(createdTournament => response.status(201).json(createdTournament))
        .catch(error => errorHandler(error,response));
    });
  router.route('/tournament/:_id?')
    .delete(bearerAuthMiddleware,(request,response) => {
      return Tournament.findById(request.params._id)
        .then(tournament => {
          if(tournament._id.toString() === request.params._id.toString())
            return tournament.remove();
          
          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    })
    .get(bearerAuthMiddleware,(request,response) => {
      //  returns one team
      console.log('in get route');
      if(request.params._id){
        return Tournament.findById(request.params._id)
          .then(tournament => response.status(200).json(tournament))
          .catch(error => errorHandler(error,response));
      }

      // returns all the team
      
      return Tournament.find()
        .then(tournaments => {
          let tournamentIds = tournaments.map(tournament => tournament._id);

          response.status(200).json(tournamentIds);
        })
        .catch(error => errorHandler(error,response));
      
    });
};