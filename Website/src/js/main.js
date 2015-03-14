/* define global app context */
var app = {
	router: new Router(),
	sqldb: new DatabaseController(),
};

jQuery(function () {
	app.router.run();
	//app.sqldb.testfunct();
});