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
		passwordField: 'password',
		passReqToCallback: true,	
	},
	function(req, login, password, done) {
		let name = req.body.name;
		let surname = req.body.surname;
		let dob		= req.body.dob;
		let gender	= req.body.gender;		
		

		if (login.length < 3) {
			console.log('LOGIN TOO LOW');
			return done(null, false, req.flash('signupMessage',
				'Слишком короткий логин! (Не меньше 3 символов)'));
		}
				
		if (password.length < 6) {
			console.log('PASSWORD TOO LOW');
      return done(null, false, req.flash('signupMessage',
        'Слишком короткий пароль! (Не меньше 6 символов)'));
		}
		
		process.nextTick( function() {
			User.findOne({'login': login }, function(err, user){
				if (err) {
					return done(err);
				} 

				if (user) {
					return done(null, false, req.flash('signupMessage',
						'Видимо, кто-то тебя опередил в выборе этого логина. Выбери другой!'));
				} 


					let newUser	= new User();
					
					newUser.login = login;
					newUser.password = newUser.generateHash(password);
					newUser.name = name;
					newUser.surname = surname;
					newUser.dob = dob;
					newUser.gender = gender;
          newUser.status = '';
          newUser.avatar = {
            contentType: '',
            default: true
          }

					newUser.save(function(err){
						if (err) 
							throw err;
						return done(null, newUser);
					});
				
			});
		});
	}));

	// LOGIN =========================================================================

	passport.use('local-login', new LocalStrategy({
		usernameField: 'login',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, login, password, done) {


			User.findOne( { 'login' : login }, function(err, user) {
				if (err) {
					return done(err)
				}	


        console.log(user.password);
				if (!user || !user.validPassword(password) ) {
          return done(null, false, req.flash('loginMessage',
					'Что-то тут не так. Либо логин не правильный, либо же пароль'));
				}				

				return done(null, user);
			});

	}));
};
