var mongoose = require('mongoose');
var User = mongoose.model('User');
var Email = require('../mailers/email');
var _ = require('underscore');
var passport = require('passport');
var sanitize = require('validator').sanitize;

exports.user = function (req, res, next, username) {
  console.log('comes into user controller');
  User.load(username, function (err, user) {
    if (err) return next(err);
    if (!user) return res.render('404');
    req.profile = user;
    next();
  });
};

exports.authCallback = function (req, res, next) {
  passport.authenticate('github', function (err, user, profile) {
    console.log('callback');
    if (err) return next(err);
    if (user) {
      req.logIn(user, function (err) {
        if (err) return next(err);
        req.session.user = user;
        req.flash('success', '欢迎');
        return res.redirect('/users/' + user.username);
      });
    } else {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        avatar_url: profile._json.avatar_url,
        provider: 'github',
        github: profile._json
      });
      user.validateUsername(function (err, isValid, message) {
        if (err) return next(err);
        if (!isValid) {
          req.flash('error', message);
          return res.redirect('/signup');
        }
        user.validateEmail(function (err, isValid, message) {
          if (err) return next(err);
          if (!isValid) {
            req.flash('error', message);
            return res.redirect('/signup');
          }
          user.save(function (err) {
            if (err) return next(err);
            // Email.send_email(user);
            req.logIn(user, function (err) {
              if (err) return next(err);
              req.session.user = user;
              req.flash('success', '欢迎');
              return res.redirect('/users/' + user.username);
            });
          });
        });
      });
    }
  })(req, res, next);
};

exports.show = function (req, res) {
  res.render('users/show', {
    profile: req.profile,
    title: '账户'});
};

exports.new = function (req, res) {
  res.render('users/new', {
    title: '注册',
    user: new User({})
  });
};

exports.create = function (req, res, next) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  user.validateUsername(function (err, isValid, message) {
    if (err) return next(err);
    if (!isValid) {
      req.flash('error', message);
      return res.redirect('/signup');
    }

    user.validateEmail(function (err, isValid, message) {
      if (err) return next(err);
      if (!isValid) {
        req.flash('error', message);
        return res.redirect('/signup');
      }

      if (user.password.length < 6) {
        req.flash('error', '请设置6位以上的口令');
        return res.redirect('/signup');
      }

      if (req.body["password_confirmation"] !== user.password) {
        req.flash('error', '两次输入的口令不一致！');
        return res.redirect('/signup');
      }
      user.provider = 'local';
      user.save(function (err) {
        if (err) return next(err);
        // Email.send_email(user);
        req.logIn(user, function(err) {
          if (err) return next(err);
          req.flash('success','注册成功！');
          req.session.user = user;
          return res.redirect('/users/'+ user.username);
        });
      });
    });
  });
};

exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var perPage = 144;
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
  console.log("comes into the edit controller")
  res.render('users/edit', {
    title: 'Edit '+req.profile.name,
    profile: req.profile
  });
};

exports.update = function (req, res) {
  console.log("comes to update controller");
  var user = req.profile;
  // user.name = sanitize(req.body.name).xss();)
  user.website = sanitize(req.body.website).xss();
  user.location = sanitize(req.body.location).xss();
  user.company = sanitize(req.body.company).xss();
  user.introduction = sanitize(req.body.introduction).xss();

  user.save(function (err, user) {
    if (err) {
      res.render('users/edit', {
        title: 'Edit user',
        user: user,
        errors: err.errors
      });
    }
    else {
      req.flash("success","修改成功！");
      req.session.user = user;
      res.redirect('/users/' + user.username);
    }
  });
};

exports.reset_edit = function (req, res) {
  console.log(req.profile);
  res.render('users/reset', {
    title: 'reset',
    profile: req.profile
  });
};
exports.reset_update = function (req, res) {
  console.log('come into the reset controller');
  if (req.body.password.length < 6) {
    req.flash('error', '请设置6位以上的口令');
    return res.redirect('/users/'+req.profile.username+'/reset');
  }

  if (req.body["password_confirmation"] !== req.body.password) {
    req.flash('error', '两次输入的口令不一致！');
    return res.redirect('/users/'+req.profile.username+'/reset');
  }

  User.load(req.profile.username, function (err, user) {
    user.password = req.body.password;
    user.save(function (err, user){
      res.redirect('/users/' + user.username);
    });
  });
};


exports.forgot = function (req, res) {
  console.log('come into the forgot controller');
  res.render('users/forgot', {
    title: 'forgot'
  });
};

exports.send_forgot_email = function (req, res) {
  User.findOne({email: req.body.email}, function (err, user){
    user.generate_password_reset_token();
    user.save(function (err, user){
      Email.send_password_reset_token(user);
      req.flash('success', 'email has been sent, please wait.....');
      res.redirect('/signup');
    });
  });
};


exports.reset_email_callback = function (req, res) {
  User.findOne({password_reset_token: req.query['token']}, function (err, user) {
   var expire = new Date();
   expire.setUTCMinutes(expire.getUTCMinutes()-1);
   console.log(user);
   if(user.password_reset_sent_at < expire) {
    req.flash('error',"The token's time is over the expire, new token has been sent" );
    user.generate_password_reset_token();
    user.save(function (err, user) {
     Email.send_password_reset_token(user);
     res.redirect('/signup');
   })

  }else {
    req.session.user = user;
    res.redirect('/users/'+ user.username+'/reset');
  }
});
};

exports.direct_reset_edit = function (req, res) {
  res.render('users/direct_reset', {
    title: 'direct_reset',
    profile: req.profile
  });
};

exports.direct_reset_update = function (req, res) {
  console.log('come into the direct_reset controller');

  if (req.body.password.length < 6) {
    req.flash('error', '请设置6位以上的口令');
    return res.redirect('/users/'+req.profile.username+'/direct_reset');
  }

  if (req.body["password_confirmation"] !== req.body.password) {
    req.flash('error', '两次输入的口令不一致！');
    return res.redirect('/users/'+req.profile.username+'/direct_reset');
  }

  User.load(req.profile.username, function (err, user) {
    user.comparePassword (req.body.old_password, function (err, isMatch){
      if(!isMatch){
        req.flash('error', '输入的就口令不正确！');
        return res.redirect('/users/'+req.profile.username+'/direct_reset');
      } else {
        user.password = req.body.password;
        user.save(function (err, user){
          res.redirect('/users/' + user.username);
        });
      }
    })
  });
};
