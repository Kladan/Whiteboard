	module.exports = function(app, passport, path) {
	app.get('/', isAuthenticated, function(req, res) {
		res.sendFile(path + "/views/dashboard.html");
	});

	app.get('/board', isAuthenticated, function(req, res) {
		res.sendFile(path + "/views/board.html");
	});

	app.get('/registration', function(req, res) {
		res.sendFile(path + "/views/registration.html");
	});

	app.get('/login', function(req, res) {
		res.sendFile(path + "/views/login.html");
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/dashboard', isAuthenticated, function(req, res) {
		res.sendFile(path + "/views/dashboard.html");
	});

	app.get('/profil', isAuthenticated, function(req, res) {
		res.sendFile(path + "/views/profil.html");
	});

	app.get('/impressum', function(req, res) {
		res.sendFile(path + "/views/impressum.html");
	});

	app.get('/notfound', function(req, res) {
		res.sendFile(path + "/views/notfound.html");
	});

	app.get('/header', function(req, res) {
		res.sendFile(path + "/views/header.html");
	});

	app.post('/registration', function(req, res, next) {
		passport.authenticate('registration', function(err, user, info) {

			if (err) { return next(err); }

			if (!user) { errorMsg = "Der Username existiert bereits!"; return res.redirect("/registration");}

			req.logIn(user, function(err) {

				if (err) { return next(err); }

				return res.redirect("/board");
			});
		})(req, res, next);
	});

	app.post('/login', function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {

			if (err) { return next(err); }

			if (!user) { errorMsg = "Username oder Passwort ist nicht korrekt!"; return res.redirect("/login"); }

			req.logIn(user, function(err) {

				if (err) { return next(err); }

				return res.redirect("/board");
			});
		})(req, res, next);
	});

	app.get("/loggedIn", function(req, res) {
		res.json(req.isAuthenticated());
	});

	app.get('/errormessages', function (req, res) {
		var error = errorMsg;
		errorMsg = "";
		res.json(error);
	});
};

function isAuthenticated(req, res, next) {

	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect("/login")
}

var errorMsg = "";
