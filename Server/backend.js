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
writeToFile();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.get('/', function (req, res) {
	res.send('Hello World');
});

app.post('/', function (req, res) {
	res.send(req.body);
	console.log(req.body);
});

app.post('/test', function (req, res) {
	res.send('Das sollte hier aber nicht hin');
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

	console.log('Example app listening at http://%s:%s', host, port);

});