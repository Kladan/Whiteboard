	
	var Board = require('./board');

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

				return res.redirect("/");
			});
		})(req, res, next);
	});

	app.post('/login', function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {

			if (err) { return next(err); }

			if (!user) { errorMsg = "Username oder Passwort ist nicht korrekt!"; return res.redirect("/login"); }

			req.logIn(user, function(err) {

				if (err) { return next(err); }

				return res.redirect("/");
			});
		})(req, res, next);
	});

	app.get('/userdata', isAuthenticated, function(req, res) {
		var user = req.user; //req.user gibt den aktuellen User zurück
		res.json(user);
	});

	app.get("/loggedIn", function(req, res) {
		res.json(req.isAuthenticated());
	});

	app.get('/errormessages', function (req, res) {
		var error = errorMsg;
		errorMsg = "";
		res.json(error);
	});
	

	//Whiteboard API
	app.post('/saveBoard', isAuthenticated, function(req, res) {

		var sketch = req.body.sketch;
		sketch.userId = req.user.userId;
		
		Board.Service.create(sketch, function(err, result) {
			res.json({result: result.insertId});
		});
	});

	app.get('/getAllBoards', function(req, res) {
		var id = req.user.userId;
		Board.Service.getAll(id, function(err, results) {
			if (err) throw err;
			//console.log(results);
			res.json(results);
		});
	});

	app.get('/getBoardById', function(req, res){

		var userId = req.user.userId;
		var boardId = parseInt(req.query.boardId);
		
		Board.Service.getById(userId, boardId, function(err, result){
			
			if (err != null) {
				res.status(500).json({error: "An error occured!"});
			}

			if (result.length == 0) {
				res.status(404).json({message: "Board not found!"});
			}
			else {
				res.json({
					title: result[0].title,
					imageUrl: result[0].imageUrl,
					bg_white: result[0].bg_white
				});
			}
		});
	});

	app.post('/share', function(req, res){

		var data = req.body.shareDetails;
		Board.Service.share(data, function(err, result) {

			if (err != null){
				res.status(500).json({error: "An error occured!"});
			}
			else {
				res.json({success: true});
			}
		});
	});
};

function isAuthenticated(req, res, next) {

	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect("/login")
}

var errorMsg = "";
