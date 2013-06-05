var mongoose = require('mongoose');
var Article = mongoose.model('Article');

exports.index = function(req, res, next){
  Article.list({perPage: 5, page: 0}, function (err, articles) {
    if (err) return next(err);
    res.render('about/index',{
      title: '关于我们',
      articles: articles
    });
  });
};
