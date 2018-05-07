'use strict';
const Game = require('../model/game-model');
const gamesArray = [
  [1,2],[3,4],[1,3],[2,4],[4,1],[2,3],
  [5,6],[7,8],[5,7],[6,8],[8,5],[7,6],
  [9,10],[11,12],[9,11],[10,12],[12,9],[10,11],
  [13,14], [15,16], [13,15], [14,16], [16,13], [15,14],
];

module.exports = function(teams, divisionId) {
  return new Promise((resolve, reject) => {

    let holdingArray = [];
    let returnArray = [];
    gamesArray.forEach(function(e, index) {
      let currentGame = {};
      currentGame.gamenumber = index +1;
      currentGame.teamA = teams[(e[0]-1)];
      currentGame.teamB = teams[(e[1]-1)];
      currentGame.division = divisionId;
      //Add group and letter to game
      currentGame.eliminationRound = `group${String.fromCharCode(Math.ceil((index + 1)/6) + 64)}`;
      holdingArray.push(currentGame);
    });
    let eliminationRound = ['consolidation', 'consolidation', 'semiFinal', 'final'];
    for (let i = 25; i < 32; i ++) {
      let currentGame = {};
      currentGame.gamenumber = i;
      currentGame.division = divisionId;
      currentGame.eliminationRound = `${eliminationRound[Math.ceil((i - 24) / 2)] - 1}`;
      holdingArray.push(currentGame);

    }
    Game.create(holdingArray)
      .then(savedGameArray => {
        returnArray.push(savedGameArray.slice(0,6));
        returnArray.push(savedGameArray.slice(6,12));
        returnArray.push(savedGameArray.slice(12,18));
        returnArray.push(savedGameArray.slice(18,24));
        returnArray.push(savedGameArray.slice(24,28));
        returnArray.push(savedGameArray.slice(28,30));
        returnArray.push(savedGameArray.slice(30));
        return resolve(returnArray);
      })
      .catch(err => {
        reject (err);
      });
  });
};