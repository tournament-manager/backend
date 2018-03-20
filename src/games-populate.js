'use strict';

const gamesPopulate = require('./games-for-division');
const div = '5aaf248169009747716ed73d';
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

let finalGamesArray = gamesPopulate(teams, div);
console.log('final array A', finalGamesArray[0]);
console.log('final array B', finalGamesArray[1]);
console.log('final array C', finalGamesArray[2]);
console.log('final array D', finalGamesArray[3]);
console.log('final array Con', finalGamesArray[4]);
console.log('final array Semi', finalGamesArray[5]);
console.log('final array Final', finalGamesArray[6]);