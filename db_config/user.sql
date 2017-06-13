CREATE TABLE IF NOT EXISTS user {
	userId int NOT NULL AUTO_INCREMENT,
	username VARCHAR(100) NOT NULL,
	email VARCHAR(200) NOT NULL,
	password CHAR(60) NOT NULL,
	
	PRIMARY KEY (id),
	UNIQUE INDEX username_index (username, ASC),
	UNIQUE INDEX email_index (email, ASC)
}