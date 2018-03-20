'use strict';

const Game = require('../model/game-model');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');

const ERROR_MESSAGE = 'Authorization Failed';


module.exports = function (router){

  
  router.route('/game/:_id?')
      
    .get(bearerAuthMiddleware,(request,response) => {
      //  returns one team
      if(request.params._id){
        return Game.findById(request.params._id)
          .then(game => response.status(200).json(game))
          .catch(error => errorHandler(error,response));
      }

      // returns all the team
      
      return Game.find()
        .then(games => {
          let gameIds = games.map(game => game._id);

          response.status(200).json(gameIds);
        })
        .catch(error => errorHandler(error,response));
      
    })
    .put(bearerAuthMiddleware,bodyParser,(request,response) => {
      Game.findById(request.params._id)
        .then(game => {
          
          if(game._id.toString() === request.params._id.toString()){
            game.gamenumber = request.body.name || game.gamenumber;
            game.referee = request.body.referee || game.referee;
            game.field = request.body.field || game.field;
            game.teamA = request.body.teamA || game.teamA;
            game.teamA = request.body.teamA || game.teamA;
            game.teamAResult = request.body.teamAResult || game.teamAResult;
            game.teamB = request.body.teamB || game.teamB;
            game.teamBResult = request.body.teamBResult || game.teamBResult;

            
            return game.save();
          }

          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    });

};