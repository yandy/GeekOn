var mongoose = require('mongoose')
  , Schema = mongoose.Schema



var ArticleSchema = new Schema({
  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},
 // body_html: { type: String, default: '', trim: true},
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  createdAt  : {type : Date, default : Date.now}
})

ArticleSchema.methods = {

  addComment: function (user, comment, cb) {

    this.comments.push({
      body: comment,
      user: user._id
    })
    this.save(cb)
  }

}


ArticleSchema.statics = {
  
  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email')
      .populate('comments.user')
      .exec(cb)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }


 
}

mongoose.model('Article', ArticleSchema)
