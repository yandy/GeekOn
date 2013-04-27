var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	name: String,
	provider: {type : Schema.ObjectId, ref : 'User'},
	preview: String,
	requirement: String,
	Participants: [{type : Schema.ObjectId, ref : 'User'}],
	comments: [{
		body: { type : String, default : '' },
		user: { type : Schema.ObjectId, ref : 'User' },
		createdAt: { type : Date, default : Date.now }
	}],
	createdAt: { type: Date, default : Date.now }
});

ProjectSchema.methods = {
	addComment: function (user, comment, cb) {
		this.comments.push({
			body: comment,
			user: user._id
		})
		this.save(cb)
	}

}
ProjectSchema.statics = {

  
  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email')
      .populate('comments.user')
      .exec(cb)
  },

}

mongoose.model('Project', ProjectSchema);