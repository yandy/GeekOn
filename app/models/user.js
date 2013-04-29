var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;

var UserSchema = new Schema({
   name: { type: String, default: ''}
   ,username: { type: String, required: true}
   ,password: String
   ,avatar_url: {type: String, default: 'http://localhost:3000/img/avatar_default.jpg'}
   ,email: {type: String, required: true, index: {unique: true, dropDups: true}}
   ,provider: { type: String, required: true}
   ,github: {}
   ,joined_projects: [{
        project: {type : Schema.ObjectId, ref : 'Project'},
        createdAt: { type : Date, default : Date.now }
    }]
   ,isAdmin:{type: Boolean, default: false}
   ,createdAt: { type: Date, default : Date.now }
});

UserSchema.pre('save', function (next) {
  var user = this;
  user.name = user.name || user.username;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.statics = {

  
  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('joined_projects.project')
      .populate('joined_projects.project.provider')
      .exec(cb)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}
mongoose.model('User', UserSchema);
