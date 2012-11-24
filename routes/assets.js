var
	nap = require('nap'),
	config = require('../config');

nap({
	assets: config.assets
});

if (process.env.NODE_ENV == 'production') {
	// commenting this out for now because nap has bad dep
	// management and breaks with latest uglify
	// nap.package();
}

module.exports = nap;