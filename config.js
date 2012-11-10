var
	path = require('path'),
	map_assets = require('./routes/assets'),

	config;

config = module.exports = {
	port: process.env.PORT || 8000,
	statics: path.join(__dirname, 'public'),
	views: path.join(__dirname, 'views'),
	assets: {
		css: {
			main: ['/public/css/main/*']
		},
		js: {
			viewer: [
				'/public/js/deck/viewer.js'
			]
		}
	}
};

config.mapped_assets = map_assets(config.assets);