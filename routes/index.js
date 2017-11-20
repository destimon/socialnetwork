"use strict"

let controller = require('./controller.js');

module.exports = function(app, passport, db) {
	controller(app, passport, db);
}