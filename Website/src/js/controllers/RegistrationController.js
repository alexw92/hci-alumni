var RegistrationController = function () {
	this.TAG = 'RegistrationController =>';

	this.exampleFunction();
	this.initValidation();
	this.bindEvents();
};

RegistrationController.prototype.exampleFunction = function() {
	console.log(this.TAG + 'constructor called');
};

RegistrationController.prototype.bindEvents = function() {
	var self = this;
	console.log(this.TAG + 'submit');
	$('#btnSubmitReg').on('click', function(event){
		event.preventDefault();
		console.log('SubmitBtn clicked');
		$('#registrationForm').formValidation('validate');
	});
	$('#noMemberRadio').on('change', function(event) {
		console.log('membership selected');
		$('#membershipData').fadeOut('slow');
		$('#membershipData').formValidation('destroy');
	});
	$('#memberRadio').on('change', function(event) {
		console.log('membership selected');
		$('#membershipData').fadeIn();
		self.initMembershipValidation();
		$('#membershipData').formValidation('validate');
	});
};

RegistrationController.prototype.initMembershipValidation = function () {
	$('#registrationForm').formValidation({
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
            }
		}
	});
};


RegistrationController.prototype.initValidation = function () {
	$('#registrationForm').formValidation({
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
                        message: 'Ihr Benutzername muss aus Buchstaben und Zahlen bestehen und darf nur die Sonderzeichen "Punkt" oder "Unterstrich" enthalten'
                    }
                }
            },
            email: 
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
                    }
                }
            }
        }
    });
};