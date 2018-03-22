// 'use strict';

const Game = require('../model/game-model');
module.exports = function(divisionId) {

  Game.find({division:`${divisionId}`}).populate('team', 'name')
    .then(results => {
      console.log('results from game search and populate', results[0].teamA);
    })
    .catch(err => console.error(err));




};