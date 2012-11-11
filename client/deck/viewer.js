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
	else if (window.slickslide) {
		return slickslide;
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
		initMaster(data);
	}
	else {
		initViewer(data);
	}

});

socket.on('connect_failed', function() {
	alert('Sorry, could\'t connect to the viewing session :(');
});

socket.on('inactive', function(message){
	socket.disconnect();
	alert('This viewing session is no longer active :(');
});

function initMaster (data) {
	api.onChange(function(to) {
		socket.emit('change', to);
	});
}

function initViewer (data) {
	socket.on('triggerchange', api.goto);
	api.goto(data.index);
}

function createNotifier () {
	var
		container = document.createElement('div'),
		html = '';

	div.id = 'slickslide';

	document.body.append(container);
}