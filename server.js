var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

var port = process.env.PORT || 8080; //Umgebungsvariable PORT bzw. 8080
var app = express();

require('./app/passport')(passport); //passport konfigurieren

app.use("/views", express.static(__dirname + '/views'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/img", express.static(__dirname + '/img'));

app.use(cookieParser())  //cookies lesen (authentication)

app.use(bodyParser.urlencoded({
	extended: true,
	limit: '16mb'
}));
app.use(bodyParser.json());


//Wird für passport benötigt (session handling)
app.use(session({
	secret: 'sketchbooksecret',
	resave: true,
	saveUninitialized: true
 } ));

app.use(passport.initialize());
app.use(passport.session()); //persistente login session


require('./app/routes')(app, passport, __dirname); //routes laden mit konfiguriertem passport

app.use(function (req, res, next) {
    res.status(404);
    res.redirect('/notfound');
});

app.listen(port);
console.log("Anwendung läuft auf Port: " + port);