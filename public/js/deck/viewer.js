(function(io) {
	var socket = io.connect('http://localhost:8000');

	socket.on('next', function (data) {
		console.log(data);
	});

	socket.on('prev', function(data) {
		console.log(data);
	});
})(io);