module.exports = {
	goto: function(index) {
		getApi(function(cw) {
			cw.postMessage('["goToSlide","'+index+'"]', 'http://speakerdeck.com');
		});
	},
	onChange: function(fn) {
		window.addEventListener('message', function(e) {
			var res = JSON.parse(e.data);
			if (res[0] == 'change') {
				fn(res[1].number);
			}
		});
	},
	type: 'speakerdeck'
};

function getApi (fn) {
	var iframe;

	if (this.contentWindow) {
		return fn(this.contentWindow);
	}

	(function findIframe() {
		iframe = document.querySelector('.speakerdeck-iframe');
		if (!iframe) {
			return setTimeout(findIframe, 100);
		}

		this.contentWindow = iframe.contentWindow;
		if (!this.contentWindow) {
			return setTimeout(findIframe, 100);
		}

		return fn(this.contentWindow);
	})();
}