var LoginController = (function () {
	var TAG = 'LoginCtrl =>',
		dbHandler = new DatabaseHandler(),
		requestPath = '',
		loginPnl = null,
		loginBtn = null,
		inputUser = null,
		inputPassword = null,
		errorSpan = null,
		warningspan = null;

	/**
	 * private methods
	 */
	var setDomElements = function () {
		loginPnl = $('#login');
		loginBtn = $(loginPnl).find('button');
		inputUser = $(loginPnl).find('#login-user');
		inputPassword = $(loginPnl).find('#login-password');
		errorSpan = $(loginPnl).find('#login-error-msg');
		warningSpan = $(loginPnl).find('#login-warning-msg');
	};

	var bindLoginEvents = function () {
		$(loginPnl).find('#btn-submit-login').on('click', function (e) {
			e.preventDefault();
			initLoginMechanism();
		});

		$(inputPassword.selector).on({
			keyup: function (e) {
				e.preventDefault();
				if(e.keyCode === 13)
					initLoginMechanism();
			},
			keypress: function(e) {
				var kc = e.keyCode ? e.keyCode : e.which;
				var sk = e.shiftKey ? e.shiftKey : ((kc == 16) ? true : false);
				if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
				{
					showWarning(' Warnung: Sie haben die Feststelltaste gedrückt!');
				}
			},
			keydown: function(e){
				var kc = e.keyCode ? e.keyCode : e.which;
				if (kc == 20)
				{
					hideWarning();
				}
			}
		});

		$(inputUser.selector + ", " + inputPassword.selector).on('focus', function () {
			hideError();
		});
	};

	var initLoginMechanism = function () {
		hideError();

		var credentials = getLoginInput();

		if(isCredentialsEmpty(credentials)) {
			showError('Benutzername und Passwort eingeben');
			return;
		}

		deactivateButton($(loginBtn).attr('id'));
		Spinner.show(loginBtn);
		dbHandler.checkValidLogin(credentials.username, credentials.password, function (isValid) {
			if(isValid === true) {
				if(dbHandler.isUserUnlocked(credentials.username, function(response) {
					if(response){
						loadUserDataAndLogin(credentials);
					}
					else{
						setTimeout(function () {
						showError('Sie haben Ihren Benutzeraccount noch nicht freigeschaltet');
						Spinner.hide(loginBtn);
						activateButton($(loginBtn).attr('id'));
						}, 2000);
					}
				}));
			}
			else {
				clearPasswordField();
				setTimeout(function () {
					showError('Nutzername und Passwort stimmen nicht überein');
					Spinner.hide(loginBtn);
					activateButton($(loginBtn).attr('id'));
				}, 2000);
			}
		});
	};

	var isCredentialsEmpty = function (credentials) {
		if(credentials.username === '' || credentials.password === '')
			return true;
		return false;
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
					activateButton($(loginBtn).attr('id'));
				}, 2000);
			});
		}
		else {
			dbHandler.getUserByUsername(credentials.username, function (user) {
				setTimeout(function () {
					Spinner.hide(loginBtn);
					logUserIn(user);
					activateButton($(loginBtn).attr('id'));
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

	var showError = function (message) {
		$(errorSpan).text(message).show();
	};
	
	var showWarning = function (message) {
		$(warningSpan).text(message).show();
	};

	var hideError = function () {
		$(errorSpan).hide();
	};
	
	var hideWarning = function() {
		$(warningSpan).hide();
	};

	var activateButton = function (btnID) {
		$(loginPnl).find('#' + btnID).removeClass('disabled');
	};

	var deactivateButton = function (btnID) {
		$(loginPnl).find('#' + btnID).addClass('disabled');
	};

	var bindLogoutEvents = function () {
		$('#login').find('button').on('click', function () {
			deactivateButton($(this).attr('id'));
			Spinner.show($(this));

			setTimeout(function () {
				Session.clear();
				Navigation.update();
				activateButton($(this).attr('id'));
				Spinner.hide($(this));

				ContentHandler.changeUrlHash('');
				ContentHandler.loadView('home.html', '.content');
				ContentHandler.loadView('loginform.html', '#login', function() {
					publicMethods.initialize();
				});
			}, 1000);
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
