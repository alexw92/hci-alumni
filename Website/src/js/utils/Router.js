var Router = function () {
	this.TAG = "Router => ";
	this.routing = this.init();
};

Router.prototype.init = function() {
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
	});
};

Router.prototype.run = function() {
	this.routing.run();
};
