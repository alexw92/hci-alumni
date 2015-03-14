var Router = function () {
	this.TAG = "Router => ";
	this.routing = this.init();
};

Router.prototype.init = function() {
	return Sammy('#main', function () {
		this.get('/', function () {
			console.log('home is where you come from');
		});

		this.get('#/register', function () {
			var regCtrl = new RegistrationController();
		});

		this.get('#/verify/:verifyCode', function () {
			var code = this.params.verifyCode;
			console.log('account verification with code: %s', code);
		});

		this.get('#/forgotpw', function () {
			console.log('forgot pw? resend via email');
		});
	});
};

Router.prototype.run = function() {
	this.routing.run();
};