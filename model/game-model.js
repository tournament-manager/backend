const mongoose = require('mongoose');

const Game = mongoose.Schema({
  'gamenumber': {type: Number, required: true},
  'referee': {type: mongoose.Schema.Types.ObjectId, ref: 'referee'},
  'field':{type: mongoose.Schema.Types.ObjectId, ref: 'field'},
  'startTime': {type: Date},
  'endTime': {type: Date},
  'division': {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'division'},
  'teamA': {type: mongoose.Schema.Types.ObjectId, ref: 'team'},
  'teamAResult': {type: Number},
  'teamB': {type: mongoose.Schema.Types.ObjectId, ref: 'team'},
  'teamBResult': {type: Number},
  'complete': {type: Boolean},

}, {timestamps: true});


module.exports = mongoose.model('game', Game);

