var Spinner = (function () {
	var TAG = 'ButtonSpinner';

	var getElementTag = function (element) {
		return $(element).prop('tagName');
	};

	return {
		show: function (element) {
			if(getElementTag(element) === 'BUTTON') {
				$(element).find('span:first')
					.addClass('glyphicon-refresh-animate')
					.removeClass('hidden');
			}
			else if(getElementTag(element) === 'DIV') {
				$(element).find('span:first')
					.addClass('glyphicon-refresh-animate');
				$(element)
					.removeClass('hidden');
			}
		},
		hide: function (element) {
			if(getElementTag(element) === 'BUTTON') {
				$(element).find('span:first')
					.addClass('hidden')
					.removeClass('glyphicon-refresh-animate');
			}
			else if(getElementTag(element) === 'DIV') {
				$(element).find('span:first')
					.removeClass('glyphicon-refresh-animate');
				$(element)
					.addClass('hidden');
			}
		}
	};
})();