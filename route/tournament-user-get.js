'use strict';

const Tournament = require('../model/tournament-model');

//const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');

const ERROR_MESSAGE = 'Authorization Failed';


module.exports = function (router){
  
  
  router.route('/tournamentowner/user')
  
    .get(bearerAuthMiddleware, (request,response) => {
      console.log('request',request.user._id);

      //populate divisions games and teams
      return Tournament.find({director:request.user._id})
        .populate({
          path: 'divisions',
          populate: {
            path: 'groupA groupB groupC groupD consolidation semiFinal final',
            populate: {
              path: 'teamA teamB',
            },
          },
        })
        .then(tournaments => {
          
          response.status(200).json(tournaments);
        })
        .catch(error => errorHandler(error,response));

    
    });


};