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
  return new Promise((resolve, reject) => {
    // let groupA, groupB, groupC, groupD, consolidation, semi, final;
    let resultsArrayofObject = [];
    for (let i = 0; i < 16 ; i ++) {
      resultsArrayofObject.push({
        played: 0,
        won: 0,
        lost: 0,
        points: 0,
        draw: 0,
      });
    }
    
   
  


    Game.find({division:`${divisionId}`})
      .then(result => {
        result.sort();
        console.log('sorted result of find games by division',result);
        result.forEach(game => {
          let index = game.gamenumber - 1;
          if(game.complete) {
            let teamA = gamesArray[index][0] - 1;
            let teamB = gamesArray[index][1] - 1;
            console.log('teams in this game', teamA, teamB);
            console.log('game complete');
            console.log('in complete', game.gamenumber);
            console.log('targeted object in index',index ,resultsArrayofObject[gamesArray[index][0]] );
            console.log('team A result', game.teamAResult);
            console.log('team B result', game.teamBResult);
            resultsArrayofObject[teamA].played ++;
            resultsArrayofObject[teamB].played ++;

            if(game.teamAResult > game.teamBResult) {
              resultsArrayofObject[teamA].won ++ ;
              resultsArrayofObject[teamB].lost ++;
              let pointsA = 0;
              let pointsB = 0;
              pointsA = 6;
              pointsA = game.teamAResult  > 3 ?  pointsA + 3 : pointsA + game.teamBResult;
              if(game.teamBResult === 0) {
                pointsA ++;
              } else {
                pointsB = game.teamBResult > 3 ? 3 : game.teamBResult;
              } 
              resultsArrayofObject[teamA].points = resultsArrayofObject[teamA].points + pointsA ;
              resultsArrayofObject[teamB].points = resultsArrayofObject[teamB].points + pointsB;
            } 
            if (game.teamBResult > game.teamAResult) {
              resultsArrayofObject[teamB].won ++;
              resultsArrayofObject[teamA].lost ++;
              let pointsA = 0;
              let pointsB = 0;
              pointsB = 6;
              pointsB = game.teamBResult  > 3 ? pointsB + 3 : pointsB + game.teamBResult;
              if(game.teamAResult === 0) {
                pointsB ++;
              } else {
                pointsA = game.teamAResults > 3 ? 3 : game.teamAResults;
              } 
              
         
              resultsArrayofObject[teamB].points = resultsArrayofObject[teamB].points + pointsB;
              resultsArrayofObject[teamA].points = resultsArrayofObject[teamA].points + pointsA ;

            }
            if (game.teamBResult === game.teamAResult) {
              console.log('in draw')
              resultsArrayofObject[teamB].draw ++;
              resultsArrayofObject[teamA].draw ++;
              let pointsA = 3;
              let pointsB = 3;
              pointsB = game.teamBResult  > 3 ? pointsB + 3 : pointsB + game.teamBResult;
              pointsA = game.teamAResult > 3 ? pointsA + 3 : pointsA + game.teamAResult;
              resultsArrayofObject[teamB].points = resultsArrayofObject[teamB].points + pointsB;
              resultsArrayofObject[teamA].points = resultsArrayofObject[teamA].points + pointsA;

            }
          }
        });
        console.log('results array from logic',resultsArrayofObject );
        return resolve(resultsArrayofObject);
        
      })
      .catch(err => reject(err));
      

    





  // })







  });
};