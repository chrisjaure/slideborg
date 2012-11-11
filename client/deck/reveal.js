module.exports = {
	goto: function(index) {
		Reveal.slide.apply(Reveal, index);
	},
	onChange: function(fn) {
		Reveal.addEventListener('slidechanged', function(e) {
			fn([e.indexh, e.indexv]);
		});
	}
};