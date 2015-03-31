var HomeController = (function () {
	var _TAG = 'HomeController',
		_dbHandler = new DatabaseHandler(),
		_userCarouselTmpl = 'carousel_user_tmpl.html',
		_userDom = null,
		_carouselPanel = null,
		_userList = null;

	/**
	 * private methods
	 */
	 var loadDomElement = function () {
	 	_carouselPanel = $('#user-carousel');
	 };

	 var loadCarouselUser = function (callback) {
	 	_dbHandler.getNewestUsers(function (resultSet) {
	 		_userList = resultSet;

	 		if(typeof(callback) === 'function' && callback !== 'undefined')
	 			callback('user-received');
	 	});
	 };

	 var renderCarousel = function () {
	 	$('.carousel').carousel({interval:false});

	 	$.each(_userList, function (index, user) {
	 		var gender = (user.title === 'Herr') ? 'm' : 'f';

			$('.carousel-inner').append(
				'<div class="item carousel-user-item">' +
				'<div><img class="carousel-user-img img-thumbnail" src="img/avatars/user_' + user.image_id + '_' + gender + '.png" alt="' + user.completename + '">' +
				'<div class="carousel-caption"><h3>' + user.completename + '</h3><p>aus ' + user.city + '</p></div></div>' +
				'</div>');

			if(index === 0)
				$('.carousel-inner').find('div:first').addClass('active');
	 	});
	 };

	/**
	 * public methods
	 */
	return {
		init: function () {
			loadDomElement();
			loadCarouselUser(function (eventName) {
				renderCarousel();
			});
		}
	};
});