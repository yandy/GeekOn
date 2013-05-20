var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
var Validator = require('../../lib/validate').Validator;
var santize = require('validator').santize;

var UserSchema = new Schema({

  name: {type: String},
  username: {type: String, required: true},
  uname: {type: String, required: true, unique: true},

  password: {type: String},
  avatar_url: {type: String},

  email: {type: String, required: true},
  uemail: {type: String, required: true, unique: true},

  password_reset_token: {type: String},
  password_reset_sent_at: {type: Date, default: Date.now},

  company: {type: String},
  location: {type: String},
  website: {type: String},
  introduction: {type: String},

  provider: {type: String, required: true},
  github: {},
  google: {},

  starred_projects: [{
    project: {type: Schema.Types.ObjectId, ref: 'Project'},
    created_at: {type: Date, default: Date.now }
  }],

  joined_projects: [{
    project: {type: Schema.Types.ObjectId, ref: 'Project'},
    created_at: {type: Date, default: Date.now}
  }],

  is_admin: {type: Boolean, default: false},
  created_at: {type: Date, default: Date.now}
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
  var validator = new Validator();
  validator.check(this.username).len(3, 40).is(/^[\w\.@-]+$/);
  if (validator.getErrors().length > 0)
    return cb(null, false, '用户名只能是3-40位英文字母，数字，下划线_连字符-，@和.');

  this.uname = this.username.toLowerCase();
  this.model('User').findOne({uname: this.uname}, function (err, user) {
    if (err) return cb(err);
    if (!user) {
      return cb(null, true);
    } else {
      return cb(null, false, '该用户名已被注册！');
    }
  });
};

UserSchema.methods.validateEmail = function (cb) {
  var validator = new Validator();
  validator.check(this.email).isEmail();
  if (validator.getErrors().length > 0)
    return cb(null, false, '请输入合法的Email地址');
  this.uemail = this.email.toLowerCase();
  this.model('User').findOne({uemail: this.uemail}, function (err, user) {
    if (err) return cb(err);
    if (!user) {
      return cb(null, true);
    } else {
      return cb(null, false, '该Email已被注册！');
    }
  });
};

UserSchema.methods.generate_token = function () {
  var chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  var token = new Date().getTime() + '_';
  for (var x = 0; x < 16; x++) {
    var i = Math.floor( Math.random() * 62);
    token += chars.charAt(i);
  }
  return token;
};

UserSchema.methods.generate_password_reset_token = function (cb) {
  this.password_reset_token = this.generate_token().toString('base64');
  this.password_reset_sent_at = new Date();
};

UserSchema.statics.load = function (username, cb) {
  this.findOne({uname : username.toLowerCase()}, function (err, user) {
    if (err || !user) return cb(err);
    user.populate({path: 'joined_projects.project starred_projects.project', model: 'Project'}, function (err, pop) {
      if (err) return cb(err);
      pop.populate({path: 'joined_projects.project.provider starred_projects.project.provider', model: 'User'}, cb);
    });
  });
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
