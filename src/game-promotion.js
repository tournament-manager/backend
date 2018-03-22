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
    let resultsArrayofObject = [];
    for (let i = 0; i < 16 ; i ++) {
      resultsArrayofObject.push({
        teamId: null,
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
          if(game.gamenumber === 1) {
            resultsArrayofObject[0].teamId = game.teamA;
            resultsArrayofObject[1].teamId = game.teamB; 
          }
          if(game.gamenumber === 2) {
            resultsArrayofObject[2].teamId = game.teamA;
            resultsArrayofObject[3].teamId = game.teamB; 
          }
          if(game.gamenumber === 7) {
            resultsArrayofObject[4].teamId = game.teamA;
            resultsArrayofObject[5].teamId = game.teamB; 
          }
          if(game.gamenumber === 8) {
            resultsArrayofObject[6].teamId = game.teamA;
            resultsArrayofObject[7].teamId = game.teamB; 
          }
          if(game.gamenumber === 13) {
            resultsArrayofObject[8].teamId = game.teamA;
            resultsArrayofObject[9].teamId = game.teamB; 
          }
          if(game.gamenumber === 14) {
            resultsArrayofObject[10].teamId = game.teamA;
            resultsArrayofObject[11].teamId = game.teamB; 
          }
          if(game.gamenumber === 19) {
            resultsArrayofObject[12].teamId = game.teamA;
            resultsArrayofObject[13].teamId = game.teamB; 
          }
          if(game.gamenumber === 20) {
            resultsArrayofObject[14].teamId = game.teamA;
            resultsArrayofObject[15].teamId = game.teamB; 
          }
          

          if(game.complete) {
            let teamA = gamesArray[index][0] - 1; //this is just a index number in resultsArrayofObject
            let teamB = gamesArray[index][1] - 1;
           

            // console.log('Game info', game);
            // console.log('game complete');
            // console.log('in complete', game.gamenumber);
            // console.log('targeted object in index',index ,resultsArrayofObject[gamesArray[index][0]] );
            // console.log('team A result', game.teamAResult);
            // console.log('team B result', game.teamBResult);
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
        let returnObject = {};
        returnObject.poolA = {};
        returnObject.poolB = {};
        returnObject.poolC = {};
        returnObject.poolD = {};
        for (let i = 0; i < 4; i ++) {
          let teamname = `team${i + 1}`;
          returnObject.poolA[teamname] = resultsArrayofObject[i];
        }
        for (let i = 4; i < 8; i ++) {
          let teamname = `team${i + 1}`;
          returnObject.poolB[teamname] = resultsArrayofObject[i];
        }
        for (let i = 8; i < 12; i ++) {
          let teamname = `team${i + 1}`;
          returnObject.poolC[teamname] = resultsArrayofObject[i];
        }
        for (let i = 12; i < 16; i ++) {
          let teamname = `team${i + 1}`;
          returnObject.poolD[teamname] = resultsArrayofObject[i];
        }

    
        
        if (result.slice(0,6).filter(x => x.complete).length === 6) returnObject.poolA.complete = true;
        if (result.slice(6,12).filter(x => x.complete).length === 6) returnObject.poolB.complete = true;
        if (result.slice(12,18).filter(x => x.complete).length === 6) returnObject.poolC.complete = true;
        if (result.slice(18,24).filter(x => x.complete).length === 6) returnObject.poolD.complete = true;
        if(returnObject.poolA.complete) {
          returnObject.poolA.first = resultsArrayofObject.slice(0,4).sort((a, b) => b.points - a.points)[0].teamId;
          returnObject.poolA.second = resultsArrayofObject.slice(0,4).sort((a, b) => b.points - a.points)[1].teamId;
        }
        if(returnObject.poolB.complete) {
          returnObject.poolB.first = resultsArrayofObject.slice(4,8).sort((a, b) => b.points - a.points)[0].teamId;
          returnObject.poolB.second = resultsArrayofObject.slice(4,8).sort((a, b) => b.points - a.points)[1].teamId;
        }
        if(returnObject.poolC.complete) {
          returnObject.poolC.first = resultsArrayofObject.slice(8,12).sort((a, b) => b.points - a.points)[0].teamId;
          returnObject.poolC.second = resultsArrayofObject.slice(8,12).sort((a, b) => b.points - a.points)[1].teamId;
        }
        if(returnObject.poolD.complete) {
          returnObject.poolD.first = resultsArrayofObject.slice(12,16).sort((a, b) => b.points - a.points)[0].teamId;
          returnObject.poolD.second = resultsArrayofObject.slice(12,16).sort((a, b) => b.points - a.points)[1].teamId;
        }
        
                
        console.log('______________________________________');
        console.log('return object', returnObject);
        console.log('______________________________________');



        // console.log('results array from logic',resultsArrayofObject );
        return returnObject;
        
      })
      .then(object => {
        if(object.poolA.complete) {

        }

      })
      .catch(err => reject(err));
      

    





  // })







  });
};