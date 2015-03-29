var UserpanelController = function () {
	this.TAG = 'UserpanelController =>';
	

	this.exampleFunction();
	this.loadUserInfo();
	//this.initValidationNewPassword();
	//this.parseURLData(uname, pwd);
	//this.bindEvents();
};

UserpanelController.prototype.exampleFunction = function() {
	console.log(this.TAG + 'constructor called');
};

UserpanelController.prototype.loadUserInfo = function() {
	console.log(this.TAG + ' User Information is about to load');
	var user = Session.getUser();
	console.log(user.title + ' ' + user.image_id);
	//load user image
	if(user.title === 'Frau') 
	{	
		console.log("ich bin hier");	
	 	$('#userImage').attr('src', 'img/avatars/user_' + user.image_id + '_f.png');
		console.log("ich bin hier2");	
	}
	else if(user.title === 'Herr')
	{
	 	$('#userImage').find('.result-image').attr('src', 'img/avatars/user_' + user.image_id + '_m.png');
	}
	
};


