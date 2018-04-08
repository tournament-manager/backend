
const Division = require('../model/division-model');
const divisionRounds = ['groupA', 'groupB', 'groupC', 'groupD', 'consolidation', 'semiFinal', 'final'];

const getDivisionRound = (gameNumber) => {
  if (gameNumber < 29 ) return divisionRounds[Math.ceil(gameNumber / 6) - 1];
  return divisionRounds[Math.floor(gameNumber / 10.1) + 3];
};

const nextGames = {
  groupA: [25, 27],
  groupB: [26, 28],
  groupC: [27, 25],
  groupD: [28, 26],
  consolidation: [29, 30]
}

const caluculateWinner = (game) => {
  let teamAResults = game.teamAResults;
  let teamBResults = game.teamBResults;
  if (teamAResults === teamAResults){
    return game.teamARollingTotal > game.teamBRollingTotal ? game.teamA : game.teamB;
  };
  return teamAResults > teamBResults ? game.teamA : game.teamB
}


module.exports = function(game){

  let divisionRound = getDivisionRound(game.gamenumber);

  Division.findById(game.division)
    .populate({
      path: divisionRound,
      populate: {
        path: 'teamA teamB',
      },
    })
    .then(division => {
      if (!division[divisionRound].every(game => game.complete)) return;
      // group play promotion
      if (divisionRound.match(/group/g)) { 
        let lastGames = division[divisionRound].filter(game => !(game.gamenumber + 1) % 6 || !game.gamenumber % 6);
        let teams = lastGames.reduce((teamsArray, game) => {
          game.teamA.pointsTotal = game.teamARollingTotal;
          game.teamB.pointsTotal = game.teamBRollingTotal;
          teamsArray.push(game.teamA, game.teamB);
          return teamsArray;
        },[]);

        let winningTeams  = teams.sort((a, b) => b.pointsTotal - a.pointsTotal).slice(0,2);

        let nextGame  = nextGames[divisionRound][0]
        let nextGame = nextGames[divisionRound][1]

        
        //groupA winner 1 plays game 25
        //groupA winner 2 plays game 27

        //groupB winner 1 plays game 26
        //groupB winner 2 plays game 28

        //groupC winner 1 plays game 27
        //groupC winner 2 plays game 25

        //groupD winner 1 plays game 28
        //groupD winner 2 plays game 26

        /*
        {
          nextGames = {
            groupA: [25, 27].
            groupB: [26, 28],
            groupC: [27, 25],
            groupD: [28, 26],
            consolidation: [29, 30]
          }
        }


        function nextGame(game){
 return nextIndex = Math.floor(game / 27);
}
        */

        //retutn Advance()
      }

      if (divisionRound === consolidation) {
        let winningTeams = division[divisionRound].reduce((gameWinners, game) => {
          let winner = caluculateWinner(game)
          winner.gameNumber = game.gamenumber;
          gameWinners.push(winner);
          return gameWinners;
        }, []);
      }
      
      //consolidation
      //winner 25 plays winner 26 = game 29
      //winner 27 plays winner 28 == game 30

    });

};
