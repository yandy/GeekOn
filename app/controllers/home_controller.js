var mongoose = require('mongoose');
var Project = mongoose.model('Project');

exports.index = function(req, res, next){
  var options = {
    perPage: 5,
    page: 0
  };

  Project.list(options, function (err, projects) {
    if (err) return next(err);
    res.render('home', {
      title: '极客行动官方网站',
      projects: projects
    });
  });
};
