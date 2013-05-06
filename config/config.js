var path = require('path');
var rootPath = path.join(__dirname, '..');

module.exports = {
  development : {
    db: 'mongodb://localhost/geekon',
    root: rootPath,
    github: {
      clientID: '64bd1cd2bd08947654e2',
      clientSecret: '460b0d7ad999d4728e3ab2daec4298cefc795cb0',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
  }
};
