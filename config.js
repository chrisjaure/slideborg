var path = require('path');

module.exports = {
	port: process.env.PORT || 8000,
	statics: path.join(__dirname, 'public'),
	views: path.join(__dirname, 'views'),
	assets: {
		css: {
			main: ['/public/css/*']
		}
	}
};