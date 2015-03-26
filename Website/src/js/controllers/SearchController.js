var SearchController = (function () {
	var TAG = 'SearchController',
		dbHandler = new DatabaseHandler();
		searchPanel = null,
		searchBtn = null,
		searchInput = null,
		extendedSearchBtn = null,
		names = null;

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
			hideErrorMessage();
			startSearch();
		});

		$(searchInput).on('enterKey', function () {
			hideErrorMessage();
			startSearch();
		});

		$(extendedSearchBtn).on('click', function (e) {
			e.preventDefault();
			hideErrorMessage();
			toggleExtendedSearch();
		});

		$(searchInput).on('keyup', function (event) {
			hideErrorMessage();
			if(event.keyCode === 13) {
				$(this).trigger('enterKey');
				return;
			}
		});
	};

	var startSearch = function () {
		var searchVal = $(searchInput).val();

		if(searchVal === '') {
			showErrorMessage();
			return;
		}

		if(isExtendedSearchVisible()) {
			var searchObj = getExtendedSearchInputValues();

			searchObj.name = searchVal;
			dbHandler.getUsersExtendedSearch(searchObj, handleSearchResult);
		}
		else {
			searchVal = $(searchInput).val();
			dbHandler.getUsersByFullname(searchVal, handleSearchResult);
		}

		if(searchVal !== null)
			updateBrowserLocation(searchVal);
	};

	var showErrorMessage = function () {
		$(searchPanel).find('#search-error-panel').show();
	};

	var hideErrorMessage = function () {
		$(searchPanel).find('#search-error-panel').hide();
	};

	var isExtendedSearchVisible = function () {
		return $(searchPanel).find('.search-extended')
			.is(':visible');
	};

	var getExtendedSearchInputValues = function () {
		var searchFields = $(searchPanel).find('.search-extended').find('input'),
			values = {};

		values.name = $(searchInput).val();
		values.university = $(searchFields[0]).val() === '' ? null : $(searchFields[0]).val();
		values.faculty =  $(searchFields[1]).val() === '' ? null : $(searchFields[1]).val();
		values.study_start = $(searchFields[2]).val() === '' ? null : $(searchFields[2]).val();
		values.study_end = $(searchFields[3]).val() === '' ? null : $(searchFields[3]).val();
		values.interests = $(searchFields[4]).val() === '' ? null : $(searchFields[4]).val();
		values.street = $(searchFields[5]).val() === '' ? null : $(searchFields[5]).val();
		values.city = $(searchFields[6]).val() === '' ? null : $(searchFields[6]).val();
		values.postalcode = $(searchFields[7]).val() === '' ? null : $(searchFields[7]).val();
		values.company = $(searchFields[8]).val() === '' ? null : $(searchFields[8]).val();
		values.sector = $(searchFields[9]).val() === '' ? null : $(searchFields[9]).val();
		values.state = $(searchFields[10]).val() === '' ? null : $(searchFields[10]).val();

		return values;
	};

	var handleSearchResult = function (resultSet) {
		displaySearchResult(resultSet);
		updateResultCount(resultSet.length);
	};

	var displaySearchResult = function (resultSet) {
		if(resultSet.length === 0) {
			displayNoResult();
			return;
		}

		var resultDomArray = [];

		renderPageination();
		$(searchPanel).find('#search-result').show();

		$(resultSet).each(function (index, user) {
			userBuilder = new UserPreviewBuilder(user.toJson());
			userBuilder.build(function (result) {
				resultDomArray.push(result);

				if(resultSet.length === index +1)
					appendSearchResult(resultDomArray);
			});
		});
	};

	var displayNoResult = function () {
		$(searchPanel).find('.search-result-wrapper')
			.html('<div class="alert alert-info" role="alert">Keine Treffer gefunden</div>');
		$(searchPanel).find('#search-result').show();
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

	var initSearchNavigation = function () {
		$(searchPanel).find('#search-nav a').on('click', function (e) {
			e.preventDefault();
			var tabID = $(this).attr('id'),
				tabParent = $(this).parent();

			if(tabID === 'course') {
				$(searchPanel).find('#search-contact-panel').hide();
				$(searchPanel).find('#search-course-panel').show();
			}
			else if(tabID === 'contact') {
				$(searchPanel).find('#search-contact-panel').show();
				$(searchPanel).find('#search-course-panel').hide();
			}

			$(this).tab('show');
			$(searchPanel).find('#search-result').hide();
		});
	};

	var bindAutoComplete = function (names) {
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

	var loadFullNameList = function () {
		dbHandler.getFullnames(function (nameList) {
			bindAutoComplete(nameList);
		});
	};

	var searchMatcher = function (strs) {
		return function findMatches(q, callback) {
			var matches, substrRegex;
			matches = [];
			substrRegex = new RegExp(q, 'i');

			$.each(strs, function(i, str) {
				if(substrRegex.test(str) && $.inArray(str, matches) === -1) {
					matches.push(str);
				}
			});

			callback(buildMatchesArray(matches));
		};
	};

	var buildMatchesArray = function (stringArray) {
		var matches = [];
		stringArray.forEach(function (item, index) {
			matches.push({ value : item });
		});
		return matches;
	};

	/**
	 * public methods
	 */
	var public = {
		initialize: function () {
			var searchString = getSearchQuery(window.location.hash);

			setDomElements();
			bindEvents();
			initSearchNavigation();
			loadFullNameList();

			if(searchString !== '') {
				$(searchPanel).find('#input-search').val(searchString);
				startSearch(searchString);
			}
		}
	};
	return public;
});