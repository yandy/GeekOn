exports.create = function (req, res) {
    var project = req.project || null;
    var article = req.article || null;
    var user = req.session.user;
    
    if (project && !article){
        if (!req.body['comment']) return res.redirect('/project/'+ project._id);
        project.addComment(user, req.body['comment'], function (err) {
         if (err) return res.render('500')
             res.redirect('/project/'+ project.id);
     })
    }else {
         if (!req.body['comment']) return res.redirect('/article/'+ article._id);
        article.addComment(user, req.body['comment'], function (err) {
         if (err) return res.render('500')
             res.redirect('/article/'+ article.id);
     })
    }
}