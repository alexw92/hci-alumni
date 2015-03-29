var Router = function () {
	this.TAG = "Router => ";
	this.routing = this.init();
};

Router.prototype.init = function() {
	var self = this;

	return Sammy('#main', function () {
		this.get('/', function () {
			ContentHandler.loadView('home.html', '.content', function () {
				console.log('main page loaded');
			});
		});

		this.get('#/register', function () {
			ContentHandler.loadView('register.html', '.content', function () {
				var regCtrl = new RegistrationController();
				console.log('register form loaded');
			});
		});

		this.get('#/forgotpw', function () {
			ContentHandler.loadView('pwdRecovery.html', '.content', function () {
				var pwdRecovery = new PwdRecoveryController();
				console.log('password recovery form loaded');
			});
		});

		this.get('#/verify/:verifyCode', function () {
			var code = this.params.verifyCode;
			console.log('account verification with code: %s', code);
		});

		this.get('#/userpanel', function () {
			if(Session.isSessionActive()) {
				var userpanel = new UserpanelController();
				ContentHandler.loadView('userpanel.html', '.content');
			}
		});

		this.get('#/mentoring', function () {
			ContentHandler.loadView('mentoring.html', '.content', function () {
				console.log('mentoring content form loaded');
			});
		});
		this.get('#/publication', function () {
			ContentHandler.loadView('publication.html', '.content', function () {
				console.log('mentoring content form loaded');
			});
		});
		this.get('#/galery', function () {
			ContentHandler.loadView('galery.html', '.content', function () {
				console.log('mentoring content form loaded');
			});
		});
		this.get('#/alumniSearch', function () {
			ContentHandler.loadView('alumniSearch.html', '.content', function () {
				console.log('mentoring content form loaded');
			});
		});
		this.get('#/events', function () {
			ContentHandler.loadView('events.html', '.content', function () {
				console.log('mentoring content form loaded');
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
				console.log('password change form loaded');
			});
		});
		this.get('#/pwdChange/:uname/:pwd', function() {
			var urlUsername = this.params.uname;
			var urlPassword = this.params.pwd;
			console.log('password change form loaded' + urlUsername + ' ' + urlPassword);
			ContentHandler.loadView('pwdChange.html', '.content', function () {
				console.log('password change form loaded 2 ' + urlUsername + ' ' + urlPassword);
				var pwdChange = new PwdChangeController(urlUsername, urlPassword);
				
			});
		});
	});
};

Router.prototype.run = function() {
	this.routing.run();
};
