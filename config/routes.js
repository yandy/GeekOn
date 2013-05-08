module.exports = function (app, passport, auth) {
  var user = require('../app/controllers/users_controller');
  app.get('/signup', user.new);
  app.post('/signup', user.create);
  app.get('/user/:user', user.show);
  app.get('/auth/github', passport.authenticate('github'), user.signin);
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), user.authCallback);
  app.get('/geeks',user.index);
  app.get('/user/:user/edit', user.edit);
  app.put('/user/:user', user.update);
  app.get('/user/:user/reset', user.reset);
  app.get('/user/:user/reset/callback', user.reset_edit);
  //app.put('/user/:user/reset/update', user.reset_update);
  app.param('user', user.user);

  var session = require('../app/controllers/sessions_controller');
  app.get('/login', session.new);
  app.post('/login',session.create);
  app.get('/logout', session.destroy);

  var project = require('../app/controllers/projects_controller');
  var comment = require('../app/controllers/comments_controller');
  app.get('/create_project', project.new);
  app.post('/create_project', project.create);
  app.get('/destroy_project', project.destroy);
  app.get('/project/:projectId', project.show);
  app.get('/projects', project.index);
  app.post('/project/:projectId/create_comment', auth.ensureAuthenticated, comment.create);
  app.get('/project/:projectId/follow', auth.ensureAuthenticated, project.follow);
  app.param('projectId', project.project);

  var article = require('../app/controllers/articles_controller');
  app.get('/create_article', article.new);
  app.post('/create_article', article.create);
  app.get('/destroy_article', article.destroy);
  app.get('/article/:articleId', article.show);
  app.get('/articles', article.index);
  app.post('/article/:articleId/create_comment', auth.ensureAuthenticated,comment.create);
  app.param('articleId', article.article);

  var home = require('../app/controllers/home_controller');
  app.get('/', home.index);

};
