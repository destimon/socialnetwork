
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, passport) {

	// HOME =================================

	app.get('/', (req, res) => {
		res.render('index.ejs');
	});

	// LOGIN =================================

	app.get('/login', (req, res) => {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/account',
		failureRedirect : '/login',
		failureFlash: true
	}));

	// SIGNUP =================================

	app.get('/signup', (req,res) => {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/account',
		failureRedirect : '/signup',
		failureFlash	: true
	}));

	// ACCOUNT ================================

    app.get('/account', isLoggedIn, function(req, res) {
        res.render('account.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

	// LOGOUT =================================

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
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