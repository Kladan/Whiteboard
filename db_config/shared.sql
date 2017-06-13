CREATE TABLE IF NOT EXISTS shared {
	sharedId int NOT NULL AUTO_INCREMENT,
	userId int NOT NULL,
	boardId int NOT NULL,
	
	FOREIGN KEY (userId) REFERENCES user(userId),
	FOREIGN KEY (boardId) REFERENCES whiteboard(boardId)
}