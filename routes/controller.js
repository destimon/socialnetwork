"use strict"

let ObjectID = require('mongodb').ObjectID;
let Contacts = require('../models/contacts');
let User = require('../models/user');
let Feed = require('../models/feed');
let multer  = require('multer')
let upload = multer()
let path = require('path');

module.exports = function(app, passport, db) {

	// HOME ============================================================================
  // =================================================================================
	app.get('/', isLoggedIn, (req, res) => {
		res.redirect('me');
	});

	// LOGIN ============================================================================
  // ==================================================================================
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

  // SIGNUP ============================================================================
  // ===================================================================================
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

  // USERS ============================================================================
  // ==================================================================================
    app.get('/me', isLoggedIn, function(req, res) {
      console.log(req.user);
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
          console.log('AVATAR:' + user.avatar);
          console.log('DEFAULT: ' + user.avatar.default);
        }
      });
    } catch (err) {
      res.send(err);
    }
  });

  // CONTACTS ============================================================================
  // =====================================================================================
  app.get('/contacts/:p', isLoggedIn, (req, res) => {
    let pg = req.params.p;

    User.paginate({ }, { page: pg, limit: 4}, (err, data) => {
      console.log('page: ' + data.page);
      console.log('pages: ' + data.pages);

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
    let targetLogin = req.body.addusr;
    console.log(targetLogin);

    // Get curr.user.id
    Contacts.findOne( {'secondLogin' : targetLogin }, (err, cont) => {
      if (cont) {
    
        if( cont.firstStatus == true) {
        cont.firstStatus = false;
        req.flash('ContactMessage', 'Вы успешно отозвали заявку!'); 
        }
        else {
          cont.firstStatus = true;
          req.flash('ContactMessage', 'Вы отправили заявку!');  
        }

        
        cont.save(function(err){
          if (err) throw err;
        });

      } else {

        // Set FirstStatus ON
        var newContacts = new Contacts();

        newContacts.firstLogin = req.user.local.login;
        newContacts.secondLogin = targetLogin;
        newContacts.firstStatus = true; 
      
        newContacts.save(function(err){
          if (err) throw err;
        }); 
        req.flash('ContactMessage', 'Вы отправили заявку!');
      }
        res.redirect('contacts/');
    });
  });

  // EDIT ============================================================================
  // =================================================================================
  app.get('/edit', isLoggedIn, function(req,res) {
    let id = req.user.id;

    res.render('edit', { 
      mydata: req.user,       
      message: req.flash('signupMessage', 'я даун')
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
      
      console.log(req.files);

      if (!req.files.avatar) {
        user.avatar.default = true;
      } else {
        user.avatar = {
          data: req.files.avatar.data,
          contentType: req.files.avatar.mimetype,
          default: false
        }
      }

      console.log('user :');
      console.log(user);
      console.log('req.files.avatar :');
      console.log(req.files.avatar);

      user.save(function(err) {
        if (err) throw err;
      });
      res.redirect('edit');
    });


  });

  // HELP ============================================================================
  // =================================================================================
  app.get('/help', function(req, res) {
    res.render('devinfo', {
      mydata: req.user
    });
  });

  // FEED ============================================================================
  // =================================================================================
  app.get('/feed/:p', isLoggedIn, function(req,res) {
    let pg = req.params.p;

    Feed.paginate({ }, { page: pg, limit: 5 }, function(err, data) {
      res.render('feed', {
        mydata: req.user,
        feed: data.docs,
        curr: data.page, 
        pgs: data.pages        
      });
    });
  });

  app.post('/feednew', (req, res) => {
    let date_now = new Date().toLocaleString();

    let post = {
      text: req.body.text,
    };


    console.log('>>BODY' + req.body);

    let newFeed = new Feed();
    newFeed.author = post.author;
    newFeed.text = post.text;
    newFeed.date = post.date;

    newFeed.save(function(err) {
      if (err) throw err;
    });

    res.json(post);
    console.log(post);
  });
  
  app.get('/feeds', (req, res) => {
    Feed.find({  }, function(err, doc) {
      console.log(doc);
      res.json(doc);
    });
  });
  // app.post('/feed', function(req, res) {
    
  //   console.log('QUERY:  ' + req.query.info);

  //   let info = req.body.info
  //   console.log('>>INFO: ' + info);
  //   console.log('>>BODY: ' + req.body);
  //   let newFeed = new Feed();
  //   let date = new Date();
  //   let hours = date.getHours();
  //   let minutes = date.getMinutes();
  //   let seconds = date.getSeconds();

  //   let datestring = hours + ':' + minutes + '.' + seconds; 
  //   console.log(datestring);

  //   newFeed.author = req.user.login;
  //   newFeed.date = datestring;
  //   newFeed.info = info;
    
  //   newFeed.save(function(err) {
  //     if (err) 
  //       throw err;
  //   });
    
  //   res.redirect('me');
  // });

	// LOGOUT ==============================================================================
  // =====================================================================================
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

  // isLoggedIn  ============================================================================
  function isLoggedIn(req, res, next) {

      // if user is authenticated in the session, carry on 
      if (req.isAuthenticated())
          return next();

      // if they aren't redirect them to the home page
      res.redirect('/login');
  }
};