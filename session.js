var
	url = require('url'),
	request = require('request'),
	cheerio = require('cheerio'),
	uuid = require('node-uuid'),
	config = require('./config'),
	assets = require('./routes/assets');

var Session = function(link, io, callback) {
	link = url.parse(link);
	link.hash = null;
	this.url = url.format(link);
	this.io = io;

	this.id = uuid.v4();
	this.masterId = uuid.v4().substr(0,8);
	this.index = 0;
	this.timestamp = Date.now();
	this.urls = {

	};

	this.requestPage(callback);
};

Session.prototype.addClient = function(client) {
	client.join(this.id);
};

Session.prototype.getClients = function() {
	return this.io.sockets.clients(this.id);
};

Session.prototype.broadcast = function(event, data) {
	this.io.sockets.in(this.id).emit(event, data);
	this.timestamp = Date.now();
};

Session.prototype.destroy = function() {
	this.broadcast('inactive');
};

Session.prototype.requestPage = function(callback) {
	request(this.url, function(err, res, body) {

		if (err) {
			return callback(err);
		}

		var $ = cheerio.load(body);

		// rewrite urls that begin with /
		$('link[rel="stylesheet"],script[src]').each(function(i, el) {
			var $el = $(el),
				type = ($el.attr('href') ? 'href' : 'src'),
				eurl = $el.attr(type);

			if (eurl.match(/^\/[^\/]/)) {
				$el.attr(type, encodeURIComponent(url.resolve(this.url, eurl)));
			}
		}.bind(this));

		$('head').append(assets.css('viewer'));
		$('body').append(assets.js('viewer'));
		this.page = $.html();

		callback(null, this);
		
	}.bind(this));
};

Session.prototype.isMaster = function(id) {
	return (id == this.masterId);
};

Session.prototype.setUrls = function(urls) {
	this.urls = urls;
};

exports.Session = Session;