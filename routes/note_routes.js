var ObjectID = require('mongodb').ObjectID;
var Contacts = require('../models/contacts');
var User = require('../models/user');



module.exports = function(app, passport, db) {

	// HOME =================================

	app.get('/', (req, res) => {
		res.render('index.ejs');
	});

	// LOGIN =================================

	app.get('/login', (req, res) => {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/me',
		failureRedirect : '/login',
		failureFlash: true
	}));

	// SIGNUP =================================

	app.get('/signup', (req,res) => {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/me',
		failureRedirect : '/signup',
		failureFlash	: true
	}));

	// USERS ================================

    app.get('/me', isLoggedIn, function(req, res) {

        res.render('account.ejs', {
            user : req.user, // get the user out of session and pass to template
        	mydata : req.user
        });
    });

    app.get('/go=:login', isLoggedIn, (req, res) => {
    	var login = req.params.login;
    	var current = req.user;
		User.findOne( {'local.login' : login }, (err, getuser) => {
			
			res.render('account.ejs', {
				user : getuser,
				mydata : current
			});			
		});		
	});

	// LOGOUT =====user.local.login============================

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
	

	// CONTACTS ================================

	app.get('/contacts/:page', isLoggedIn, (req, res) => {

	  var pg = req.params.page;

	  User.paginate({ }, { page: pg, limit: 5}, (err, data) => {

	  	res.render('contacts.ejs', {
	  		pgs: data.pages,
	  		curr: data.page,
	  		users: data.docs,
	  		mydata: req.user
	  	});
	  });
	});


	app.post('/contacts', function(req, res) {
		
		// Get user.id
		var targetLogin = req.body.addusr;
		console.log(targetLogin);

		// Get curr.user.id
		
		
		Contacts.findOne( {'contacts.secondLogin' : targetLogin }, (err, cont) => {
			if (cont) {
		
				if( cont.contacts.firstStatus == true) {
				cont.contacts.firstStatus = false;
				req.flash('ContactMessage', 'Вы успешно отозвали заявку!');	
				}
				else {
					cont.contacts.firstStatus = true;
					req.flash('ContactMessage', 'Вы отправили заявку!');	
				}

				
				cont.save(function(err){
					if (err) throw err;
				});

			} else {

				// Set FirstStatus ON
				var newContacts = new Contacts();

				newContacts.contacts.firstLogin = req.user.local.login;
				newContacts.contacts.secondLogin = targetLogin;
				newContacts.contacts.firstStatus = true;	
			
				newContacts.save(function(err){
					if (err) throw err;
				});	
				req.flash('ContactMessage', 'Вы отправили заявку!');
			}
				res.redirect('contacts/');
		});
	});

	// EDIT

	app.get('/edit', isLoggedIn, (req,res) => {


		res.render('edit', { 
			message: req.flash('signupMessage'),
			mydata: req.user,
			failureFlash	: true		
		});
	});

	// isLoggedIn
	function isLoggedIn(req, res, next) {

	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();

	    // if they aren't redirect them to the home page
	    res.redirect('/');
	}




};