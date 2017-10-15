var LocalStrategy	= require('passport-local').Strategy;
var User			= require('../models/user');


module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	// SIGNUP =========================================================================

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'login',
		passwordField: 'passw',
		passReqToCallback: true
	
	},
	function(req, login, passw, done) {
		
		process.nextTick( function() {
			User.findOne({'local.login': login }, function(err, user){
				if (err) {
					return done(err);
				} 

				if (user) {
					return done(null, false, req.flash('signupMessage', 'Nickname already taken! Pridumay chota svoe, daun'));
				} else {
					var newUser	= new User();
				
					newUser.local.login = login;
					newUser.local.passw = newUser.generateHash(passw);
				
					newUser.save(function(err){
						if (err) 
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	// LOGIN =========================================================================

	passport.use('local-login', new LocalStrategy({
		usernameField: 'login',
		passwordField: 'passw',
		passReqToCallback: true
	},
	function(req, login, passw, done) {

		process.nextTick( function() {
			User.findOne( { 'local.login' : login }, function(err, user) {
				if (err) {
					return done(err)
				}	

				if (!user || !user.validPassword) {
					return done(null, false, req.flash('loginMessage', 'Wrong login or password =-('));
				}				

				return done(null, user);
			});
		})
	}));
};