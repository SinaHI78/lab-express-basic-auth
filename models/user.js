'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  passwordHashAndSalt: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', schema);
module.exports = User;
