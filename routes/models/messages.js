var express = require('express');
var con = require('./connection');

exports.getConv = function(match, client, cb) {
	con.query("SELECT name_messager.username AS messager, name_messaged.username AS messaged, messages.message, messages.add_date\
				FROM messages \
				INNER JOIN users AS name_messager \
					ON messages.id_messager = name_messager.id \
				INNER JOIN users as name_messaged \
					ON messages.id_messaged = name_messaged.id \
				WHERE (id_messager = ? AND id_messaged = ?) OR (id_messager = ? AND id_messaged = ?) \
				ORDER BY messages.add_date \
				", [match, client, client, match], cb);
}

exports.newMess = function(message, id_messaged, id_messager, cb) {
	con.query("INSERT INTO messages (message, id_messaged, id_messager) VALUES (?, ?, ?)", [message, id_messaged, id_messager], cb);
}

exports.getConvs = function(client, cb) {
	var sql = "SELECT convs.id, username, message, ifnull(messages.add_date, convs.add_date) as add_datef FROM(\
							SELECT users.id, username, if(liking.add_date > liked.add_date, liking.add_date, liked.add_date) as add_date FROM users\
							INNER JOIN (SELECT * FROM likes WHERE id_liking = ?) AS liking\
								ON users.id = liking.id_liked\
							INNER JOIN (SELECT * FROM likes WHERE id_liked = ?) AS liked\
								ON users.id = liked.id_liking\
							) as convs\
				LEFT JOIN (\
							SELECT name_messager.id AS messager_id, name_messager.username AS messager, name_messaged.id AS messaged_id, name_messaged.username AS messaged, m1.message, m1.add_date\
							FROM messages m1 LEFT JOIN messages m2\
								ON ((m1.id_messager = m2.id_messager AND m1.id_messaged = m2.id_messaged) AND m1.id < m2.id)\
							INNER JOIN users AS name_messager \
								ON m1.id_messager = name_messager.id \
							INNER JOIN users as name_messaged \
								ON m1.id_messaged = name_messaged.id \
							WHERE m2.id IS NULL AND (m1.id_messaged = ? OR m1.id_messager = ?)\
							ORDER BY m1.add_date\
							DESC\
							) as messages\
				ON convs.id = messages.messager_id OR convs.id = messages.messager_id\
				ORDER BY add_datef DESC"
	con.query(sql, [client, client, client, client], cb);
}

exports.getNonVu = function(client, cb) {
	var sql = "select id_messager as new_id, count(vu) - sum(vu) as nonvu from messages where id_messaged = ? group by id_messager, id_messaged"
	con.query(sql, [client], cb);
}

exports.searchMatchs = function(like, id, cb) {
	var sql = "SELECT users.id, username FROM users\
				INNER JOIN (SELECT * FROM likes WHERE id_liking = ?) AS liking\
					ON users.id = liking.id_liked\
				INNER JOIN (SELECT * FROM likes WHERE id_liked = ?) AS liked\
					ON users.id = liked.id_liking\
				WHERE username LIKE '%"+like+"%'"
	con.query(sql, [id, id], cb);
}

exports.setVu = function(match, client, cb) {
	var sql = "UPDATE messages SET vu = 1 WHERE id_messaged = ? AND id_messager = ?"
	con.query(sql, [client, match], cb);
}

exports.countMessages = function(id, cb) {
	var sql = "SELECT count(vu) - sum(vu) as count FROM messages WHERE id_messaged = ?"
	con.query(sql, [id], cb);
}











 
