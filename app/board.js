
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

//Bild in Db speichern
save: function(sketch) {

	var insertSketch = "INSERT INTO Whiteboard (created_date, last_change, created_by, drawing_data, title, bg_white) VALUES (?,?,?,?,?,?);";

	if (sketch.title === "") {
		sktech.title = "Mein Whiteboard";
	}

	connection.query(insertSketch, [new Date(), new Date(), sketch.userId, sketch.imageUrl, sketch.title, sketch.bg], function(err, rows) {
		if (err) throw err;

		return rows[0].insertId;
	});
},

//Alle Whiteboards abfragen und als json zurückgeben
getAll: function() {

},

//Mit Id zurückgeben
getById: function(id) {

}

};


module.exports = Board;