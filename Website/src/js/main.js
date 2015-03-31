/* define global app context */
var app = {
	router: new Router(),
	dbconn: new DatabaseHandler(),
	loginCtrl: new LoginController(),
};

jQuery(function () {
	app.router.run();

	ContentHandler.loadView('loginform.html', '#login', function () {
		app.loginCtrl.initialize();
	});

	PopOvers.bind('.navigation'); // init popover info for header links
});