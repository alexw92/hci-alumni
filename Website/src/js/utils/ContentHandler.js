var ContentHandler = (function () {
	var TAG = 'ContentHandler',
		viewsPath = './views';

	/**
	 * public methods
	 */
	return {
		loadView: function (viewFile, selector, callback) {
			$(selector).load(viewsPath + '/' + viewFile, function () {
				PopOvers.bind();
				if(typeof(callback) === 'function' && callback !== undefined)
					callback('view-loaded');
			});
		},
		changeUrlHash: function (pageHash) {
			window.location.hash = '#/' + pageHash;
		}
	};
})();