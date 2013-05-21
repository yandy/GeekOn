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
    },
    google: {
      returnURL: 'http://localhost:3000/auth/google/callback',
      realm: 'http://localhost:3000'
    }
  },

  production: {
    db: 'mongodb://localhost/geekon',
    root: rootPath,
    github: {
      clientID: '5830cf0d80d4c9b8c62f',
      clientSecret: '168059ea4de1fdebeabe53106d515d835868c016',
      callbackURL: 'http://ec2-54-251-161-104.ap-southeast-1.compute.amazonaws.com/auth/github/callback'
    },
    google: {
      returnURL: 'http://ec2-54-251-161-104.ap-southeast-1.compute.amazonaws.com/auth/google/callback',
      realm: 'http://ec2-54-251-161-104.ap-southeast-1.compute.amazonaws.com'
    }
  }
};
