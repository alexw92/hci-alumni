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

PwdRecoveryController.prototype.bindEvents = function() {
	var self = this;
	console.log(this.TAG + 'submit');
	$("#btnSubmitRecoveryPassword").on('click', function(event){
		event.preventDefault();
		console.log('password recovery btn clicked');
		self.pwdRecoveryForm.validate();
		if(self.pwdRecoveryForm.isValid())
		{
			var user = new User();
			var dbHandler = new DatabaseHandler();
			var emailToFind = self.pwdRecContainer.find('[name = passwordRecovery]').val();
			
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
								console.log(response);
								if(!response.error)
								{
									$('#feedbackPositiveRecovery').html('Es wurde Ihnen eine E-Mail mit neuen Logindaten zugesendet!');
									$('#feedbackPositiveRecovery').fadeIn('slow');
									$('#feedbackNegativeRecovery').fadeOut('slow');
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
					console.log(self.TAG + ' no User object found by email');
					$('#feedbackNegativeRecovery').html('Es tut uns leid, es wurde kein Account zu dieser E-Mail gefunden!');
					$('#feedbackPositiveRecovery').fadeOut('slow');
					$('#feedbackNegativeRecovery').fadeIn('slow');
					//TODO plot failure of finding email in database to feedback div
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

				dbHandler.getUserByUsername(userToFind, function(response){
					if(response.username == userToFind)
					{
						console.log(self.TAG + ' user found by username, returning email...');
						//TODO Email Magic  
						var mailData = {
							recipient: response.firstname + ' ' + response.lastname,
							recipient_mail: response.email,
							username: response.username,
							lastname: response.lastname,
							salutation: user.title
						};
						dbHandler.sendMail('send-account', mailData, function(response){
							if(!response.error)
							{
								$('#feedbackPositiveEmailRecovery').html('Es wurde Ihnen eine Nachricht an die E-Mail-Adresse, mit welcher Sie sich registriert haben, gesendet!');
								$('#feedbackPositiveEmailRecovery').fadeIn('slow');
								$('#feedbackNegativeEmailRecovery').fadeOut('slow');
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
						console.log(self.TAG + ' no user found by username...')
						$('#feedbackNegativeEmailRecovery').html('Es tut uns Leid, es wurde kein Account zu diesem Benutzernamen gefunden!');
						$('#feedbackPositiveEmailRecovery').fadeOut('slow');
						$('#feedbackNegativeEmailRecovery').fadeIn('slow');
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