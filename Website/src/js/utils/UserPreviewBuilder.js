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