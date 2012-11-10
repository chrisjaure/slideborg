var
	http = require('http'),
	app = require('./app'),

	server;

server = http.createServer(app);
require('./io').listen(server);

server.listen(app.get('port'), function(err) {
	if (err) {
		console.error(err);
	}
	else {
		console.log('listening on port %s', server.address().port);
	}
});