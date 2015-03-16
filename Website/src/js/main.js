/* define global app context */
var app = {
	router: new Router(),
	//sqldb: new DatabaseController(),
	loginCtrl: new LoginController(),
};

jQuery(function () {
	app.router.run();
	//app.sqldb.testfunct();
	ContentHandler.loadView('loginform.html', '#login', function () {
		app.loginCtrl.initialize();
	});
});