var UserPreviewBuilder = (function (userData) {
	var TAG = 'UserPrevBuilder',
		user = userData,
		userPrevTmpl = 'user_preview_tmpl.html',
		userPrevDom = null;

	/**
	 * private methods
	 */
	 var loadTemplate = function (callback) {
	 	$.get('./views/' + userPrevTmpl, function (data) {
	 		userPrevDom = $(data);

	 		if(typeof(callback) === 'function' && callback !== undefined)
	 			callback('template-loaded');
	 	});
	 };

	 var renderUserInfos = function () {
	 	$(userPrevDom).find('.search-result-lastname').text(user.lastname);
	 	$(userPrevDom).find('.search-result-firstname').text(user.firstname);
	 	$(userPrevDom).find('.search-result-city').text(user.postalcode + ' ' + user.city);

	 	if(user.birthday !== null) {
	 		$(userPrevDom).find('.search-result-birthdate').text(user.birthday);
	 		$(userPrevDom).find('.search-result-age').text(calculateAge(user.birthday));
	 		$(userPrevDom).find('#birthday-row').show();
	 	}

	 	if(user.title === 'Frau') {
	 		$(userPrevDom).find('.result-image').attr('src', 'img/avatars/user_2_f.png');
	 	}
	 	else if(user.title === 'Herr') {
	 		$(userPrevDom).find('.result-image').attr('src', 'img/avatars/user_3_m.png');
	 	}

	 	if(user.company !== null) {
	 		$(userPrevDom).find('.search-result-company')
	 			.html('ist tätig bei ' + user.company + ' im Bereich ' + user.sector + '<br />')
	 			.show();
	 	}

	 	if(user.university !== null){
	 		$(userPrevDom).find('.search-result-university')
	 			.html('studiert(e) an der ' + user.university + ' im Studiengang ' + user.course + '<br />')
	 			.show();
	 	}
	 };

	 var calculateAge = function (date) {
	 	var dateParts = date.split('.'),
	 		birthdate = new Date(dateParts[2], dateParts[1], dateParts[0]),
	 		currentDate = new Date(),
	 		diff = currentDate - birthdate,
	 		age = Math.floor(diff/31536000000);

	 	return age;
	 };

	/**
	 * public methods
	 */
	var public = {
		build: function (callback) {
			loadTemplate(function () {
				renderUserInfos();

				if(typeof(callback) === 'function' && callback !== undefined)
					callback($(userPrevDom));
			});
		}
	};
	return public;
});