var sio = require('socket.io'),
	Session = require('./session').Session,
	io,
	sessions = [];

exports.listen = function(server) {
	io = sio.listen(server);
};

exports.createSession = function(url) {
	return new Session(url);
};