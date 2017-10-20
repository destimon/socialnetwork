var mongoose = require('mongoose');

var contactsSchema = mongoose.Schema({

	contacts    			: {
		maincontactid		: String,
		anothercontactid 	: String,
	}  

});

module.exports = mongoose.model('Contacts', contactsSchema);