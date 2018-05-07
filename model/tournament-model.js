const mongoose = require('mongoose');

const Tournament = mongoose.Schema({
  'name': {type: String, required: true},
  'director': {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  'dateStart': {type: Date},
  'dateEnd': {type: Date},
  'divisions':[{type: mongoose.Schema.Types.ObjectId, ref: 'division'}],
  'locked': {type: Boolean, default: false},
}, {timestamps: true});


module.exports = mongoose.model('tournament', Tournament);