var DatabaseHandler = function () {
	this.TAG = "DatabaseHandler => ";
};

//Returns the User object to the given e-mail address
DatabaseHandler.prototype.getUserByEmail = function(mailaddr, callback) {
	$.get('http://localhost:3001/user/mail/' + mailaddr + '', function(response) {
		var resobj = response[0]['values'][0];
		var newuser = new User(resobj);
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(newuser);
		}
	});
}

//Returns the User object to the given username
DatabaseHandler.prototype.getUserByUsername = function(username, callback) {
	$.get('http://localhost:3001/user/name/' + username + '', function(response) {
		var resobj = response[0]['values'][0];
		var newuser = new User(resobj);
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(newuser);
		}
	});
};

//Returns an array of user objects for the given part of the full name
DatabaseHandler.prototype.getUsersByFullname = function(fullname, callback) {
	$.get('http://localhost:3001/user/fullname/' + fullname + '', function(response) {
		var resobj = response[0]['values'];
		var uarray = [];
		for (i=0;i<resobj.length;i++){
			uarray[i] = new User(resobj[i]);
		}
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(uarray);
		}
	});
};

//Returns an array of User objects
DatabaseHandler.prototype.getNewestUsers = function(callback) {
	$.get('http://localhost:3001/newest/', function(response) {
		var resobj = response[0]['values'];
		var uarray = [];
		for (i=0;i<=4;i++){
			uarray[i] = new User(resobj[i]);
		}
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(uarray);
		}
	});
}

//Insert new user into the Database
//Returns 'success' if the user was created successfully, 'failure' otherwise
DatabaseHandler.prototype.insertNewUser = function(userobj,callback) {
	$.post('http://localhost:3001/new/', userobj.toJsonNewUser(), function(response) { 
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(response);
		}
	});
}

//Returns 'true' if e-mail address is already in use, 'false' otherwise
DatabaseHandler.prototype.checkMailInUse = function(mailaddr, callback) {
	$.get('http://localhost:3001/check/mail/' + mailaddr + '', function(response) {
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(JSON.parse(response));
		}
	});
}

//Returns 'true' if username is already in use, 'false' otherwise
DatabaseHandler.prototype.checkUsernameInUse = function(username, callback) {
	$.get('http://localhost:3001/check/user/' + username + '', function(response) {
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(JSON.parse(response));
		}
	});
}

//Returns 'true' if login credentials are valid, 'false' otherwise
DatabaseHandler.prototype.checkValidLogin = function(username, password, callback) {
	var shaObj = new jsSHA(password, "TEXT");
	$.get('http://localhost:3001/login/' + username + '/' + shaObj.getHash("SHA-512", "HEX") + '', function(response) {
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(JSON.parse(response));
		}
	});
}

//Update User Information
//Returns 'success' if information was updated successfully, 'failure' otherwise
DatabaseHandler.prototype.updateUserinfo = function(type, username, newval, callback){
	if (type == "password"){
		var shaObj = new jsSHA(newval, "TEXT");
		newval = shaObj.getHash("SHA-512", "HEX");
	} 
	$.get('http://localhost:3001/update/' + type + '/' + username + '/' + newval + '', function(response) { 
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(response);
		}
	});
}

//Returns list of all courses
DatabaseHandler.prototype.getCourses = function(callback) {
	$.get('http://localhost:3001/courses/', function(response) {
		var resobj = response[0]['values'];
		var carray = [];
		for (i=0;i<resobj.length;i++){
			carray[i] = resobj[i][0];
		}
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(carray);
		}
	});
};

//Returns list of all courses
DatabaseHandler.prototype.getFullnames = function(callback) {
	$.get('http://localhost:3001/names/', function(response) {
		var resobj = response[0]['values'];
		var narray = [];
		for (i=0;i<resobj.length;i++){
			narray[i] = resobj[i][0];
		}
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(narray);
		}
	});
};







