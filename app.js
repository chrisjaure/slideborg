/**
 * Module dependencies.
 */

var
	express = require('express'),
	nunjucks = require('nunjucks'),
	routes = require('./routes'),
	assets = require('./routes/assets'),
	path = require('path'),
	config = require('./config'),

	app,
	env = new nunjucks.Environment(new nunjucks.FileSystemLoader(config.views));

app = module.exports = express();

app.set('port', config.port);
env.express(app);

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

app.locals.title = 'SlickSlide';
app.locals.assets = assets;
routes.generate(app);