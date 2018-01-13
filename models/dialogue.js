"use strict"

let mongoose			= require('mongoose');
let bcrypt				= require('bcrypt-nodejs');
let mognoosePaginate	= require('mongoose-paginate');

let messageSchema = mongoose.Schema({
	userOne: 		String,
	userTwo: 		String,
	messages: 		[{ sender: String, body: String, date: Date }]
});

// create model
module.exports = mongoose.model('Message', messageSchema);