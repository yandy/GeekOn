var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var User = require('mongoose').model('User');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function (username, password, done) {
  User.findOne({username: username}, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, {message: 'Unkown user '+ username});
    user.comparePassword(password, function (err, isMatch) {
      if (err) return done(err);
      if (isMatch) {
        return done(null, user);
      } else{
        return done(null, false, {message:'Invalid password'});
      }
    });
  });
}));

exports.ensureAuthenticated = function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {return next();}
  res.redirect('/login');
}
