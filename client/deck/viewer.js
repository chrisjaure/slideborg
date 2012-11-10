var io = require('../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js');

var socket = io.connect('http://localhost:8000');

socket.on('connect', function() {
	var room = window.location.pathname.match(/\/deck\/([^\/]*)\//);
	if (room[1]) {
		room = room[1];
		socket.emit('subscribe', { room: room });
	}
});

socket.on('next', function (data) {
	console.log(data);
});

socket.on('prev', function(data) {
	console.log(data);
});

socket.on('connect_failed', function() {
	console.log('failed');
});

socket.on('announcement', function(message){
	console.log('Incoming Announcement:' + message);
});

socket.on('inactive', function(message){
	console.log('This connection is no longer active.');
});