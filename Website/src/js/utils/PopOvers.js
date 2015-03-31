var PopOvers = (function () {
	var _TAG = 'PopOvers';

	/**
	 * private methods
	 */
	 var initPopOvers = function (elements) {
	 	$(elements).popover({
	 		content: buildHtmlContent(),
	 		html: true,
	 		placement: 'top',
	 		title: buildTitle(),
	 		trigger: 'hover'
	 	});

	 	$(elements).on('click', function (e) {
	 		e.preventDefault();
	 	});
	 };

	 var buildTitle = function () {
	 	return '<span class="glyphicon glyphicon-info-sign"></span>&nbsp;<b>Hinweis</b>';
	 };

	 var buildHtmlContent = function () {
	 	var text = 'Diese Interaktion ist im derzeitigen Prototypen nicht implementiert.';
	 	return text;
	 };

	/**
	 * public methods
	 */
	 return {
	 	// param: class or id selector (e.g. .container / #panel)
	 	bind: function (container) {
	 		if(typeof(container) === 'undefined')
	 			container = '.content';

	 		var dummyLinks = $(container).find('.not-implemented');
	 		initPopOvers(dummyLinks);
	 	}
	 };
})();