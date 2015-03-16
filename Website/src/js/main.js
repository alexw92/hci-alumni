/* define global app context */
var app = {
	router: new Router(),
	//dbconn: new DatabaseHandler(),
	loginCtrl: new LoginController(),
};

jQuery(function () {
	app.router.run();
	//app.dbconn.testfunct();
	ContentHandler.loadView('loginform.html', '#login', function () {
		app.loginCtrl.initialize();
	});
});