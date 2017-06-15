var mysql = require('mysql');
var dbConfig = require('./database');

var connection = mysql.createConnection(dbConfig.connection);

connection.query('CREATE DATABASE IF NOT EXISTS ' + dbConfig.database);


connection.query("CREATE TABLE IF NOT EXISTS sketchbookdb.user ( `userId` int NOT NULL AUTO_INCREMENT, " +
	"`username` VARCHAR(100) NOT NULL, `email` VARCHAR(200) NOT NULL, `password` CHAR(60) NOT NULL," +
	"\nPRIMARY KEY (userId)," +
	"\nUNIQUE KEY `user_index` (`username`, `email`) );", function(error, results, fields){
	if (error) throw error;
});

connection.query("CREATE TABLE IF NOT EXISTS sketchbookdb.whiteboard ( `boardId` int NOT NULL AUTO_INCREMENT, " +
	"`created_date` date NOT NULL, `created_by` int NOT NULL, `drawing_data` LONGBLOB NOT NULL, " +
	"`title` varchar(25), \nPRIMARY KEY (boardId), " +
	"\nFOREIGN KEY (`created_by`) REFERENCES sketchbookdb.user(`userId`) );", function(error, results, fields){
	if (error) throw error;
});

connection.query("CREATE TABLE IF NOT EXISTS sketchbookdb.shared ( `sharedId` int NOT NULL AUTO_INCREMENT, " +
	"`userId` int NOT NULL, `boardId` int NOT NULL, " +
	"\nPRIMARY KEY (sharedId), " +
	"\nFOREIGN KEY (userId) REFERENCES sketchbookdb.user(userId), " +
	"\nFOREIGN KEY (boardId) REFERENCES sketchbookdb.whiteboard(boardId) );", function(error, results, fields){
	if (error) throw error;
});

console.log("Database created!");

connection.end();
