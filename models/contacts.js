var mongoose = require('mongoose');

var contactsSchema = mongoose.Schema({

	contacts    			: {
		firstLogin			: String,
		secondLogin 		: String,
		firstStatus			: Boolean,
		secondStatus		: Boolean
	}  

});



module.exports = mongoose.model('Contacts', contactsSchema);

