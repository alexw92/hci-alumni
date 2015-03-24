var User = function(resobj){
	var userid = null;
	var title = null;
	var firstname = null;
	var lastname = null;
	var fullname = null;
	var address = null;
	var addressaddition = null;
	var postalcode = null;
	var city = null;
	var email = null;
	var username = null;
	var password = null;
	var birthday = null;
	var company = null;
	var sector = null;
	var state = null;
	var university = null;
	var faculty = null;
	var course = null;
	var study_start = null;
	var study_end = null;
	var interests = null;

	if(resobj !== 'undefined' && typeof(resobj) === 'object') {
		userid = resobj[0];
		title = resobj[1];
		firstname = resobj[2];
		lastname = resobj[3];
		completename = resobj[4];
		address = resobj[5];
		addressaddition = resobj[6];
		postalcode = resobj[7];
		city = resobj[8];
		email = resobj[9];
		username = resobj[10];
		password = resobj[11];
		birthday = resobj[12];
		company = resobj[13];
		sector = resobj[14];
		state = resobj[15];
		university = resobj[16];
		faculty = resobj[17];
		course = resobj[18];
		study_start = resobj[19];
		study_end = resobj[20];
		interests = resobj[21];
	} else {
		//leer initialisiert
	}

	this.toJsonNewUser = function(){
		var shaObj = new jsSHA(password, "TEXT");
		return {title: this.title, firstname: this.firstname, lastname: this.lastname, address: this.address, addressaddition: this.addressaddition, postalcode: this.postalcode, city: this.city,
				email: this.email, username: this.username, password: shaObj.getHash("SHA-512", "HEX"), birthday: this.birthday};
	};

	this.toJson = function(){
		var shaObj = new jsSHA(password, "TEXT");
		return {title: this.title, firstname: this.firstname, lastname: this.lastname, fullname: this.fullname, address: this.address, addressaddition: this.addressaddition, postalcode: this.postalcode, city: this.city,
				email: this.email, username: this.username, password: shaObj.getHash("SHA-512", "HEX"), birthday: this.birthday, company: this.company, sector: this.sector, state: this.state, university: this.university,
				faculty: this.faculty, course: this.course, study_start: this.study_start, study_end: this.study_end, interests: this.interests};
	};

	//Getter
	this.__defineGetter__("userid", function(){
        return userid;
    });
	this.__defineGetter__("title", function(){
        return title;
    });
	this.__defineGetter__("firstname", function(){
        return firstname;
    });
	this.__defineGetter__("lastname", function(){
        return lastname;
    });
	this.__defineGetter__("completename", function(){
        return lastname;
    });
	this.__defineGetter__("address", function(){
        return address;
    });
	this.__defineGetter__("addressaddition", function(){
        return addressaddition;
    });
	this.__defineGetter__("postalcode", function(){
        return postalcode;
    });
	this.__defineGetter__("city", function(){
        return city;
    });
	this.__defineGetter__("email", function(){
        return email;
    });
	this.__defineGetter__("username", function(){
        return username;
    });
	this.__defineGetter__("password", function(){
        return password;
    });
	this.__defineGetter__("birthday", function(){
        return birthday;
    });
	this.__defineGetter__("company", function(){
        return company;
    });
	this.__defineGetter__("sector", function(){
        return sector;
    });
	this.__defineGetter__("state", function(){
        return state;
    });
	this.__defineGetter__("university", function(){
        return university;
    });
	this.__defineGetter__("faculty", function(){
        return faculty;
    });
	this.__defineGetter__("course", function(){
        return course;
    });
	this.__defineGetter__("study_start", function(){
        return study_start;
    });
	this.__defineGetter__("study_end", function(){
        return study_end;
    });
	this.__defineGetter__("interests", function(){
        return interests;
    });

	//Setter
    this.__defineSetter__("userid", function(val){
        userid = val;
    });
	this.__defineSetter__("title", function(val){
        title = val;
    });
	this.__defineSetter__("firstname", function(val){
        firstname = val;
    });
	this.__defineSetter__("lastname", function(val){
        lastname = val;
    });
	this.__defineSetter__("completename", function(val){
        completename = val;
    });
	this.__defineSetter__("address", function(val){
        address = val;
    });
	this.__defineSetter__("addressaddition", function(val){
        addressaddition = val;
    });
	this.__defineSetter__("postalcode", function(val){
        postalcode = val;
    });
	this.__defineSetter__("city", function(val){
        city = val;
    });
	this.__defineSetter__("email", function(val){
        email = val;
    });
	this.__defineSetter__("username", function(val){
        username = val;
    });
	this.__defineSetter__("password", function(val){
        password = val;
    });
	this.__defineSetter__("birthday", function(val){
        birthday = val;
    });
	this.__defineSetter__("company", function(val){
        company = val;
    });
	this.__defineSetter__("sector", function(val){
        sector = val;
    });
	this.__defineSetter__("state", function(val){
        state = val;
    });
	this.__defineSetter__("university", function(val){
        university = val;
    });
	this.__defineSetter__("faculty", function(val){
        faculty = val;
    });
	this.__defineSetter__("course", function(val){
        course = val;
    });
	this.__defineSetter__("study_start", function(val){
        study_start = val;
    });
	this.__defineSetter__("study_end", function(val){
        study_end = val;
    });
	this.__defineSetter__("interests", function(val){
        interests = val;
    });
};

