var express = require('express');
var con = require('./connection');


exports.create = (liking, liked, cb) => {
	const sql = 'INSERT INTO likes (id_liking, id_liked)\
								VALUES (?,?)\
								ON DUPLICATE KEY UPDATE id_liking=id_liking'

	con.query(sql, [liking, liked], cb);
}

exports.delete = function(liking, liked, cb) {
	const sql = 'DELETE FROM likes\
								WHERE id_liking = ? AND id_liked = ?'

	con.query(sql, [liking, liked], cb);
}

exports.get = function(id, cb) {
	const sql = 'SELECT id_liking\
								FROM likes\
								WHERE id = ?'

	con.query(sql, [liking, liked], cb);
}

exports.doesLike = function(id1, id2, cb) {
	const sql = 'SELECT IF(COUNT(*), (true), (false)) AS does_like\
								FROM likes\
								WHERE id_liking = ? AND id_liked = ?'

	con.query(sql, [id1, id2], cb)
}

exports.getAllForUser = function(like, cb) {
	const sql = 'SELECT users.username, likes.add_date\
								FROM likes\
								INNER JOIN users ON likes.id_liking = users.id\
								WHERE id_like = ? AND vu = 0\
								ORDER BY likes.add_date DESC'

	con.query(sql, [like], cb)
}






 
