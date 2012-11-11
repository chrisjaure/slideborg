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
			
			var session = IO.getSession(data.room),
				master = false;

			if (session) {
				console.log("Client connected to room: "+ data.room);
				session.broadcast("announcement", "Client Connected");
				socket.join(data.room);

				if (session.isMaster(data.masterId)) {
					master = true;
					socket.on('change', function(index) {
						session.index = index;
						session.broadcast('change', index);
					});
				}

				socket.emit('confirm', {
					master: master,
					index: session.index
				});
			}
			else {
				console.log("Session "+ data.room +" session is no longer active.");
				socket.emit('inactive');
				socket.disconnect();
			}

		});

	});
};

IO.createSession = function(url, callback) {
	var session = new Session(url, io, callback);
	sessions.set(session.id, session);
	return session;
};

IO.getSession = function(id) {
	return sessions.get(id);
};