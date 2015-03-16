var LoginController = (function () {
	var TAG = 'LoginCtrl =>',
		requestPath = '',
		loginPnl = null,
		inputUser = null,
		inputPassword = null,
		errorSpan = null;

	/**
	 * private methods
	 */
	var setDomElements = function () {
		loginPnl = $('#login');
		inputUser = $(loginPnl).find('#login-user');
		inputPassword = $(loginPnl).find('#login-password');
		errorSpan = $(loginPnl).find('#login-error-msg');
	};

	var bindLoginEvents = function () {
		$(loginPnl).find('#btn-submit-login').on('click', function () {
			var credentials = getLoginInput();
			hideError();

			if(isValidCredentials(credentials)) {
				console.log('%s login done; store session', TAG);
				// TODO dbhandler -> get user data from db ;)
				Session.setUser(getUserData(credentials));
				ContentHandler.loadView('userpanel.html', '#login', function (event) {
					console.log('%s %s', TAG, event);
					bindLogoutEvents();
				});
			}
			else {
				console.log('%s something went wrong while login', TAG);
				clearPasswordField();
				showError();
			}
		});

		$(inputUser.selector + ", " + inputPassword.selector).on('focus', function () {
			hideError();
		});
	};

	var getLoginInput = function () {
		var credentials = {};

		credentials.username = $(inputUser).val();
		credentials.password = $(inputPassword).val();
		credentials.isEmail = isEmail(credentials.username);

		return credentials;
	};

	var isEmail = function (userInput) {
		if(userInput.indexOf('@') === -1)
			return false;
		return true;
	};

	var isValidCredentials = function (credentials) {
		// TODO: check via dbhandler and database
		if((credentials.username === 'Test' ||
			credentials.username === 'Max.Mustermann@muster.de') &&
			credentials.password === 'test')
				return true;
		return false;
	};

	var getUserData = function (credentials) {
		//var dbHandler = new DbHandler();

		if(credentials.isEmail) {
			// return dbHandler.getUserByEmail(credentials.username);
			return { username: 'Test',
				password: 'test',
				firstname: 'Max',
				lastname: 'Mustermann',
				email: 'Max.Mustermann@muster.de' };
		}
		else {
			// return dbHandler.getUserByUsername(credentials.username);
			return { username: 'Test',
				password: 'test',
				firstname: 'Max',
				lastname: 'Mustermann',
				email: 'Max.Mustermann@muster.de' };
		}
	};

	var clearPasswordField = function () {
		$(inputPassword).val('');
	};

	var showError = function () {
		$(errorSpan).show();
	};

	var hideError = function () {
		$(errorSpan).hide();
	};

	var bindLogoutEvents = function () {
		$('#login').find('button').on('click', function () {
			Session.clear();
			ContentHandler.loadView('loginform.html', '#login', function() {
				publicMethods.initialize();
			});
		});
	};

	/**
	 * public methods
	 */
	var publicMethods = {
	 	initialize: function () {
	 		setDomElements();
	 		bindLoginEvents();
	 	}
	};
	return publicMethods;
});
