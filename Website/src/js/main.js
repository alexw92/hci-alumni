/* define necessary routes */
var app = Sammy('#main', function () {
	// define necessary routes for alumni portal
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

jQuery(function () {
	app.run();
});