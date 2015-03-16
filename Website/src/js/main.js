/* define global app context */
var app = {
	router: new Router(),
	//dbconn: new DatabaseHandler(),
};

jQuery(function () {
	app.router.run();
	//app.dbconn.testfunct();
});