var PwdChangeController = function (uname, pwd) {
	this.TAG = 'PwdChangeController =>';
    this.pwdChangeForm = null;
    this.pwdChangeContainer = $('#pwdChangeForm');
	this.hintColor = "#D9EDF7";
	
	var usernameForPwdChange = null;
	var oldPassword = null;

	this.initValidationNewPassword();
	this.parseURLData(uname, pwd);
	this.bindEvents();
};

PwdChangeController.prototype.parseURLData = function(uname, pwd) {
	console.log(this.TAG + ' constructor called');
	console.log(uname + ' ' + pwd);
	var self = this;
	if(uname !== 'undefined' && pwd !== 'undefined' && typeof(uname) === 'string' && typeof(pwd) === 'string')
	{
		$('#oldPassword').attr('type', 'text');
		usernameForPwdChange = uname;
		oldPassword = pwd;
		$('#oldPassword').val(oldPassword);
		self.pwdChangeForm.updateStatus('oldPassword', 'VALID', 'notEmpty');
		//$('#oldPassword').trigger(jQuery.Event('keypress',{which : 13}));
	}
	else
	{
		
	}
};


PwdChangeController.prototype.bindEvents = function() {
	var self = this;
	console.log(this.TAG + 'submit');
	//reset button
	$('#BtnabortPasswordChange').on('click', function(event){
		event.preventDefault();
		$(':input', '#pwdChangeForm')
			.not(':button, :submit, :reset, :hidden')
            .val('');
		self.pwdChangeForm.resetForm();
	});
	
	$('#pwdChangeForm').keydown(function(e) {
		if(e.keyCode == 13) 
		{
			$('#BtnChangePassword').trigger('click');
		}
	});
	$("#BtnChangePassword").on('click', function(event){
		event.preventDefault();
		console.log(self.TAG + ' Change password button clicked');
		self.pwdChangeForm.validate();
		if(self.pwdChangeForm.isValid())
		{
			var user = new User();
			var newPassword = null;
			var dbHandler = new DatabaseHandler();

			Spinner.show($('#BtnChangePassword'));
			
			if(Session.isSessionActive())
			{
				user = Session.getUser();
				usernameForPwdChange = user.username;
				oldPassword = self.pwdChangeContainer.find('[name = oldPassword]').val();
			}
			else
			{
				console.log(usernameForPwdChange + ' ' + oldPassword);
			}
			newPassword = self.pwdChangeContainer.find('[name = newPassword]').val();

			//check gerenrated password with userinput
			dbHandler.checkValidLogin(usernameForPwdChange, oldPassword, function(response){
				if(response) //login success pwd can be changed
				{
					dbHandler.updateUserinfo('password', usernameForPwdChange, newPassword, function(response){
						if(response == 'success')
						{
							setTimeout(function () {
								Spinner.hide($('#BtnChangePassword'));
								console.log(self.TAG + ' password is changed');
								$('#feedbackPositivePasswordCh').html('Ihr Passwort wurde erfolgreich geändert!');
								$('#feedbackPositivePasswordCh').fadeIn('slow');
								$('#feedbackNegativePasswordCh').fadeOut('slow');
								return true;
							}, 1500);
						}
						else
						{
							setTimeout(function () {
								Spinner.hide($('#BtnChangePassword'));
								console.log(self.TAG + ' password could not be changed');
								$('#feedbackNegativePasswordCh').html('Es tut uns Leid, Ihr Passwort konnte nicht geändert werden. Bitte versuchen sie es zu einem anderen Zeitpunkt erneut.');
								$('#feedbackPositivePasswordCh').fadeOut();
								$('#feedbackNegativePasswordCh').fadeIn('slow');
								//TODO plot failure of finding email in database to feedback div
								return false;
							}, 1500);
						}
					});
				}
				else//response is false -> login failed -> oldPassword is wrong
				{
					setTimeout(function () {
						Spinner.hide($('#BtnChangePassword'));
						console.log(self.TAG + ' user login failed with old password');
						$('#feedbackNegativePasswordCh').html('Sie haben ein falsches Passwort als "Altes Passwort" angegeben.');
						$('#feedbackPositivePasswordCh').fadeOut('slow');
						$('#feedbackNegativePasswordCh').fadeIn('slow');
						return false;
					}, 1500);
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
		},keypress: function(e) {
			var kc = e.keyCode ? e.keyCode : e.which;
			var sk = e.shiftKey ? e.shiftKey : ((kc == 16) ? true : false);
			if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
			{
				$('#pwdChangeCapslock').removeClass('hidden');
				$('#pwdChangeCapslock').html('<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>' + ' Warnung: Sie haben die Feststelltaste gedrückt!');
			}
		},keydown: function(e){
			var kc = e.keyCode ? e.keyCode : e.which;
			if (kc == 20){
				$('#pwdChangeCapslock').addClass('hidden');
			}
		}
	});
	$('#oldPassword').on({keypress: function(e) {
			var kc = e.keyCode ? e.keyCode : e.which;
			var sk = e.shiftKey ? e.shiftKey : ((kc == 16) ? true : false);
			if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
			{
				$('#pwdChangeOldCapslock').removeClass('hidden');
				$('#pwdChangeOldCapslock').html('<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>' + ' Warnung: Sie haben die Feststelltaste gedrückt!');
			}
		},keydown: function(e){
			var kc = e.keyCode ? e.keyCode : e.which;
			if (kc == 20){
				$('#pwdChangeOldCapslock').addClass('hidden');
			}
		}
	});
	$('#newPasswordRepeat').on({focus: function() {
			$('#newPasswordHint').css("background-color",self.hintColor);
		}, focusout: function(){
			$('#newPasswordHint').css("background-color","white");
		},keypress: function(e) {
			var kc = e.keyCode ? e.keyCode : e.which;
			var sk = e.shiftKey ? e.shiftKey : ((kc == 16) ? true : false);
			if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
			{
				$('#pwdChangeRepCapslock').removeClass('hidden');
				$('#pwdChangeRepCapslock').html('<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>' + ' Warnung: Sie haben die Feststelltaste gedrückt!');
			}
		},keydown: function(e){
			var kc = e.keyCode ? e.keyCode : e.which;
			if (kc == 20){
				$('#pwdChangeRepCapslock').addClass('hidden');
			}
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
                        field: 'newPassword',
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
