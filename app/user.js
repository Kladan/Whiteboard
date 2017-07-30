
var mysql = require('mysql');
var dbConfig = require('../db_config/database');
var connection;

function User() {
	connection = mysql.createConnection(dbConfig.connection);
	connection.query('USE ' + dbConfig.database);
}

User.prototype.Service = {
	//Für die Share Funktionalität
	//Gibt alle User zurück, außer sich selbst, die mit dem "username" anfangen.
	//Ergebnisse sind auf 5 limitiert.
	getUser: function(userId, username, boardId, callback) {

		var userQuery = "SELECT userId, username FROM user WHERE userId != " + userId + " AND userId NOT IN (SELECT userId FROM shared " +
				"WHERE boardId = " + parseInt(boardId) +") AND username like \"" + username + "%\" LIMIT 5;";

		connection.query(userQuery, function(err, rows) {
			callback(err, rows);
		})
	}
};


module.exports = new User();