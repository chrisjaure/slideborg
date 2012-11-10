var sio = require('socket.io'),
	Map = require('collections/map'),
	Session = require('./session').Session,
	sessions = new Map(),
	io;

// TODO: expire old sessions

var IO = module.exports = {};

IO.listen = function(server) {
	io = sio.listen(server);

	io.sockets.on('connection', function(socket) {

		socket.on('subscribe', function(data) {
			
			var sessionid = data.room;

			if (IO.getSession(sessionid)) {
				console.log("Client connected to room: "+ sessionid);
				IO.broadcastToRoom(sessionid, "announcement", "Client Connected");
				socket.join(sessionid);
			}
			else {
				console.log("Session "+ sessionid +" session is no longer active.");
				socket.emit('inactive');
				socket.disconnect();
			}

		});

	});
};

IO.createSession = function(url) {
	var session = new Session(url);
	sessions.set(session.id, session);
	return session;
};

IO.getSession = function(id) {
	return sessions.get(id);
};

IO.broadcastToRoom = function (session, event, message) {
	io.sockets.in(session.id).emit(event, message);
};