var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
var Validator = require('../../lib/validate').Validator;
var santize = require('validator').santize;

var UserSchema = new Schema({

  name: {type: String, default: ''},
  username: {type: String, required: true, unique: true},
  uname: {type: String, required: true, unique: true},

  password: {type: String, required: true},
  avatar_url: {type: String, default: 'http://localhost:3000/img/avatar_default.jpg'},

  email: {type: String, required: true, unique: true},
  uemail: {type: String, required: true, unique: true},

  password_reset_token: {type: String, default: ''},
  password_reset_sent_at: {type: Date, default : Date.now},

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
  var validator = new Validator();
  validator.check(this.uname).len(3, 40).is(/^[\w-]+$/);
  if (validator.getErrors().length > 0) return cb(null, false, '用户名只能是3-40位英文字母，数字，下划线_及连字符-');

  this.username = this.uname.toLowerCase();
  this.model('User').findOne({username: this.username}, function (err, user) {
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
  validator.check(this.uemail).isEmail();
  if (validator.getErrors().length > 0) return cb(null, false, '请输入合法的Email地址');
  this.email = this.uemail.toLowerCase();
  this.model('User').findOne({email: this.email}, function (err, user) {
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
 var   token = new Date().getTime() + '_';
 for ( var x = 0; x < 16; x++ ) {
  var i = Math.floor( Math.random() * 62 );
  token += chars.charAt( i );
}
return token;
};

UserSchema.methods.generate_password_reset_token = function (cb) {
  this.password_reset_token = this.model('User').generate_token().toString('base64');
  this.password_reset_sent_at = new Date();
  this.markModified('password_reset_token');
  this.markModified('password_reset_sent_at');
};


UserSchema.statics.load = function (username, cb) {
  this.findOne({username : username})
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
