const mongoose = require('mongoose');

const Game = mongoose.Schema({
  'gamenumber': {type: Number, required: true},
  'startTime': {type: Date},
  'endTime': {type: Date},
  'division': {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'division'},
  'teamA': {type: mongoose.Schema.Types.ObjectId, ref: 'team', default: null},
  'teamAResult': {type: Number},
  'teamAPoints': {type: Number, default: 0},
  'teamARollingTotal': {type: Number, default: 0},
  'teamB': {type: mongoose.Schema.Types.ObjectId, ref: 'team', default: null},
  'teamBResult': {type: Number},
  'teamBPoints': {type: Number, default: 0},
  'teamBRollingTotal': {type: Number, default: 0},
  'eliminationRound': {type: String},
  'complete': {type: Boolean},
}, {timestamps: true});

module.exports = mongoose.model('game', Game);

