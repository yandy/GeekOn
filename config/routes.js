module.exports = function (app, passport, auth) {

  var user = require('../app/controllers/users_controller')
  app.get('/signup', user.new);
  app.post('/signup', user.create);
  app.get('/user/:userId', auth.Authenticated, user.show);
  app.get('/auth/github', passport.authenticate('github'), function(req, res){});
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), user.authCallback)
  app.param('userId', user.user)

  var session = require('../app/controllers/sessions_controller')
  app.get('/login', session.new);
  app.post('/login',session.create);
  app.get('/logout', session.destroy);

  var project = require('../app/controllers/projects_controller');
  app.get('/create_project', project.new);
  app.post('/create_project', project.create);
  app.delete('/destroy_project', project.destroy);
  app.get('/project/:projectId', project.show);
  app.get('/projects', project.index);
    var comment = require('../app/controllers/comments_controller');
    app.post('/project/:projectId/create_comment', comment.create);
  app.param('projectId', project.project)
  

  var geek = require('../app/controllers/geek');
  app.get('/geeks', geek.list);

  var activity = require('../app/controllers/activity');
  app.get('/events', activity.list);

  var home = require('../app/controllers/home_controller');
  app.get('/', home.index);
  
}
