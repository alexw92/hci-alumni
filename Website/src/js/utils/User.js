var User = function(resobj){
	var userid = null;
	var title = null;
	var firstname = null;
	var lastname = null;
	var address = null;
	var addressaddition = null;
	var postalcode = null;
	var city = null; 
	var email = null;
	var username = null;
	var password = null; 
	var birthday = null;
	
	if(resobj !== 'undefined' && typeof(resobj) === 'object') { 
		userid = resobj[0];
		title = resobj[1];
		firstname = resobj[2];
		lastname = resobj[3];
		address = resobj[4];
		addressaddition = resobj[5];
		postalcode = resobj[6];
		city = resobj[7];
		email = resobj[8];
		username = resobj[9];
		password = resobj[10];
		birthday = resobj[11];
	} else { 
		//leer initialisiert
	}
	
	this.toString = function(){
		var shaObj = new jsSHA(password, "TEXT");
		return title + ';' + firstname + ';' + lastname + ';' + address + ';' + addressaddition + ';' + postalcode + ';' + city + ';' + email + ';' + username + ';' + shaObj.getHash("SHA-512", "HEX") + ';' + birthday;
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
};

