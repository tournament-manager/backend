'use strict';
const mongoose = require('mongoose');
const Game = require('../model/game-model');
const Division = require('../model/division-model');
const gamesArray = [
  [1,2],[3,4],[1,3],[2,4],[4,1],[2,3],
  [5,6],[7,8],[5,7],[6,8],[8,5],[7,6],
  [9,10],[11,12],[9,11],[10,12],[12,9],[10,11],
  [13,14], [15,16], [13,15], [14,16], [16,13], [15,14],
];
let finalResultsArray = [];
let finalReturnObject = {};

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
        result.sort((a, b) => a.gamenumber - b.gamenumber);
        
        for(let i = 0; i < 24; i++) {
          let game = result[i];
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
        
            let teamA = gamesArray[index][0] - 1;
            let teamB = gamesArray[index][1] - 1;
         
            resultsArrayofObject[teamA].played ++;
            resultsArrayofObject[teamB].played ++;

            if(game.teamAResult > game.teamBResult) {
              resultsArrayofObject[teamA].won ++ ;
              resultsArrayofObject[teamB].lost ++;
              let pointsA = 0;
              let pointsB = 0;
              pointsA = 6;
              pointsA = game.teamAResult  >= 3 ?  pointsA + 3 : pointsA + game.teamAResult;
              if(game.teamBResult === 0) {
                pointsA ++;
                pointsB = game.teamBResult >= 3 ? pointsB + 3 : pointsB + game.teamBResult;
              } else {
                pointsB = game.teamBResult >= 3 ? pointsB + 3 : pointsB + game.teamBResult;
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
              pointsB = game.teamBResult  >= 3 ? pointsB + 3 : pointsB + game.teamBResult;
              if(game.teamAResult === 0) {
                pointsB ++;
                
              } else {
                pointsA = game.teamAResult > 3 ? pointsA + 3 : pointsA + game.teamAResult;
              } 
              
            
              resultsArrayofObject[teamB].points = resultsArrayofObject[teamB].points + pointsB;
              resultsArrayofObject[teamA].points = resultsArrayofObject[teamA].points + pointsA ;

            }
            if (game.teamBResult === game.teamAResult) {
              resultsArrayofObject[teamB].draw ++;
              resultsArrayofObject[teamA].draw ++;
              let pointsA = 3;
              let pointsB = 3;
              pointsB = game.teamBResult  >= 3 ? pointsB + 3 : pointsB + game.teamBResult;
              pointsA = game.teamAResult >= 3 ? pointsA + 3 : pointsA + game.teamAResult;
              resultsArrayofObject[teamB].points = resultsArrayofObject[teamB].points + pointsB;
              resultsArrayofObject[teamA].points = resultsArrayofObject[teamA].points + pointsA;

            }
          }
        }
        // console.log('return of for each',resultsArrayofObject );
        let returnObject = {};
        returnObject.poolA = {};
        returnObject.poolB = {};
        returnObject.poolC = {};
        returnObject.poolD = {};
        returnObject.consolidation = {};
        returnObject.semi = {};
        
        
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

    
        // this checks to see if the the round robin play is complete
        if (result.slice(0,6).filter(x => x.complete).length === 6) returnObject.poolA.complete = true;
        if (result.slice(6,12).filter(x => x.complete).length === 6) returnObject.poolB.complete = true;
        if (result.slice(12,18).filter(x => x.complete).length === 6) returnObject.poolC.complete = true;
        if (result.slice(18,24).filter(x => x.complete).length === 6) returnObject.poolD.complete = true;
        //this checks to see if the pools are complete and populate the next rounds with the correct teams
     
        if(returnObject.poolA.complete) {
          returnObject.poolA.first = resultsArrayofObject.slice(0,4).sort((a, b) => b.points - a.points)[0].teamId;
          returnObject.poolA.second = resultsArrayofObject.slice(0,4).sort((a, b) => b.points - a.points)[1].teamId;
          result[24].teamA = returnObject.poolA.first;
          result[25].teamA = returnObject.poolA.second;
        }
        if(returnObject.poolB.complete) {
          returnObject.poolB.first = resultsArrayofObject.slice(4,8).sort((a, b) => b.points - a.points)[0].teamId;
          returnObject.poolB.second = resultsArrayofObject.slice(4,8).sort((a, b) => b.points - a.points)[1].teamId;
          result[24].teamB = returnObject.poolB.second;
          result[25].teamB = returnObject.poolB.first;
        }
        if(returnObject.poolC.complete) {
          returnObject.poolC.first = resultsArrayofObject.slice(8,12).sort((a, b) => b.points - a.points)[0].teamId;
          returnObject.poolC.second = resultsArrayofObject.slice(8,12).sort((a, b) => b.points - a.points)[1].teamId;
          result[26].teamA = returnObject.poolC.first;
          result[27].teamA = returnObject.poolC.second;
        }
        if(returnObject.poolD.complete) {
          
          returnObject.poolD.first = resultsArrayofObject.slice(12,16).sort((a, b) => b.points - a.points)[0].teamId;
          returnObject.poolD.second = resultsArrayofObject.slice(12,16).sort((a, b) => b.points - a.points)[1].teamId;
          result[26].teamB = returnObject.poolD.second;
          result[27].teamB = returnObject.poolD.first;
          
        }
        
        returnObject.consolidation.game1 = result[24]._id;
        returnObject.consolidation.game2 = result[25]._id;
        returnObject.consolidation.game3 = result[26]._id;
        returnObject.consolidation.game4 = result[27]._id;
        returnObject.semi.game1 = result[28]._id;
        returnObject.semi.game2 = result[29]._id;
        returnObject.final = result[30]._id;
    
        
        //this promotes the consolidation, semi rounds to the final by winner.
        //____________________
        if(result[25].complete && (result[25].teamAResult === result[25].teamBResult)) {
          let teamAPoints = resultsArrayofObject.slice(4,8).sort((a, b) => b.points - a.points)[0].points;
          let teamBPoints = resultsArrayofObject.slice(0,4).sort((a, b) => b.points - a.points)[1].points;
          teamAPoints > teamBPoints ? result[28].teamB = result[25].teamA : result[28].teamB = result[25].teamB; 
        }
        if(result[24].complete && (result[24].teamAResult === result[24].teamBResult)) {
          let teamAPoints = resultsArrayofObject.slice(0,4).sort((a, b) => b.points - a.points)[0].points;
          let teamBPoints = resultsArrayofObject.slice(4,8).sort((a, b) => b.points - a.points)[1].points; 
          teamAPoints > teamBPoints ? result[28].teamA = result[24].teamA : result[28].teamA = result[24].teamB; 
        }
        if(result[26].complete && (result[26].teamAResult === result[26].teamBResult)) {
          let teamAPoints = resultsArrayofObject.slice(8,12).sort((a, b) => b.points - a.points)[0].points;
          let teamBPoints = resultsArrayofObject.slice(12,16).sort((a, b) => b.points - a.points)[1].points;
          teamAPoints > teamBPoints ? result[29].teamA = result[26].teamA : result[29].teamA = result[26].teamB; 
        }
        if(result[27].complete && (result[27].teamAResult === result[27].teamBResult)) {
          let teamAPoints = resultsArrayofObject.slice(8,12).sort((a, b) => b.points - a.points)[1].points;
          let teamBPoints = resultsArrayofObject.slice(12,16).sort((a, b) => b.points - a.points)[0].points;
          teamAPoints > teamBPoints ? result[29].teamB = result[27].teamA : result[29].teamB = result[27].teamB; 
        }

        if(result[24].complete && (result[24].teamAResult > result[24].teamBResult)) {
          result[28].teamA = result[24].teamA;
          
        } 
        if(result[24].complete && (result[24].teamAResult < result[24].teamBResult)) {
          result[28].teamA = result[24].teamB;
        
        } 
        //_________________________
        
        if(result[25].complete && (result[25].teamAResult > result[25].teamBResult)) {
          result[28].teamB = result[25].teamA;
         
        } 
        if(result[25].complete && (result[25].teamAResult < result[25].teamBResult)) {
          result[28].teamB = result[25].teamB;
         
        } 
        //___________________________
        if(result[26].complete && (result[26].teamAResult > result[26].teamBResult)) {
          result[29].teamA = result[26].teamA;
         
        } 
        if(result[26].complete && (result[26].teamAResult < result[26].teamBResult)) {
          result[29].teamA = result[26].teamB;
        } 
        //-----------------------------
        if(result[27].complete && (result[27].teamAResult > result[27].teamBResult)) {
          result[29].teamB = result[27].teamA;
        } 
        if(result[27].complete && (result[27].teamAResult < result[27].teamBResult)) {
          result[29].teamB = result[27].teamB;
        } 
        //_____________________
        if(result[28].complete && (result[28].teamAResult > result[28].teamBResult)) {
          result[30].teamA = result[28].teamA;
        }
        if(result[28].complete && (result[28].teamAResult < result[28].teamBResult)) {
          result[30].teamA = result[28].teamB;
        }
        // ------------------------
        if(result[29].complete && (result[29].teamAResult > result[29].teamBResult)) {
          result[30].teamB = result[29].teamA;
        }
        if(result[28].complete && (result[29].teamAResult < result[29].teamBResult)) {
          result[30].teamB = result[29].teamB;
        }
        if(result[30].complete && (result[30].teamAResult < result[30].teamBResult)) {
          returnObject.winner = result[30].teamB;
        }
        if(result[30].complete && (result[30].teamAResult > result[30].teamBResult)) {
          returnObject.winner = result[30].teamA;
        }
        
        finalResultsArray  = result;
        finalReturnObject = returnObject;
  
        return Game.findById({ _id: result[24]._id.toString()});
      })
      .then(game => {
        game.teamA = finalResultsArray[24].teamA;
        game.teamB = finalResultsArray[24].teamB;
        return game.save();
      })
      .then(() => {
        return Game.findById({ _id: finalResultsArray[25]._id.toString()});

      })
      .then(game => {
        game.teamA = finalResultsArray[25].teamA;
        game.teamB = finalResultsArray[25].teamB;
        return game.save();
      })
      .then(() => {
        return Game.findById({ _id: finalResultsArray[26]._id.toString()});
      })
      .then(game => {
        game.teamA = finalResultsArray[26].teamA;
        game.teamB = finalResultsArray[26].teamB;
        return game.save();
      })
      .then(() => {
        return Game.findById({ _id: finalResultsArray[27]._id.toString()});
      })
      .then(game => {
        game.teamA = finalResultsArray[27].teamA;
        game.teamB = finalResultsArray[27].teamB;
        return game.save();
      })
      .then(() => {
        return Game.findById({ _id: finalResultsArray[28]._id.toString()});
      })
      .then(game => {
        game.teamA = finalResultsArray[28].teamA;
        game.teamB = finalResultsArray[28].teamB;
        return game.save();
      })
      .then(() => {
        return Game.findById({ _id: finalResultsArray[29]._id.toString()});
      })
      .then(game => {
        game.teamA = finalResultsArray[29].teamA;
        game.teamB = finalResultsArray[29].teamB;
        return game.save();
      })
      .then(() => {
        return Game.findById({ _id: finalResultsArray[30]._id.toString()});
      })
      .then(game => {
        game.teamA = finalResultsArray[30].teamA;
        game.teamB = finalResultsArray[30].teamB;
        return game.save();
      })

      .then(() => {

        return resolve(finalReturnObject);

      })
      .catch(err => reject(err));
      

    













  });
};