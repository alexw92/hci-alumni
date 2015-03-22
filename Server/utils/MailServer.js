var emailjs = require('./../node_modules/emailjs/email');

var MailServer = (function () {
	var server = null,
		options = {
			user: 'alumni.wuerzburg',
			password: 'alumni-hci',
			host: 'smtp.web.de',
			port: 587,
			tls: true
		};

	/**
	 * public methods
	 */
	return {
		connect: function () {
			server = emailjs.server.connect(options);
		},
		sendMail: function (mailToSend, callback) {
			server.send(mailToSend, function (err, msg) {
				callback(err, msg);
			});
		},
	};
});



module.exports = new MailServer();