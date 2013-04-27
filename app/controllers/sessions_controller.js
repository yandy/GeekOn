var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

exports.new = function (req, res) {
  res.render('sessions/new', { user: req.user,
                     message: req.session.message,
                       title: "登录"});
};

exports.create = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {return next(err);}
    if (!user) {
      return res.render('/login', {
                                      title: 'login',
                                      user: new User()
                                     })
    };
    req.logIn(user, function (err) {
      if (err) {return next(err);}
      return res.redirect('/user/' + user.id);
    });
  })(req, res, next);
};

exports.destroy = function (req, res) {
  req.user = null;  
  req.logout();
  res.redirect('/');
}

