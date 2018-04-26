const mongoose = require('mongoose');


const Team = mongoose.Schema({
  'name': {type: String, required: true},
  'coach': {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  'birthyear': {type: String, required: true},
  'classification': {type: String, required: true},
  'tournaments': [{type: mongoose.Schema.Types.ObjectId, ref: 'tournament'}],
}, {timestamps: true});


module.exports = mongoose.model('team', Team);