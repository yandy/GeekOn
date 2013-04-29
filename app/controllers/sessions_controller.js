var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

exports.new = function (req, res) {
  res.render('sessions/new', { 
                              user: new User({}),
                              title: "登录"});
};

exports.create = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {return next(err);}
    if (!user) {
      req.flash('error','sorry, please check your name and password!');
      return res.redirect('/login');
    };
    req.logIn(user, function (err) {
      if (err) {return next(err);}
      req.session.user = user;
      req.flash('success','login');
      return res.redirect('/user/' + user.id);
    });
  })(req, res, next);
};

exports.destroy = function (req, res) {
  req.flash('success','logout');
  req.session.user = null;  
  req.logout();
  res.redirect('/');
}

