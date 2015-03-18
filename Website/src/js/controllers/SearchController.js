var SearchController = (function () {
	var TAG = 'SearchController',
		searchPanel = null,
		searchBtn = null,
		searchInput = null,
		extendedSearchBtn = null,
		names = ['Thomas Handwerker', 'Alexander Werthmann', 'Armin Beutel', 'Benedikt Pfaff', 'Vanessa Weltner', 'Jessica Voll', 'Max Mustermann'];

	/**
	 * private methods
	 */
	var setDomElements = function () {
		searchPanel = $('#search-panel');
		searchBtn = $(searchPanel).find('#btn-submit-search');
		searchInput = $(searchPanel).find('#input-search');
		extendedSearchBtn = $(searchPanel).find('#btn-extended-search');
	};

	var getSearchQuery = function (urlHash) {
		var splitIndex = urlHash.indexOf('?'),
			queryString = urlHash.substr(splitIndex +1, urlHash.length);

		if(queryString.startsWith('query')) {
			var beginSearchValue = queryString.indexOf('=') + 1,
				endSearchValue = queryString.indexOf('&');

			if(beginSearchValue === -1)
				return '';
			else if(endSearchValue === -1)
				return decodeURIComponent(queryString.substring(beginSearchValue, queryString.length));
			else
				return decodeURIComponent(queryString.substring(beginSearchValue, endSearchValue));
		}
		else
			return '';
	};

	var bindEvents = function () {
		$(searchBtn).on('click', function () {
			startSearch($(searchInput).val());
		});

		$(searchInput).on('enterKey', function () {
			startSearch($(searchInput).val());
		});

		$(extendedSearchBtn).on('click', function (e) {
			e.preventDefault();
			toggleExtendedSearch();
		});

		$(searchInput).on('keyup', function (event) {
			if(event.keyCode === 13) {
				$(this).trigger('enterKey');
				return;
			}
		});
	};

	var startSearch = function (searchValue) {
		console.log('%s => searching for: %s', TAG, searchValue);

		var resultSet = [{firstname: 'Thomas', lastname: 'Handwerker'}, {firstname: 'Armin', lastname: 'Beutel'}];

		displaySearchResult(resultSet);
		updateResultCount(resultSet.length);
		updateBrowserLocation(searchValue);
	};

	var displaySearchResult = function (resultSet) {
		var resultDomArray = [];

		renderPageination();

		$(resultSet).each(function (index, resultUser) {
			userBuilder = new UserPreviewBuilder(resultUser);
			userBuilder.build(function (result) {
				resultDomArray.push(result);

				if(resultSet.length === index +1)
					appendSearchResult(resultDomArray);
			});
		});
	};

	var updateResultCount = function (resultLength) {
		$(searchPanel).find('#search-result-length').text(resultLength);
	};

	var updateBrowserLocation = function (searchValue) {
		var urlHash = window.location.hash;

		if(urlHash.indexOf('?') !== -1)
			urlHash = urlHash.substring(0, urlHash.indexOf('?'));

		urlHash += '?query=' + encodeURIComponent(searchValue);
		window.location.hash = urlHash;
	};

	var renderPageination = function () {
		// TODO: pageination :)
	};

	var appendSearchResult = function (domElements) {
		$(searchPanel).find('.search-result-wrapper')
			.html(domElements);
	};

	var toggleExtendedSearch = function () {
		var extSearchPnl = $(searchPanel).find('.search-extended');
		extSearchPnl.fadeToggle('slow');
	};

	var bindAutoComplete = function () {
		$(searchInput).typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			name: 'names',
			displayKey: 'value',
			source: searchMatcher(names)
		});
	};

	var searchMatcher = function (strs) {
		return function findMatches(q, callback) {
			var matches, substrRegex;
			matches = [];
			substrRegex = new RegExp(q, 'i');

			$.each(strs, function(i, str) {
				if(substrRegex.test(str)) {
					matches.push({ value : str });
				}
			});

			callback(matches);
		};
	};

	/**
	 * public methods
	 */
	var public = {
		initialize: function () {
			var searchString = getSearchQuery(window.location.hash);

			setDomElements();
			bindEvents();
			bindAutoComplete();

			if(searchString !== '') {
				startSearch(searchString);
			}
		}
	};
	return public;
});