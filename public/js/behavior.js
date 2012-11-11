(function() {
	var insertDemoBtn = document.getElementById('insert-demo');
	if (insertDemoBtn) {
		insertDemoBtn.addEventListener('click', function(e) {
			e.preventDefault();
			document.getElementById('slide-url').value = 'http://lab.hakim.se/reveal-js/';
		}, false);
	}
})();