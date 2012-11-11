var
	io = require('../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js'),

	api,
	socket,
	isMaster = false;

YUI().use('node', 'event', function(Y) {

	api = (function(){
		var
			index = 0,
			impress_api;
		// impressjs
		if (window.impress && impress.supported) {
			impress_api = impress();
			return {
				goto: impress_api.goto,
				onChange: function(fn) {
					document.addEventListener('impress:stepenter', function(e) {
						console.log(e);
						index = Y.all('.step').indexOf(e.target);
						fn(index);
					}, false);
				}
			};
		}
		// deckjs
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

		// fallback
		return {
			goto: function() {},
			onChange: function() {}
		};
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