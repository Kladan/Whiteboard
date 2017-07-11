
var PassportLocal = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var mysql = require('mysql');
var dbConfig = require('../db_config/database');

var connection = mysql.createConnection(dbConfig.connection);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err);
    return;
  }
});

connection.query('USE ' + dbConfig.database);

module.exports = function(passport) {

	//Session Funktionen für Serialisierung in einem Session Cookie und Deserialisierung aus einem Session Cookie

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(user, done) {
		connection.query('select * from user where userId = ? ', [user], function(err, user) {
			done(err, user[0]);
		});
	});


	//Registrierung

	passport.use('registration', new PassportLocal({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback : true //die komplette request wird zum Callback geschoben
		},

		function (req, username, password, done) {
			connection.query("select * from user where username = ? or email = ?;", [username, req.body.email], function(err, rows) {
				if (err) {
					return done(err);
				}
				if (rows.length) {
					return done(null, false); //Username / E-Mail existiert bereits
				}
				else {

					var signupUser = {
						username: username,
						email: req.body.email,
						password: ""
					};

					bcrypt.hash(password, 8, function(err, hash) { //.hash(password, salt, callback)

						var query = "insert into user (username, email, password) values (?,?,?);";

						connection.query(query, [signupUser.username, signupUser.email, hash], function(err, rows){

								if (err) {
									return done(err);
								}
								signupUser.password = hash;
								signupUser.id = rows.insertId;

								return done(null, signupUser);
						});
					});

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
		connection.query("select * from user where username = ? or email = ?", [username, username], function(err, rows) {
			if (err) {
				return done(err);
			}
			if (!rows.length){
				return done(null, false); //User nicht vorhanden
			}
			else {
				bcrypt.compare(password, rows[0].password, function(err, res){

					if (!res) {
						return done(null, false); //Passwort ist falsch
					}
					var user = {
						id: rows[0].userId,
						username: rows[0].username,
						email: rows[0].email,
						password: rows[0].password
					}
					return done(null, user);
				});
			}
		});
	}
	));
};