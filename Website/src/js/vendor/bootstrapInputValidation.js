$(document).ready(function() 
{
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
                row: '.col-xs-4',
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
                row: '.col-xs-4',
                validators: 
				{
                    notEmpty: 
					{
                        message: 'Bitte tragen Sie Ihren Nachnamen ein'
                    }
                }
            },
			lastName: 
			{
                row: '.col-xs-4',
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
                row: '.col-xs-4',
                validators: 
				{
                    notEmpty: 
					{
                        //message: 'Bitte tragen Sie Ihre Adresse ein'
                    }
                }
            },
			zipCode: 
			{
                validators: 
				{
                    notEmpty: 
					{
                        message: 'Bitte tragen Sie Ihre PLZ ein'
                    },
					stringLength:
					{
                        min: 5,
                        max: 6,
                        message: 'Bitte geben Sie eine gültige Postleitzahl ein'
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
                        message: 'The username is required'
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
                        message: 'Ihr Benutzername muss aus Buchstaben und Zahlen bestehen und darf nur die Sonderzeichen Punkt oder Unterstrich enthalten'
                    }
                }
            },
            email: 
			{
                validators: 
				{
                    notEmpty: 
					{
                        message: 'Bitte tragen Sie Ihre Emailadresse ein'
                    },
                    emailAddress: 
					{
                        message: 'Dies ist keine gültige Emailadresse'
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
                        message: 'Das Passwort darf nicht Ihr Benutzername sein'
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
                    different: 
					{
                        field: 'password',
                        message: 'The password cannot be the same as username'
                    }
                }
            },
            birthday: 
			{
                validators: 
				{
                    notEmpty: 
					{
                        message: 'The date of birth is required'
                    },
                    date: 
					{
                        format: 'YYYY/MM/DD',
                        message: 'The date of birth is not valid'
                    }
                }
            }
        }
    });
});