var mongoose = require('mongoose');
var User = mongoose.model('User');


exports.user = function (req, res, next, id) {
  User.load(id, function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load user ' + id));
    req.profile = user;
    next();
  });
};

exports.signin = function (req, res) {};

exports.authCallback = function (req, res, next) {
  req.flash('success','Signup');
  req.session.user = req.user;
  req.user = null;
  res.redirect('/');
};

exports.show = function (req, res) {
  res.render('users/show', {
    profile: req.profile,
    title: "账户"});
};

exports.new = function (req, res) {
  res.render('users/new', {
    title: 'Sign up',
    user: new User({})
  });
};

exports.create = function (req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  if (req.body["password_confirmation"] == user.password) {
    user.save(function (err) {
      if (err) {
        req.flash('error','some mistakes have appeared');
        return res.render('users/new', {
          title: 'error',
          errors: err.errors,
          user: user});
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        req.flash('success','Signup');
        req.session.user = user;
        return res.redirect('/user/'+user._id);
      });
    });
  } else {
    res.render('users/new', {
      title: 'Sign up',
      user: new User({})
    });
  }

};

exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var perPage = 2;
  var options = {
    perPage: perPage,
    page: page
  };

  User.list(options, function(err, users) {
    if (err) return res.render('500');
    User.count(
               function (err, count) {
                res.render('users/index', {
                  title: 'List of Users',
                  users: users,
                  page: page,
                  pages: count / perPage
                });
              });
  });
};

exports.edit = function (req, res) {
   res.render('users/edit', {
    title: 'Edit '+req.profile.name,
    profile: req.profile
  });
};

exports.update = function (req, res) {

};
