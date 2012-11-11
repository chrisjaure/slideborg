var
	request = require('request'),
	cheerio = require('cheerio'),
	uuid = require('node-uuid'),
	config = require('./config');

var Session = function(url) {
	this.clients = [];
	// TODO: normalize url - remove hash, etc.
	this.url = url;
	this.id = uuid.v4();
	this.masterId = uuid.v4().substr(0,8);
	this.index = 0;

	this.requestPage();
};

Session.prototype.addClient = function(client) {
	this.clients.push(client);
};

Session.prototype.getClients = function() {
	return this.clients;
};

Session.prototype.requestPage = function() {
	request(this.url, function(err, res, body) {
		var $ = cheerio.load(body);

		// TODO: normalize all relative asset urls

		// TODO: inject client script here, socket.io too
		$('body').append(config.mapped_assets.assets.js.viewer);

		this.page = $.html();
	}.bind(this));
};

Session.prototype.isMaster = function(id) {
	return (id == this.masterId);
};

// TODO: write socket broadcasting and joining logic (https://github.com/LearnBoost/socket.io/wiki/Rooms)

exports.Session = Session;