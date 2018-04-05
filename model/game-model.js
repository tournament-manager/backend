const mongoose = require('mongoose');

const Game = mongoose.Schema({
  'gamenumber': {type: Number, required: true},
  'referee': {type: mongoose.Schema.Types.ObjectId, ref: 'referee'},
  'field':{type: mongoose.Schema.Types.ObjectId, ref: 'field'},
  'startTime': {type: Date},
  'endTime': {type: Date},
  'division': {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'division'},
  'teamA': {type: mongoose.Schema.Types.ObjectId, ref: 'team', default: null},
  'teamAResult': {type: Number},
  'teamB': {type: mongoose.Schema.Types.ObjectId, ref: 'team', default: null},
  'teamBResult': {type: Number},
  'eliminationRound': {type: String}, 
  'complete': {type: Boolean},

}, {timestamps: true});


module.exports = mongoose.model('game', Game);

