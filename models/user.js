var mongoose			= require('mongoose');
var bcrypt				= require('bcrypt-nodejs');
var mognoosePaginate	= require('mongoose-paginate');

var userSchema = mongoose.Schema({

	local			: {
		login		: String,
		passw		: String,
		name		: String,
		surname		: String,
		gender		: String,
		dob			: String
	}
});

// Methods ==================================

userSchema.plugin(mognoosePaginate);


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