'use strict';
const Game = require('../model/game-model');

module.exports = function (gameid) {
 console.log('game search');
  Game.findById(gameid)
    .then(result => {
      console.log('in seperate file find game', result);

    })
    .catch(err => console.error(err));
};