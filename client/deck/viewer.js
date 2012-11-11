var
	io = require('../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js'),

	api,
	socket,
	isMaster = false;

YUI().use('node', 'event', function(Y) {

	api = (function(){
		var index = 0;
		if (window.impress && impress.supported) {
			var impress_api = impress();
			return {
				goto: impress_api.goto,
				onChange: function(fn) {
					Y.one('document').on('keyup', function(e) {
						if (e.keyCode == 37) {
							fn(--index);
						}
						else if (e.keyCode == 39) {
							fn(++index);
						}
					});
				}
			};
		}
		else if (window.jQuery && jQuery.deck) {
			return {
				goto: function(index) {
					jQuery.deck('go', index);
				},
				onChange: function(fn) {
					jQuery('document').on('deck.change', function(e, from, to) {
						fn(to);
					});
				}
			};
		}
		// custom api that plugins can write adapters for
		else if (window.slyncr) {
			return slyncr;
		}
		else {
			return {
				goto: function() {},
				onChange: function() {}
			};
		}
	})();

	socket = io.connect('http://localhost:8000');

	socket.on('connect', function() {
		var room = window.location.pathname.match(/\/deck\/([^\/\|]*)\|?([^\/]*)?\/?/);
		if (room[1]) {
			socket.emit('subscribe', { room: room[1], masterId: room[2] });
		}
	});

	socket.on('confirm', function(data) {

		if (data.master) {
			api.onChange(function(to) {
				socket.emit('change', to);
			});
		}
		else {
			socket.on('change', api.goto);
			api.goto(data.index);
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

});