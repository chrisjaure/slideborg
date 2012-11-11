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
	var room = decodeURI(window.location.pathname).match(/\/deck\/([^\/\|]*)\|?([^\/]*)?\/?/);
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

	setTimeout(function() {
		document.getElementById('slickslide').className = 'connected';
		updateClientCount(data.count);
	}, 100);

});

socket.on('connect_failed', function() {
	alert('Sorry, could\'t connect to the viewing session :(');
});

socket.on('inactive', function(message){
	var container = document.getElementById('slickslide');
	socket.disconnect();
	if (container) {
		container.className = '';
	}
	alert('This viewing session is no longer active :(');
});

function initMaster (data) {
	api.onChange(function(to) {
		socket.emit('change', to);
	});
	createNotifier(true);
	if (data.urls) {
		createDropdown(data.urls);
	}
}

function initViewer (data) {
	socket.on('triggerchange', api.goto);
	api.goto(data.index);
	createNotifier();
}

function createNotifier (master) {
	var
		container = document.createElement('div'),
		html = '';

	html += '<span id="slickslide-client-count">0</span>';

	container.id = 'slickslide';
	container.innerHTML = html;

	document.body.appendChild(container);

	socket.on('clientcount', function(count) {
		updateClientCount(count);
	});
}

function createDropdown (urls) {
	var
		container = document.createElement('div'),
		html = '';

	html += '<div id="slickslide-dropdown-inner"><ul>' +
				'<li><a href="'+urls.viewing+'">Viewing URL</a></li>' +
				'<li><a href="'+urls.master+'">Master URL</a></li>' +
			'</ul></div>';

	container.id = 'slickslide-dropdown';
	container.innerHTML = html;

	document.getElementById('slickslide').appendChild(container);
}

function updateClientCount (count) {
	document.getElementById('slickslide-client-count').innerHTML = count;
}