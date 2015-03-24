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

	/*

	//Examples: How to use dbconn
	app.dbconn.checkUsernameInUse('FHeer', function(result) {
		console.log(result); //true
	});
	app.dbconn.checkUsernameInUse('Fheer', function(result) {
		console.log(result); //false
	});
	app.dbconn.getUserByUsername('FHeer', function(result) {
		console.log(result); //komisches Array (da die Variablen privat sind)
		console.log(result.username); //FHeer
		console.log(result.firstname); //Frauke
		console.log(result.lastname); //Heer
	});
	app.dbconn.getNewestUsers(function(result){
		console.log(result); //Array mit 5 User-Objekten
		console.log(result[1].firstname); //Joachim
	});
	var n = new User();n.title='Herr';n.firstname='Test';n.lastname='Test';n.address='Teststraße 1';n.postalcode='12345';n.city='Teststadt';n.email='test@test.de';n.username='Test123';n.password='Test123';
	app.dbconn.insertNewUser(n, function(result){
		console.log(result);
	});
	app.dbconn.updateUserinfo('username','FHeer','FHeer123',function(result){
		console.log(result);
	});
	*/

});