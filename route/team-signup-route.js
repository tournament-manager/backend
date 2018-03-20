'use strict';

const Team = require('../model/team-model');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');

const ERROR_MESSAGE = 'Authorization Failed';


module.exports = function (router){
  
  router.route('/team/signup')
    .post(bearerAuthMiddleware,bodyParser,(request,response) => {
      request.coach = request.user._id;

      return new Team(request.body).save()
        .then(createdTeam => response.status(201).json(createdTeam))
        .catch(error => errorHandler(error,response));
    });
  
    
};