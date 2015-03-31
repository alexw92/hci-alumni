var EMail = (function (mailData) {
	var _type = null,
		_reqParams = mailData,
		_mail = {};

	/**
	 * private methods
	 */
	var setText = function () {
		if(_type === MailType.CONFIRM_REGISTER)
			_mail.text = 'Registrierung erfolgreich; No-HTML Fallback Text';
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
		var beforeSaluation = (_reqParams.salutation === 'Herr') ? 'geehrter' : 'geehrte';

		if(_type === MailType.CONFIRM_REGISTER)
			htmlMessage += '<div style="max-width:650px; padding: 15px;"><h3 style="Margin-top: 0;color: #555;font-weight: normal;font-size: 18px;line-height: 26px;Margin-bottom: 16px;font-family: Georgia,serif">' +
								'Sehr ' + beforeSaluation + ' ' + _reqParams.salutation + ' ' + _reqParams.lastname + ',</h3><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">es freut uns Ihnen mitteilen zu k&#246;nnen, dass ihre Registrierung beim Alumni-Portal der Uni W&#252;rzburg erfolgreich war.</p>' +
								'<p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">Mit Klick auf folgenden Link ' +
								'<a href="http://localhost:3000/#/verify/' + _reqParams.verify_code + '" target="_blank">https://uni-wuerzburg.alumnionline.de/verify/' + _reqParams.verify_code + '</a> wird ihre Registrierung abgeschlossen und Sie k&#246;nnen sich mit dem Benutzernamen ' +
								'&lsquo;' + _reqParams.username + '&rsquo; und dem von Ihnen gew&#228;hlten Passwort einloggen.</p>' +
								'<p style="Margin-top: 0;color: #565656;font-family:Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">Bei Fragen stehen unsere ehrenamtlichen Alumni-Unterst&#252;tzer Ihnen nat&#252;rlich jederzeit gerne zur Verf&#252;gung!</p><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">Wir w&#252;nschen Ihnen viel Spa&#223; im Alumni-Portal!</p>' +
								'<p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">Viele Gr&#252;&#223;e, Ihr</p><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">Alumni-Team<br />___________________________<br />' +
								'Alumni Universit&#228;t W&#252;rzburg<br />Am Hubland<br />97074 W&#252;rzburg<br />Tel. 0931/1234567</p><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 24px"><em>P.S. Wir m&#246;chten unser Netzwerk weiter vergr&#246;&#223;ern - sagen Sie doch auch Ihren Kontakten Bescheid - vielen Dank!</em></p></div>';
		else if(_type === MailType.SEND_PASSWORD)
			htmlMessage += '<div style="max-width:650px; padding: 15px;"><h3 style="Margin-top: 0;color: #555;font-weight: normal;font-size: 18px;line-height: 26px;Margin-bottom: 16px;font-family: Georgia,serif">Sehr ' + beforeSaluation + ' ' + _reqParams.salutation + ' ' + _reqParams.lastname + '</h3><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">hiermit senden wir Ihnen ihre Logindaten mit neu generiertem Passwort zu. Bei Ihrem nächsten Login sollten Sie dieses Passwort aus Sicherheitsgründen ändern. </p><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">' +
							'Folgendes sind Ihre LoginDaten:</br> Benutzername: ' + _reqParams.username + '</br> Passwort: ' + _reqParams.password + ' </br>Mit Klick auf folgende <a href="http://localhost:3000/#/pwdChange/' + _reqParams.username + '/' + _reqParams.password + '" target="_blank">https://uni-wuerzburg.alumnionline.de/pwdChange/' + _reqParams.username + '/' + _reqParams.password + '</a> können sie die Passwort-Änderung durchführen</p>' +
							'<p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">Viele Gr&#252;&#223;e, Ihr</p><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">Alumni-Team<br />' +
							'___________________________<br />Alumni Universit&#228;t W&#252;rzburg<br />Am Hubland<br />97074 W&#252;rzburg<br />Tel. 0931/1234567</p><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 24px"><em>P.S. Wir m&#246;chten unser Netzwerk weiter vergr&#246;&#223;ern - sagen Sie doch auch Ihren Kontakten Bescheid - vielen Dank!</em></p></div>';
		else if(_type === MailType.SEND_ACCOUNT)
			htmlMessage += '<div style="max-width:650px; padding: 15px;"><h3 style="Margin-top: 0;color: #555;font-weight: normal;font-size: 18px;line-height: 26px;Margin-bottom: 16px;font-family: Georgia,serif">Sehr ' + beforeSaluation + ' ' + _reqParams.salutation + ' ' + _reqParams.lastname + ',</h3><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">hiermit senden wir Ihnen Ihre angeforderte E-Mail, die mit dem Alumni-Benutzerkonto &quot;' + _reqParams.username + '&quot; verknüpft ist. </p>' +
							'<p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">Viele Gr&#252;&#223;e, Ihr</p><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 25px">Alumni-Team<br />' +
							'___________________________<br />Alumni Universit&#228;t W&#252;rzburg<br />Am Hubland<br />97074 W&#252;rzburg<br />Tel. 0931/1234567</p><p style="Margin-top: 0;color: #565656;font-family: Georgia,serif;font-size: 16px;line-height: 25px;Margin-bottom: 24px"><em>P.S. Wir m&#246;chten unser Netzwerk weiter vergr&#246;&#223;ern - sagen Sie doch auch Ihren Kontakten Bescheid - vielen Dank!</em></p></div></div>';
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
			_mail.subject = 'Alumni-Portal: Ihre Registrierungsbestätigung';
		else if(_type === MailType.SEND_PASSWORD)
			_mail.subject = 'Alumni-Portal: Ihre neuen Logindaten';
		else if(_type === MailType.SEND_ACCOUNT)
			_mail.subject = 'Alumni-Portal: Ihre E-Mail Erkennung';
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
	['recipient', 'recipient_mail', 'username', 'lastname', 'salutation', 'verify_code'], // Confirm-Register
	['recipient', 'recipient_mail', 'username', 'lastname', 'salutation', 'password'], // Send-Password
	['recipient', 'recipient_mail', 'username', 'lastname', 'salutation'] // Send-Acount
];

module.exports = EMail;