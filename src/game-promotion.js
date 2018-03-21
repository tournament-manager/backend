'use strict';

const Game = require('../model/game-model');
const Division = require('../model/division-model');


module.exports = function(divisionId) {
  // return new Promise((resolve, reject) => {
  let groupA;
  let groupB;
  let groupC;
  let groupD;
  let consolidation;
  let semi;
  let final; 
  // Division.findById(`${divisionId}`)
  //   .then(result => {
  //     console.log('result of div find', result);
      
  //   })
  //   .then(() => {
  //     // console.log('group a array of games', groupA);
  //     console.log('______________________________________');

  //   })
  //   .catch( err => console.error(err));


  Game.find({division:`${divisionId}`})
    .then(result => {
      console.log('result of game find', result.length);
      result.sort();
      groupA = result.slice(0,6);
      console.log('result after sort',groupA);
      groupB = result.slice(6,12);
      groupC = result.slice(12,18);
      groupD = result.slice(18,24);
      let groupAComplete = groupA.filter(game => {
        return game.complete;
      });
      
      let groupBComplete = groupA.filter(game => {
        return game.complete;
      });
      let groupCComplete = groupA.filter(game => {
        return game.complete;
      });
      let groupDComplete = groupA.filter(game => {
        return game.complete;
      });
      console.log('lengths', groupAComplete.length, groupBComplete.length, groupCComplete.length, groupDComplete.length)
      consolidation = result.slice(24,28);
      semi = result.slice(28,30);
      final = result.slice(30);
      // console.log('goup a after slice',final);
    })
    .catch(err => console.error(err));


    





  // })







};

