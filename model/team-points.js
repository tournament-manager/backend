const mongoose = require('mongoose');

const TeamPoints = mongoose.Schema({
  'division':  {type: mongoose.Schema.Types.ObjectId, ref: 'division', required: true},
  'team':  {type: mongoose.Schema.Types.ObjectId, ref: 'team', required: true},
  'points': {type: Number, default: 0},
}, {timestamps: true});


module.exports = mongoose.model('teampoints',  TeamPoints);