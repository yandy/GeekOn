var user = require('./user');
var project = require('./project');
var activity = require('./activity');
var geek = require('./geek');

var index = function(req, res){
  res.render('index', { title: 'GeekOn' });
};


exports.route = function (app) {
  app.get('/', index);
  app.get('/events', activity.list);
  app.get('/projects', project.list);
  app.get('/geeks', geek.list);
  app.get('/user', user.list);
}
