var mongoose = require('mongoose');
var User = mongoose.model('User');


exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.user = user
      next()
    })
}

exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

exports.show = function (req, res) {
	res.render('users/show', { user: req.user,
		title: "账户"});
};

exports.new = function (req, res) {
	res.render('users/new', {
		title: 'Sign up',
		user: new User()
	})
};

exports.create = function (req, res) {
	var user = new User(req.body)
	user.provider = 'local'
	if (req.body["password_confirmation"] == user.password) {
		user.save(function (err) {
			if (err) {
				return res.render('users/new', { errors: err.errors, user: user });
			}
			req.logIn(user, function(err) {
				if (err) return next(err)
				return res.redirect('/user/'+user._id);	
			})
		});
	}else{
		res.render('users/new', {
			title: 'Sign up',
			user: new User()
		})
	}

};