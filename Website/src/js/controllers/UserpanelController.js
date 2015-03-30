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
		var imageURL = 'img/avatars/user_' + user.image_id + '_f.png';
	 	$('#userPanelImage').attr('src', imageURL);
		console.log('img/avatars/user_' + user.image_id + '_f.png');	
	}
	else if(user.title === 'Herr')
	{
	 	$('#userPanelImage').attr('src', 'img/avatars/user_' + user.image_id + '_m.png');
	}
	
};


