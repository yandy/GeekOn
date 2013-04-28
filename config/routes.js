module.exports = function (app, passport, auth) {

  var comment = require('../app/controllers/comments_controller');

  var user = require('../app/controllers/users_controller')
  app.get('/signup', user.new);
  app.post('/signup', user.create);
  app.get('/user/:userId', user.show);
  app.get('/auth/github', passport.authenticate('github'), user.signin);
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), user.authCallback)
  app.get('/geeks',user.index);
  app.param('userId', user.user)

  var session = require('../app/controllers/sessions_controller')
  app.get('/login', session.new);
  app.post('/login',session.create);
  app.get('/logout', session.destroy);

  var project = require('../app/controllers/projects_controller');
  app.get('/create_project', project.new);
  app.post('/create_project', project.create);
  app.get('/destroy_project', project.destroy);
  app.get('/project/:projectId', project.show);
  app.get('/projects', project.index);
  app.post('/project/:projectId/create_comment', auth.Authenticated, comment.create);
  app.param('projectId', project.project)
  
  var article = require('../app/controllers/articles_controller');
  app.get('/create_article', article.new);
  app.post('/create_article', article.create);
  app.get('/destroy_article', article.destroy);
  app.get('/article/:articleId', article.show);
  app.get('/articles', article.index);
  app.post('/article/:articleId/create_comment', auth.Authenticated,comment.create);
  app.param('articleId', article.article)


  var activity = require('../app/controllers/activity');
  app.get('/events', activity.list);

  var home = require('../app/controllers/home_controller');
  app.get('/', home.index);
  
}
