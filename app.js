'use strict';

const path = require('path');
const express = require('express');
const createError = require('http-errors');
const connectMongo = require('connect-mongo');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const serveFavicon = require('serve-favicon');
const baseRouter = require('./routes/base');
const authentication = require('./middleware/authentication.js');
const bindUserToViewLocals = require('./middleware/bind-user-to-view-locals.js');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(
  session({
    secret: '123',
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true
    },
    store: connectMongo.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60
    })
  })
);

app.use(serveFavicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public/styles'),
    dest: path.join(__dirname, 'public/styles'),
    prefix: '/styles',
    outputStyle:
      process.env.NODE_ENV === 'development' ? 'expanded' : 'compressed',
    force: process.env.NODE_ENV === 'development',
    sourceMap: process.env.NODE_ENV === 'development'
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(authentication);
app.use('/', baseRouter);
app.use(bindUserToViewLocals);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;
