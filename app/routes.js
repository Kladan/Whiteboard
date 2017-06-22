module.exports = function(app, passport, path) {
	app.get('/', function(req, res) {
		//res.redirect('index'); // load the index file
		res.sendFile("/index.html");
	});

	app.get('/board', isAuthenticated, function(req, res) {
		res.sendFile(path + "/views/index.html");
	});

	app.get('/registration', function(req, res) {
		res.sendFile(path + "/views/registration.html");
	});

	app.get('/login', function(req, res) {
		res.sendFile(path + "/views/login.html");
	});

	app.get('/dashboard', function(req, res) {
		res.sendFile(path + "/views/dashboard.html");
	});

	app.post('/registration', passport.authenticate('registration', {
		successRedirect: "/board",
		failureRedirect: "/registration"
	}));
};

function isAuthenticated(req, res, next) {

	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect("/login")
}