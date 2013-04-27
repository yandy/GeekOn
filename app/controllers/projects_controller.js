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
		project: new Project({provider: req.user}),
		user: req.user
	} );
};

exports.create = function (req, res) {
	var project = new Project(req.body)
	project.provider = req.user._id;
	project.Participants.push(req.user._id);

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
	console.log(req.project);
	res.render('projects/show', {
									project: req.project,
									title: req.project.name,
									user: req.user
								});
};

exports.index = function (req,res) {
	Project.find(function (err, projects){
		if(!err){
			res.render('projects/index', {title: 'all projects',
										  projects: projects, 
										  user: req.user
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