var LocalStrategy = require('passport-local').Strategy
    ,GitHubStrategy = require('passport-github').Strategy
    ,User = require('mongoose').model('User')

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

 // use github strategy
  passport.use(new GitHubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL,
      customHeaders: {"User-Agent" : "I don't know"}
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'github.id': profile.id }, function (err, user) {
        if (!user) {
          user = new User({
              name: profile.displayName
            , email: profile.emails[0].value
            , username: profile.username
            , provider: 'github'
            , github: profile._json
            , avatar_url: profile.github[avatar_url]
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        } else {
          return done(err, user)
        }
      })
    }
  ));

};
