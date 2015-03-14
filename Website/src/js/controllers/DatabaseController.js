var DatabaseController = function () {
	this.TAG = "DatabaseController => ";
	var db = null;
	this.routing = this.init();
};

DatabaseController.prototype.init = function() {	
	loadBinaryFile('./testdb.sqlite');
};

DatabaseController.prototype.testfunct = function() {
	var res = db.exec("SELECT * FROM userdata");
};


function loadBinaryFile(path) {		
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function(e) {
		if (xhr.status == 404) {
			db = new SQL.Database();			
			sqlstr = "CREATE TABLE userdata (firstname TEXT, lastname TEXT, address TEXT, postalcode INTEGER, city TEXT, email TEXT, password TEXT, username TEXT);";
			db.run(sqlstr);
			console.log('new db created');
		} else {
			var data = new Uint8Array(this.response);
			db = new SQL.Database(data);
			console.log('db opened');
		}
	};
	xhr.send();
};
	
function writeBinaryFile(path) {
	var xhr = new XMLHttpRequest();
    xhr.open('POST', path, true); 
	var data = new Uint8Array(db);
    //hmm...
	xhr.send();
};

    