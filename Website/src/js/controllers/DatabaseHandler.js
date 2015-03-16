var DatabaseHandler = function () {
	this.TAG = "DatabaseController => ";
	var db = null;
	this.routing = this.init();
};

DatabaseHandler.prototype.init = function() {	
	//loadBinaryFile('./testdb.sqlite');
};

DatabaseHandler.prototype.getUserByEmail = function(mailaddr) {

}

DatabaseHandler.prototype.getUserByUsername = function(username) {

}

DatabaseHandler.prototype.getNewestUsers = function() {

}

DatabaseHandler.prototype.insertNewUser = function() {

}

//used to send SQL string to the Database (not sure if needed)
// DatabaseHandler.prototype.sendSqlQuery = function(sqlstring) {

// }

//used to send other requests (not sure if needed)
// DatabaseHandler.prototype.sendQuery = function(querystring) {

// }


// function loadBinaryFile(path) {		
	// var xhr = new XMLHttpRequest();
	// xhr.open('POST', path, true);
	// xhr.responseType = 'arraybuffer';
	// xhr.onload = function(e) {
		
	// };
	// xhr.send();
// };
	

    