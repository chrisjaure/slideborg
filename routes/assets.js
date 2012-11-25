var
	nap = require('nap'),
	config = require('../config');

nap({
	mode: 'dev', // temporarily force dev mode until nap gets fixed
	assets: config.assets
});

if (process.env.NODE_ENV == 'production') {
	nap.package();
}

module.exports = nap;