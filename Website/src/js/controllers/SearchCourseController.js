var SearchCourseController = (function () {
	var _TAG = 'SearchCourseController',
		_dbHandler = new DatabaseHandler(),
		_courseList = null,
		_coursePanel = null,
		_courseLetterNav = null;

	/**
	 private methods
	 */
	 var clearFirst = function () {
	 	$(_coursePanel).find('ul:first').empty();
	 };

	 var loadDomElements = function () {
	 	_coursePanel = $('#search-panel').find('#search-course-panel');
	 	_courseLetterNav = $(_coursePanel).find('#course-letter-nav');
	 };

	 var loadFullCourseList = function (callback) {
		_dbHandler.getCourses(function (resultSet) {
			var courseListDirty = resultSet.sort();
			_courseList = courseListDirty.slice(1, courseListDirty.length);

			if(typeof(callback) === 'function' && callback !== 'undefined')
				callback('course-list-received');
			//renderCourseList();
			//displayCourseList();
		});
	};

	var renderCourseList = function () {
		var listInHtml = $(_coursePanel).find('ul:first');

		$.each(_courseList, function (index, course) {
			$(listInHtml).append('<li class="list-group-item" name="' + course[0] + '">' +
				'<span class="badge">' + course[1] +'</span><a href="#/search">' + course[0] + '</a></li>');
		});
	};

	var initCourseLetterNav = function () {
		var letters = $(_courseLetterNav).find('a');

		letters.on('click', function (e) {
			e.preventDefault();

			$(letters).parent().removeClass('label-letter label-primary');
			$(letters).removeClass('letter-active');

			$(this).parent().addClass('label-letter label-primary');
			$(this).addClass('letter-active');

			filterCourseListByLetter($(_coursePanel).find('ul:first'), $(this).text());
		});
	};

	var filterCourseListByLetter = function (list, filter) {
		$(list).find('li').show();

		if(filter === 'Alle')
			return;

		$(list).find('li[name^=' + filter + ']').show();
		$(list).find('li').not('li[name^=' + filter +']').hide();

		if(!$('.list-group-item').is(':visible'))
			$('#course-list-empty').removeClass('hidden');
		else
			$('#course-list-empty').addClass('hidden');
	};

	/**
	 * public methods
	 */
	 return {
	 	init: function () {
	 		loadDomElements();
	 		clearFirst();
	 		loadFullCourseList(function (eventName) {
	 			renderCourseList();
	 		});

	 		initCourseLetterNav();
	 	},
	 };
});