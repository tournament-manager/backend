'use strict';

const Game = require('../model/game-model');
const Division = require('../model/division-model');
const gamesArray = [
  [1,2],[3,4],[1,3],[2,4],[4,1],[2,3],
  [5,6],[7,8],[5,7],[6,8],[8,5],[7,6],
  [9,10],[11,12],[9,11],[10,12],[12,9],[10,11],
  [13,14], [15,16], [13,15], [14,16], [16,13], [15,14],
];

module.exports = function(divisionId) {
  // return new Promise((resolve, reject) => {
  let groupA, groupB, groupC, groupD, consolidation, semi, final;
  let resultsArrayofObject = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
  


  Game.find({division:`${divisionId}`})
    .then(result => {
      // console.log('result of game find', result.length);
      result.sort();
      console.log('sorted result of find games by division')
      result.array.forEach(game => {
        let index = game.gamenumber - 1;
        if(game.complete) {
          resultsArrayofObject[gamesArray[index][0]].played ++;
          resultsArrayofObject[gamesArray[index][1]].played ++;
          if(game.resultA > game.resultB) {
            resultsArrayofObject[gamesArray[index][0]].won ++ ;
            resultsArrayofObject[gamesArray[index][1]].lost ++;
            let pointsA, pointsB;
            pointsA = 6;
            pointsA = game.resultA  > 3 ? 3 : game.resultA;
            if(game.resultB === 0) {
              pointsA ++;
            } else {
              pointsB = game.resultsB > 3 ? 3 : game.resultB;
            } 
            resultsArrayofObject[gamesArray[index][0]].points = pointsA ;
            resultsArrayofObject[gamesArray[index][1]].points = pointsB;
          } else {
            resultsArrayofObject[gamesArray[index][1]].won ++;
            resultsArrayofObject[gamesArray[index][0]].lost ++;
            let pointsA, pointsB;
            pointsB = 6;
            pointsB = game.resultB  > 3 ? 3 : game.resultB;
            if(game.resultA === 0) {
              pointsB ++;
            } else {
              pointsA = game.resultsA > 3 ? 3 : game.resultA;
            } 
            resultsArrayofObject[gamesArray[index][0]].points = pointsA ;
            resultsArrayofObject[gamesArray[index][1]].points = pointsB;

          }

          
        }
      });
      
      
      
      
      
      
      // let groupAComplete = groupA.filter(game => {
      //   return game.complete;
      // });
      // groupA = result.slice(0,6);
      // console.log('result after sort',groupA);
      // groupB = result.slice(6,12);
      // groupC = result.slice(12,18);
      // groupD = result.slice(18,24);
      // let groupBComplete = groupB.filter(gamea => {
      //   return gamea.complete;
      // });
      // let groupCComplete = groupC.filter(gameb => {
      //   return gameb.complete;
      // });
      // let groupDComplete = groupD.filter(gamec => {
      //   return gamec.complete;
      // });
      // console.log('teams: ', team1, team2, team3, team4);
      
      // console.log('lengths', groupAComplete.length, groupBComplete.length, groupCComplete.length, groupDComplete.length)
      // consolidation = result.slice(24,28);
      // semi = result.slice(28,30);
      // final = result.slice(30);
      // console.log('goup a after slice',final);
    })
    .catch(err => console.error(err));


    





  // })







};

