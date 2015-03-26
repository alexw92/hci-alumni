var DatabaseHandler = function () {
	this.TAG = "DatabaseHandler => ";
};

//Returns the User object to the given e-mail address
DatabaseHandler.prototype.getUserByEmail = function(mailaddr, callback) {
	$.get('http://localhost:3001/user/mail/' + mailaddr + '', function(response) {
		var newuser;
		if (typeof response !== 'undefined' && response.length > 0) {
			var resobj = response[0]['values'][0];
			newuser = new User(resobj);
		} else {
			newuser = new User();
		}
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(newuser);
		}
	});
}

//Returns the User object to the given username
DatabaseHandler.prototype.getUserByUsername = function(username, callback) {
	$.get('http://localhost:3001/user/name/' + username + '', function(response) {
		var newuser;
		if (typeof response !== 'undefined' && response.length > 0) {
			var resobj = response[0]['values'][0];
			newuser = new User(resobj);
		} else {
			newuser = new User();
		}
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(newuser);
		}
	});
};

//Returns an array of user objects for the given part of the full name
DatabaseHandler.prototype.getUsersByFullname = function(fullname, callback) {
	$.get('http://localhost:3001/user/fullname/' + fullname + '', function(response) {
		var uarray = [];
		if (typeof response !== 'undefined' && response.length > 0) {
			var resobj = response[0]['values'];
			for (i=0;i<resobj.length;i++){
				uarray[i] = new User(resobj[i]);
			}
		}
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(uarray);
		}
	});
};

//Returns an array of user objects for the given part of the full name
DatabaseHandler.prototype.getUsersExtendedSearch = function(searchjson, callback) {
	$.post('http://localhost:3001/user/extended/', searchjson, function(response) {
		var uarray = [];
		if (typeof response !== 'undefined' && response.length > 0) {
			var resobj = response[0]['values'];
			for (i=0;i<resobj.length;i++){
				uarray[i] = new User(resobj[i]);
			}
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
		var carray = [];
		if (typeof response !== 'undefined' && response.length > 0) {
			var resobj = response[0]['values'];		
			for (i=0;i<resobj.length;i++){
				carray[i] = resobj[i];
			}
		}
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(carray);
		}
	});
};

//Returns list of all Fullnames
DatabaseHandler.prototype.getFullnames = function(callback) {
	$.get('http://localhost:3001/names/', function(response) {
		var narray = [];
		if (typeof response !== 'undefined' && response.length > 0) {
			var resobj = response[0]['values'];
			for (i=0;i<resobj.length;i++){
				narray[i] = resobj[i][0];
			}
		}
		
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(narray);
		}
	});
};

//Returns 'success' if user was unlocked, 'failure' if an error occurred or the user is already unlocked
DatabaseHandler.prototype.unlockUser = function(hashcode, callback){
	$.get('http://localhost:3001/unlock/' + hashcode + '/', function(response) {
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(response);
		}
	});
};

//Returns 'true', if user is unlocked, 'false' otherwise
DatabaseHandler.prototype.isUserUnlocked = function(username, callback){
	$.get('http://localhost:3001/checkul/' + username + '/', function(response) {
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			callback(JSON.parse(response));
		}
	});
};

DatabaseHandler.prototype.requestNewPassword = function(username, callback){
	$.get('http://localhost:3001/reqnewpw/' + username + '/', function(response){
		if (typeof(callback) === 'function' && callback !== 'undefined'){
			if (typeof response !== 'undefined' && response.length > 0) {
				callback(response);
			} else {
				callback('-1');
			}
		}
	});
};
DatabaseHandler.prototype.sendMail = function(type, mailData, callback) {
	var request = $.ajax({
		type: 'POST',
		url: 'http://localhost:3001/sendmail/' + type,
		data: mailData
	});
	
	request.done(function (response) {
		console.log(response);
		if(callback !== 'undefined' && typeof(callback) === 'function') {
			callback(response);
		}
	}); 
	
	request.fail(function (response) {
		console.log(response);
	});
};





