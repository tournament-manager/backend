const mongoose = require('mongoose');

const Field = mongoose.Schema({
  'name': {type: String, required: true},
  'location': {type: String, required: true},
  'size': {type: String, requires: true},

}, {timestamps: true});


module.exports = mongoose.model('field', Field);