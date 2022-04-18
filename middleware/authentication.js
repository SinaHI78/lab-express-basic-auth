'use strict';

const User = require('./../models/user');

module.exports = (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    User.findById(userId)
      .then((user) => {
        req.user = user;
        console.log(req.user);
        next();
      })
      .catch((error) => {
        next(error);
      });
  } else {
    console.log('no user in ' + req.session);
    next();
  }
};
