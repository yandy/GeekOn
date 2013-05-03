var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var User = mongoose.model('User');

exports.project = function (req, res, next, id) {
  Project.load(id, function (err, project) {
    if (err) return next(err);
    if (!project) return next(new Error('Failed to load project' + id));
    req.project = project;
    next();
  });
};

exports.new = function (req, res) {
  res.render( 'projects/new', {
    title: 'new Project',
    project: new Project({provider: req.session.user})
  });
};

exports.create = function (req, res) {
  var project = new Project(req.body);
  project.provider = req.session.user._id;
  project.participants.push({ user: req.session.user._id});
  project.save( function(err, project){
    User.findOne(
                 {_id: req.session.user._id} ,function (err, user){
                  if (err) return next(err);
                  if (!user) return next(new Error('Failed to load user ' + id));
                  user.joined_projects.push({project: project._id});
                  user.save();
                  res.redirect('/project/'+ project.id);
                });
  });
};

exports.show = function (req, res) {
  res.render('projects/show', {
    project: req.project,
    title: req.project.name
  });
};

exports.index = function (req,res) {
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var perPage = 15;
  var options = {
    perPage: perPage,
    page: page
  };

  Project.list(options, function(err, projects) {
    if (err) return res.render('500');
    Project.count(function (err, count) {
      res.render('projects/index', {
        title: 'List of Projects',
        projects: projects,
        page: page,
        pages: count / perPage
      });
    });
  });

};

exports.destroy = function (req, res) {
  var project = req.project;
  project.remove(function(err){
    res.redirect('/projects');
  });
};

exports.follow = function (req, res) {
  console.log('come  into follow');
  var project = req.project;
  project.participants.push({user: req.session.user._id});
  project.save();
  console.log(project.participants);
  User.findOne({_id: req.session.user._id} ,function (err, user){
    console.log(user);
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load user ' + id));
    user.joined_projects.push({project: req.project._id});
    user.save();
    res.redirect('/project/'+ project.id);
  });
};
