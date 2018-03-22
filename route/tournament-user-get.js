'use strict';

const Tournament = require('../model/tournament-model');

const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');

const ERROR_MESSAGE = 'Authorization Failed';


module.exports = function (router){
  
  
  router.route('/tournamentowner/user')
  
    .get(bearerAuthMiddleware,bodyParser,(request,response) => {
      console.log('request',request.user._id);

      return Tournament.find({director:request.user._id})
        .then(tournaments => {
          console.log('tournaments for user', tournaments)
          response.status(200).json(tournaments);
        })
        .catch(error => errorHandler(error,response));

    
    });


};