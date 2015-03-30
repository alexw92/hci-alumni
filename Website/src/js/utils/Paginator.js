var Paginator = (function (domContainer, resultListLength, resultsPerPage, activePage) {
	var _TAG = 'Paginator',
		_paginatorContainer = domContainer,
		_paginator = null,
		_resultCount = resultListLength,
		_pageCount = null,
		_resultsPerPage = resultsPerPage,
		_activePage = activePage;

	/**
	 * private methods
	 */
	var calcPageCount = function () {
		if(_resultCount % _resultsPerPage === 0)
			return _resultCount / _resultsPerPage;
		else
			return Math.ceil(_resultCount / _resultsPerPage);
	};

	var buildPaginator = function () {
		if(_resultCount <= _resultsPerPage)
			return;

		var nav = '';
		nav += '<nav><ul class="pagination" id="search-paginator">';
		nav += buildPreviousElement();
		nav += buildPageElements();
		nav += buildNextElement();
		nav += '</ul></nav>';

		$(_paginatorContainer).html(nav);
		_paginator = $('#search-paginator');
	};

	var buildPreviousElement = function () {
		return '<li><a href="#" aria-label="Previous">' +
					'<span aria-hidden="true">&laquo;</span>' +
					'</a></li>';
	};

	var buildPageElements = function () {
		var pageElements = '';

		for (var i = 0 ; i < _pageCount; i++) {
			pageElements += '<li><a href="#">' + (i + 1) + '</a></li>';
		}

		return pageElements;
	};

	var buildNextElement = function () {
		return '<li><a href="#" aria-label="Next">' +
					'<span aria-hidden="true">&raquo;</span>' +
					'</a></li>';
	};

	var setActivePage = function (page) {
		_activePage = page;
		highlightActivePage(page);
		updateUrlHash(page);
		$('html').animate({ scrollTop: 355}, 'slow');

		handlePrevButtonStatus();
		handleNextButtonStatus();
	};

	var highlightActivePage = function (page) {
		$(_paginator).find('li').removeClass('active');
		$(_paginator).find('li').eq(page)
			.addClass('active');
	};

	var handlePrevButtonStatus = function () {
		if(_activePage === 1)
			$(_paginator).find('li:first').addClass('disabled');
		else
			$(_paginator).find('li:first').removeClass('disabled');
	};

	var handleNextButtonStatus = function () {
		if(_activePage === _pageCount)
			$(_paginator).find('li:last').addClass('disabled');
		else
			$(_paginator).find('li:last').removeClass('disabled');
	};

	var setClickEvents = function () {
		var allNavElements = $(_paginator).find('li'),
			pageNumberElements = allNavElements.slice(1, allNavElements.length - 1);

		$(pageNumberElements).on('click', function (e) {
			var clickedPageNumber = Number.parseInt(e.target.text);

			e.preventDefault();
			setActivePage(clickedPageNumber);
		});

		$(_paginator).find('li:first').on('click', function (e) {
			e.preventDefault();

			if(_activePage === 1)
				return;
			else
				setActivePage(_activePage - 1);
		});

		$(_paginator).find('li:last').on('click', function (e) {
			console.log('%s => next clicked', _TAG);
			e.preventDefault();

			if(_activePage === _pageCount)
				return;
			else
				setActivePage(_activePage + 1);
		});
	};

	var updateUrlHash = function (page) {
		var pageParamIndex = window.location.hash.indexOf('&'),
			hash = window.location.hash.substr(0, pageParamIndex);

		window.history.pushState('', '', hash + '&page=' + page);
	};

	/**
	 * public methods
	 */
	return {
		init: function () {
			_pageCount = calcPageCount();

			buildPaginator();
			setActivePage(_activePage);
			setClickEvents();
		},
		show: function () {
			$(_paginatorContainer)
				.removeClass('hidden');
		},
		getActivePage: function () {
			return _activePage;
		},
		getNavContainer: function () {
			return _paginator;
		}
	};
});