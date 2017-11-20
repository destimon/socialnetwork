"use strict"

let LocalStrategy	= require('passport-local').Strategy;
let User			= require('../models/user');


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
		passReqToCallback: true,	
		// givenNameField:     'name',
		// familyNameField:  'surname'
	},
	function(req, login, passw, done) {
		let name = req.body.name;
		let surname = req.body.surname;
		let dob		= req.body.dob;
		let gender	= req.body.gender;		
		
		
		process.nextTick( function() {
			User.findOne({'local.login': login }, function(err, user){
				if (err) {
					return done(err);
				} 

				if (user) {
					return done(null, false, req.flash('signupMessage',
					'Видимо, кто-то тебя опередил в выборе этого логина. Выбери другой!'));
				} else {
					let newUser	= new User();
					
					newUser.local.login = login;
					newUser.local.passw = newUser.generateHash(passw);
					newUser.local.name = name;
					newUser.local.surname = surname;
					newUser.local.dob = dob;
					newUser.local.gender = gender;

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
					return done(null, false, req.flash('loginMessage',
					'Что-то тут не так. Либо логин не правильный, либо же пароль'));
				}				

				return done(null, user);
			});
		})
	}));
};
