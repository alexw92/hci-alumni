var Session = (function () {
	var user = null;

	return {
		setUser: function (value) {
			user = value;
		},
		getUser: function () {
			return user;
		},
		clear: function () {
			user = null;
		},
		isSessionActive: function () {
			if(user === null)
				return false;
			return true;
		}
	};
})();
