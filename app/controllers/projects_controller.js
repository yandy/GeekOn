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
		user: req.session.user
	} );
};

exports.create = function (req, res) {
	var project = new Project(req.body)
	project.provider = req.session.user._id;
	project.Participants.push(req.session.user._id);

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
									user: req.session.user
								});
};

exports.index = function (req,res) {
	Project.find(function (err, projects){
		if(!err){
			res.render('projects/index', {title: 'all projects',
										  projects: projects, 
										  user: req.session.user
										});
		}else {
			res.redirect('/');	
		};
	});

}

exports.destroy = function (req, res) {
	var project = req.project;
	project.remove(function(err){
		res.redirect('/projects');
	})
};