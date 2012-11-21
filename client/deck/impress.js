var
	impress_api = impress(),
	index = 0;

module.exports = {
	goto: impress_api.goto,
	onChange: function(fn) {
		document.addEventListener('impress:stepenter', function(e) {
			index = [].slice.call(document.querySelectorAll('.step')).indexOf(e.target);
			fn(index);
		}, false);
	},
	type: 'impress.js'
};