const mongoose = require('mongoose');

const Division = mongoose.Schema({
  'name': {type: String, required: true},
  'tournament': {type: mongoose.Schema.Types.ObjectId, ref: 'tournament'},
  'agegroup': {type: String, required: true},
  'classification': {type: String, required: true},
  'fields': [{type: mongoose.Schema.Types.ObjectId, ref: 'field'}],
  'groupA': [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}],
  'groupB': [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}],
  'groupC': [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}],
  'groupD': [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}],
  'consolidation': [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}],
  'semiFinal': [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}],
  'final': [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}],
  'locked': {type: Boolean, default: false},
}, {timestamps: true});


module.exports = mongoose.model('division', Division);