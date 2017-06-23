module.exports = function(app, passport, path) {
	app.get('/', function(req, res) {
		res.sendFile(path + "/views/index.html");
	});

	app.get('/board', isAuthenticated, function(req, res) {
		res.sendFile(path + "/views/index.html");
	});

	app.get('/registration', function(req, res) {
		res.sendFile(path + "/views/registration.html");
	});

	// app.post('/registration', passport.authenticate('registration', {
	// 	successRedirect: "/board",
	// 	failureRedirect: "/registration"
	// }));

	app.post('/registration', function(req, res, next) {
		passport.authenticate('registration', function(err, user, info) {

			if (err) { return next(err); }

			if (!user) { errorMsg = "Username existiert bereits!"; return res.redirect("/registration");}

			req.logIn(user, function(err) {

				if (err) { return next(err); }

				return res.redirect("/board");
			});
		})(req, res, next);
	});

	// app.post('/login', passport.authenticate('login', {
	// 	successRedirect: "/board",
	// 	failureRedirect: "/login"
	// }));

	app.post('/login', function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {

			if (err) { return next(err); }

			if (!user) { errorMsg = "Username oder Passwort sind nicht korrekt!"; return res.redirect("/login"); }

			req.logIn(user, function(err) {

				if (err) { return next(err); }

				return res.redirect("/board");
			});
		})(req, res, next);
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
