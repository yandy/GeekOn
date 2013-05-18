var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var User = require('mongoose').model('User');

module.exports = function (passport, config) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({_id: id}, function (err, user) {
      done(err, user);
    });
  });

  // use local strategy
  passport.use(new LocalStrategy(function (username, password, done) {
    User.findOne({$or:[{username: username}, {email: username}]}, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, {message: '该用户不存在！'});

      user.comparePassword(password, function (err, isMatch) {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message:'口令不正确！'});
        }
      });
    });
  }));

  // use github strategy
  passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL,
    customHeaders: { "User-Agent": "geekon" }},
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'github.id': profile.id }, function (err, user) {
        if(err) return done(err);
        if (user) return done(err, user);
        return done(err, null, profile);
      });
    }));

  /**
   * use Google Strategy
   */
  passport.use(new GoogleStrategy({
    returnURL: config.google.returnURL,
    realm: config.google.realm,
    profile: true
  },
  function (identifier, profile, done) {
    profile.id = identifier;
    User.findOne({'google.id': profile.id}, function (err, user) {
      if (err) return done(err);
      if (user) return done(err, user);
      return done(err, null, profile);
    });
  }));
};
