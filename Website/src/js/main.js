/* define global app context */
var app = {
	router: new Router(),
	dbconn: new DatabaseHandler(),
	loginCtrl: new LoginController(),
};

jQuery(function () {
	app.router.run();
	console.log(app.dbconn.checkUsernameInUse('FHeer'));
	console.log(app.dbconn.checkUsernameInUse('Fheer'));
	ContentHandler.loadView('loginform.html', '#login', function () {
		app.loginCtrl.initialize();
	});
});