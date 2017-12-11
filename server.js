"use strict";

let express 		= require('express');
const MongoClient 	= require('mongodb').MongoClient;
const mongoose		= require('mongoose');
const bodyParser 	= require('body-parser');
const passport		= require('passport');
const flash			= require('connect-flash');
const cookieParser 	= require('cookie-parser');
const db 			= require('./config/db');
const morgan		= require('morgan');
const session 		= require('express-session');
const fileupload 	= require('express-fileupload');
const app 			= express();

let server = require('http').createServer(app);  
let io = require('socket.io')(server);

const port = process.env.PORT || 8080;

// Configuration 	================================================

mongoose.connect(db.url);

require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(fileupload());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));																																					

app.use(session({ 
	secret: 'yonigga',
	resave: false
})); 

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Start 	================================================

MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log(err);

	require('./routes')(app, passport, db);
	require('./config/socket.js')(io);	

	server.listen(port, () => {
	  console.log('Up on ' + port);
	});
})