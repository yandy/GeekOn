var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var marked = require('marked');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  langPrefix: 'language-',
  highlight: function(code, lang) {
    if (lang === 'js') {
      return highlighter.javascript(code);
    }
    return code;
  }
});

var ProjectSchema = new Schema({
  name: String,
  provider: {type :  Schema.Types.ObjectId, ref : 'User'},

  summary: String,

  description: String,
  description_html: String,

  participants: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: {type: Date, default: Date.now }
  }],

  followers: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: {type: Date, default: Date.now }
  }],

  comments: [{
    body: {type: String, default: ''},
    body_html: {type: String, default: ''},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: {type: Date, default: Date.now}
  }],
  created_at: {type: Date, default: Date.now}
});

ProjectSchema.pre('save', function(next) {
  this.description_html = marked(this.description);
  next();
});

ProjectSchema.methods = {
  addComment: function (user, comment, cb) {
    this.comments.push({
      body: comment,
      body_html: marked(comment),
      user: user._id
    });
    this.save(cb);
  }
};

ProjectSchema.statics = {
  load: function (id, cb) {
    this.findOne({_id: id})
    .populate('provider', 'name username avatar_url')
    .populate('participants.user')
    .populate('followers.user')
    .populate('comments.user')
    .exec(cb);
  },

  list: function (options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
    .populate('provider', 'name username avatar_url').populate('participants.user', 'name username avatar_url')
      .sort({'created_at': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
    }
  };

  mongoose.model('Project', ProjectSchema);
