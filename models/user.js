var mongoose	= require('mongoose');
var bcrypt		= require('bcrypt-nodejs');


var userSchema = mongoose.Schema({

	local			: {
		login		: String;
		password	: String;
	}
});

// Methods ==================================


// hashing
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}; 

// valid or not
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create model
module.exports = mongoose.model('User', userSchema);