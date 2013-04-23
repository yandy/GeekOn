/**
 * index render
 * @param  req
 * @param  res
 */
var index = function(req, res){
  res.render('index', { user: req.user,
                       title: 'GeekOn' });
};


exports.route = function (app) {
  app.get('/', index);

  var activity = require('./activity');
  app.get('/events', activity.list);

  var project = require('./project');
  app.get('/projects', project.list);

  var geek = require('./geek');
  app.get('/geeks', geek.list);

  var user = require('./user');
  var pass = require('../config/pass');
  app.get('/user', user.list);
  app.get('/account', pass.ensureAuthenticated, user.account);
  app.get('/login', user.getLogin);
  app.post('/login', user.postLogin);
  app.get('/logout', user.logout);
  app.get('/test', user.test);
}
