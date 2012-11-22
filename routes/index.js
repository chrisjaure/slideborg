var
	fs = require('fs'),
	path = require('path'),
	querystring = require('querystring'),
	cheerio = require('cheerio'),
	request = require('request'),
	config = require('../config'),
	io = require('../io'),
	async = require('async'),

	slideshows = [];

exports.generate = function(app) {

	app.get('/', function(req, res) {
		return res.render('index.html');
	});

	app.post('/', function(req, res) {

		if (!req.body.url) {
			return res.render('index.html', {
				message: 'Please enter the URL to your slides, e.g. http://imakewebthings.com/deck.js/'
			});
		}

		return io.createSession(req.body.url, function(err, session) {

			var baseUrl = 'http://' + req.headers.host,
				urls = {
					original: req.body.url,
					viewing: baseUrl + '/deck/'+ session.id +'/',
					master: baseUrl + '/deck/'+ session.id + '|' + session.masterId +'/'
				};

			if (err) {
				return res.render('index.html', showError(err));
			}


			async.series([
				async.apply(shortenUrl, urls.viewing),
				async.apply(shortenUrl, urls.master)
			], function(err, results) {
				if (!err) {
					urls.viewing = results[0];
					urls.master = results[1];
				}

				session.setUrls(urls);
				
				return res.render('index.html', {
					urls: urls,
					message: 'Great! Use the URLs below'
				});
			});

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

	// TODO: provide a remote url

	// proxy all relative asset requests
	app.get('/deck/:id/*', function(req, res, next) {
		var
			session = io.getSession(parseSessionId(req.params.id)),
			asset_url;
		if (session) {
			asset_url = req.url.replace(/\/deck\/[^\/]*\//, '');
			if (asset_url.match(/^http/)) {
				// could be a full url that has been encoded
				asset_url = decodeURIComponent(asset_url);
			}
			else {
				// or a dynamically added script or link
				asset_url = session.url + asset_url;
			}
			req.pipe(request(asset_url)).pipe(res);
		}
		else {
			next();
		}
	});

};

function parseSessionId (id) {
	return id.split('|')[0];
}

function showError (err) {
	return {
		message: "Hmm, something's not quite right... ("+ err.message +")"
	};
}

function shortenUrl (url, callback) {
	var params = {
			format: 'json',
			url: url
		};

	request('http://is.gd/create.php?' + querystring.stringify(params), function(err, res, body) {
		var result;

		if (err) {
			return callback(err);
		}

		try {
			result = JSON.parse(body);
		}
		catch (e) {
			return callback(err);
		}

		if (result.errormessage) {
			return callback(new Error(result.errormessage));
		}

		return callback(null, result.shorturl);
	});
}