var DatabaseHandler = function () {
	this.TAG = "DatabaseHandler => ";
};	
	
DatabaseHandler.prototype.getUserByEmail = function(mailaddr) {
	$.get('http://localhost:3001/user/mail/' + mailaddr + '', function(response) { 
		// var resobj = response[0]['values'][0];
		// var newuser = new User(resobj);		
		// return newuser;
	});
}

DatabaseHandler.prototype.getUserByUsername = function(username) {
	$.get('http://localhost:3001/user/name/' + username + '', function(response) { 
		// var resobj = response[0]['values'][0];
		// var newuser = new User(resobj);
		// return newuser;
	});
};

DatabaseHandler.prototype.getNewestUsers = function() {
	$.get('http://localhost:3001/newest/', function(response) { 
		// var resobj = response[0]['values'];
		// var uarray = [];
		// for (i=0;i<=4;i++){
			// uarray[i] = new User(resobj[i]);
		// }
		// return uarray;
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
		return response;
	});
}

DatabaseHandler.prototype.checkValidLogin = function(username, password) {
	var shaObj = new jsSHA(password, "TEXT");
	$.get('http://localhost:3001/login/' + username + '/' + shaObj.getHash("SHA-512", "HEX") + '', function(response) { 
		//console.log(response);
	});
}







	

    