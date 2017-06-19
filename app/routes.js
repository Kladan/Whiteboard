module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		res.redirect('index'); // load the index file
	});
}