exports.create = function (req, res) {
    var project = req.project;
    var user = req.session.user;
    
    if (!req.body['comment']) return res.redirect('/project/'+ project._id);
    project.addComment(user, req.body['comment'], function (err) {
       if (err) return res.render('500')
       res.redirect('/project/'+ project.id);
    })

}