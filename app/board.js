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
create: function(sketch, callback) {

	var insertSketch = "INSERT INTO Whiteboard (created_date, last_change, created_by, drawing_data, title, bg_white) VALUES (";

	if (sketch.title === "") {
		sketch.title = "Mein Whiteboard";
	}

	insertSketch += mysql.escape(new Date()) + "," + mysql.escape(new Date()) + "," + sketch.userId + "," + mysql.escape(sketch.imageUrl) + 
	"," + mysql.escape(sketch.title) + "," + parseInt(sketch.bg) + ");";

	connection.query(insertSketch, function(err, rows) {
		if (err) throw err;

		callback(err, rows);
	});
},

//Alle Whiteboards abfragen und als json zurückgeben
getAll: function(userId, callback) {
	var getBoards = "SELECT boardId, title, bg_white, CONVERT(drawing_data USING utf8) AS imgData FROM whiteboard WHERE created_by = " + userId + " ORDER BY `last_change` DESC ;";

	connection.query(getBoards, function(err, rows) {
		if (err) throw err;

		callback(err, rows);
	});
},

//Ein Board durch Id zurückgeben
getById: function(userId, boardId, callback) {
	var boardByIdQuery = "SELECT title, CONVERT(drawing_data USING utf8) AS imageUrl, bg_white FROM whiteboard w " + 
			"LEFT JOIN shared s ON w.boardId = s.boardId WHERE w.boardId = " + boardId + " AND (w.created_by = " + userId + 
			" OR s.userId = " + userId + ");";

	connection.query(boardByIdQuery, function(err, rows) {
		callback(err, rows);
	});
},

getShared: function(userId, callback) {
	var sharedQuery = "SELECT boardId, title, bg_white, CONVERT(drawing_data USING utf8) AS imgData FROM whiteboard " + 
			"WHERE boardId IN (SELECT boardId FROM shared WHERE userId = " + userId + ") ORDER BY `last_change` DESC;";

	connection.query(sharedQuery, function(err, rows) {
		callback(err, rows);
	});
},

update: function(boardData, callback) {

	var updateQuery = "UPDATE whiteboard SET drawing_data = " + mysql.escape(boardData.imageUrl) + ", last_change = " + mysql.escape(new Date()) + 
	", bg_white = " + parseInt(boardData.bg);

	if (boardData.hasOwnProperty('title')){
		updateQuery += ", title = " + mysql.escape(boardData.title);
	}

	updateQuery += " WHERE boardId = " + boardData.id;

	connection.query(updateQuery, function(err, rows) {
		callback(err, rows);
	});
},

delete: function(sketch, callback) {

	var sharedDelQuery = "DELETE FROM shared WHERE boardId = " + sketch;
	var boardDelQuery = "DELETE FROM whiteboard WHERE boardId = " + sketch;

	"DELETE whiteboard, shared FROM whiteboard LEFT JOIN shared ON whiteboard.boardId = shared.boardId WHERE whiteboard.boardId = 3;"
},

share: function(details, callback) {

	var insertQuery = "INSERT INTO shared (userId, boardId) VALUES ",
		userIds = details.users;

	for (var user in userIds) {
		insertQuery += "(" + parseInt(userIds[user]) + "," + parseInt(details.boardId) + "),"
	}
	insertQuery = insertQuery.replace(/,$/, ';');

	connection.query(insertQuery, function(err, rows){
		callback(err, rows);
	});
},

info: function(boardId, callback) {
	var infoQuery = "SELECT title, created_date, last_change FROM whiteboard WHERE boardId = " + boardId + ";" + 
	"SELECT username FROM shared sh INNER JOIN user u ON sh.userId = u.userId WHERE boardId = " + boardId + ";";

	connection.query(infoQuery, function(err, rows) {
		callback(err, rows);
	});
}

};

module.exports = new Board();