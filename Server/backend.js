var express = require('express');
var app = express();
var fs = require('fs');
var SQL = require('sql.js');
var bodyParser = require('body-parser');
var db = null;
var emailServer = require('./utils/MailServer.js'),
	EMail = require('./utils/EMail.js');

try {
	var filebuffer = fs.readFileSync('userdb.sqlite');
	db = new SQL.Database(filebuffer);
	console.log('database loaded');
} catch (e) {
	db = new SQL.Database();
	sqlstr = "CREATE TABLE userdata (userid INTEGER PRIMARY KEY, title TEXT NOT NULL, firstname TEXT NOT NULL, lastname TEXT NOT NULL, address TEXT NOT NULL, addressaddition TEXT, postalcode INTEGER NOT NULL, city TEXT NOT NULL, email TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL, birthday TEXT);";
	db.run(sqlstr);
	console.log('new database created');
	//Insert 10 randomly generated data sets to populate the database
	insertDatabasePopulation();
	writeToFile();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use(function(req, res, next) {
	var origin = (req.get('origin') || "*");
    res.setHeader("Access-Control-Allow-Origin", origin);
    return next();
});


//get user by username or mail
//returns json containing the user data
app.get('/user/:type/:data', function (req, res) {
	if (req.params.type == 'name'){
		var ans = db.exec("SELECT * FROM userdata WHERE username='" + req.params.data + "';");
	} else if(req.params.type == 'mail'){
		var ans = db.exec("SELECT * FROM userdata WHERE email='" + req.params.data + "';");
	}
	res.send(ans);
});

//getNewestUsers
//returns json of the newest users
app.get('/newest', function (req, res) {
	var ans = db.exec("SELECT * FROM userdata ORDER BY userid DESC LIMIT 5;");
	res.send(ans);
});

//insert new user
//returns success if the user was inserted successfully, failure otherwise
app.post('/new', function(req,res){
	try {
		var addressadditionString = "";
		var birthdayString = "";
		if (req.body.addressaddition === ""){
			addressadditionString = null;
		} else {
			addressadditionString = "'" + req.body.addressaddition + "'";
		}
		if (req.body.birthday === ""){
			birthdayString = null;
		} else {
			birthdayString = "'" + req.body.birthday + "'";
		}
		sqlstr = "INSERT INTO userdata(title, firstname, lastname, address, addressaddition, postalcode, city, email, username, password, birthday) VALUES('" + 
		req.body.title + "', '" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.address + "'," + addressadditionString + ",'" + req.body.postalcode + "','" + 
		req.body.city + "','" + req.body.email + "','" + req.body.username + "','" + req.body.password + "'," + birthdayString + ");";
		db.run(sqlstr);
		writeToFile();
		res.send('success');
	} catch (err) {
		res.send('failure');
	}
});


//check if username or mail in use
//returns true if username/mail is in use, false otherwise
app.get('/check/:type/:val', function (req, res) {
	if (req.params.type == 'user') {
		var ans = db.exec("SELECT * FROM userdata WHERE username='" + req.params.val + "';");
	} else if (req.params.type == 'mail'){
		var ans = db.exec("SELECT * FROM userdata WHERE email='" + req.params.val + "';");
	}
	if (typeof ans !== 'undefined' && ans.length > 0) {
		res.send('true');
	} else {
		res.send('false');
	}
});


//check if login credentials are valid
//returns true if credentials are valid, false otherwise
app.get('/login/:uname/:passw', function (req, res) {
	var ans = db.exec("SELECT * FROM userdata WHERE username='" + req.params.uname + "' and password='" + req.params.passw + "';");
	if (typeof ans !== 'undefined' && ans.length > 0) {
		res.send('true');
	} else {
		res.send('false');
	}
});


//update user info
app.get('/update/:type/:uname/:newval', function (req, res) {
	try {
		sqlstr = "UPDATE userdata SET " + req.params.type + "='" + req.params.newval + "' WHERE username='" + req.params.uname + "';";
		db.run(sqlstr);
		writeToFile();
		res.send('success');
	} catch (err) {
		res.send('failure');
	}
});


app.post('/sendmail/:type', function (req, res) {
	var mail = new EMail(req.body);
		mail.parseMailType(req.params.type);

	if(!mail.isTypeSupported())
		return res.status(400).send({ error: true, message: 'Unkown mail type parameter in url' });

	mail.verifyRequiredParams(function (result) {
		if(result.error) {
			return res.status(400).send({ error: result.error, message: result.message });
		}
		else {
			mail.build();

			emailServer.connect();
			emailServer.sendMail(mail.getMail(), function (error, result) {
				if(error)
					return res.status(400).send({ error: true, details: error });
				else
					return res.status(200).send({ error: false, details: result });
			});
		}
	});
});

function writeToFile(){
	var data = db.export();
	var buffer = new Buffer(data);
	fs.writeFileSync("userdb.sqlite", buffer);

}


function insertDatabasePopulation(){
	sqlstr = "INSERT INTO userdata(title, firstname, lastname, address, postalcode, city, email, username, password, birthday) " + 
			 "VALUES('Herr','Willhart','Niehoff','Zur Neuen Brücke 36','20963','Rosdorf','wniehoff@mail.de','WNiehoff'," + 
			 "'b8b463ddfe62a6f8454d3d226053babc8bfb2ac0bacf77fa4831311287d24b6573bcfb49f5f4b2f94e0112774ab8729f3f151be5e07cf661c58af506b16a4e5e','03.07.1968')," + 
			 "('Frau','Frauke','Heer','Röntgenstraße 16','10592','Gaukönigshofen','fheer@mail.de','FHeer'," + 
			 "'c459fa5d5a3ce416dd1dfc55cd1feae7b87c2c18d7cd5daaf514dbf474f72392087efdfe8984a433b15b6392529964c0569bcda0e23915eccd5bc0a588ba3368','05.08.1960')," + 
			 "('Frau','Minna','Preuß','Billtalstraße 35','69047','Margetshöchheim','mpreuß@mail.de','MPreuß'," + 
			 "'ef742b85bf318558562b827d65502a375a7b9e83ff6d0f37d9fc73b95f99ddba575faef1470398450f459430e45ac2b306849e8eb43242473f89cab7a3351644','06.10.1953')," + 
			 "('Frau','Eva','Bohnert','Schanzstraße 50','30651','Cramme','ebohnert@mail.de','EBohnert'," + 
			 "'3f57d8e93518d16e1e97834c2d281592bba580185c59db4de4c118e825529daad1c00abd1311bd712ffae2fc858c54a0217057f77d196b4e31c8d8d7473f6b42','10.09.1954')," +
			 "('Herr','Anton','Pickel','Rudolf-Presber-Straße 251','80866','Schnakenbek','apickel@mail.de','APickel'," + 
			 "'c05bcdedc8c289b62634c319debce9427b9949281fdc51ed3ec65f83e6f8c8bc02cfd8569f4a78a1c77a9d7b2eb1a122de3a39a674fed06a5195a0396b893901','27.09.1959')," + 
			 "('Frau','Sibilla','Pawlowski','Andreas-Meyer-Straße 65','10056','Bötzingen','spawlowski@mail.de','SPawlowski'," + 
			 "'cbcfa5cc0d0abe5074ca6b066be3d48ff932955f8e695843cc9c2d390723d350a28b6b6c17bd9e9de92da433796d0c299a8dcd4e86bc26ea7f38decdce54c46b','10.06.1986')," + 
			 "('Herr','Kevin','Pfau','Schönbrunnstraße 8','50252','Unterwaldhausen','kpfau@mail.de','KPfau'," + 
			 "'1f4b117fdc9f3f92d630d0cb8f5682863c0e0ca907e67f1d33d097cd3b968c524cf27a9d8771ed91115f98dbd3d5a0c110e651bdabf9c957f6f6aa1549ed0173','16.09.1986')," + 
			 "('Frau','Heidemarie','Bartsch','Rosa-Luxemburg-Platz 46','20700','Kellenbach','hbartsch@mail.de','HBartsch'," + 
			 "'ee3bda292302438de9f1a3834dc719b2226ec279a1f891c0e12b3508d803e834a22db1b2a0cb01bfe364782db0bb3290584a9f81cecd0a97bae4c4563c6e6499','08.03.1981')," + 
			 "('Herr','Joachim','Traub','Pappelweg 2','20929','Biebersdorf','jtraub@mail.de','JTraub'," + 
			 "'36e161e1fbab23637868953b8290a50c8ecdce61cd30855d5523e9034dbb43c9cc8104e6e7cbc37d9a828a166145601f4652b048729ac8fa8f19db6ec6d7d13b','15.01.1992')," + 
			 "('Herr','Marc','Reiff','Nikolaus-Brum-Straße 950','32003','Salzweg','mreiff@mail.de','MReiff'," + 
			 "'36e161e1fbab23637868953b8290a50c8ecdce61cd30855d5523e9034dbb43c9cc8104e6e7cbc37d9a828a166145601f4652b048729ac8fa8f19db6ec6d7d13b','01.04.1975');";
	db.run(sqlstr);
}


var server = app.listen(3001, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Backend listening at http://%s:%s', host, port);

});