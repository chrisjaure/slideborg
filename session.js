var Session = function(url) {
	this.clients = [];
	this.url = url;
	this.id = url;
};

Session.prototype.addClient = function(client) {
	this.clients.push(client);
};

exports.Session = Session;