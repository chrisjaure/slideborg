var
	io = require('../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js'),

	api,
	socket;

api = (function(){
	// impressjs
	if (window.impress && impress.supported) {
		return require('./impress');
	}
	// deckjs
	else if (window.jQuery && jQuery.deck) {
		return require('./deck');
	}
	// revealjs
	else if (window.Reveal) {
		return require('./reveal');
	}
	// custom api that plugins can write adapters for
	else if (window.slyncr) {
		return slyncr;
	}
	// fallback to nothing
	return {
		goto: function() {},
		onChange: function() {}
	};
})();

socket = io.connect();

socket.on('connect', function() {
	var room = window.location.pathname.match(/\/deck\/([^\/\|]*)\|?([^\/]*)?\/?/);
	if (room[1]) {
		socket.emit('subscribe', { room: room[1], masterId: room[2] });
	}
});

socket.on('confirm', function(data) {

	if (data.master) {
		initMaster();
	}
	else {
		initViewer();
	}

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

function initMaster () {
	api.onChange(function(to) {
		socket.emit('change', to);
	});
}

function initViewer () {
	socket.on('change', api.goto);
	api.goto(data.index);
}