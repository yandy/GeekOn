var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var marked = require('marked');

var ArticleSchema = new Schema({
  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},
  body_html: { type: String, default: '', trim: true},
  comments: [{
    body: { type : String, default : '' },
    body_html: { type: String, default: ''},
    user: { type : Schema.ObjectId, ref : 'User' },
    created_at: { type : Date, default : Date.now }
  }],
  created_at  : {type : Date, default : Date.now}
});

ArticleSchema.pre('save', function(next) {
  if (this.isNew) return next();
  this.body_html = marked(this.body);
  next();
});


ArticleSchema.methods = {

  addComment: function (user, comment, cb) {
    this.comments.push({
      body: comment,
      body_html: marked(comment),
      user: user._id
    });
    this.save(cb);
  }

};

ArticleSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id })
    .populate('user')
    .populate('comments.user')
    .exec(cb);
  },

  list: function (options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
    .populate('user')
      .sort({'created_at': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
    }

  };

  mongoose.model('Article', ArticleSchema);
