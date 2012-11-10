/**
 * Module dependencies.
 */

var
	express = require('express'),
	cons = require('consolidate'),
	routes = require('./routes'),
	path = require('path'),
	config = require('./config'),
	map_assets = require('./routes/assets'),

	app;

app = module.exports = express();

app.set('port', config.port);
app.set('views', config.views);
app.engine('html', cons.whiskers);
app.set('view engine', 'html');

app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(config.statics));

// 404 catchall, order matters
app.use(function(req, res, next){

	if (req.accepts('html')) {
		res.status('404');
		res.render('404.html');
	}
	else {
		next();
	}

});

app.locals(map_assets(config.assets));
routes.generate(app);