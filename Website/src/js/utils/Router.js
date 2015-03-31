var Router = function () {
	this.TAG = "Router";
	this.routing = this.init();
};

Router.prototype.init = function() {
	var self = this;

	return Sammy('#main', function () {
		this.get('/', function () {
			ContentHandler.loadView('home.html', '.content', function () {
				console.log('%s => main site loaded', self.TAG);
				var homeCtrl = new HomeController();
				homeCtrl.init();
			});
		});

		this.get('#/register', function () {
			ContentHandler.loadView('register.html', '.content', function () {
				console.log('%s => init registration controller', self.TAG);
				var regCtrl = new RegistrationController();
			});
		});

		this.get('#/forgotpw', function () {
			ContentHandler.loadView('pwdRecovery.html', '.content', function () {
				var pwdRecovery = new PwdRecoveryController();
				console.log('%s => init password recovery controller', self.TAG);
			});
		});

		this.get('#/verify/:verifyCode', function () {
			var verifyCode = this.params.verifyCode;

			ContentHandler.loadView('verify_user.html', '.content', function () {
				var verifyCtrl = new VerifyUserController();
				verifyCtrl.verify(verifyCode);
			});
		});

		this.get('#/userpanel', function () {
			if(Session.isSessionActive()) {
				ContentHandler.loadView('userpanel.html', '.content', function () {
					var userpanel = new UserpanelController();
				});
			}
		});

		this.get('#/mentoring', function () {
			ContentHandler.loadView('mentoring.html', '.content', function () {
				console.log('%s => mentoring view loaded', self.TAG);
			});
		});
		this.get('#/publication', function () {
			ContentHandler.loadView('publication.html', '.content', function () {
				console.log('%s => publication view loaded', self.TAG);
			});
		});
		this.get('#/galery', function () {
			ContentHandler.loadView('galery.html', '.content', function () {
				console.log('%s => galery view loaded', self.TAG);
			});
		});
		this.get('#/events', function () {
			ContentHandler.loadView('events.html', '.content', function () {
				console.log('%s => event view loaded', self.TAG);
			});
		});

		this.get('#/search', function () {
			// workaround to prevent page refresh after change url hash
			if($('.content').find('#search-panel').length !== 0)
				return;

			ContentHandler.loadView('search.html', '.content', function () {
				var searchCtrl = new SearchController().initialize();
			});
		});

		this.get('#/pwdChange', function() {
			ContentHandler.loadView('pwdChange.html', '.content', function () {
				var pwdChange = new PwdChangeController();
				console.log('%s => init password change controller', self.TAG);
			});
		});
		this.get('#/pwdChange/:uname/:pwd', function() {
			var urlUsername = this.params.uname,
				urlPassword = this.params.pwd;

			ContentHandler.loadView('pwdChange.html', '.content', function () {
				console.log('%s => init password change controller with username=%s and password=%s', self.TAG, urlUsername, urlPassword);
				var pwdChange = new PwdChangeController(urlUsername, urlPassword);
			});
		});

		this.get('#/impressum', function () {
			ContentHandler.loadView('impressum.html', '.content', function () {
				console.log('impressum loaded');
			});
		});
	});
};

Router.prototype.run = function() {
	this.routing.run();
};
