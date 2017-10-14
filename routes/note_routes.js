
module.exports = function(app, db) {
	app.post('/notes', (req, res) => {
		const Note = { text: req.body.body, title: req.body.title };
		db.collection('notes').insert(Note, (err, result) => {
			if (err) {
				res.send({ 'error': 'Error epta'});
			}
			else {
				res.send(result.ops[0]);
			}
		});
	});

};