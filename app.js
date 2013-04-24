/**
 * Module dependencies.
 */
var express = require('express');
var fs = require('fs');
var passport = require('passport');
var path = require('path');
var http = require('http');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env]
var auth = require('./config/middlewares/authorization')
var mongoose = require('mongoose');

// connect db
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

// load models
var models_path = path.join(__dirname, 'app', 'models');
fs.readdirSync(models_path).forEach(function (file) {
  require(path.join(models_path, file));
});

// passport config
require('./config/passport')(passport, config);

var app = express();

// express settings
require('./config/express')(app, config, passport);

// load routes
require('./config/routes')(app, passport, auth);

// start app
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
