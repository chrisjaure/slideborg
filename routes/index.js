var
	fs = require('fs'),
	path = require('path'),
	config = require('../config');

exports.generate = function(app) {

	app.get('/', function(req, res) {
		render(res, 'index');
	});

	app.post('/', function(req, res) {

		if (req.body.url) {
			console.log(req.body.url);
		}

		render(res, 'index', {
			message: 'Submitted!'
		});
	});

};

function render (res, body, locals) {
	locals = locals || {};
	locals.body = fs.readFileSync(path.join(config.views, body + '.html'), 'utf8');
	res.render('layout', locals);
}