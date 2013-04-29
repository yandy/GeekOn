var mongoose = require('mongoose');
var Project = mongoose.model('Project');

exports.project = function(req, res, next, id){
  var User = mongoose.model('User')
  Project.load(id, function (err, project) {
    if (err) return next(err)
    if (!project) return next(new Error('Failed to load article ' + id))
    req.project = project;
    next()
  })
}

exports.new = function(req, res){
	res.render( 'projects/new', {
		title: 'new Project',
		project: new Project({provider: req.session.user}),
	} );
};

exports.create = function (req, res) {
	var project = new Project(req.body)
	project.provider = req.session.user._id;
	project.participants.push({ user: req.session.user._id});

	project.save(function (err, project) {
		if (err) {
			res.render('projects/new', {
				title: 'New Project',
				project: project,
				errors: err.errors
			})
		}
		else {
			res.redirect('/project/'+ project.id);
		}
	})
};

exports.show = function (req, res) {
	res.render('projects/show', {
									project: req.project,
									title: req.project.name,
								});
};

exports.index = function (req,res) {
	var page = req.param('page') > 0 ? req.param('page') : 0
  	var perPage = 15
  	var options = {
  		perPage: perPage,
  		page: page
  	}

  Project.list(options, function(err, projects) {
    if (err) return res.render('500')
    Project.count(function (err, count) {
      res.render('projects/index', {
        title: 'List of Articles',
        projects: projects,
        page: page,
        pages: count / perPage
      })
    })
  })

}

exports.destroy = function (req, res) {
	var project = req.project;
	project.remove(function(err){
		res.redirect('/projects');
	})
};

exports.follow = function (req, res) {
    console.log('come  into follow');
    var project = req.project;
    project.participants.push({user: req.session.user._id});
    project.save(function (err, project){
        res.redirect('/project/'+ project.id);
    })
};