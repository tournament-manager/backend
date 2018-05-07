'use strict';

module.exports = function (a, b) {
  let totals = {};
  let points;
  //max points for goals
  let goalsMax = 3;
  totals.a = a < goalsMax ? a : goalsMax;
  totals.b = b < goalsMax ? b : goalsMax;

  if (a === b){ // draw
    points = 3;
    //add shutout points
    points += a === 0 ? 1 : 0;
    totals.a += points;
    totals.b += points;
    return totals;
  }

  //winner gets 6 points
  points = 6;
  (a > b) ? totals.a += 6 : totals.b += 6;
  //add shutout points
  if(a === 0 || b === 0 )
    a === 0 ? totals.b += 1 : totals.a += 1;
  return totals;
};
