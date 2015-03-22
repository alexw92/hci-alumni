var EMail = (function (mailData) {
	var _type = null,
		_reqParams = mailData,
		_mail = {};

	/**
	 * private methods
	 */
	var setText = function () {
		if(_type === MailType.CONFIRM_REGISTER)
			_mail.text = 'Registierung bestätigt; No-HTML Fallback Text';
		else if(_type === MailType.SEND_PASSWORD)
			_mail.text = 'Passwort wird zugesendet; No-HTML Fallback Text';
		else if(_type === MailType.SEND_ACCOUNT)
			_mail.text = 'Account vergessen; No-HTML Fallback Text';
		else
			_mail.text = '';
	};

	var setSender = function () {
		_mail.from = 'Alumni-Portal <alumni.wuerzburg@web.de>';
	};

	var setRecipient = function () {
		_mail.to = '' + _reqParams.recipient + ' <' + _reqParams.recipient_mail + '>';
	};

	var setAttachment = function () {
		var htmlMessage = '<html>';

		if(_type === MailType.CONFIRM_REGISTER)
			htmlMessage += '<b>Registrierung</b> ... blubb';
		else if(_type === MailType.SEND_PASSWORD)
			htmlMessage += '<b>Passwort vergessen</b> ... blubb';
		else if(_type === MailType.SEND_ACCOUNT)
			htmlMessage += '<b>Account vergessen</b> ... blubb';
		else
			htmlMessage += '<b>Nichts</b> ...';

		htmlMessage += '</html>';

		_mail.attachment = [{
			data: htmlMessage,
			alternative: true
		}];
	};

	var setSubject = function () {
		if(_type === MailType.CONFIRM_REGISTER)
			_mail.subject = 'Alumni-Portal: Registrierungsbestätigung';
		else if(_type === MailType.SEND_PASSWORD)
			_mail.subject = 'Alumni-Portal: Passwort vergessen';
		else if(_type === MailType.SEND_ACCOUNT)
			_mail.subject = 'Alumni-Portal: Deine Accountinformationen';
		else
			_mail.subject = 'Alumni-Portal: ...';
	};

	/**
	 * public methods
	 */
	 return {
	 	parseMailType: function (typeAsString) {
			switch(typeAsString) {
				case 'confirm-register':
					_type =  MailType.CONFIRM_REGISTER;
					break;
				case 'send-password':
					_type = MailType.SEND_PASSWORD;
					break;
				case 'send-account':
					_type = MailType.SEND_ACCOUNT;
					break;
				default:
					_type = MailType.NOT_SUPPORTED;
			}
		},
	 	isTypeSupported: function () {
	 		if(_type === MailType.NOT_SUPPORTED)
	 			return false;
	 		return true;
	 	},
	 	verifyRequiredParams: function (callback) {
	 		var error = false,
				errorFields = '',
				requiredFields = MailRequiredParams[_type];

			requiredFields.forEach(function (field, index) {
				if(!_reqParams.hasOwnProperty(field) || _reqParams[field].length === 0) {
					error = true;
					errorFields += field + ', ';
				}
			});

			if(typeof(callback) === 'function' && callback !== 'undefined')
				callback({
					error: error,
					message:  'Required field(s) ' + errorFields.substr(0, errorFields.length - 2) + ' is missing or empty'
				});
	 	},
	 	build: function () {
	 		setText();
	 		setSubject();
	 		setSender();
	 		setRecipient();
	 		setAttachment();
	 	},
	 	getMail: function () {
	 		return _mail;
	 	}
	 };
});

var MailType = {
	NOT_SUPPORTED: -1,
	CONFIRM_REGISTER: 0,
	SEND_PASSWORD: 1,
	SEND_ACCOUNT: 2
};

var MailRequiredParams = [
	['recipient', 'recipient_mail', 'username', 'password'], // Confirm-Register
	['username', 'email'], // Send-Password
	['username', 'email'] // Send-Acount
];

module.exports = EMail;