const mongoose = require('mongoose');

const Tournament = mongoose.Schema({
  'name': {type: String, required: true},
  'director': {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  'dateStart': {type: Date},
  'dateEnd': {type: Date},
  
}, {timestamps: true});


module.exports = mongoose.model('tournament', Tournament);