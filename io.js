var sio = require('socket.io'),

	io;

module.exports = function(server) {
	io = sio.listen(server);
};