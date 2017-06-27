//Module laden
//require mysql, database config
//mysql connection erstellen
//use sketchbookdb

var mysql = require('mysql');
var dbConfig = require('../db_config/database');
var connection;

function Board() {
	connection = mysql.createConnection(dbConfig.connection);
	connection.query('USE ' + dbConfig.database);
}


Board.prototype.Service = {

//Bild in Db erstellen
create: function(sketch) {

	var insertSketch = "INSERT INTO Whiteboard (created_date, last_change, created_by, drawing_data, title, bg_white) VALUES (";

	if (sketch.title === "") {
		sketch.title = "Mein Whiteboard";
	}

	insertSketch += mysql.escape(new Date()) + "," + mysql.escape(new Date()) + "," + sketch.userId + "," + mysql.escape(sketch.imageUrl) + 
	"," + mysql.escape(sketch.title) + "," + parseInt(sketch.bg) + ");";

	connection.query(insertSketch, function(err, rows) {
		if (err) throw err;

		return rows.insertId;
	});
},

//Alle Whiteboards abfragen und als json zurückgeben
getAll: function(userId, callback) {
	var getBoards = "SELECT * FROM whiteboard WHERE created_by = " + userId + ";";

	connection.query(getBoards, function(err, rows) {
		if (err) throw err;
		callback(err, rows);
	});
},

//Ein Board durch Id zurückgeben
getById: function(boardId) {
	var getBoardById = "SELECT * FROM whiteboard WHERE boardId = " + boardId + ";";

	connection.query(getBoardById, function(err, rows) {
		if (err) throw err;
		return rows;
	});
}

};

module.exports = new Board();