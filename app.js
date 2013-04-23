/**
 * Module dependencies.
 */

var express = require('express');
var models = require('./models');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes.route(app);

mongoose.connect('mongodb://localhost/geekon');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
