var Map = require('collections/map');

var sio = require('socket.io'),
	Session = require('./session').Session,
	sessions = new Map(),
	io;

// TODO: expire old sessions

exports.listen = function(server) {
	io = sio.listen(server);

	io.sockets.on('connection', function(socket) {

        socket.on('subscribe', function(data) {
        	
        	var sessionid = data.room;

        	if(exports.getSession(sessionid)) {
        		console.log("Client connected to room: "+ sessionid);
        		exports.broadcastToRoom(sessionid, "announcement", "Client Connected");
            	socket.join(sessionid);            	
        	} else {
        		console.log("Session "+ sessionid +" session is no longer active.")
        		socket.emit('inactive');
        		socket.disconnect();
        	}

        });

    });
};

exports.createSession = function(url) {
	var session = new Session(url);
	sessions.set(session.id, session);
	return session;
};

exports.getSession = function(id) {
	return sessions.get(id);
};

exports.broadcastToRoom = function (session, event, message) {
	io.sockets.in(session.id).emit(event, message);
};