var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type: String, default: ''},
  username: {type: String, required: true, unique: true, lowercase: true, trim: true},
  password: {type: String, required: true},
  avatar_url: {type: String, default: 'http://localhost:3000/img/avatar_default.jpg'},
  email: {type: String, required: true, unique: true, lowercase: true, trim: true},
  provider: {type: String, required: true},
  github: {},
  joined_projects: [{
    project: {type : Schema.ObjectId, ref : 'Project'},
    created_at: { type : Date, default : Date.now }
  }],
  is_admin: {type: Boolean, default: false},
  created_at: {type: Date, default : Date.now}
});

UserSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Validate username
 * @param  {Function} cb [err, isValid, message]
 */
 UserSchema.methods.validateUsername = function (cb) {
  this.model('User').findOne({username: this.username.trim().toLowerCase()}, function (err, user) {
    if (err) return cb(err);
    if (!user) {
      return cb(null, true);
    } else {
      return cb(null, false, '该用户名已被注册！');
    }
  });
};

UserSchema.methods.validateEmail = function (cb) {
  this.model('User').findOne({email: this.email.trim().toLowerCase()}, function (err, user) {
    if (err) return cb(err);
    if (!user) {
      return cb(null, true);
    } else {
      return cb(null, false, '该Email已被注册！');
    }
  });
};

UserSchema.statics.load = function (id, cb) {
  this.findOne({username : id})
  .populate('joined_projects.project')
  .populate('joined_projects.project.provider')
  .exec(cb);
};

UserSchema.statics.list = function (options, cb) {
  var criteria = options.criteria || {};

  this.find(criteria)
  .sort({'created_at': -1}) // sort by date
  .limit(options.perPage)
  .skip(options.perPage * options.page)
  .exec(cb);
};

mongoose.model('User', UserSchema);
