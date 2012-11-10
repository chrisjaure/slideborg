var sio = require('socket.io'),
	Session = require('./session').Session,
	io,
	sessions = {};

// TODO: expire old sessions

exports.listen = function(server) {
	io = sio.listen(server);

	io.sockets.on('connection', function(socket) {

	});
};

exports.createSession = function(url) {
	var session = new Session(url);
	sessions[session.id] = session;
	return session;
};

exports.getSession = function(id) {
	return sessions[id];
};

exports.broadcastToRoom = function (session, event, message) {
	io.sockets.in(session.id).emit(event, message);
};