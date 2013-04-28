var express = require('express')
var path = require('path')
var flash = require('connect-flash');
var helpers = require('view-helpers');

module.exports = function (app, config, passport) {
  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(config.root, 'app', 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret:'geekon'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(helpers('geekon'));
  app.use(flash());
  app.use(function (req, res, next) {
   res.locals.error = req.flash('error').toString();
   res.locals.success = req.flash('success').toString();
   res.locals.user = req.session ? req.session.user:'';
   next();
 });
  app.use(app.router);
  app.use(express.static(path.join(config.root, 'public')));
  
  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
}
