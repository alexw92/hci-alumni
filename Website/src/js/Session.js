var Session = (function () {
	var user = null;

	return {
		setUser: function (value) {
			user = value;
		},
		getUser: function () {
			return user;
		},
		clearUser: function () {
			user = null;
		},
		isUserLoggedIn: function () {
			if(user === null)
				return false;
			return true;
		}
	};
})();
