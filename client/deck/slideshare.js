module.exports = {
	goto: function(index) {
		$.slideshareEventManager.trigger('gotoslide', {index: index});
	},
	onChange: function(fn) {
		$.slideshareEventManager.player.on('slidechanged', function(e) {
			fn(e.ssData.index);
		});
	},
	type: 'slideshare'
};