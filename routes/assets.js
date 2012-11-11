var nap = require('nap');

module.exports = function(assets) {
	var maps = {};

	nap({ assets: assets });
	if (process.env.NODE_ENV == 'production') {
		nap.package();
	}

	Object.keys(assets).forEach(function asset_type_loop(type) {

		maps[type] = {};
		Object.keys(assets[type]).forEach(function asset_name_loop(name) {

			maps[type][name] = nap[type](name);

		});

	});

	return {
		assets: maps
	};
};