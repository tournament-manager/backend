const mongoose = require('mongoose');

const Referee = mongoose.Schema({
  'name': {type: String, required: true},
  'contact': {type: String, required: true},

}, {timestamps: true});


module.exports = mongoose.model('referee', Referee);