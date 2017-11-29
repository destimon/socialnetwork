"use strict"

var mongoose = require('mongoose');
let mognoosePaginate	= require('mongoose-paginate');

var feedSchema = mongoose.Schema({

	author		: String,
	date 		: String,
	text 		: String,
	comments 	: String

});

feedSchema.plugin(mognoosePaginate);

module.exports = mongoose.model('Feed', feedSchema);

