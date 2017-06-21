module.exports = function(app, passport, path) {
	app.get('/', function(req, res) {
		//res.redirect('index'); // load the index file
		res.sendFile("/index.html");
	});

	app.get('/board', function(req, res) {
		res.sendFile(path + "/views/index.html");
	});

	app.get('/registration', function(req, res) {
		res.sendFile(path + "/views/registration.html");
	});

	app.post('/registration', passport.authenticate('registration', {
		successRedirect: "/board",
		failureRedirect: "/registration"
	}));
};