/* define global app context */
var app = {
	router: new Router(),
	dbconn: new DatabaseHandler(),
	loginCtrl: new LoginController(),
};

jQuery(function () {
	$(window).on('hashchange', function (e) {
		e.preventDefault();
		e.stopPropagation();
		console.log('blubb hash changed');
	});
	app.router.run();

	ContentHandler.loadView('loginform.html', '#login', function () {
		app.loginCtrl.initialize();
	});

});