var express 		= require('express');
const MongoClient 	= require('mongodb').MongoClient;
const bodyParser 	= require('body-parser');
const app 			= express();

const port = 8080;

app.use(bodyParser.urlencoded({extended: true}));
MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log(err);


	require('./routes')(app, database);

	app.listen(port, () => {
	  console.log('We are live on ' + port);
	});
})