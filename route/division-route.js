'use strict';

const Division = require('../model/division-model');
const Tournament = require('../model/tournament-model');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');
const gamesPopulate = require('../src/games-for-division');
const Game = require('../model/game-model');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function (router){

  router.route('/division/create')
    .post(bearerAuthMiddleware,bodyParser,(request,response) => {
      return new Division(request.body).save()
        .then(createdDivision => {
          //add division id to divisions array in the tournament
          let tournamentId = createdDivision.tournament;
          let divId = createdDivision._id;
          Tournament.findById(tournamentId)
            .then(tournament => {
              tournament.divisions.push(divId);
              tournament.save();
            });
          return createdDivision;
        })
        .then(createdDivision => response.status(201).json(createdDivision))
        .catch(error => errorHandler(error,response));
    });

  router.route('/division/populate/:_id')
    .post(bearerAuthMiddleware,bodyParser,(request,response) => {
      gamesPopulate(request.body, request.params._id)
        .then(returnArray => {
          Division.findById(request.params._id)
            .then(division => {
              if(division._id.toString() === request.params._id.toString()){
                division.groupA = returnArray[0];
                division.groupB = returnArray[1];
                division.groupC = returnArray[2];
                division.groupD = returnArray[3];
                division.consolidation = returnArray[4];
                division.semiFinal = returnArray[5];
                division.final = returnArray[6];
                return division.save();
              }
              return errorHandler(new Error(ERROR_MESSAGE),response);
            })
            .then(() => response.sendStatus(204))
            .catch(error => errorHandler(error,response));
        })
        .catch(error => errorHandler(error,response));
    });

  router.route('/division/:_id?')
    .get((request,response) => {
      //  returns one division
      if(request.params._id){
        return Division.findById(request.params._id)
          .then(division => response.status(200).json(division))
          .catch(error => errorHandler(error,response));
      }

      // returns all the divisions
      return Division.find()
        .then(divisions => {
          response.status(200).json(divisions);
        })
        .catch(error => errorHandler(error,response));
    })
    .put(bearerAuthMiddleware,bodyParser,(request,response) => {
      Division.findById(request.params._id)
        .then(division => {

          let updateGames = false;
          if (division.agegroup !== request.body.agegroup || division.classification !== request.body.classification) updateGames = true;

          if(division._id.toString() === request.params._id.toString()){
            division.name = request.body.name || division.name;
            division.tournament = request.body.tournament || division.tournament;
            division.agegroup = request.body.agegroup || division.agegroup;
            division.classification = request.body.classification || division.classification;

            return division.save()
              .then(division => {
                if(!updateGames) return;
                //remove the teams from the games if the classification or age group changes
                let games = [
                  ...division.groupA,
                  ...division.groupB,
                  ...division.groupC,
                  ...division.groupD,
                ];

                let gamesUpdate = games.reduce((gamesData, game) => {
                  gamesData.push(
                    {
                      updateOne: {
                        filter: {_id: game},
                        update: {teamA: null, teamB: null},
                      },
                    });
                  return gamesData;
                }, []);
                return Game.bulkWrite(gamesUpdate);

              });
          }

          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    })

    .delete(bearerAuthMiddleware,(request,response) => {
      return Division.findById(request.params._id)
        .then(division => {
          if(division._id.toString() === request.params._id.toString()){
            let tournamentId = division.tournament;
            let divId = division._id;
            return division.remove()
              .then(() => {
                //remove the division from the divisions array in the tournament
                Tournament.findById(tournamentId)
                  .then(tournament => {
                    tournament.divisions = tournament.divisions.filter(divisionId => divisionId.toString() !== divId.toString());
                    tournament.save();
                  });
              });
          }
          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    });
};