module.exports = {
	goto: function(index) {
		jQuery.deck('go', index);
	},
	onChange: function(fn) {
		jQuery(document).on('deck.change', function(e, from, to) {
			fn(to);
		});
	},
	type: 'deck.js'
};