const mongoose = require('mongoose');
const debug = require('debug')('http:game-model');

debug('game model');

const Game = mongoose.Schema({
  'gamenumber': {type: Number, required: true},
  'referee': {type: mongoose.Schema.Types.ObjectId, ref: 'referee'},
  'field':{type: mongoose.Schema.Types.ObjectId, ref: 'field'},
  'startTime': {type: Date},
  'endTime': {type: Date},
  'divisionId': {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'division'},
  'tournamentId': {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'tournament'},
  'teamA': {type: mongoose.Schema.Types.ObjectId, ref: 'team'},
  'teamAResult': {type: Number},
  'teamB': {type: mongoose.Schema.Types.ObjectId, ref: 'team'},
  'teamBResult': {type: Number},

}, {timestamps: true});

module.exports = mongoose.model('game', Game);

