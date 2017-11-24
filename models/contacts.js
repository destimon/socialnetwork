var mongoose = require('mongoose');

var contactsSchema = mongoose.Schema({

		firstLogin			: String,
		secondLogin 		: String,
		firstStatus			: Boolean,
		secondStatus		: Boolean  
});



module.exports = mongoose.model('Contacts', contactsSchema);

