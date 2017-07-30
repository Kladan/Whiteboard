var mysql = require('mysql');
var dbConfig = require('../db_config/database');
var connection;

function Board() {
	connection = mysql.createConnection(dbConfig.connection);
	connection.query('USE ' + dbConfig.database);
}


Board.prototype.Service = {

//Bild in DB speichern
create: function(sketch, callback) {

	var insertSketch = "INSERT INTO whiteboard (created_date, last_change, created_by, drawing_data, title, bg_white) VALUES (";

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

//Alle Whiteboards eines Users abfragen
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

//Alle geteilten Boards abfragem
getShared: function(userId, callback) {
	var sharedQuery = "SELECT boardId, title, bg_white, CONVERT(drawing_data USING utf8) AS imgData FROM whiteboard " + 
			"WHERE boardId IN (SELECT boardId FROM shared WHERE userId = " + userId + ") ORDER BY `last_change` DESC;";

	connection.query(sharedQuery, function(err, rows) {
		callback(err, rows);
	});
},

//Bild aktualisieren
update: function(boardData, callback) {

	var updateQuery = "UPDATE whiteboard SET drawing_data = " + mysql.escape(boardData.imageUrl) + ", last_change = " + mysql.escape(new Date()) + 
	", bg_white = " + parseInt(boardData.bg);

	if (boardData.hasOwnProperty('title')){
		if (boardData.title != "")
			updateQuery += ", title = " + mysql.escape(boardData.title);
	}

	updateQuery += " WHERE boardId = " + boardData.id;

	connection.query(updateQuery, function(err, rows) {
		callback(err, rows);
	});
},

//Bild löschen
delete: function(sketch, callback) {

	var deleteQuery = "DELETE FROM shared WHERE boardId = ?; DELETE FROM whiteboard WHERE boardId = ?;";

	connection.query(deleteQuery, [sketch, sketch], function(err, rows) {
		callback(err, rows);
	});
},

//Board teilen
share: function(details, callback) {

	var insertQuery = "INSERT INTO shared (userId, boardId) VALUES ",
		userIds = details.users.filter(uniqueValues);

	for (var user in userIds) {
		insertQuery += "(" + parseInt(userIds[user]) + "," + parseInt(details.boardId) + "),"
	}
	insertQuery = insertQuery.replace(/,$/, ';');

	connection.query(insertQuery, function(err, rows){
		callback(err, rows);
	});
},

//Informationen eines Boards zurückgeben
info: function(boardId, callback) {
	var infoQuery = "SELECT title, created_date, last_change, username as creator FROM whiteboard w INNER JOIN user u ON w.created_by = u.userId " + 
		"WHERE w.boardId = " + boardId + ";" + 
		"SELECT username FROM shared sh INNER JOIN user u ON sh.userId = u.userId WHERE boardId = " + boardId + ";";

	connection.query(infoQuery, function(err, rows) {
		callback(err, rows);
	});
}

};

//Hilfsmethode um Duplikate zu entfernen
function uniqueValues(value, index, self) {
	return self.indexOf(value) === index;
}

//Boards "exportieren" für andere Module
module.exports = new Board();