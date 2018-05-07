'use strict';

const Tournament = require('../model/tournament-model');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');
const TournamentDemo = require('../src/create-tournament-demo');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function (router){

  router.route('/tournament/create')
    .post(bearerAuthMiddleware,bodyParser,(request,response) => {
      request.body.director = request.user._id;
      return new Tournament(request.body).save()
        .then(createdTournament => response.status(201).json(createdTournament))
        .catch(error => errorHandler(error,response));
    });

  router.route('/tournament/create_demo')
    .post(bearerAuthMiddleware, bodyParser,(request,response) => {
      new TournamentDemo(request.user._id).createTournamentDemoData()
        .then(demoTournament => response.status(201).json(demoTournament))
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

    .put(bearerAuthMiddleware,bodyParser,(request,response) => {
      Tournament.findById(request.params._id)
        .then(tournament => {
          if(tournament._id.toString() === request.params._id.toString()){
            tournament.name = request.body.name || tournament.name;
            tournament.director = request.body.director || tournament.director;
            tournament.startdate = request.body.startdate || tournament.startdate;
            tournament.enddate = request.body.enddate || tournament.enddate;
            return tournament.save();
          }

          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    })

    .get((request,response) => {
      //  returns one tournament
      if(request.params._id){
        return Tournament.findById(request.params._id)
          .populate({
            path: 'divisions',
            populate: {
              path: 'groupA groupB groupC groupD consolidation semiFinal final',
              populate: {
                path: 'teamA teamB',
              },
            },
          })
          .then(tournament => response.status(200).json(tournament))
          .catch(error => {
            errorHandler(error,response);
          });
      }

      // returns all the tournaments
      return Tournament.find()
        .then(tournaments => {
          response.status(200).json(tournaments);
        })
        .catch(error => errorHandler(error,response));
    });
};
