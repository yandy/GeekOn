var mongoose = require('mongoose')
   , Article = mongoose.model('Article')


exports.article = function(req, res, next, id){
  var User = mongoose.model('User')

  Article.load(id, function (err, article) {
    if (err) return next(err)
    if (!article) return next(new Error('Failed to load article ' + id))
    req.article = article
    next()
  })
}


exports.new = function(req, res){
  res.render('articles/new', {
    title: 'New Article',
    article: new Article({})
  })
}

/**
 * Create an article
 */

exports.create = function (req, res) {
  var article = new Article(req.body)

  article.save(function (err) {
    if (err) {
      res.render('articles/new', {
        title: 'New Article',
        article: article,
        errors: err.errors
      })
    }
    else {
      res.redirect('/article/'+article._id)
    }
  })
}


exports.show = function(req, res){
  res.render('articles/show', {
    title: req.article.title,
    article: req.article
  })
}

/**
 * Delete an article
 */

exports.destroy = function(req, res){
  var article = req.article
  article.remove(function(err){
    req.flash('success', 'Deleted successfully')
    res.redirect('/articles')
  })
}



exports.index = function(req, res){
  Project.find(function (err, articles){
      if(!err){
        res.render('articles/index', {title: 'all articles',
                        articles: articles 
                      });
      }else {
        res.redirect('/');  
      };
    });

}
