var Navigation = (function () {
	var _nav = $('.navigation:first'),
		_hideableNavIds = [
			'nav-mentoring',
			'nav-publication',
			'nav-search',
			'nav-userpanel'
		];

	/**
	 * private methods
	 */
	 var showNavigationItems = function () {
	 	$.each(_hideableNavIds, function (index, navItem) {
	 		$(_nav).find('#' + navItem).removeClass('hidden');
	 	});
	 };

	 var hideNavigationItems = function () {
	 	$.each(_hideableNavIds, function (index, navItem) {
	 		$(_nav).find('#' + navItem).addClass('hidden');
	 	});
	 };

	/**
	 * public methods
	 */
	return {
		update: function () {
			if(Session.isSessionActive())
				showNavigationItems();
			else
				hideNavigationItems();
		}
	};
})();