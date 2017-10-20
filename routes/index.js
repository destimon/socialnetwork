
var noteRoutes = require('./note_routes.js');

module.exports = function(app, passport, db) {
	noteRoutes(app, passport, db);
}