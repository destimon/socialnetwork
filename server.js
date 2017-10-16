var express 		= require('express');
const MongoClient 	= require('mongodb').MongoClient;
const mongoose		= require('mongoose');
const bodyParser 	= require('body-parser');
const passport		= require('passport');
const flash			= require('connect-flash');
const cookieParser 	= require('cookie-parser');
const db 			= require('./config/db');
const morgan		= require('morgan');
const session 		= require('express-session');

const app 			= express();
const port = 8080;

// Configuration 	================================================

mongoose.connect(db.url);

require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Start 	================================================

MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log(err);

	require('./routes')(app, passport);

	app.listen(port, () => {
	  console.log('We are live on ' + port);
	});
})