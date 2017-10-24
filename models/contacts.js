var mongoose = require('mongoose');

var contactsSchema = mongoose.Schema({

	contacts    			: {
		firstID				: String,
		secondID 			: String,
		firstStatus			: Boolean,
		secondStatus		: Boolean
	}  

});



module.exports = mongoose.model('Contacts', contactsSchema);

