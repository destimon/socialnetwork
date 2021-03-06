"use strict"

let ObjectID = require('mongodb').ObjectID;
let User = require('../models/user'); // db
let Feed = require('../models/feed'); // db
let Follower = require('../models/follower'); // db
let Dialogue = require('../models/dialogue'); // db
let multer  = require('multer')
let upload = multer()
let path = require('path');

module.exports = function(app, passport, db) {

	// HOME ------------------------------------------------------------------------------------
	app.get('/', isLoggedIn, (req, res) => {
  	res.redirect('me');
	});

	// LOGIN ------------------------------------------------------------------------------------
	app.get('/login', (req, res) => {
		if (req.isAuthenticated())
	      res.redirect('/me');

		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/me',
    failureRedirect : '/login',
    failureFlash: true
  }));

  // SIGNUP ------------------------------------------------------------------------------------
  app.get('/signup', (req,res) => {
    let empty = new User();

    // To avoid problem with undefined local
    empty.login = '';
    empty.password = '';
    empty.name = '';
    empty.surname = '';
    empty.dob = '';
    empty.gender = '';

    res.render('signup.ejs', {
      message: req.flash('signupMessage'),
      mydata:  empty
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/me',
    failureRedirect : '/signup',
    failureFlash  : true
  }));

  // USERS ------------------------------------------------------------------------------------
    app.get('/me', isLoggedIn, function(req, res) {
      let login = req.user.login;

      Feed.find({'author' : login }, function(err, data) {
        res.render('account.ejs', {
          user : req.user, // get the user out of session and pass to template
          mydata : req.user,
          feed : data
        });
      });
    });

    app.get('/usr/:login', (req, res) => {
      // req.isAuthenticated();

      let login = req.params.login;
      let current = req.user;

      if (req.isAuthenticated()) {
        if (req.user.login == login) {
          res.redirect('/me');
        }
      }

      User.findOne( {'login' : login }, (err, getuser) => {
        Feed.find({'author' : login }, (err, data) => {
          res.render('account.ejs', {
            user : getuser,
            mydata : current,
            feed: data
          });
        });
      });
    });


  app.get('/usr/:login/avatar', (req, res) => {
    try {
      User.findOne( {'login' : req.params.login }, function (err, user) {
        if (err) {
          res.send(err);
        } else if (user.avatar.default == undefined || user.avatar.default == true) {
          res.sendfile(path.join(__dirname, '../public/img/no_avatar.jpg'));
        } else {
          res.setHeader('Cache-Control', 'public, max-age=3000000');
          // res.contentType(user.avatar.contentType);
          res.send(user.avatar.data);
        }
      });
    } catch (err) {
      res.send(err);
    }
  });

	app.get('/api/follows', (req, res) => {
		let list = req.query.list;
    let user = req.user.login;
		let target = req.query.target;

    if (list == undefined || list !== 'all')
		Follower.findOne({ follower: user, target: target }, function(err, data) {
			if (err) throw err;

			res.json(data);
		});

    if (list == 'all') {
      Follower.find({ }, function(err, data) {
        if (err) throw err;

        res.json(data);
      })
    }
	});

	app.post('/api/fs', (req, res) => {
		let user = req.user.login;
		let target = req.body.target;

		Follower.findOne({ follower: user , target: target }, function(err, data) {

			if (data !== null) {
				if (data.target == target) {

					data.statusF = (data.statusF == true)?false: true

					data.save(function(err, upd) {
						if (err) throw err;
						res.send(upd);
					});
				}
			} else {
				let newFollow = new Follower();

				newFollow.follower = user;
				newFollow.target = target;
				newFollow.statusF = true;

				newFollow.save(function(err) {
					if (err) throw err;
				});
			}
		});
	});

  // CONTACTS ------------------------------------------------------------------------------------
  app.get('/contacts', isLoggedIn, (req, res) => {
    res.render('contacts.ejs', {
      mydata: req.user
    });
  });

  app.get('/api/users', function(req, res) {
    let p = req.query.p;

    let options = {
      page: p,
      limit: 6
    }

    User.paginate({ }, options, (err, data) => {
      res.json(data);
    });
  });

  // EDIT ------------------------------------------------------------------------------------
  app.get('/edit', isLoggedIn, function(req,res) {
    let id = req.user.id;

    res.render('edit', {
      mydata: req.user,
      message: req.flash('signupMessage', '')
    });
  });

  app.post('/edit', function(req, res) {
    let id = req.user.id;
    let login = req.body.login;
    let name = req.body.name;
    let surname = req.body.surname;
    let dob   = req.body.dob;
    let gender  = req.body.gender;
    let about = req.body.about;

    User.findById(id, function(err, user) {
      user.login = login;
      user.name = name;
      user.surname = surname;
      user.dob = dob;
      user.gender = gender;
      user.about = about;


      if (!req.files.avatar) {
        user.avatar.default = true;
      } else {
        user.avatar = {
          data: req.files.avatar.data,
          contentType: req.files.avatar.mimetype,
          default: false
        }
      }

      user.save(function(err) {
        if (err) throw err;
      });
      res.redirect('edit');
    });
  });

  // HELP -----------------------------------------------------------------------------
  app.get('/help', function(req, res) {
    res.render('devinfo', {
      mydata: req.user
    });
  });

  // FEED -----------------------------------------------------------------------------
  app.get('/feed', isLoggedIn, function(req,res) {
    res.render('feed', {
      mydata: req.user
    });
  });

  app.post('/feednew', (req, res) => {
    let date_now = new Date().toLocaleString();
    let avatarlink = '/usr/' + req.user.login + '/avatar';

    let post = {
      author: req.user.login,
      text: req.body.text,
      date: date_now,
      avalink: avatarlink
    };

    let newFeed = new Feed();
    newFeed.author = post.author;
    newFeed.text = post.text;
    newFeed.date = post.date;
    newFeed.avalink = post.avalink;

    newFeed.save(function(err) {
      if (err) throw err;
    });

    res.json(post);
  });

  app.get('/api/feed', (req, res) => {
    let login = req.query.login;
    let amount = Number(req.query.offset);
    let lim = Number(req.query.limit);

    // for self page
    if (login == 'me') {
			let me_athor = req.user.login;
      Feed.paginate({ author: me_athor }, { offset: amount, limit: lim }, function(err, data) {
        res.json(data);
      });
    // for every other page
    } else if (login != undefined && login != 'me' && login != 'feed') {
      Feed.paginate({ author: login }, { offset: amount, limit: lim }, function(err, data) {
        res.json(data);
      });
    // for feed
    } else {
      Feed.paginate({  }, { offset: amount, limit: lim }, function(err, data) {
        res.json(data);
      });
    }
  });

  // MESSAGES -----------------------------------------------------------------------------

  app.get('/messages', isLoggedIn, function(req, res) {

    res.render('messages.ejs', {
      mydata: req.user
    });
  });

  app.get('/api/messages', isLoggedIn, function(req, res) {
    let from = req.user.login;

    Dialogue.find({ userOne : from }, function(err, data) {
      res.json(data);
    })
  });

  app.post('/api/messages', isLoggedIn, function(req, res) {
    let from = req.user.login;
    let to = req.body.to;

    Dialogue.findOne({ userOne : from , userTwo : to }, function(err, data) {
      if (err) throw err;
      console.log('dialogues: ' + data);

      if (data == null || data == undefined) {
        let newDialogue = new Dialogue();

        newDialogue.userOne = from;
        newDialogue.userTwo = to;

        newDialogue.save(function(err) {
          if (err) throw err;
        });
      }

      res.send('Data Recieved');
    }) 
  });

  // LOGOUT -----------------------------------------------------------------------------
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // TESTING -----------------------------------------------------------------------------
  app.get('/test', (req, res) => {
    res.sendfile('views/test.html');
  });

  app.post('/test', (req, res) => {

  });

  // isLoggedIn -----------------------------------------------------------------------------
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
  }
}
