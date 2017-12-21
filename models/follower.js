var mongoose = require('mongoose');

var followerSchema = mongoose.Schema({
	follower: String,
	target: String,
	statusF: Boolean
});



module.exports = mongoose.model('Follower', followerSchema);
