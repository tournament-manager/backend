'use strict';

const Game = require('../model/game-model');


const Division = require('../model/division-model');
const div = '5aaf248169009747716ed73d';
const gamesArray = [
  [1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],
  [15,16],[1,3],[2,4],[5,7],[6,8],[9,11],[10,12],
  [13,15],[14,16],[4,1],[2,3],[8,5],[7,6],[12,9],
  [10,11],[16,13],[15,14],
];
const teams = [
  '5aaedafa6d4f732e2756a9c7',
  '5aaee2b26938803307b06e5e',
  '5aaf2b72f5326c4d62d63d90',
  '5aaf2b82f5326c4d62d63d91',
  '5aaf2b8df5326c4d62d63d92',
  '5aaf2b98f5326c4d62d63d93',
  '5aaf2ba4f5326c4d62d63d94',
  '5aaf2baef5326c4d62d63d95',
  '5aaf2bb8f5326c4d62d63d96',
  '5aaf2bc3f5326c4d62d63d97',
  '5aaf2bd1f5326c4d62d63d98',
  '5aaf2bdcf5326c4d62d63d99',
  '5aaf2be7f5326c4d62d63d9a',
  '5aaf2bf2f5326c4d62d63d9b',
  '5aaf2bfef5326c4d62d63d9c',
  '5aaf2c09f5326c4d62d63d9d',
];
console.log('teams',teams.length);
let testHoldingArray = [];

gamesArray.forEach(function(e, index) {
  let currentGame = new Game();
  currentGame.gamenumber = index +1;
  currentGame.teamA = teams[(e[0]-1)];
  currentGame.teamB = teams[(e[1]-1)];
  currentGame.division = div;
  testHoldingArray.push(currentGame);
});

for (let i = 25; i < 32; i ++) {
  let currentGame = new Game();
  currentGame.gamenumber = i;
  currentGame.division = div;
  testHoldingArray.push(currentGame);
}
console.log('testhoding', testHoldingArray);