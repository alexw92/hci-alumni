var DatabaseHandler = function () {
	this.TAG = "DatabaseController => ";
	var db = null;
	this.routing = this.init();
};

DatabaseHandler.prototype.init = function() {	
	//loadBinaryFile('./testdb.sqlite');
};

DatabaseHandler.prototype.getUserByEmail = function(mailaddr) {
	$.get('http://localhost:3001/user/mail/' + mailaddr + '', function(response) { 
		//handle the response
	});
}

DatabaseHandler.prototype.getUserByUsername = function(username) {
	$.get('http://localhost:3001/user/name/' + username + '', function(response) { 
		//handle the response
	});
}

DatabaseHandler.prototype.getNewestUsers = function() {
	$.get('http://localhost:3001/newest/', function(response) { 
		//handle the response
	});
}

DatabaseHandler.prototype.insertNewUser = function() {
	$.post('http://localhost:3001/new/' + username + '', function(response) { 
		//handle the response
	});
}

DatabaseHandler.prototype.checkMailInUse = function(mailaddr) {
	$.get('http://localhost:3001/check/mail/' + mailaddr + '', function(response) { 
		//handle the response
	});
}

DatabaseHandler.prototype.checkUsernameInUse = function(username) {
	$.get('http://localhost:3001/check/user/' + username + '', function(response) { 
		//handle the response
	});
}

DatabaseHandler.prototype.testfunct = function(username) {
	$.get('http://localhost:3001/user/' + username + '', function(response) { 
		console.log(response);
	});
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
	

    