module.exports = function (app, passport, auth) {
  var index = require('../app/controllers/index')
  app.get('/', index.index);

  var activity = require('../app/controllers/activity');
  app.get('/events', activity.list);

  var project = require('../app/controllers/project');
  app.get('/projects', project.list);

  var geek = require('../app/controllers/geek');
  app.get('/geeks', geek.list);

  var user = require('../app/controllers/user');
  app.get('/user', user.list);
  app.get('/account', auth.requiresLogin, user.account);
  app.get('/login', user.getLogin);
  app.post('/login', user.postLogin);
  app.get('/logout', user.logout);
  app.get('/test', user.test);
}
