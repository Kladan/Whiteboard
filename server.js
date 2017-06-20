var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var port = process.env.PORT || 8080;
var app = express();

require('./app/passport')(passport); //passport konfigurieren

app.use(cookieParser())  //cookies lesen (authentication)

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());


//Wird für passport benötigt (session handling)
app.use(session({
	secret: 'sketchbooksecret',
	resave: true,
	saveUninitialized: true
 } )); // session secret

app.use(passport.initialize());
app.use(passport.session()); //persistent login session
app.use(flash()); //flash messages für Fehler

require('./app/routes')(app, passport); //routes laden mit konfiguriertem passport

app.listen(port);
console.log("Anwendung läuft auf Port: " + port);