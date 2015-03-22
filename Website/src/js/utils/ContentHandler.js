var ContentHandler = (function () {
	var TAG = 'ContentHandler',
		viewsPath = './views';

	/**
	 * public methods
	 */
	return {
		loadView: function (viewFile, selector, callback) {
			$(selector).load(viewsPath + '/' + viewFile, function () {
				if(typeof(callback) === 'function' && callback !== undefined)
					callback('view-loaded');
			});
		},
		changeUrlHash: function (pageHash) {
			window.location.hash = '#/' + pageHash;
		}
	};
})();