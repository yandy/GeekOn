var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Article = mongoose.model('Article');

exports.index = function(req, res, next){
  var options = {
    perPage: 5,
    page: 0
  };

  Article.list(options, function (err, articles) {
    if (err) return next(err);
    Project.list(options, function (err, projects) {
      if (err) return next(err);
      res.render('home', {
        title: '极客行动官方网站',
        projects: projects,
        articles: articles
      });
    });
  });
};
