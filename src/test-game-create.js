'use strict';

const Game = require('../model/game-model');
const gamesArray = [
  [1,2],[3,4],[1,3],[2,4],[4,1],[2,3],
  [5,6],[7,8],[5,7],[6,8],[8,5],[7,6],
  [9,10],[11,12],[9,11],[10,12],[12,9],[10,11],
  [13,14], [15,16], [13,15], [14,16], [16,13], [15,14],
];

let holdingArray = [];

module.exports = function(teams, divisionId) {

  gamesArray.forEach(function(e, index) {
    let currentGame = {};
    currentGame.gamenumber = index +1;
    currentGame.teamA = teams[(e[0]-1)];
    currentGame.teamB = teams[(e[1]-1)];
    currentGame.division = divisionId;
    holdingArray.push(currentGame);
  });

  for (let i = 25; i < 32; i ++) {
    let currentGame = {};
    currentGame.gamenumber = i;
    currentGame.division = divisionId;
    holdingArray.push(currentGame);
      
  }
 
  Game.create(holdingArray)
    .then(res => {
      console.log('res from Game.create', res);
    })
    .catch(err => console.error(err));
 

};




