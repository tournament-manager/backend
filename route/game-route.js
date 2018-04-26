'use strict';

const Game = require('../model/game-model');
const TeamPoints = require('../model/team-points' );
const pointTally = require('../src/point_tally');
const advanceTeams = require('../src/advance-teams');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');

const ERROR_MESSAGE = 'Authorization Failed';


module.exports = function (router){

  router.route('/testgames/:_id')
      
    .get((request,response) => {
      //  returns all games matching division id
      if(request.params._id){
        return Game.find({division:`${request.params._id}`})
          .then(games => {
            let gameIds = games.map(game => game._id);

            response.status(200).json(gameIds);
          })
          .catch(error => errorHandler(error,response));

        
      }
      
    });

  router.route('/game/scorecard')
    .put(bearerAuthMiddleware, bodyParser, (request, response) => {
      let {a: pointsA, b: pointsB} = pointTally(request.body.teamAResult, request.body.teamBResult);
      Game.findById(request.body._id)
        .then(game => {
          game.teamAResult = request.body.teamAResult;
          game.teamBResult = request.body.teamBResult;
          game.teamAPoints = pointsA;
          game.teamBPoints = pointsB;
          game.complete = true;
          return game;
        })
        .then(game => {
          TeamPoints.find({division: game.division, team: {$in: [game.teamA, game.teamB]}})
            .then(teamPointsArray => {
              let indexA = 0;
              let indexB = 0;
              game.teamA === teamPointsArray[0].team ? indexB = 1 : indexA = 1;
              teamPointsArray[indexA].points += game.teamAPoints;
              teamPointsArray[indexB].points += game.teamBPoints;
               
              game.teamARollingTotal += teamPointsArray[indexA].points;
              game.teamBRollingTotal += teamPointsArray[indexB].points;

              return Promise.all([
                teamPointsArray[0].save(),
                teamPointsArray[0].save(),
                game.save(),
              ]);
            })
            .then(returnedPromises => advanceTeams(returnedPromises[2]));
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    });
  
  router.route('/game/:_id?')
      
    .get((request,response) => {
      //  returns one game
      if(request.params._id){
        return Game.findById(request.params._id)
          .then(game => response.status(200).json(game))
          .catch(error => errorHandler(error,response));
      }

      // returns all the games
      
      return Game.find()
        .then(games => {
          

          response.status(200).json(games);
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
            game.complete = request.body.complete || game.complete;

            
            return game.save();
          }

          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    });

};