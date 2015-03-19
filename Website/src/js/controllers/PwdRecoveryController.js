var PwdRecoveryController = function () {
	this.TAG = 'PwdRecoveryController =>';

	this.exampleFunction();
	this.initValidationPassword();
	this.initValidationEmail();
	this.setSubmitbutton();
};

PwdRecoveryController.prototype.exampleFunction = function() {
	console.log(this.TAG + 'constructor called');
};

PwdRecoveryController.prototype.setSubmitbutton = function() {
	console.log(this.TAG + 'submit');
	$("#btnSubmitRecoveryPassword").on('click', function(event){
		event.preventDefault();
		console.log('SubmitBtn clicked');
		$('#pwdRecoveryForm').formValidation('validate');
	});
	$("#btnSubmitRecoveryEmail").on('click', function(event){
		event.preventDefault();
		console.log('SubmitBtn clicked');
		$('#mailRecoveryForm').formValidation('validate');
	});
};


PwdRecoveryController.prototype.initValidationPassword = function () {
	$('#pwdRecoveryForm').formValidation({
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
};
PwdRecoveryController.prototype.initValidationEmail = function () {
	$('#mailRecoveryForm').formValidation({
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
};