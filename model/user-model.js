'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const User = mongoose.Schema({
  'username':{type: String},
  'email': {type: String, required: true, unique: true},
  'contact': {type: String},
  'fullname': {type: String, required: true},
  'password': {type: String, required: true},
  'tokenSeed': {type: String, unique: true},
  'notification': {type: Boolean, required: true},
  'isAdmin': [{type: mongoose.Schema.Types.ObjectId, ref: 'tournament'}],
}, {timestamps: true});

User.methods.generatePasswordHash = function(password) {
  if(!password) return Promise.reject(new Error('Authorization failed. Password required.'));

  return bcrypt.hash(password, 10)
    .then(hash => this.password = hash)
    .then(() => this)
    .catch(err => err);
};

User.methods.comparePasswordHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);
      if(!valid) return reject(new Error('Authorization failed. Password invalid.'));
      resolve(this);
    });
  });
};

User.methods.generateTokenSeed = function() {
  this.tokenSeed = crypto.randomBytes(32).toString('hex');
  return this.save()
    .then(() => Promise.resolve(this.tokenSeed))
    .catch(() => this.generateTokenSeed()); // This line is not very robust... potential loop
};

User.methods.generateToken = function() {
  return this.generateTokenSeed()
    .then(tokenSeed => jwt.sign({token: tokenSeed}, process.env.APP_SECRET))
    .catch(err => err);
};






module.exports = mongoose.model('user', User);