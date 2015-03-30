var VerifyUserController = (function () {
	var _TAG = 'Verify Controller',
		_dbHandler = new DatabaseHandler();
		_verifyWrapper = $('#verifyuser-wrapper');

	/**
	 * private methods
	 */
	var handleResult = function (result) {
		setTimeout(function () {
			Spinner.hide($(_verifyWrapper).find('#verify-spinner'));

			if(result === 'success')
				showFeedbackPanel('#verify-success');
			else
				showFeedbackPanel('#verify-error');
		}, 1500);
	};

	 var showFeedbackPanel = function (panelID) {
	 	$(_verifyWrapper).find(panelID).removeClass('hidden');
	 };

	/**
	 * public methods
	*/
	return {
		verify: function (code) {
			_dbHandler.unlockUser(code, handleResult);
		}
	};
});