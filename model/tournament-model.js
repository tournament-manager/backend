'use strict';

const mongoose = require('mongoose');

const Tournament = mongoose.Schema({
  'name': {type: String, required: true},
  'director': {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  'dateStart': {type: Date, required: true},
  'dateEnd': {type: Date, required: true},
  
}, {timestamps: true});


module.exports = mongoose.model('tournament', Tournament);