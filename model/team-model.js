const mongoose = require('mongoose');


const Team = mongoose.Schema({
  'name': {type: String, required: true},
  'coach': {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  'birthyear': {type: Date, required: true},
  'classification': {type: String, required: true},
  'results': {type: Number, required: false},

}, {timestamps: true});


module.exports = mongoose.model('team', Team);