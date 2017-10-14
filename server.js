var express 		= require('express');
const MongoClient 	= require('mongodb').MongoClient;
const bodyParser 	= require('body-parser');
const passport		= require('passport');
const flash			= require('connect-flash');
const cookieParser 	= require('cookie-parser');
const db 			= require('./config/db');
const morgan		= require('morgan');
const app 			= express();


const port = 8080;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');

MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log(err);


	require('./routes')(app, database);

	app.listen(port, () => {
	  console.log('We are live on ' + port);
	});
})