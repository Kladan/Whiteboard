
var PassportLocal = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var mysql = require('mysql');
var dbConfig = require('../db_config/database');

var connection = mysql.createConnection(dbConfig.connection);

connection.query('USE ' + dbConfig.database);

module.exports = function(passport) {

	//Session Funktionen für Serialisierung in einem Cookie und Deserialisierung aus einem Cookie

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		connection.query('select * from user where userId = ? ', [id], function(err, user) {
			done(err, user);
		});
	});


	//Registrierung

	passport.use('registration', new PassportLocal({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback : true //die komplette request wird zum Callback geschoben
		},

		//email feld
		function (req, username, password, done) {
			connection.query("select * from user where username = '" + username + "' or email = '" + req.body.email + "'", function(err, rows) {
				if (err) {
					return done(err);
				}
				if (rows.length) {
					console.log(rows); //Filterung nach Username und Email
					return done(null, false, {message: 'Username existiert bereits.'});
				}
				else {

					var hashedPwd = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
					var regUser = {
						username: username,
						email: reg.body.email,
						password: hashedPwd
					};
					connection.query("insert into user (username, email, password) values ('" + regUser.username + "', '" + regUser.email + "' ," + regUser.password + "')", function(err, rows){
						if (err)
							return done(err);

						regUser.id = rows.insertId;

					 	return done(null, regUser);
					});
					// bcrypt.hash(password, 8, function(err, hash){ //.hash(password, salt, callback)
					// 	connection.query("insert into user values (" + username, "test@test.de", hash + ")", function(err, rows){
					// 	console.log(rows);
					// 	return done(null, rows.id);
					// 	});
					// });
				} 
			});
		})
	);

	passport.use('login', new PassportLocal({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, username, password, done) {
		connection.query("select * from user where username = ? email = ?", [username], [username], function(err, rows) {
			if (err) {
				return done(err);
			}
			if (!rows.length){
				return done(null, false, {message: 'User nicht vorhanden'});
			}
			else {

				bcrypt.compare(password, rows[0].password, function(err, res){

					if (!res) {
						return done(null, false, {message: "Eingegebenes Passwort ist falsch"});
					}

					return done(null, rows[0]);
				});
			}
		});
	}
	));
};