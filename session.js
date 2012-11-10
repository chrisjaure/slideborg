var
	request = require('request'),
	cheerio = require('cheerio'),
	uuid = require('node-uuid');

var Session = function(url) {
	this.clients = [];
	this.url = url;
	this.id = uuid.v4();

	this.requestPage();
};

Session.prototype.addClient = function(client) {
	this.clients.push(client);
};

Session.prototype.requestPage = function() {
	request(this.url, function(err, res, body) {
		var $ = cheerio.load(body);
		$('body').append('<script>alert("here");</script>');

		this.page = $.html();
	}.bind(this));
};

exports.Session = Session;