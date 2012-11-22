var
	nap = require('nap'),
	config = require('../config');

nap({
	assets: config.assets
});

if (process.env.NODE_ENV == 'production') {
	nap.package();
}

module.exports = nap;