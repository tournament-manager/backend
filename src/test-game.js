const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/tournament');
const Game = require('../model/game-model');

let testArray = [];

  
let testGame = new Game({gamenumber:1, division:'5aaf248169009747716ed73d'});
testGame.save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.error(err);
  });


console.log('test array', testArray);

