var express = require('express');
var app = express();
var fs = require('fs');
var SQL = require('sql.js');
var db = null;

try {
	var filebuffer = fs.readFileSync('userdb.sqlite');
	db = new SQL.Database(filebuffer);
	console.log('database loaded');
} catch (e) {
	db = new SQL.Database();
	sqlstr = "CREATE TABLE userdata (firstname TEXT, lastname TEXT, address TEXT, postalcode INTEGER, city TEXT, email TEXT, password TEXT, username TEXT);";
	db.run(sqlstr);
	console.log('new database created');
}
writeToFile();

app.get('/', function (req, res) {
	res.send('Hello World');
});

app.post('/', function (req, res) {
	res.send('Hello World');
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