var express = require('express');
var con = require('./connection');

exports.getAll = (cb) => {
	var sql = 'SELECT * FROM users'

	con.query(sql, cb);
}

exports.findOne = (username, cb) => {
	var sql = 'SELECT * FROM users WHERE username = ?'

	con.query(sql, [username], cb)
}

exports.getProfile = (id, userId, cb) => {
	var sql = 'SELECT users.id, username, firstname, lastname, email, gender, orientation, bio, lat, lon, birthdate, score, address, status\
							FROM users\
							WHERE users.id = ? AND users.id NOT IN (\
								SELECT id_from FROM blocked WHERE id_blocked = ?\
							)'

	con.query(sql, [id, userId], cb)
}

exports.findEmailOrUsername = (username, email, cb) => {
	var sql = 'SELECT * FROM users WHERE username = ? OR email = ?'

	con.query(sql, [username, email], cb)
}

exports.logIn = (username, password, cb) => {
	var sql = 'SELECT id, username, email, gender, orientation, address, city, country, email\
							FROM users\
							WHERE username = ? AND password = ? and activated = 1'

	con.query(sql, [username, password], cb)
}

exports.create = (username, firstname, lastname, email, password, token, birthdate, cb) => {
	var sql = 'INSERT INTO users (username, firstname, lastname, email, password, token, birthdate)\
							VALUES (?, ?, ?, ?, ?, ?, ?)'

	con.query(sql, [username, firstname, lastname, email, password, token, birthdate], cb)
}

exports.activate = (token, cb) => {
	var sql = 'UPDATE users\
							SET activated = 1, token = (null)\
							WHERE token = ?'

	con.query(sql, [token], cb)
}

exports.findToken = (token, cb) => {
	var sql = 'SELECT * FROM users WHERE token = ?'

	con.query(sql, [token], cb)
}

exports.updateAddress = (address, lat, lon, id, cb) => {
	var sql = 'UPDATE users\
							SET address = ?, lat = ?, lon = ?\
							WHERE id = ?'

	con.query(sql, [address, lat, lon, id], cb)
}

exports.updateOneField = (field, value, id, cb) => {
	var sql = 'UPDATE users\
							SET ?? = ?\
							WHERE id = ?'

	con.query(sql, [field, value, id], cb)
}

exports.updateToken = (token, email, cb) => {
	var sql = 'UPDATE users\
							SET token = ?\
							WHERE email = ? AND activated = 1'

	con.query(sql, [token, email], cb)
}

exports.updateStatus = (id, cb) => {
	var sql = 'UPDATE users\
							SET status = NOW()\
							WHERE id = ?'

	con.query(sql, [id], cb)
}

exports.resetPassword = (password, token, cb) => {
	var sql = 'UPDATE users\
							SET password = ?, token = (null)\
							WHERE token = ?'

	con.query(sql, [password, token], cb)
}

exports.updateScore = (id, cb) => {
	function update(err, result) {
		if (err) cb(err)
		else {
			const sql2 = 'UPDATE users SET score = ? WHERE id = ?'
			const score = [(result[1][0].likes / (result[0][0].views + 1)) * 0.7 + (result[3][0].likes / (result[2][0].views + 1)) * 0.3]
			con.query(sql2, [score, id], cb)
		}
	}

	const sql = 'SELECT COUNT(count) AS views\
							FROM (\
								SELECT count(id) AS count \
									FROM notifs WHERE id_notified = ?\
									AND type = "view" AND time_to_sec(timediff(NOW(), add_date)) < 60*60*24*30\
									GROUP BY id_notifier\
							) AS table_count;\
						SELECT COUNT(id) AS likes\
							FROM likes\
							WHERE id_liked = ?\
							AND time_to_sec(timediff(NOW(), add_date)) < 60*60*24*30;\
						SELECT COUNT(count) AS views\
							FROM (\
								SELECT count(id) AS count \
									FROM notifs WHERE id_notified = ?\
									AND type = "view"\
									GROUP BY id_notifier\
							) AS table_count;\
						SELECT COUNT(id) AS likes\
							FROM likes\
							WHERE id_liked = ?'

	con.query(sql, [id, id, id, id], update)
}

exports.suggestions = (id, gender1, gender2, orientation, cb) => {
	var sql = "SELECT isLiked, likedMe, users.username, users.score, users.gender, users.orientation, users.birthdate, suggid, dist_rel, restag, (dist_rel + IFNULL(restag,0) + IFNULL(score,0))/3 as matching, concat, countsugg, dist, path "+
				"FROM ("+
						"SELECT km.suggid, km.dist, mint.res/km.dist as dist_rel "+
						"FROM ("+
									"SELECT users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist "+
								"FROM users "+
								"RIGHT JOIN ("+
													"SELECT id as client, lat as latc, lon as lonc "+
														"FROM users where id = ?"+
														") as test "+
								"ON 1 = 1 "+
								"WHERE users.gender in (?, ?) and users.id != ?"+
								") as km "+
						"INNER JOIN ("+
										"SELECT min(dist) as res "+
										"from ("+
											"SELECT users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist "+
											"FROM users "+
											"RIGHT JOIN ("+
														"SELECT id as client, lat as latc, lon as lonc "+
														"FROM users where id = ?"+
														") as test2 "+
											"ON 1 = 1 "+
												"WHERE users.gender in (?, ?) and users.id != ?"+
												") as diff2"+
									") as mint "+
						"on 1 = 1"+
						") as tab_dist "+
				"LEFT JOIN ("+
								"SELECT concat, tags.user_id, tags.count as countsugg, tot.count as counttot, client.count as countclient, tags.count / ((tot.count + client.count)/2) as restag "+
								"FROM ("+
											"SELECT truc.user_id, count(client.tag_id) as count, GROUP_CONCAT(ini_tags.label SEPARATOR ' ') as concat "+
											"FROM tag_user as client "+
											"INNER JOIN tags as ini_tags "+
											"ON client.tag_id = ini_tags.id "+
											"INNER JOIN tag_user as truc "+
											"ON client.tag_id = truc.tag_id "+
											"WHERE client.user_id = ? "+
											"GROUP BY truc.user_id"+
										") as tags "+
								"INNER JOIN ("+
													"SELECT user_id, count(user_id) as count "+
													"FROM tag_user "+
													"GROUP BY user_id"+
													") as tot "+
								"ON tags.user_id = tot.user_id "+
								"INNER JOIN ("+
													"SELECT user_id, count(user_id) as count "+
													"FROM tag_user "+
													"GROUP BY user_id) as client "+
								"ON ? = client.user_id"+
							") as tab_tag "+
				"ON tab_dist.suggid = tab_tag.user_id "+
				"INNER JOIN users "+
				"ON tab_dist.suggid = users.id "+
				"INNER JOIN pictures "+
				"ON tab_dist.suggid = pictures.id_user and 1 = pictures.rank "+
				"LEFT JOIN (SELECT id_liked as isLiked FROM likes WHERE id_liking = ?) AS liking "+
				"ON tab_dist.suggid = liking.isLiked "+
				"LEFT JOIN (SELECT id_liking as likedMe FROM likes WHERE id_liked = ?) AS liked "+
				"ON tab_dist.suggid = liked.likedMe "+
				"WHERE tab_dist.suggid NOT IN (SELECT id_blocked FROM blocked WHERE id_from = ?) AND (users.orientation = 'both' OR users.orientation = ?) AND isLiked IS NULL "+
				"ORDER BY matching "+
				"DESC LIMIT 100"

	con.query(sql, [id, gender1, gender2, id, id, gender1, gender2, id, id, id, id, id, id, orientation], cb);
}

exports.search = (id, gender1, gender2, tags, dist, age, score, page, cb) => {
	var sql = "SELECT isLiked, likedMe, users.username, users.score, users.birthdate, suggid, dist_rel, restag, (dist_rel + IFNULL(restag,0))/2 as matching, concat, countsugg, dist, path "+
	"FROM ("+
			 "SELECT km.suggid, km.dist, mint.res/km.dist as dist_rel "+
			 "FROM ("+
					 "SELECT users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist "+
					 "FROM users "+
					 "RIGHT JOIN ("+
									"SELECT id as client, lat as latc, lon as lonc "+
									"FROM users "+
									"WHERE id = ?"+
								 ") as test "+
					 "ON 1 = 1 "+
					 "WHERE users.gender in (?, ?) and users.id != ?"+
					 ") as km "+
				"INNER JOIN ("+
								 "SELECT min(dist) as res "+
								 "FROM ("+
											 "SELECT users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist "+
											 "FROM users "+
											 "RIGHT JOIN ("+
																"SELECT id as client, lat as latc, lon as lonc "+
																"FROM users "+
																"WHERE id = ?"+
																") as test2 "+
											 "ON 1 = 1 "+
											 "WHERE users.gender in (?, ?) and users.id != ?"+
											 ") as diff2"+
								 ") as mint "+
				"ON 1 = 1"+
			 ") as tab_dist "+
	"LEFT JOIN ("+
					"SELECT user_id, count(tag_id) as countsugg, count(tag_id) as restag, GROUP_CONCAT(label SEPARATOR ' ') as concat "+
					"FROM tag_user "+
					"INNER JOIN tags "+
					"ON tag_user.tag_id = tags.id "+
					"WHERE find_in_set(label, ?) "+
					"GROUP BY tag_user.user_id"+
				 ") as tab_tag "+
	"ON tab_dist.suggid = tab_tag.user_id "+
	"INNER join users "+
	"ON tab_dist.suggid = users.id "+
	"INNER JOIN pictures "+
	"ON tab_dist.suggid = pictures.id_user and 1 = pictures.rank "+
	"LEFT JOIN (SELECT id_liked as isLiked FROM likes WHERE id_liking = ?) AS liking "+
	"ON tab_dist.suggid = liking.isLiked "+
	"LEFT JOIN (SELECT id_liking as likedMe FROM likes WHERE id_liked = ?) AS liked "+
	"ON tab_dist.suggid = liked.likedMe "+
	"WHERE tab_dist.suggid NOT IN (SELECT id_blocked FROM blocked WHERE id_from = ?) AND dist < ? AND (users.score BETWEEN ? AND ?) AND (TIMESTAMPDIFF(YEAR, users.birthdate, CURDATE()) BETWEEN ? AND ?) "+
	"ORDER BY restag "+
	"DESC "+
	"LIMIT 100 OFFSET ?"

	con.query(sql, [id, gender1, gender2, id, id, gender1, gender2, id, tags, id, id, id, dist, score[0], score[1], age[0], age[1], page], cb);
}
