/* define global app context */
var app = {
	router: new Router(),
	dbconn: new DatabaseHandler(),
	loginCtrl: new LoginController(),
};

jQuery(function () {
	app.router.run();
	//app.dbconn.testfunct('username02');
	ContentHandler.loadView('loginform.html', '#login', function () {
		app.loginCtrl.initialize();
	});
});