/* define global app context */
var app = {
	router: new Router(),
	loginCtrl: new LoginController(),
};

jQuery(function () {
	app.router.run();

	ContentHandler.loadView('loginform.html', '#login', function () {
		app.loginCtrl.initialize();
	});
});