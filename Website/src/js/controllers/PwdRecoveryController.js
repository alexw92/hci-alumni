var PwdRecoveryController = function () {
	this.TAG = 'PwdRecoveryController =>';
    this.pwdRecoveryForm = null;
    this.emailRecoveryForm = null;

    this.pwdRecContainer = $('#pwdRecoveryForm');
    this.emailRecContainer = $('#mailRecoveryForm');

	this.exampleFunction();
	this.initValidationPassword();
	this.initValidationEmail();
	this.bindEvents();
};

PwdRecoveryController.prototype.exampleFunction = function() {
	console.log(this.TAG + 'constructor called');
};

//found on stackoverflow
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

PwdRecoveryController.prototype.coverEmailIdentity = function(userMail){
	var coveredEmailString = userMail,
		positionOfAt = userMail.indexOf('@'),
		positionOfFirstCoveredLetter = 4;
	
	//very short email  e.g. *@mail.de / ***@mail.de
	if(positionOfFirstCoveredLetter >= positionOfAt && positionOfAt != -1)
	{
		for(var iterator = positionOfAt; iterator > 0; iterator--)
		{
			coveredEmailString = coveredEmailString.replaceAt(iterator, '*');
		}
	}
	else //replace every letter between postion 4 and index of '@'
	{
		for(var iterator = positionOfFirstCoveredLetter; iterator < positionOfAt; ++iterator)
		{
			coveredEmailString = coveredEmailString.replaceAt(iterator, '*');
		}
	}
	return coveredEmailString;
};


PwdRecoveryController.prototype.bindEvents = function() {
	var self = this;
	//change password button
	$("#btnSubmitRecoveryPassword").on('click', function(event){
		event.preventDefault();
		self.pwdRecoveryForm.validate();
		if(self.pwdRecoveryForm.isValid())
		{
			var user = new User();
			var dbHandler = new DatabaseHandler();
			var emailToFind = self.pwdRecContainer.find('[name = passwordRecovery]').val();
				
			Spinner.show($('#btnSubmitRecoveryPassword'));
			
			//generate new password
			dbHandler.getUserByEmail(emailToFind, function(response){
				if(response.email == emailToFind)
				{
					//request new password
					var newPassword = '';
					dbHandler.requestNewPassword(response.username, function(rsp){
						if(rsp != '-1')
						{					
							console.log(self.TAG + ' new password set (generated)');
							newPassword = rsp;
							//TODO Email Magic  
							var mailData = {
								recipient: response.firstname + ' ' + response.lastname,
								recipient_mail: response.email,
								username: response.username,
								lastname: response.lastname,
								salutation: response.title,
								password: newPassword
							};
							dbHandler.sendMail('send-password', mailData, function(response){
								if(!response.error)
								{
									setTimeout(function () {
										Spinner.hide($('#btnSubmitRecoveryPassword'));
										$('#feedbackPositiveRecovery').html('Es wurde Ihnen eine E-Mail mit neuen Logindaten zugesendet!');
										$('#feedbackPositiveRecovery').fadeIn('slow');
										$('#feedbackNegativeRecovery').fadeOut('slow');
									}, 1500);	

								}
								else
								{
									console.log(self.TAG + ' sendMail failure');
								}
							});
						}
						else
						{
							console.log(self.TAG + ' response from requestNewPassword was -1');
						}
					});
					//TODO plot email in feedback div / send email to user
				}
				else
				{
					setTimeout(function () {
					Spinner.hide($('#btnSubmitRecoveryPassword'));
					$('#feedbackNegativeRecovery').html('Es tut uns leid, es wurde kein Account zu dieser E-Mail gefunden!');
					$('#feedbackPositiveRecovery').fadeOut('slow');
					$('#feedbackNegativeRecovery').fadeIn('slow');
					$(':input', '#pwdRecoveryForm')
						.not(':button, :submit, :reset, :hidden, :radio')
						.val('');
					self.pwdRecoveryForm.resetForm();
					}, 1500);

				}
			});
		}
		else
		{
			console.log(self.TAG + ' pwd recovery failure');
		}
		
		//$('#pwdRecoveryForm').formValidation('validate');
	});
	$("#btnSubmitRecoveryEmail").on('click', function(event){
		event.preventDefault();
		console.log('email recovery btn clicked');
		self.emailRecoveryForm.validate();
		if(self.emailRecoveryForm.isValid())
		{
			var user = new User(), 
				dbHandler = new DatabaseHandler(),
				userToFind = self.emailRecContainer.find('[name = emailRecovery]').val();
				
			Spinner.show($('#btnSubmitRecoveryEmail'));	

			dbHandler.getUserByUsername(userToFind, function(response){
				if(response.username == userToFind)
				{
					var userMail = response.email;
					console.log(self.TAG + ' user found by username, returning email...');
					//TODO Email Magic  
					var mailData = {
						recipient: response.firstname + ' ' + response.lastname,
						recipient_mail: userMail,
						username: response.username,
						lastname: response.lastname,
						salutation: response.title
					};
					dbHandler.sendMail('send-account', mailData, function(response){
						if(!response.error)
						{
							setTimeout(function () {
							Spinner.hide($('#btnSubmitRecoveryEmail'));
							var coveredEmailString = self.coverEmailIdentity(userMail);
							$('#feedbackPositiveEmailRecovery').html('Es wurde Ihnen eine Nachricht an die E-Mail-Adresse: <b>' + coveredEmailString + '</b>, mit welcher Sie sich registriert haben, gesendet!');
							$('#feedbackPositiveEmailRecovery').fadeIn('slow');
							$('#feedbackNegativeEmailRecovery').fadeOut('slow');
							}, 1500);
						}
						else
						{
							console.log(self.TAG + ' sendMail failure');
						}
					});
				//TODO plot email in feedback div / send email to user
				}
				else
				{
					setTimeout(function () {
						Spinner.hide($('#btnSubmitRecoveryEmail'));
						console.log(self.TAG + ' no user found by username...')
						$('#feedbackNegativeEmailRecovery').html('Es tut uns Leid, es wurde kein Account zu diesem Benutzernamen gefunden!');
						$('#feedbackPositiveEmailRecovery').fadeOut('slow');
						$('#feedbackNegativeEmailRecovery').fadeIn('slow');
						$(':input', '#mailRecoveryForm')
							.not(':button, :submit, :reset, :hidden, :radio')
							.val('');
						self.emailRecoveryForm.resetForm();
					}, 1500);
					
				}

			});
		}
		else
		{
			console.log(self.TAG + ' email recovery failure')
		}


		$('#mailRecoveryForm').formValidation('validate');
	});
};


PwdRecoveryController.prototype.initValidationPassword = function () {
	var pwdRecContainer = $('#pwdRecoveryForm').formValidation({
        framework: 'bootstrap',
        icon: 
		{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        err: 
		{
            // You can set it to popover
            // The message then will be shown in Bootstrap popover
            container: 'tooltip'
        },
        fields: 
		{
            passwordRecovery: 
			{

                validators: 
				{
                    notEmpty: 
					{
                        message: 'Bitte tragen Sie Ihre Email-Adresse ein'
                    },
					emailAddress: 
					{
                        message: 'Dies ist keine gültige Email-Adresse'
                    }
                }
            },
        }
    });
    this.pwdRecoveryForm = pwdRecContainer.data('formValidation');
};
PwdRecoveryController.prototype.initValidationEmail = function () {
	var emailRecContainer = $('#mailRecoveryForm').formValidation({
        framework: 'bootstrap',
        icon: 
		{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        err: 
		{
            // You can set it to popover
            // The message then will be shown in Bootstrap popover
            container: 'tooltip'
        },
        fields: 
		{
            emailRecovery: 
			{

                validators: 
				{
                    notEmpty: 
					{
                        message: 'Bitte tragen Sie Ihren Benutzernamen ein'
                    },
                    stringLength: 
					{
                        min: 7,
                        max: 30,
                        message: 'Ihr Benutzername muss mindestens 7 maximal aber 30 Zeichen lang sein'
                    },
                    regexp: 
					{
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: 'Ihr Benutzername muss aus Buchstaben und Zahlen bestehen und darf nur die Sonderzeichen "Punkt" oder "Unterstrich" enthalten'
                    }					
                }
            },
        }
    });
    this.emailRecoveryForm = emailRecContainer.data('formValidation');
};






















