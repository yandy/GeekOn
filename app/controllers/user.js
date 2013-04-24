var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.account = function (req, res) {
  res.render('account', { user: req.user,
                         title: "账户"});
};

exports.getLogin = function (req, res) {
  res.render('login', { user: req.user,
                     message: req.session.message,
                       title: "登录"});
};

exports.postLogin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {return next(err);}
    if (!user) {
      req.session.message = [info.message];
      return res.redirect('/login');
    };
    req.logIn(user, function (err) {
      if (err) {return next(err);}
      return res.redirect('/');
    });
  })(req, res, next);
};

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
}

exports.test = function (req, res) {
  var user = new User({ username: "a",
                           email: "a@example.com",
                        password: "pass" });
  user.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("save user: " + user.username);
    };
  });
  res.send("test");
};
