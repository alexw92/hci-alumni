var express = require('express');
var app = express();
var fs = require('fs');
var SQL = require('sql.js');
var bodyParser = require('body-parser');
var db = null;

try {
	var filebuffer = fs.readFileSync('userdb.sqlite');
	db = new SQL.Database(filebuffer);
	console.log('database loaded');
} catch (e) {
	db = new SQL.Database();
	sqlstr = "CREATE TABLE userdata (userid INTEGER PRIMARY KEY, firstname TEXT, lastname TEXT, address TEXT, postalcode INTEGER, city TEXT, email TEXT, password TEXT, username TEXT);";
	db.run(sqlstr);
	console.log('new database created');
}
// sqlstr = "INSERT INTO userdata(firstname, lastname, address, postalcode, city, email, password, username) VALUES('hans', 'wurst', 'adresse hier', 12345, 'stadt', 'a@b.de', 'blablapass', 'username01');";
// db.run(sqlstr);
// var uname = 'username03'
// var res = db.exec("SELECT firstname, lastname FROM userdata WHERE username='" + uname + "';")
// console.log(res);
// var stmt = db.prepare("SELECT firstname, lastname FROM userdata WHERE username='" + uname + "';");
// stmt.step();
// console.log(stmt.getAsObject());
// stmt.free();
// SELECT * FROM tablename ORDER BY column DESC LIMIT 1;
writeToFile();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.get('/', function (req, res) {
	res.send('Hello World');
});

//get user by username or mail
app.get('/user/:type/:data', function (req, res) {
	if (req.params.type == 'name'){
		var ans = db.exec("SELECT * FROM userdata WHERE username='" + req.params.data + "';");
	} else if(req.params.type == 'mail'){
		var ans = db.exec("SELECT * FROM userdata WHERE email='" + req.params.data + "';");
	}	
	var origin = (req.get('origin') || "*");
	res.header('Access-Control-Allow-Origin', origin);
	res.send(ans);
});

//getNewestUsers
app.get('/newest', function (req, res) {
	var ans = db.exec("SELECT * FROM userdata ORDER BY userid DESC LIMIT 5;");
	var origin = (req.get('origin') || "*");
	res.header('Access-Control-Allow-Origin', origin);
	res.send(ans);
});

//insert new user
app.post('/new', function(req,res){

});



//check if username or mail in use
app.get('/check/:type/:val', function (req, res) {
	if (req.params.type == 'user') {
		console.log('request user wurde gesendet. username: ' + req.params.val + '');
	} else if (req.params.type == 'mail'){
		console.log('request mail wurde gesendet. mailadresse: ' + req.params.val + '');
	}
	// var ans = db.exec("SELECT * FROM userdata ORDER BY userid DESC LIMIT 5;");
	// var origin = (req.get('origin') || "*");
	// res.header('Access-Control-Allow-Origin', origin);
	// res.send(ans);
});

app.post('/', function (req, res) {
	res.send(req.body);
	console.log(req.body);
});


function writeToFile(){
	var data = db.export();
	var buffer = new Buffer(data);
	fs.writeFileSync("userdb.sqlite", buffer);

}


var server = app.listen(3001, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Backend listening at http://%s:%s', host, port);

});