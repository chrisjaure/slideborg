var
	fs = require('fs'),
	path = require('path'),
	cheerio = require('cheerio'),
	request = require('request'),
	config = require('../config'),
	io = require('../io'),

	slideshows = [];

exports.generate = function(app) {

	app.get('/', function(req, res) {
		render(res, 'index');
	});

	app.post('/', function(req, res) {

		var
			message,
			session;

		if (req.body.url) {
			session = io.createSession(req.body.url);
			message = '<a href="/deck/'+ session.id +'/">Viewing URL</a><br><a href="/deck/'+ session.id + '|' + session.masterId +'/">Master URL</a>';
		}

		render(res, 'index', {
			message: message
		});
	});

	// provide a viewing url
	app.get('/deck/:id/', function(req, res, next) {
		var session = io.getSession(parseSessionId(req.params.id));
		if (session) {
			res.send(session.page);
			res.end();
		}
		else {
			next();
		}
	});

	// TODO: provide a controlling url

	// TODO: provide a remote url

	// proxy all relative asset requests
	app.get('/deck/:id/*', function(req, res, next) {
		var
			session = io.getSession(parseSessionId(req.params.id)),
			asset_url;
		if (session) {
			// TODO: make sure this url is always right
			asset_url = session.url + req.url.replace(/\/deck\/[^\/]*\//, '');
			req.pipe(request(asset_url)).pipe(res);
		}
		else {
			next();
		}
	});

};

function render (res, body, locals) {
	locals = locals || {};
	locals.body = fs.readFileSync(path.join(config.views, body + '.html'), 'utf8');
	res.render('layout', locals);
}

function parseSessionId (id) {
	return id.split('|')[0];
}