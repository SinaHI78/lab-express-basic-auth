'use strict';

const User = require('./../models/user');

module.exports = (req, res, next) => {
  res.locals.user = req.user;
  next();
};
