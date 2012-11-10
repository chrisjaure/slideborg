var
	io = require('../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js'),
	jq = require('../../node_modules/jquery-browserify/lib/jquery.js'),

	api,
	socket,
	isMaster = false;

jq.noConflict(true);

api = (function(){
	if (window.impress && impress.supported) {
		return impress();
	}
	else if (window.jQuery && jQuery.deck) {
		return {
			next: function() {
				jQuery.deck('next');
			},
			prev: function() {
				jQuery.deck('prev');
			},
			goto: function(index) {
				jQuery.deck('go', index);
			}
		};
	}
	// fallback to triggering native events
	return {
		next: function() {
			jq.event.trigger({ type: 'keydown', which: 39 } );
			jq.event.trigger({ type: 'keyup', which: 39 } );
		},
		prev: function() {
			jq.event.trigger({ type: 'keydown', which: 37 } );
			jq.event.trigger({ type: 'keyup', which: 37 } );
		},
		goto: function() {}
	};
})();

socket = io.connect('http://localhost:8000');

socket.on('connect', function() {
	var room = window.location.pathname.match(/\/deck\/([^\/\|]*)\|?([^\/]*)?\/?/);
	console.log(room);
	if (room[1]) {
		socket.emit('subscribe', { room: room[1], masterId: room[2] });
	}
});

socket.on('confirm', function(data) {

	console.log(data);

	if (data.master) {

	}
	else {
		socket.on('next', api.next);
		socket.on('prev', api.prev);
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