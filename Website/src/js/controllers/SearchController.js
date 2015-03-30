var SearchController = (function () {
	var TAG = 'SearchController',
		dbHandler = new DatabaseHandler(),
		paginator = null,
		resultsPerPage = 5,
		searchPanel = null,
		searchSpinner = null,
		coursePanel = null,
		searchBtn = null,
		searchInput = null,
		searchResult = null,
		courseListPanel = null,
		extendedSearchBtn = null,
		names = null,
		courses = null;

	/**
	 * private methods
	 */
	var setDomElements = function () {
		searchPanel = $('#search-panel');
		searchSpinner = $(searchPanel).find('#search-spinner');
		coursePanel = $('#search-course-panel');
		searchBtn = $(searchPanel).find('#btn-submit-search');
		searchInput = $(searchPanel).find('#input-search');
		extendedSearchBtn = $(searchPanel).find('#btn-extended-search');
		courseListPanel = $(coursePanel).find('#course-list');
	};

	var getParamFromUrlHash = function (paramName) {
		var urlHash = window.location.hash,
			regEx = new RegExp("#.*[?&]" + paramName + "=([^&]+)(&|$)");
			match = urlHash.match(regEx);

		return (match ? match[1] : "");
	};

	var bindEvents = function () {
		$(searchBtn).on('click', function (e) {
			e.preventDefault();
			hideErrorMessage();

			var searchVal = $(searchInput).val();
			updateBrowserLocation(searchVal, 1, 'init');
			destroyPaginator();
			startSearch(searchVal);
		});

		$(searchInput).on('enterKey', function (e) {
			e.preventDefault();
			hideErrorMessage();

			var searchVal = $(searchInput).val();
			updateBrowserLocation(searchVal, 1, 'init');
			destroyPaginator();
			startSearch(searchVal);
		});

		$(extendedSearchBtn).on('click', function (e) {
			e.preventDefault();
			hideErrorMessage();
			toggleExtendedSearch();
		});

		$(searchInput).on('keyup', function (e) {
			hideErrorMessage();
			if(e.keyCode === 13) {
				$(this).trigger('enterKey');
				return;
			}
		});
	};

	var startSearch = function (searchVal) {
		if(searchVal === '') {
			showErrorMessage();
			return;
		}

		Spinner.show(searchSpinner);
		hideResultWrapper();

		if(isExtendedSearchVisible()) {
			var searchObj = getExtendedSearchInputValues();
			searchObj.name = searchVal;
			dbHandler.getUsersExtendedSearch(searchObj, handleSearchResult);
		}
		else {
			searchVal = $(searchInput).val();
			dbHandler.getUsersByFullname(searchVal, handleSearchResult);
		}
	};

	var showErrorMessage = function () {
		$(searchPanel).find('#search-error-panel').show();
	};

	var hideErrorMessage = function () {
		$(searchPanel).find('#search-error-panel').hide();
	};

	var hideResultWrapper = function () {
		var resultContainer = $(searchPanel).find('#search-result');

		if($(resultContainer).is(':visible'))
			$(resultContainer).fadeOut();
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
		searchResult = extendResultForDemoPurpose(resultSet);

		setTimeout(function () {
			renderPagination(searchResult.length, resultsPerPage);
			displaySearchResult();
		}, 1500);
	};

	var extendResultForDemoPurpose = function (array) {
		var extendedArray = [];

		for(var i = 0; i < 3; i++) {
			var arrayCopy = array.slice();
			extendedArray = $.merge(extendedArray, arrayCopy);
		}
		return extendedArray;
	};

	var displaySearchResult = function () {
		if(searchResult.length === 0) {
			displayNoResult();
			return;
		}

		var resultDomArray = [],
			listToDisplay = filterResults(searchResult, paginator.getActivePage(), resultsPerPage);

		$(listToDisplay).each(function (index, user) {
			userBuilder = new UserPreviewBuilder(user.toJson());
			userBuilder.build(function (result) {
				resultDomArray.push(result);

				if(listToDisplay.length === index +1)
					appendSearchResult(resultDomArray);
			});
		});

		updateResultCount(searchResult.length);
	};

	var filterResults = function (results, activePage, resultsPerPage) {
		var startIndex = 0,
			endIndex = 0;

		startIndex = activePage === 1 ? 0 : ((activePage - 1) * resultsPerPage) - 1;
		endIndex = startIndex + resultsPerPage;

		if(endIndex >= searchResult.length)
			endIndex = searchResult.length - 1;

		return results.slice(startIndex, endIndex);
	};

	var displayNoResult = function () {
		Spinner.hide(searchSpinner);

		$(searchPanel).find('.search-result-wrapper')
			.html('<div class="alert alert-info" role="alert">Keine Treffer gefunden</div>');
		$(searchPanel).find('#search-result').show();
		$(searchPanel).find('#label-search-result').hide();
	};

	var updateResultCount = function (resultLength) {
		var beginHitCount,
			endHitCount;

		if(paginator.getActivePage() === 1) {
			beginHitCount = 1;
			endHitCount = resultsPerPage;
		}
		else {
			beginHitCount = (paginator.getActivePage() - 1) * resultsPerPage + 1;
			endHitCount = paginator.getActivePage() * resultsPerPage;
		}

		if(endHitCount > resultLength)
			endHitCount = resultLength;

		$(searchPanel).find('#search-result-start').text(beginHitCount);
		$(searchPanel).find('#search-result-end').text(endHitCount);
		$(searchPanel).find('#search-result-length').text(resultLength);
		$(searchPanel).find('#label-search-result').show();
	};

	var updateBrowserLocation = function (searchValue, page, status) {
		var hash = '#/search?query=' + searchValue + '&page=' + page;

		if(status !== 'undefined')
			hash += '&status=' + status;

		window.history.pushState('', '', hash);
	};

	var destroyPaginator = function () {
		if(paginator !== null)
			paginator.destroy();
	};

	var renderPagination = function (resultCount, itemsPerPage) {
		paginator = new Paginator(
			$('#search-paginator-wrapper'),
			resultCount,
			itemsPerPage,
			Number.parseInt(getParamFromUrlHash('page')));

		paginator.init();
		paginator.show();

		setPaginatorEvents();
	};

	var setPaginatorEvents = function () {
		$(paginator.getNavContainer()).find('li').on('click', function (e) {
			e.preventDefault();
			displaySearchResult();
		});
	};

	var appendSearchResult = function (domElements) {
		$(searchPanel).find('.search-result-wrapper')
			.html(domElements);
		$(searchPanel).find('#search-result').show();
		Spinner.hide(searchSpinner);
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

	var loadFullCourseList = function () {
		dbHandler.getCourses(function (resultSet) {
			courses = resultSet.sort();
			displayCourseList();
			initLetterNavigation();
		});
	};

	var displayCourseList = function (letter) {
		if(typeof(letter) === 'undefined')
			renderCourseList(courses);
			return;
	};

	var initLetterNavigation = function () {
		var letterArray = $(coursePanel).find('#course-letter-nav').find('a');

		letterArray.on('click', function (e) {
			e.preventDefault();

			$(letterArray).parent().removeClass('label-letter label-primary');
			$(letterArray).removeClass('letter-active');

			$(this).parent().addClass('label-letter label-primary');
			$(this).addClass('letter-active');

			filterCourseList($(courseListPanel.find('ul:first')), $(this).text());
		});
	};

	var renderCourseList = function (courses) {
		var courseListDom = $(courseListPanel).find('ul:first');

		$.each(courses, function (index, course) {
			$(courseListDom).append('<li class="list-group-item" name="' + course + '"><span class="badge">3</span>' + course + '</li>');
		});
	};

	var filterCourseList = function (list, filter) {
		$(list).find('li').show();

		if(filter === 'Alle')
			return;

		$(list).find('li[name^=' + filter + ']').show();
		$(list).find('li').not('li[name^=' + filter +']').hide();
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
			var searchString = getParamFromUrlHash('query');

			setDomElements();
			bindEvents();
			initSearchNavigation();
			loadFullNameList();
			loadFullCourseList();

			if(searchString !== '') {
				$(searchPanel).find('#input-search').val(searchString);
				startSearch(searchString);
			}
		}
	};
	return public;
});