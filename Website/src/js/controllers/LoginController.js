var LoginController = (function () {
	var TAG = 'LoginCtrl =>',
		dbHandler = new DatabaseHandler(),
		requestPath = '',
		loginPnl = null,
		loginBtn = null,
		inputUser = null,
		inputPassword = null,
		errorSpan = null;

	/**
	 * private methods
	 */
	var setDomElements = function () {
		loginPnl = $('#login');
		loginBtn = $(loginPnl).find('button');
		inputUser = $(loginPnl).find('#login-user');
		inputPassword = $(loginPnl).find('#login-password');
		errorSpan = $(loginPnl).find('#login-error-msg');
	};

	var bindLoginEvents = function () {
		$(loginPnl).find('#btn-submit-login').on('click', function () {
			var credentials = getLoginInput();

			hideError();
			Spinner.show(loginBtn);

			dbHandler.checkValidLogin(credentials.username, credentials.password, function (isValid) {
				if(isValid === true) {
					loadUserDataAndLogin(credentials);
				}
				else {
					clearPasswordField();
					setTimeout(function () {
						showError();
						Spinner.hide(loginBtn);
					}, 2000);
				}
			});
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

	var loadUserDataAndLogin = function (credentials) {
		if(credentials.isEmail) {
			dbHandler.getUserByEmail(credentials.username, function (user) {
				setTimeout(function () {
					Spinner.hide(loginBtn);
					logUserIn(user);
				}, 2000);
			});
		}
		else {
			dbHandler.getUserByUsername(credentials.username, function (user) {
				setTimeout(function () {
					Spinner.hide(loginBtn);
					logUserIn(user);
				}, 2000);
			});
		}
	};

	var logUserIn = function (user) {
		Session.setUser(user);
		Navigation.update();

		ContentHandler.changeUrlHash('userpanel');
		ContentHandler.loadView('userpanel_header.html', '#login', function (event) {
			setLoginPanelInfo(user);
			bindLogoutEvents();
		});

	};

	var setLoginPanelInfo = function (userInfo) {
		var loginPanel = $('#login');
		$(loginPanel).find('#user-firstname').text(userInfo.firstname);
		$(loginPanel).find('#number-messages').text(3);
		$(loginPanel).find('#number-events').text(1);
		$(loginPanel).find('#number-friendrequests').text(7);
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
			Navigation.update();

			ContentHandler.changeUrlHash('');
			ContentHandler.loadView('home.html', '.content');
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
