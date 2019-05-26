var express = require('express');
var con = require('./connection');



// exports.test = async () => {
// 	const mysql = require('mysql2/promise')
// 	const connection =  await mysql.createConnection({ host:'localhost', user: 'root', password: 'root', database: 'matcha', multipleStatements: 'true' });
// 	const sql = 'SELEC * FROM tags'

// 	const [rows, fields] = await connection.query(sql)
// 	return [rows, fields]
// }

exports.search = (id, input, cb) => {
	const sql = 'SELECT id, label\
								FROM tags\
								WHERE id NOT IN (\
									SELECT tag_id FROM tag_user WHERE user_id = ?\
								) AND label LIKE ?'

	con.query(sql, [id, `%${input}%`], cb);
}

exports.getSelected = (id, cb) => {
	const sql = 'SELECT tags.id AS id, tags.label AS label\
								FROM tag_user\
								INNER JOIN tags ON tag_user.tag_id = tags.id\
								WHERE tag_user.user_id = ?'

	con.query(sql, id, cb)
}

exports.getAll = cb => {
	const sql = 'SELECT id, label FROM tags'

	con.query(sql, cb)
}

exports.create = (input, cb) => {
	const sql = 'INSERT INTO tags (label) VALUES (?) ON DUPLICATE KEY UPDATE label=label'

	con.query(sql, input, cb)
}

exports.addToUser = (userId, tagName, cb) => {
	const sql = 'INSERT INTO tag_user(tag_id, user_id)\
								SELECT tags.id, ? FROM tags\
								WHERE tags.label=?\
								ON DUPLICATE KEY UPDATE user_id=user_id;\
							SELECT tags.id, tags.label FROM tag_user\
								INNER JOIN tags ON tags.id=tag_user.tag_id\
								WHERE tag_user.user_id=? AND tags.label=?'

	con.query(sql, [userId, tagName, userId, tagName], cb)
}

exports.deleteFromUser = (tagId, userId, cb) => {
	const sql = 'DELETE FROM tag_user WHERE tag_id = ? AND user_id = ?'

	con.query(sql, [tagId, userId], cb)
}

/*
** OLD FUNCTIONS
*/

exports.getAllAndSelectedTags = (id, cb) => {
	const sql = 'SELECT tags.id AS id, tags.label AS label, IF(users.id IS NULL, FALSE, TRUE) AS isSelected\
								FROM tag_user\
								RIGHT JOIN tags ON tag_user.tag_id = tags.id\
								LEFT JOIN users on tag_user.user_id = users.id\
								WHERE users.id = ? OR users.id IS NULL'
	
	con.query(sql, id, cb)
}

exports.tagExist = function(tag, cb) {
	con.query("SELECT id FROM tags WHERE name = ?", tag, cb);
}

exports.newTag = function(tag, cb) {
	con.query("INSERT INTO tags (name) VALUES (?); SELECT LAST_INSERT_ID() AS 'id'", tag, cb);
}

exports.tagExistUser = function(tag, user, cb) {
	con.query("SELECT id FROM tag_user WHERE id_tag = ? AND id_user = ?", [tag, user], cb);
}

exports.newTagUser = function(tag, user, cb) {
	con.query("INSERT INTO tag_user (id_tag, id_user) VALUES (?, ?)", [tag, user], cb);
}

exports.delTag = function(tag, user, cb) {
	con.query("DELETE tag_user FROM tag_user\
				INNER JOIN tags\
					ON tag_user.id_tag = tags.id\
				WHERE id_user = ? AND tags.name = ?", [user, tag], cb);
}

exports.getTagsUserProfil = function(id_user, id_viewer, cb) {
	con.query("SELECT name, tagviewer.id_user FROM (SELECT tags.id AS idtag, tags.name\
				FROM tag_user\
				INNER JOIN tags\
					ON tag_user.id_tag = tags.id\
				WHERE tag_user.id_user = ?) AS taguser\
				LEFT JOIN (SELECT id_tag, id_user FROM tag_user WHERE id_user = ?) as tagviewer\
					ON taguser.idtag = tagviewer.id_tag\
		", [id_user, id_viewer], cb);
}
