const express = require('express');
const router = new express.Router();
const bcryptjs = require('bcryptjs');
const User = require('./../models/user');
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const { name, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        passwordHashAndSalt: hash
      });
    })
    .then((user) => {
      res.redirect('/login');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  let user;
  const { name, password } = req.body;
  User.findOne({ name })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that name."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((result) => {
      if (result) {
        console.log(JSON.stringify(req.session));
        req.session.userId = user._id;
        res.redirect('/main');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/main', routeGuard, (req, res) => {
  res.render('main');
});

router.get('/private', routeGuard, (req, res) => {
  res.render('private');
});

module.exports = router;
