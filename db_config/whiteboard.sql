CREATE TABLE IF NOT EXISTS whiteboard {
	boardId int NOT NULL AUTO_INCREMENT,
	created_date date NOT NULL,
	created_by int NOT NULL,
	drawing_data varbinary NOT NULL,
	title varchar(25),

	PRIMARY KEY (id),
	FOREIGN KEY (created_by) REFERENCES user(userId)
}