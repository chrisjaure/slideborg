var path = require('path');

module.exports = {
	port: process.env.PORT || 8000,
	statics: path.join(__dirname, 'public'),
	views: path.join(__dirname, 'views'),
	assets: {
		css: {
			viewer: ['/public/css/deck/viewer.css'],
			main: ['/public/css/main/*']
		},
		js: {
			viewer: ['/public/js/deck/viewer.js'],
			main: ['/public/js/behavior.js']
		}
	}
};