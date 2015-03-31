var RegistrationController = function () {
	this.TAG = 'RegistrationController =>';
	this.regForm = null;
	this.accountForm = null;
	this.regFormContainer = $('#registrationForm');
	this.bankFormContainer = $('#membershipData');
	this.hintColor = "#D9EDF7";

	this.exampleFunction();
	this.initValidation();
	this.bindEvents();
};

RegistrationController.prototype.exampleFunction = function() {
	console.log(this.TAG + 'constructor called');
};

RegistrationController.prototype.bindEvents = function() {
	var self = this;
	var membershipBool = false;
	console.log(this.TAG + 'submit');

	//membership selected or not?
	$('input:radio').on('click', function(){
		membershipBool = $(this).val();
		console.log(membershipBool + ' steht in bool');
		if($(this).val())
		{
			console.log('membership selected and button pressed' + $(this).val());

		}
		else
		{
			console.log('$(this).val()');
		}
	});
	$('#registrationForm').keydown(function(e) {
		if(e.keyCode == 13) 
		{
			$('#btnSubmitReg').trigger('click');
		}
	});

	//reset button
	$('#btnAbortReg').on('click', function(event){
		event.preventDefault(event);
		$(':input', '#registrationForm')
			.not(':button, :submit, :reset, :hidden, :radio')
            .val('');
		self.regForm.resetForm();
		$('#title').val('Anrede');
		$(':input', '#membershipData')
			.not(':button, :submit, :reset, :hidden, :radio')
            .val('');
		if(self.accountForm != null)
		{
			self.accountForm.resetForm();
		}

	});
	//submit button action
	$('#btnSubmitReg').on('click', function(event){
		event.preventDefault(event);
		console.log('SubmitBtn clicked');
		self.regForm.validate();
		if(membershipBool)
		{
			self.accountForm.validate();
		}
		console.log(self.regForm.isValid());
		if( self.regForm.isValid())
		{
			var user = self.parseUser(),
				dbHandler = new DatabaseHandler();
				
			Spinner.show($('#btnSubmitReg'));

			dbHandler.insertNewUser(user, function (response) {
				console.log('response text' + response);
				if(response['msg'] == 'success')
				{

					//TODO Email Magic
					var mailData = {
						recipient: user.firstname + ' ' + user.lastname,
						recipient_mail: user.email,
						username: user.username,
						lastname: user.lastname,
						salutation: user.title,
						verify_code: response['hash']
					};

					dbHandler.sendMail('confirm-register', mailData, function(response){
						if(!response.error)
						{
							setTimeout(function () {
								Spinner.hide($('#btnSubmitReg'));
								$('html').animate({scrollTop: 0}, 'slow'); // firefox workaround
								$('html body').animate({scrollTop: 0}, 'slow');
								$('#feedbackPositive').html('Ihre Registrierung war erfolgreich. In Kürze erhalten Sie eine Bestätigungsemail mit Freischaltcode!');
								$('#feedbackPositive').fadeIn('slow');
								$('#feedbackNegative').fadeOut('slow');
							}, 1500);
						}
						else
						{
							setTimeout(function () {
								Spinner.hide($('#btnSubmitReg'));
								$('html').animate({scrollTop: 0}, 'slow'); // firefox workaround
								$('html body').animate({scrollTop: 0}, 'slow');
								$('#feedbackNegative').html('Leider ist ein Fehler beim Versenden der E-Mail zur Bestätigung Ihrer Registrierung aufgetreten. Bitte wenden Sie sich an <b>alumni@uni-wuerzburg.de</b>.');
								$('#feedbackPositive').fadeOut('slow');
								$('#feedbackNegative').fadeIn('slow');
							}, 1500);
						}
					});
				}
				else
				{
					setTimeout(function () {
						Spinner.hide($('#btnSubmitReg'));
						$('html').animate({scrollTop: 0}, 'slow'); // firefox workaround
						$('html body').animate({scrollTop: 0}, 'slow');
						$('#feedbackNegative').html('Es tut uns Leid, es ist ein Fehler in der Technik aufgetreten. Versuchen Sie es bitte zu einem anderen Zeitpunkt erneut.');
						$('#feedbackPositive').fadeOut('slow');
						$('#feedbackNegative').fadeIn('slow');
					},1500);
				}
			});
			console.log('Valid');
		}
		else
		{
			console.log(self.TAG + ' NOT valid');
		}
	});
	$('#noMemberRadio').on('change', function(event) {
		console.log('No membership selected (radio)');
		$('#membershipData').fadeOut('slow');
		$('#membershipData').formValidation('destroy');
	});
	$('#memberRadio').on('change', function(event) {
		console.log('membership selected (radio)');
		$('#membershipData').fadeIn();
		self.initMembershipValidation();
	});
	//Username check (used or not used)
	$('#username').keypress(function(){
		var dbHandler = new DatabaseHandler();
		setTimeout(function(){
    		dbHandler.checkUsernameInUse(self.regFormContainer.find('[name = username]').val() , function(response) {
				if(response)
				{
					self.regForm.updateStatus('username', 'INVALID', 'ean');
				}
				else
				{
					self.regForm.updateStatus('username', 'VALID', 'ean');
				}
			});
		}, 250);

	});
	//Email check (used or not used)
	$('#email').keypress(function(){
		var dbHandler = new DatabaseHandler();
		setTimeout(function(){
			dbHandler.checkMailInUse(self.regFormContainer.find('[name = email]').val() , function(response) {
				if(response)
				{
					self.regForm.updateStatus('email', 'INVALID', 'color');
				}
				else
				{
					self.regForm.updateStatus('email', 'VALID', 'color');
				}
			});
		}, 250);
		dbHandler.checkMailInUse(self.regFormContainer.find('[name = email]').val() , function(response) {
			if(response)
			{
				self.regForm.updateStatus('email', 'INVALID', 'color');
			}
			else
			{
				self.regForm.updateStatus('email', 'VALID', 'color');
			}
		})
	});
	//username hint background-color changing on mouseover
	$('#username').on({focus: function() {
			$('#usernameHint').css("background-color",self.hintColor);
		}, focusout: function(){
			$('#usernameHint').css("background-color","white");
		}
	});
	//password hint background-color changing on mouseover
	$('#password').on({focus: function() {
			$('#passwordHint').css("background-color",self.hintColor);
		}, focusout: function(){
			$('#passwordHint').css("background-color","white");
		},keypress: function(e) {
			var kc = e.keyCode ? e.keyCode : e.which;
			var sk = e.shiftKey ? e.shiftKey : ((kc == 16) ? true : false);
			if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
			{
				$('#pwdCapslock').removeClass('hidden');
				$('#pwdCapslock').html('<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>' + ' Warnung: Sie haben die Feststelltaste gedrückt!');
			}
		},keydown: function(e){
			var kc = e.keyCode ? e.keyCode : e.which;
			if (kc == 20){
				$('#pwdCapslock').addClass('hidden');
			}
		}
	});
	$('#passwordRpt').on({focus: function() {
			$('#passwordHint').css("background-color",self.hintColor);
		}, focusout: function(){
			$('#passwordHint').css("background-color","white");
		},keypress: function(e) {
			var kc = e.keyCode ? e.keyCode : e.which;
			var sk = e.shiftKey ? e.shiftKey : ((kc == 16) ? true : false);
			if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
			{
				$('#pwdRepCapslock').removeClass('hidden');
				$('#pwdRepCapslock').html('<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>' + ' Warnung: Sie haben die Feststelltaste gedrückt!');
			}
		},keydown: function(e){
			var kc = e.keyCode ? e.keyCode : e.which;
			if (kc == 20){
				$('#pwdRepCapslock').addClass('hidden');
			}
		}
	});
	//password hint background-color changing on mouseover
	$('#email').on({focus: function() {
			$('#emailHint').css("background-color",self.hintColor);
		}, focusout: function(){
			$('#emailHint').css("background-color","white");
		}
	});
};

RegistrationController.prototype.initMembershipValidation = function () {
	var bankFormContainer = $('#membershipData').formValidation({
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
	        depositor:
			{
                validators:
				{
                    notEmpty:
					{
                        message: 'Bitte tragen Sie den Namen des Kontoinhabers ein'
                    }
                }
            },
            iban:
			{
                validators:
				{
                    notEmpty:
					{
                        message: 'Bitte tragen Sie Ihre IBAN ein'
                    },
					iban:
					{
						country: 'DE',
						message: 'Bitte geben Sie eine gültige IBAN ein'
					}
                }
            },
            bic:
			{
                validators:
				{
                    notEmpty:
					{
                        message: 'Bitte tragen Sie Ihren BIC ein'
                    },
					bic:
					{
						message: 'Bitte geben Sie einen gültigen BIC ein'
					}
                }
            }
		}
	});
	this.accountForm = bankFormContainer.data('formValidation');
};


RegistrationController.prototype.initValidation = function () {
	var regFormContainer = $('#registrationForm').formValidation({
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
			title:
			{
				validators:
				{
					notEmpty:
					{
						message: 'Bitte geben Sie eine Anrede an'
					},
					callback:
					{
						message: 'Bitte wählen Sie eine Anrede aus',
						callback: function(value, validator, $field)
						{
								if(value == 'Anrede')
								{
									return false;
								}
								return true;
						}
					}
				}
			},
            firstName:
			{

                validators:
				{
                    notEmpty:
					{
                        message: 'Bitte tragen Sie Ihren Vornamen ein'
                    }
                }
            },
            lastName:
			{
                validators:
				{
                    notEmpty:
					{
                        message: 'Bitte tragen Sie Ihren Nachnamen ein'
                    }
                }
            },
			street:
			{
                validators:
				{
                    notEmpty:
					{
                        message: 'Bitte tragen Sie Ihre Straße und Hausnummer ein'
                    }
                }
            },
			streetAdditional:
			{
                validators:
				{
                }
            },
			zipCode:
			{
                validators:
				{
					zipCode:
					{
						country: 'DE',
						message: 'Bitte tragen Sie eine gültige deutsche Postleitzahl ein'
					},
                    notEmpty:
					{
                        message: 'Bitte tragen Sie Ihre PLZ ein'
                    },
                }
            },
			city:
			{
                validators:
				{
                    notEmpty:
					{
                        message: 'Bitte tragen Sie Ihren Wohnort ein'
                    }
                }
            },
            username:
			{
                validators:
				{
                    notEmpty:
					{
                        message: 'Bitte tragen Sie einen Benutzernamen ein'
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
                        message: 'Ihr Benutzername muss aus Buchstaben und Zahlen bestehen und darf nur die Sonderzeichen "Punkt" und "Unterstrich" enthalten'
                    },
                    ean:
                    {
                    	message: 'Der Benutzername ist leider schon vergeben, versuchen Sie es bitte mit einem anderen'
                    }
                }
            },
            email:
			{
                validators:
				{
	                color:
                    {
                    	message: 'Diese Email-Adresse ist leider bereits vergeben, versuchen Sie es bitte mit einer anderen'
                    },
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
            password:
			{
                validators:
				{
                    notEmpty:
					{
                        message: 'Bitte tragen Sie ein Passwort ein'
                    },
                    different:
					{
                        field: 'username',
                        message: 'Das Passwort darf nicht Ihrem Benutzername entsprechen'
                    },
                    regexp:
					{
                        regexp: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/,  //seen on http://regexlib.com/
                        //regexp: /(?=^.{6,30}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/,
                        message: 'Ihr Passwort muss jeweils einen Groß- und Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten. Außerdem muss es zwischen 6 und 30 Zeichen lang sein'
                    }

                }
            },
            passwordRepeat:
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
                        //regexp: /(?=^.{6,30}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/,
                        message: 'Ihr Passwort muss jeweils einen Groß- und Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten. Außerdem muss es zwischen 6 und 30 Zeichen lang sein'
                    }
                }
            }
        }
    });

	this.regForm = regFormContainer.data('formValidation');
};

RegistrationController.prototype.parseUser = function()
{
	var user = new User();
	var formVariable = this.regFormContainer.find('[name = title]').val();
	user.title = formVariable;

	formVariable = this.regFormContainer.find('[name = firstName]').val();
	user.firstname = formVariable;

	formVariable = this.regFormContainer.find('[name = lastName]').val();
	user.lastname = formVariable;

	formVariable = this.regFormContainer.find('[name = street]').val();
	user.address = formVariable;

	formVariable = this.regFormContainer.find('[name = streetAdditional]').val();
	user.addressaddition = formVariable;

	formVariable = this.regFormContainer.find('[name = zipCode]').val();
	user.postalcode = formVariable;

	formVariable = this.regFormContainer.find('[name = city]').val();
	user.city = formVariable;

	formVariable = this.regFormContainer.find('[name = username]').val();
	user.username = formVariable;

	formVariable = this.regFormContainer.find('[name = email]').val();
	user.email = formVariable;

	formVariable= this.regFormContainer.find('[name = password]').val();
	user.password = formVariable;

	console.log(user);


	return user;
	//TODO get all input fields
}


















