const mongoose = require('mongoose');

const Team = mongoose.Schema({
  'name': {type: String, required: true},
  'caoch': {type: String, required: true},
  'contact': {type: String, required: true},
  'birthyear': {type: Date, required: true},
  'classification': {type: String, required: true},
  'results': {type: Number, required: false},

}, {timestamps: true});


module.exports = mongoose.model('team', Team);