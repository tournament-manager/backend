'use strict';

const Tournament = require('../model/tournament-model');
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');

module.exports = function (router){

  router.route('/tournamentowner/user')
    .get(bearerAuthMiddleware, (request,response) => {
      return Tournament.find({director:request.user._id})
        .then(tournaments => {
          response.status(200).json(tournaments);
        })
        .catch(error => errorHandler(error,response));
    });
};