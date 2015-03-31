var express = require('express');
var app = express();
var fs = require('fs');
var SQL = require('sql.js');
var bodyParser = require('body-parser');
var db = null;
var emailServer = require('./utils/MailServer.js'),
	EMail = require('./utils/EMail.js');
var chance = require('chance').Chance();
var jsSHA = require('jssha');


try {
	var filebuffer = fs.readFileSync('userdb.sqlite');
	db = new SQL.Database(filebuffer);
	console.log('database loaded');
} catch (e) {
	db = new SQL.Database();
	sqlstr = "CREATE TABLE userdata (userid INTEGER PRIMARY KEY, title TEXT NOT NULL, firstname TEXT NOT NULL, lastname TEXT NOT NULL, completename TEXT NOT NULL, address TEXT NOT NULL, addressaddition TEXT, postalcode INTEGER NOT NULL, city TEXT NOT NULL, email TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL, birthday TEXT, company TEXT, sector TEXT, state TEXT, university TEXT, faculty TEXT, course TEXT, study_start INTEGER, study_end INTEGER, interests TEXT, image_id INTEGER, is_unlocked TEXT);";
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


//get user by username or mail or (part of) fullname
//returns json containing the user data
app.get('/user/:type/:data', function (req, res) {
	if (req.params.type == 'name'){
		var ans = db.exec("SELECT * FROM userdata WHERE username='" + req.params.data + "';");
	} else if (req.params.type == 'mail'){
		var ans = db.exec("SELECT * FROM userdata WHERE email='" + req.params.data + "';");
	} else if (req.params.type == 'fullname'){
		var ans = db.exec("SELECT * FROM userdata WHERE completename LIKE '%" + req.params.data + "%';");
	}
	res.send(ans);
});

app.post('/user/extended', function(req,res){
	var optionstring = "";
	if (req.body.name !== ""){
		optionstring = optionstring + "AND completename like '%" + req.body.name + "%' ";
	}
	if (req.body.interests !== ""){
		optionstring = optionstring + "AND interests like '%" + req.body.interests + "%' ";
	}
	if (req.body.street !== ""){
		optionstring = optionstring + "AND address like '%" + req.body.street + "%' ";
	}
	if (req.body.city !== ""){
		optionstring = optionstring + "AND city like '%" + req.body.city + "%' ";
	}
	if (req.body.postalcode !== ""){
		optionstring = optionstring + "AND postalcode like '%" + req.body.postalcode + "%' ";
	}
	if (req.body.company !== ""){
		optionstring = optionstring + "AND company like '%" + req.body.company + "%' ";
	}
	if (req.body.sector !== ""){
		optionstring = optionstring + "AND sector like '%" + req.body.sector + "%' ";
	}
	if (req.body.state !== ""){
		optionstring = optionstring + "AND state like '%" + req.body.state + "%' ";
	}
	if (req.body.university !== ""){
		optionstring = optionstring + "AND university like '%" + req.body.university + "%' ";
	}
	if (req.body.faculty !== ""){
		optionstring = optionstring + "AND faculty like '%" + req.body.faculty + "%' ";
	}
	if (req.body.study_start !== ""){
		optionstring = optionstring + "AND study_start='" + req.body.study_start + "' ";
	}
	if (req.body.study_end !== ""){
		optionstring = optionstring + "AND study_end='" + req.body.study_end + "' ";
	}

	var ans = db.exec("SELECT * FROM userdata WHERE firstname like '%%' " + optionstring + ";");
	res.send(ans);
});

//getNewestUsers
//returns json of the newest users
app.get('/newest', function (req, res) {
	var ans = db.exec("SELECT * FROM userdata ORDER BY userid DESC LIMIT 5;");
	res.send(ans);
});

app.post('/reqnewpw/:uname', function(req,res){
	var newtemppw = chance.character({pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'}) + chance.character({pool: 'abcdefghijklmnopqrstuvwxyz'}) + chance.natural({min: 0, max: 9}) + chance.hash({length: 10});
	var shaObj = new jsSHA(newtemppw, "TEXT");
	var pwhash = shaObj.getHash("SHA-512", "HEX");
	sqlstr = "UPDATE userdata SET password='" + pwhash + "' WHERE username='" + req.params.uname + "';";
	db.run(sqlstr);
	writeToFile();
	res.send(newtemppw);
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
		var reghash = chance.hash({length: 15});
		sqlstr = "INSERT INTO userdata(title, firstname, lastname, completename, address, addressaddition, postalcode, city, email, username, password, birthday, image_id, is_unlocked) VALUES('" + 
		req.body.title + "', '" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.firstname + " " + req.body.lastname + "','" + req.body.address + "'," + addressadditionString + ",'" + req.body.postalcode +
		"','" + req.body.city + "','" + req.body.email + "','" + req.body.username + "','" + req.body.password + "'," + birthdayString + ",'" + chance.natural({min: 1, max: 7}) + "','" + reghash + "');";
		db.run(sqlstr);
		writeToFile();
		res.send({msg: 'success', hash: reghash});
	} catch (err) {
		res.send({msg: 'failure', hash: ''});
	}
});


//check if username or mail in use
//returns true if username/mail is in use, false otherwise
app.get('/check/:type/:val', function (req, res) {
	if (req.params.type == 'user') {
		//check if username is in use somewhere else as username or email, since both username and email are allowed to log in
		var ans = db.exec("SELECT * FROM userdata WHERE username='" + req.params.val + "';");
		var ans2 = db.exec("SELECT * FROM userdata WHERE email='" + req.params.val + "';");
	} else if (req.params.type == 'mail'){
		var ans = db.exec("SELECT * FROM userdata WHERE email='" + req.params.val + "';");
		var ans2;
	}
	if ((typeof ans !== 'undefined' && ans.length > 0) || (typeof ans2 !== 'undefined' && ans2.length > 0)) {
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
		var ans = db.exec("SELECT * FROM userdata WHERE email='" + req.params.uname + "' and password='" + req.params.passw + "';");
		if (typeof ans !== 'undefined' && ans.length > 0) {
			res.send('true');
		} else {
			res.send('false');
		}
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


//get list of all unique courses (studiengänge)
app.get('/courses',function(req,res) {
	var ans = db.exec("SELECT course, count(course) FROM userdata GROUP BY course;");
	res.send(ans);
});


//get all names
app.get('/names',function(req,res) {
	var ans = db.exec("SELECT completename FROM userdata;");
	res.send(ans);
});


//Unlock user by unlock-code
app.get('/unlock/:hash', function(req,res){
	try {
		var ans = db.exec("SELECT is_unlocked FROM userdata WHERE is_unlocked='" + req.params.hash + "';");
		if (typeof ans !== 'undefined' && ans.length > 0) {
			sqlstr = "UPDATE userdata set is_unlocked = 1 WHERE is_unlocked='" + req.params.hash + "';";
			db.run(sqlstr);
			writeToFile();
			res.send('success');
		} else {
			res.send('failure');
		}
	} catch (err) {
		res.send('failure');
	}
});

//Check if user is unlocked
app.get('/checkul/:uname', function(req,res){
	var ans = db.exec("SELECT is_unlocked FROM userdata WHERE username='" + req.params.uname + "';");
	if (typeof ans !== 'undefined' && ans.length > 0) {
		if (ans[0]['values'][0][0] == 1){
			res.send('true')
		} else {
			res.send('false');
		}
	} else {
		var ans2 = db.exec("SELECT is_unlocked FROM userdata WHERE email='" + req.params.uname + "';");
		if (typeof ans2 !== 'undefined' && ans2.length > 0) {
			if (ans2[0]['values'][0][0] == 1){
				res.send('true')
			} else {
				res.send('false');
			}
		} else {
			res.send('false');
		}
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


var server = app.listen(3001, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Backend listening at port %s', port);
});


function insertDatabasePopulation(){
	sqlstr = "INSERT INTO userdata(title, firstname, lastname, completename, address, postalcode, city, email, username, " + 
			 "password, birthday, company, sector, state, " + 
			 "university, faculty, course, study_start, study_end, interests, image_id, is_unlocked) " + 
			 "VALUES('Herr','Willhart','Niehoff','Willhart Niehoff','Zur Neuen Brücke 36','20963','Rosdorf','wniehoff@mail.de','WNiehoff'," + 
			 "'b8b463ddfe62a6f8454d3d226053babc8bfb2ac0bacf77fa4831311287d24b6573bcfb49f5f4b2f94e0112774ab8729f3f151be5e07cf661c58af506b16a4e5e','03.07.1968','Sparkasse','Bank','Bayern'," + 
			 "'Julius-Maximilians-Universität Würzburg','Mathemathik und Informatik','Mathematik','1990','1996','Lesen;Rad fahren;Wandern','1','1')," + 
			 "('Frau','Inga','Fellner','Inga Fellner','Münzmeisterstraße 8','68049','Metzels','ifellner@mail.de','IFellner'," + 
			 "'99ed2a765dbe032906c38491af0a4773fc09e901712a7da61bb45fec98623a8c74f3438af83f49258e4097871fbb436cad72138cd21b6f368461de5b25fdf694','21.07.1983','Bayer','Pharmazeutische Industrie','Baden-Württemberg'," + 
			 "'Julius-Maximilians-Universität Würzburg','Physik','Physik','2003','2007','Rad fahren','1','1')," + 
			 "('Frau','Holle','Lechner','Holle Lechner','Eichendorffstraße 7','33039','Bendestorf','hlechner@mail.de','HLechner'," + 
			 "'daa748d8d7b883e6da719bb532ff64fc746c411a0d388d889127046aa10a64a90da289536a037911dd2c3f5c28e388f8810d3042c3b2a14a425b8993eda8809e','30.01.1954','','','Nordrhein-Westfalen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Mathemathik und Informatik','Mathematische Physik','1975','1980','Musik','2','1')," + 
			 "('Herr','Michl','Scheele','Michl Scheele','Henry-Budge-Straße 25','50140','Medlingen','mscheele@mail.de','MScheele'," + 
			 "'b43274bb852ea2b3fde6565017a49f3ba03b0f95bd5c836879b040bfd0483910dff28f0ff7ac898f51513f80c42e2bfe2c1607bc19c1e97a795f556f4c8836df','18.08.1967','','','Nordrhein-Westfalen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Chemie','Lebensmittelchemie','1990','1995','Schmiedekunst','3','1')," + 
			 "('Herr','Markus','Tillmann','Markus Tillmann','Josef-Eicher-Straße 69','60259','Diez','mtillmann@mail.de','MTillmann'," + 
			 "'7bb9e9dd440083518d36de49841e77ba027f8cf962b8f1c2b7142bafe8120e6fbda60cfceedd60848affa0608f9da880324748a639cb41e530448a188fc2a946','10.11.1986','','','Saarland'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Geologie','2004','2009','Bogenbau','4','1')," + 
			 "('Frau','Bettina','Bender','Bettina Bender','Lübeckertordamm 26','80064','Heuchlingen','bbender@mail.de','BBender'," + 
			 "'18a70ac623ee039f55786917a9961dfdf57841f1bc65738716fdec89fe9f9d447d86ac26f47afc350849bed88e65091dbd3311f78ec41ccc2c40e151515e0e85','20.05.1966','','','Bayern'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Amerikanische Geschichte','1985','1990','Bogenschießen','5','1')," + 
			 "('Frau','Hannerose','Hackl','Hannerose Hackl','Carolaplatz 9','69069','Behlendorf','hhackl@mail.de','HHackl'," + 
			 "'cfb57f2b9358147002710c5db272f927820c15b2a1f7bb5c7f6b9edcadfab0723affecb4c2aa3f8971c09a5a8dbb8ac963004a050faa43746489c09e6d75357d','07.03.1947','','','Baden-Württemberg'," + 
			 "'Julius-Maximilians-Universität Würzburg','Physik','Physik','1975','1978','Lesen','6','1')," + 
			 "('Frau','Else','Welte','Else Welte','Dringsheide 7','20415','Sallneck','ewelte@mail.de','EWelte'," + 
			 "'d7d21bef0167dc499a35da3b81c4e8cb623ad553a9fcb748a9bb40df13380f2fdf41fbdbfa8cd840190654d6c7078ec647f565a46105e4a5d732a4b57589b7e5','27.02.1974','','','Niedersachsen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Mathemathik und Informatik','Medieninformatik','1992','1998','Musik hören','7','1')," + 
			 "('Herr','Aloysius','Schier','Aloysius Schier','Fritz-Erler-Straße 59','20481','Treffurt','aschier@mail.de','ASchier'," + 
			 "'296b0f17e9d3d13ff3af4912e3b4fb366de6937f31ef57d8698dc35deaf7c19d4321674311a42a292949f2f8ec6516b85b6a084821e9317596729094be6b0ad8','05.01.1980','','','Sachsen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Biologie','Biologie','2000','2003','Rad fahren','6','1')," + 
			 "('Herr','Timon','Dahlmann','Timon Dahlmann','Binzer Weg 7','30919','Krampfer','tdahlmann@mail.de','TDahlmann'," + 
			 "'bccc03ca118e37d39d5cff4be5527266a112ceba2819e500469f9f30a5167379af5b2584030fc9d2df0356e1d96b7b2c93dc7b2589a4a6051790ce5ad7642886','19.08.1958','','','Niedersachsen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Geologie','1977','1981','Schwimmen','7','1')," + 
			 "('Frau','Editha','Behn','Editha Behn','Else-Sander-Straße 59','50634','Owschlag','ebehn@mail.de','EBehn'," + 
			 "'9a87ddfcdc2dc9b4683e7b1da8d88f8fecf446fe08e0c61819d887e1f3dc7e2cf3996a436e60fd40297ea81c4481d64365fffd0da43b7ad445b0778a760aef7a','25.08.1955','','','Nordrhein-Westfalen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Ägyptologie','1973','1978','Joggen','4','1')," + 
			 "('Herr','Merlin','Angermann','Merlin Angermann','Sternweg 14','30305','Immendingen','mangermann@mail.de','MAngermann'," + 
			 "'7bd090fd17570cc8034e0ef051dfe5c97889db6cbe9482ff6011b6780c0857b048bf1b654a0b51a7a2035720a536aebfeecf177d9a780c5031897740ddf6362f','12.11.1973','','','Hessen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Chemie','Lebensmittelchemie','1995','2000','Oldtimer sammeln','1','1')," + 
			 "('Frau','Imke','Gärtner','Imke Gärtner','Storchsgasse 81','30031','Jesendorf','igärtner@mail.de','IGärtner'," + 
			 "'5ceb06b3fa0a9df35d7a0bdb3a71a4b31175cc4cb99c0ff4173a404aca57589fdabcbc7e5c013692f4d32bcf9feb571a4eb8a140e33fcbb2df376e8656ffdaf8','11.11.1957','','','Rheinland-Pfalz'," + 
			 "'Julius-Maximilians-Universität Würzburg','Mathemathik und Informatik','Mathematik','1977','1982','','5','1')," + 
			 "('Frau','Roswitha','Preiß','Roswitha Preiß','Konrad-Kreutzer-Straße 9','12008','Dinkelscherben','rpreiß@mail.de','RPreiß'," + 
			 "'bf5f0b592ecc0268cbae1a1d3ec4359987f03c7335c735f1b41eec99805faeaeed9764779814824943005e514ecbe8ee3111415db0de8bad5ea247c074b6b893','26.06.1975','Stadtverwaltung Würzburg','Öffentlicher Dienst','Berlin'," + 
			 "'Julius-Maximilians-Universität Würzburg','Mathemathik und Informatik','Mathematik','1994','1998','Lesen','2','1')," + 
			 "('Frau','Elfrieda','Graßl','Elfrieda Graßl','In der Warth 7','60393','Kronprinzenkoog','egraßl@mail.de','EGraßl'," + 
			 "'e9e4608be1d2b337cdecebded349e5e822871c8c5feba67e91d57231bf7e4f0bff7eb0748f270530f2d341119bc5f96d9a7b23b441942402751326a22b06cbc5','08.03.1953','Sparkasse','Bank','Hessen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philologie','Germanistik','1975','1981','Wandern','3','1')," + 
			 "('Herr','Folkhart','Bendel','Folkhart Bendel','Spökelbarg 2','40324','Oelsnitz/Erzgebirge','fbendel@mail.de','FBendel'," + 
			 "'87cd6577d47fa35b1a200b91deff29d789451d0819a08743770d5e07c87409bc697a11826f6f7f830c5cdb375be2ae71ee6e166f61c733701110b2b3431818b5','17.05.1949','SAP','IT','Nordrhein-Westfalen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Chemie','Lebensmittelchemie','1969','1976','Laufen','4','1')," + 
			 "('Herr','Ingobert','Rüter','Ingobert Rüter','Flurstraße 33','33047','Oberlascheid','irüter@mail.de','IRüter'," + 
			 "'4bb1c8469ddf7ad6ddbe4f08f353d56951b4718162493e88e7efda70e766af1ad02c70cd9d833d88e4e9f16e33bebfc8e1865223ba4684f5cf6fbd0192dc8184','29.09.1963','Google Deutschland','IT','Nordrhein-Westfalen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Mathemathik und Informatik','Informatik','1983','1988','Schwimmen','5','1')," + 
			 "('Frau','Evelinde','Frank','Evelinde Frank','Rudolf-Trache-Straße 6','20191','Luckau','efrank@mail.de','EFrank'," + 
			 "'7c704581496bb55d41a1b680a89ace91b5fbe846e3b201f743f747d73c2a19588e2d544f6fe8503a2a38089fa2e9dbb06a221fd05dd3c1c125a51bcaf0f235de','28.05.1952','Gymnasium Würzburg','Öffentlicher Dienst','Sachsen-Anhalt'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philologie','Deutsch/Englisch Lehramt','1973','1979','Kino','6','abcdef')," + 
			 "('Frau','Rosalie','Buhr','Rosalie Buhr','Auf der Brandshofer Schleuse 14','36046','Rastenberg','rbuhr@mail.de','RBuhr'," + 
			 "'07decd49687ca2ae9a28f17cc141094fda68d980ce9e2fe97228ce343b0c2cfe05038e38674409bea684dc00fd7efddd83c4065c8f071227b7c330d54d73a5cf','16.04.1976','Hotel- und Gaststättenverband Rheinland-Pfalz','Hotelgewerbe','Thüringen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Philosophie','1994','1997','Oper','7','1')," + 
			 "('Herr','Clemens','Knorr','Clemens Knorr','Am Landigt 10','12060','Filz','cknorr@mail.de','CKnorr'," + 
			 "'b23aa3b5022adcc2c565a85c08c11fb54bfbde182ffb9b19165ddd371d60c50b7a57d882ae9acb7dcef6ac0d056b96a895264c355fbf820941f1d041fcb642aa','03.06.1954','Sparkasse','Bank','Berlin'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Europäische Geschichte','1974','1982','Theater','6','1')," + 
			 "('Frau','Elly','Schilling','Elly Schilling','Zwinglistraße 9','30072','Wintzigerode','eschilling@mail.de','ESchilling'," + 
			 "'e93ed183546d9b1e4c78826b9c490750e793c987baa3362a0dfc6629b7e816570d16415bff3182bd831e634fee3a68727524d11ede1ed56ae46c3ae0fbc49392','11.02.1957','Datev','IT','Hessen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Geologie','1976','1980','Kitesurfen','5','1')," + 
			 "('Herr','Rotger','Fengler','Rotger Fengler','Käferstieg 15','20019','Wettenberg','rfengler@mail.de','RFengler'," + 
			 "'bf331ad246843ce828a5fe35fda8bb18c142625167b9a898333d5b1add36b03bee921078c81f306b625f8e642be9e6bc25a9e5a79196ca079f3fa0435899baa9','01.04.1965','Bayer','Pharmazeutische Industrie','Hamburg'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Amerikanistik','1983','1987','Motorrad fahren','4','1')," + 
			 "('Frau','Sieglinde','Kiesel','Sieglinde Kiesel','Oliverstraße 90','12022','Pürgen','skiesel@mail.de','SKiesel'," + 
			 "'07fd0f54ed74d835e293330dd54356dd672fe7f1b4d7ba58dbd1cd5ce2ab95e411f46c3495f914854667995ae0ce7a2c8058f5466b8fa3867e18421da3c07510','03.03.1963','Standesamt Nürnberg','Öffentlicher Dienst','Berlin'," + 
			 "'Julius-Maximilians-Universität Würzburg','Biologie','Biologie','1983','1987','Lesen','2','1')," + 
			 "('Frau','Erltrud','Jüttner','Erltrud Jüttner','An der Hufe 38','60853','Vierlinden','ejüttner@mail.de','EJüttner'," + 
			 "'8cfa05dd1a378cf22fbf28c7b523a5c61c4f75768f0a219826f3fb25d301cdc9da85075e6185824b017a760fc4485c4f3b9bbfd346d4666f34ea32aa94dac736','08.10.1963','','','Saarland'," + 
			 "'Julius-Maximilians-Universität Würzburg','Physik','Physik','1987','1991','Lesen','2','1')," + 
			 "('Frau','Amelie','Rudolf','Amelie Rudolf','Am Elbblick 18','70721','Bechtsrieth','arudolf@mail.de','ARudolf'," + 
			 "'30f199d515e7f375ce31393d8afc55a4e0e4b708eaa4b3b78ec16bdef09374641a1181f324dadaa676e93c1a75d5d7571533822a18fa214feb4c1ed0c833b306','03.01.1977','Datev','IT','Baden-Württemberg'," + 
			 "'Julius-Maximilians-Universität Würzburg','Mathemathik und Informatik','Mathematik','1997','2005','Musicals','1','1')," + 
			 "('Herr','Dietger','Specht','Dietger Specht','Marsdorfer Straße 27','90798','Grimma','dspecht@mail.de','DSpecht'," + 
			 "'cad1a659946ec7039f7904975778e4d413b135ec2cd380b8c3495289a9d440fde2cbcae7ebdbfc47b94df6f72cdab20251df5dda79f477800fd1a5c120337f85','14.10.1976','Sparkasse','Bank','Bayern'," + 
			 "'Julius-Maximilians-Universität Würzburg','Chemie','Organische Chemie','1999','2004','Lesen','6','1')," + 
			 "('Frau','Frauke','Heer','Frauke Heer','Röntgenstraße 16','10592','Gaukönigshofen','fheer@mail.de','FHeer'," + 
			 "'c459fa5d5a3ce416dd1dfc55cd1feae7b87c2c18d7cd5daaf514dbf474f72392087efdfe8984a433b15b6392529964c0569bcda0e23915eccd5bc0a588ba3368','05.08.1960','NASA','Raumfahrt','Hamburg'," + 
			 "'Julius-Maximilians-Universität Würzburg','Physik','Physik','1983','1987','Tanzen;Musicals','1','0')," + 
			 "('Frau','Minna','Preuß','Minna Preuß','Billtalstraße 35','69047','Margetshöchheim','mpreuß@mail.de','MPreuß'," + 
			 "'ef742b85bf318558562b827d65502a375a7b9e83ff6d0f37d9fc73b95f99ddba575faef1470398450f459430e45ac2b306849e8eb43242473f89cab7a3351644','06.10.1953','DLR','Luft- und Raumfahrt','Berlin'," + 
			 "'Julius-Maximilians-Universität Würzburg','Physik','Physik','1978','1984','Tanzen;Musicals','2','1')," + 
			 "('Frau','Eva','Bohnert','Eva Bohnert','Schanzstraße 50','30651','Cramme','ebohnert@mail.de','EBohnert'," + 
			 "'3f57d8e93518d16e1e97834c2d281592bba580185c59db4de4c118e825529daad1c00abd1311bd712ffae2fc858c54a0217057f77d196b4e31c8d8d7473f6b42','10.09.1954','Pergamonmuseum','Museum','Rheinland-Pfalz'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Ägyptologie','1977','1982','Musicals;Ausgrabungen;Dokumentarfilme','3','1')," +
			 "('Herr','Anton','Pickel','Anton Pickel','Rudolf-Presber-Straße 251','80866','Schnakenbek','apickel@mail.de','APickel'," + 
			 "'c05bcdedc8c289b62634c319debce9427b9949281fdc51ed3ec65f83e6f8c8bc02cfd8569f4a78a1c77a9d7b2eb1a122de3a39a674fed06a5195a0396b893901','27.09.1959','Pergamonmuseum','Museum','Hessen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Geschichte','1979','1984','Historienfilme','2','1')," + 
			 "('Frau','Sibilla','Pawlowski','Sibilla Pawlowski','Andreas-Meyer-Straße 65','10056','Bötzingen','spawlowski@mail.de','SPawlowski'," + 
			 "'cbcfa5cc0d0abe5074ca6b066be3d48ff932955f8e695843cc9c2d390723d350a28b6b6c17bd9e9de92da433796d0c299a8dcd4e86bc26ea7f38decdce54c46b','10.06.1986','SAP','IT','Thüringen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Mathematik und Informatik','Informatik','2007','2012','C;C++;Python','5','1')," + 
			 "('Herr','Kevin','Pfau','Kevin Pfau','Schönbrunnstraße 8','50252','Unterwaldhausen','kpfau@mail.de','KPfau'," + 
			 "'1f4b117fdc9f3f92d630d0cb8f5682863c0e0ca907e67f1d33d097cd3b968c524cf27a9d8771ed91115f98dbd3d5a0c110e651bdabf9c957f6f6aa1549ed0173','16.09.1986','GI','Geoinformatik','Mecklenburg-Vorpommern'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Geologie','2005','2012','Ausgrabungen;Kunsthistorie','7','1')," + 
			 "('Frau','Heidemarie','Bartsch','Heidemarie Bartsch','Rosa-Luxemburg-Platz 46','20700','Kellenbach','hbartsch@mail.de','HBartsch'," + 
			 "'ee3bda292302438de9f1a3834dc719b2226ec279a1f891c0e12b3508d803e834a22db1b2a0cb01bfe364782db0bb3290584a9f81cecd0a97bae4c4563c6e6499','08.03.1981','Mauermuseum','Museum','Baden-Württemberg'," + 
			 "'Julius-Maximilians-Universität Würzburg','Philosophische Fakultät','Geschichte','2002','2007','Actionfilme;Motorradreisen','6','1')," + 
			 "('Herr','Joachim','Traub','Joachim Traub','Pappelweg 2','20929','Biebersdorf','jtraub@mail.de','JTraub'," + 
			 "'36e161e1fbab23637868953b8290a50c8ecdce61cd30855d5523e9034dbb43c9cc8104e6e7cbc37d9a828a166145601f4652b048729ac8fa8f19db6ec6d7d13b','15.01.1992','SAP','IT','Bayern'," + 
			 "'Julius-Maximilians-Universität Würzburg','Mathematik und Informatik','Mensch-Computer-Interaktion','2010','2014','Segelfiegen;Musik','4','1')," + 
			 "('Herr','Marc','Reiff','Marc Reiff','Nikolaus-Brum-Straße 950','32003','Salzweg','mreiff@mail.de','MReiff'," + 
			 "'4a5aa0a60965b6b2ee4d4bd0484dbc6acb4633ea054f4b44daf67dc534f9f28dd116895bd9fe274045b5fe60dcaccb8a636521fcedc4cafde2219dd7df8620c7','01.04.1975','Bayer','Pharmazeutische Industrie','Nordrhein-Westfalen'," + 
			 "'Julius-Maximilians-Universität Würzburg','Chemie','Lebensmittelchemie','1999','2003','Italienisches Essen','4','1');";
	db.run(sqlstr);
}
