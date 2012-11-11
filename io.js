require('smap'); // provides Map

var sio = require('socket.io'),
	Session = require('./session').Session,
	sessions = new Map(),
	io;

var IO = module.exports = {};

IO.listen = function(server) {
	var expireCheckInMilliseconds = 1200000; // 20 mins
	io = sio.listen(server);
	IO.setup();
	setInterval(IO.expireSessions, expireCheckInMilliseconds);
};

IO.setup = function() {
	io.sockets.on('connection', function(socket) {

		socket.on('subscribe', function(data) {
			
			var session = IO.getSession(data.room),
				master = false;

			if (session) {
				console.log("Client connected to room: "+ data.room);
				socket.join(data.room);

				if (session.isMaster(data.masterId)) {
					master = true;
					socket.on('change', function(index) {
						session.index = index;
						session.broadcast('triggerchange', index);
					});
				}

				socket.emit('confirm', {
					master: master,
					index: session.index
				});
			}
			else {
				socket.emit('inactive');
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

IO.expireSessions = function() {
	var
		now = Date.now(),
		durationInMilliseconds = 1800000; // half-hour

	sessions.iterate(function(id, session) {
		if (now - session.timestamp > durationInMilliseconds) {
			console.log('Removing expired session %s', id);
			session.destroy();
			sessions.delete(id);
		}
	});
};