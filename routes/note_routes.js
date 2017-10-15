
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

	// HOME =================================

	app.get('/', (req, res) => {
		res.render('index.ejs');
	});

	// LOGIN =================================

	app.get('/login', (req, res) => {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// SIGNUP =================================

	app.get('/signup', (req,res) => {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// ACCOUNT ================================

	app.get('/account', (req, res) => {
		res.render('account.ejs', isLoggedIn, (req, res) => {
			user: req.user;
		});
	});

	// LOGOUT =================================

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
	


	// READ

	app.get('/account/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id) };

		db.collection('notes').findOne(details, (err, item) => {
			if (err) {
				res.send(' Pizda, oshibka ');
			} else {
				res.send(item);
			}
		});
	});

	// CREATE

	app.post('/register', (req, res) => {
		const note = { text: req.body.body, title: req.body.title };
		db.collection('notes').insert(note, (err, result) => {
			if (err) {
				res.send({ 'error': 'Error epta'});
			} else {
				res.send(result.ops[0]);
			}
		});
	});

	// DELETE

	app.delete('/notes/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id) };

		db.collection('notes').remove(details, (err, item) => {
			if (err) {
				res.send(' Pizda, oshibka ');
			}
			else {
				res.send('Note ' + id + ' deleted');
			}
		});
	});

	// UPDATE

	app.put('notes/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id':new ObjectID(id) };
		const note = { text: req.req.body, title: req.body.title };

		db.collectionO('notes').update(details, note, (err, result) => {
			if (err) {
				res.send(' Pizda, oshibka ');	
			} else {
				res.send(note);
			}
		});
	});
};