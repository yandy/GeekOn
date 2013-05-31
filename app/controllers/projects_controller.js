var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Article = mongoose.model('Article');
var User = mongoose.model('User');
var sanitize = require('validator').sanitize;

exports.project = function (req, res, next, id) {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.render('404');
  }
  Project.load(id, function (err, project) {
    if (err) return next(err);
    if (!project) return res.render('404');
    req.project = project;
    next();
  });
};

exports.new = function (req, res) {
  res.render( 'projects/new', {
    title: '新建项目',
    project: new Project({provider: req.session.user})
  });
};

exports.create = function (req, res) {
  var project = new Project({
    name: sanitize(req.body.name).xss(),
    summary: sanitize(req.body.summary).xss(),
    description: sanitize(req.body.description).xss()
  });
  project.provider = req.session.user._id;
  project.participants.push({ user: req.session.user._id});
  project.save( function(err, project){
    User.findOne(
                 {_id: req.session.user._id} ,function (err, user){
                  if (err) return next(err);
                  if (!user) return next(new Error('Failed to load user ' + id));
                  user.joined_projects.push({project: project._id});
                  user.save();
                  res.redirect('/projects/'+ project.id);
                });
  });
};

exports.show = function (req, res) {
  var project = req.project;
  var isJoined = false;
  var isStarred = false;
  if (req.session.user) {
    var filtered = project.participants.filter(function (element, index, array) {
      return element.user._id == req.session.user._id;
    });
    isJoined = (filtered.length === 0) ? false: true;

    filtered = project.followers.filter(function (element, index, array) {
      return element.user._id == req.session.user._id;
    });
    isStarred = (filtered.length === 0) ? false: true;
  }
  res.render('projects/show', {
    project: req.project,
    title: req.project.name,
    articles: req.articles,
    isJoined: isJoined,
    isStarred: isStarred
  });
};

exports.index = function (req, res, next) {
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var perPage = 15;
  var options = {
    perPage: perPage,
    page: page
  };

  Project.list(options, function(err, projects) {
    if (err) return next(err);
    Project.count(function (err, count) {
      res.render('projects/index', {
        title: '创意项目',
        projects: projects,
        page: page,
        pages: count / perPage,
        articles: req.articles
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

exports.join = function (req, res, next) {
  var project = req.project;
  var filtered = project.participants.filter(function (element, index, array) {
    return element.user._id == req.session.user._id;
  });
  var isJoined = (filtered.length !== 0);
  if (!isJoined) {
    project.participants.push({user: req.session.user._id});
  } else {
    var index = project.participants.indexOf(filtered[0]);
    project.participants.splice(index, 1);
  }

  project.save(function (err) {
    if (err) return next(err);
    User.findOne({_id: req.session.user._id} ,function (err, user){
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load user ' + id));
      if (isJoined) {
        var filtered = user.joined_projects.filter(function (element, index, array) {
          return element.project._id == req.project._id;
        });
        var index = user.joined_projects.indexOf(filtered[0]);
        user.joined_projects.splice(index, 1);
      } else {
        user.joined_projects.push({project: req.project._id});
      }
      user.save(function (err) {
        if (err) return next(err);
        res.redirect('/projects/'+ project.id);
      });
    });
  });
};

exports.star = function (req, res, next) {
  var project = req.project;
  var filtered = project.followers.filter(function (element, index, array) {
    return element.user._id == req.session.user._id;
  });
  var isStarred = (filtered.length !== 0);
  var date = Date.now();
  if (!isStarred) {
    project.followers.push({user: req.session.user._id, created_at: date});
  } else {
    var index = project.followers.indexOf(filtered[0]);
    project.followers.splice(index, 1);
  }

  project.save(function (err) {
    if (err) return next(err);
    User.findOne({_id: req.session.user._id} ,function (err, user){
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load user ' + id));
      if (isStarred) {
        var filtered = user.starred_projects.filter(function (element, index, array) {
          return element.project._id == req.project._id;
        });
        var index = user.starred_projects.indexOf(filtered[0]);
        user.starred_projects.splice(index, 1);
      } else {
        user.starred_projects.push({project: req.project._id, created_at: date});
      }
      user.save(function (err) {
        if (err) return next(err);
        res.redirect('/projects/'+ project.id);
      });
    });
  });
};

exports.edit = function (req, res) {
  res.render('projects/edit', {
    title: '编辑 '+req.project.name,
    project: req.project
  });
};

exports.update = function (req, res) {
  var project = req.project;
  project.name = sanitize(req.body.name).xss();
  project.summary = sanitize(req.body.summary).xss();
  project.description = sanitize(req.body.description).xss();

  project.save(function (err) {
    if (err) {
      res.render('projects/edit', {
        title: '编辑项目',
        project: project,
        errors: err.errors
      });
    } else {
      req.flash("success","修改成功！");
      req.project = project;
      res.redirect('/projects/' + project._id);
    }
  });
};
