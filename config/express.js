var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var helpers = require('view-helpers');

module.exports = function (app, config, passport) {
  // all environments
  app.set('port', process.env.PORT || 3000);
  //app.set('port', 8080);
  app.set('views', path.join(config.root, 'app', 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret:'geekon'}));
  app.use(function (req, res, next) {
    if ( req.method == 'POST' && req.url == '/login' ) {
      if ( req.body.rememberme ) {
        req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
      } else {
        req.session.cookie.expires = false;
      }
    }
    next();
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.csrf());
  app.use(helpers('geekon'));
  app.use(flash());
  app.use(function (req, res, next) {
   res.locals.error = req.flash('error').toString();
   res.locals.success = req.flash('success').toString();
   res.locals.user = req.session ? req.session.user : '';
   res.locals.token = req.session._csrf;
   next();
 });
  app.use(app.router);
  app.use(express.static(path.join(config.root, 'public')));
  app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
  });

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
};
