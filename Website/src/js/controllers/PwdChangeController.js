var PwdChangeController = function () {
	this.TAG = 'PwdChangeController =>';
    this.pwdChangeForm = null;
    this.pwdChangeContainer = $('#pwdChangeForm');
	this.hintColor = "#D9EDF7";

	this.exampleFunction();
	this.initValidationNewPassword();
	this.bindEvents();
};

PwdChangeController.prototype.exampleFunction = function() {
	console.log(this.TAG + ' constructor called');
};


PwdChangeController.prototype.bindEvents = function() {
	var self = this;
	console.log(this.TAG + 'submit');
	$("#BtnChangePassword").on('click', function(event){
		event.preventDefault();
		console.log(self.TAG + ' Change password button clicked');
		self.pwdChangeForm.validate();
		if(self.pwdChangeForm.isValid())
		{
			var user = new User();
			//TODO get the user which is logged in / Get the username of this user
			var dbHandler = new DatabaseHandler();
			//TODO get user.username
			//var usernameForPwdChange = user.username();
			//TODO for testpurposes username = BenediktP.
			if(Session.isSessionActive())
			{
				var user = Session.getUser();
			}
			else
			{
				
			}

			var usernameForPwdChange = user.username;
			console.log(self.TAG + usernameForPwdChange);
			var oldPassword = self.pwdChangeContainer.find('[name = oldPassword]').val();
			var newPassword = self.pwdChangeContainer.find('[name = newPassword]').val();

			//TODO check gerenrated password with userinput
			dbHandler.checkValidLogin(usernameForPwdChange, oldPassword, function(response){
				if(response) //login success pwd can be changed
				{
					dbHandler.updateUserinfo('password', usernameForPwdChange, newPassword, function(response){
						if(response == 'success')
						{
							console.log(self.TAG + ' password is changed');
							$('#feedbackPositivePasswordCh').html('Ihr Passwort wurde erfolgreich geändert');
							$('#feedbackPositivePasswordCh').fadeIn('slow');
							$('#feedbackNegativePasswordCh').fadeOut('slow');
							return true;
							//TODO 
						}
						else
						{
							console.log(self.TAG + ' password could not be changed');
							$('#feedbackNegativePasswordCh').html('Es tut uns leid, Ihr Passwort konnte nicht geändert werden. Bitte versuchen sie es zu einem anderen Zeitpunkt erneut.');
							$('#feedbackPositivePasswordCh').fadeOut('slow');
							$('#feedbackNegativePasswordCh').fadeIn('slow');
							//TODO plot failure of finding email in database to feedback div
							return false;
						}
					});
				}
				else//response is false -> login failed -> oldPassword is wrong
				{
					console.log(self.TAG + ' user login failed with old password');
					$('#feedbackNegativePasswordCh').html('Sie haben ein falsches Passwort als "Altes Passwort" angegeben.');
					$('#feedbackPositivePasswordCh').fadeOut('slow');
					$('#feedbackNegativePasswordCh').fadeIn('slow');
					return false;
				}
			});
		}
		else
		{
			console.log(self.TAG + ' password change validation failed');
		}
	});
	//password hint background-color changing on mouseover 
	$('#newPassword').on({focus: function() {
			$('#newPasswordHint').css("background-color",self.hintColor);
		}, focusout: function(){
			$('#newPasswordHint').css("background-color","white");
		}
	});
	$('#newPasswordRepeat').on({focus: function() {
			$('#newPasswordHint').css("background-color",self.hintColor);
		}, focusout: function(){
			$('#newPasswordHint').css("background-color","white");
		}
	});
};


PwdChangeController.prototype.initValidationNewPassword = function () {
	var pwdChangeContainer = $('#pwdChangeForm').formValidation({
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
            oldPassword: 
			{

                validators: 
				{
                    notEmpty: 
					{
                        message: 'Bitte tragen Sie Ihre tragen Sie altes Passwort ein'
                    }
                }
            },
            newPassword: 
			{
                validators: 
				{
                    notEmpty: 
					{
                        message: 'Bitte tragen Sie ein Passwort ein'
                    },
   					callback: 
					{
						/* TODO password must be different to username
						callback: function(value, validator, $field)
						{
								if(value == user.username)
								{
									return false;
								}
								return true;
						},
						message: 'Das Passwort darf nicht Ihrem Benutzername entsprechen'
						*/
					},
                    regexp: 
					{
                        regexp: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/,  //seen on http://regexlib.com/
                        message: 'Ihr Passwort muss jeweils einen Groß- und Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten. Außerdem muss es zwischen 6 und 30 Zeichen lang sein'
                    }

                }
            },
            newPasswordRepeat: 
			{
                validators: 
				{
                    notEmpty: 
					{
                        message: 'Bitte wiederholen Sie ihr Passwort'
                    },
                    identical: 
					{
                        field: 'password',
                        message: 'Ihr Passwort stimmt nicht überein'
                    },
                    regexp: 
					{
                        regexp: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/,  //seen on http://regexlib.com/ 
                    }
                }
            }

        }
    });
    this.pwdChangeForm = pwdChangeContainer.data('formValidation');
};
