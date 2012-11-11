module.exports = {
	goto: function(index) {
		if (Array.isArray(index)) {
			Reveal.slide.apply(Reveal, index);
		}
	},
	onChange: function(fn) {
		Reveal.addEventListener('slidechanged', function(e) {
			fn([e.indexh, e.indexv]);
		});
	}
};