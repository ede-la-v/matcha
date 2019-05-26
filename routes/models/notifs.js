var express = require('express');
var con = require('./connection');


exports.addNotif = function(type, notifier, notified, cb) {
	con.query("INSERT INTO notifs (type, id_notifier, id_notified) VALUES (?,?,?)", [type, notifier, notified], cb);
}

exports.getNotifsUser = function(notified, cb) {
	con.query("SELECT type, id_notifier, users.username, notifs.add_date, vu FROM notifs INNER JOIN users ON notifs.id_notifier = users.id WHERE id_notified = ? ORDER BY notifs.add_date DESC", notified, cb);
}

exports.getLastNotifsUser = function(notified, cb) {
	con.query("SELECT type, id_notifier, users.username, notifs.add_date, vu FROM notifs INNER JOIN users ON notifs.id_notifier = users.id WHERE id_notified = ? ORDER BY notifs.add_date DESC LIMIT 1", notified, cb);
}

exports.vuNotifsUser = function(client, cb) {
	con.query("UPDATE notifs SET vu = 1 WHERE id_notified = ?", client, cb);
}

exports.test = function(user, gender1, gender2, cb) {
	var sql = "SELECT users.username, users.score, users.birthdate, suggid, dist_rel, restag, (dist_rel + IFNULL(restag,0) + IFNULL(score,0))/3 as matching, concat, countsugg, dist, path "+
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
			  			  "WHERE users.gender in (?, ?) and users.id < 800 and users.id != ?"+
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
			  					 		"WHERE users.gender in (?, ?) and users.id < 800 and users.id != ?"+
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
			  "WHERE tab_dist.suggid NOT IN (SELECT id_blocked FROM blocked WHERE id_from = ?) "+
			  "ORDER BY matching "+
			  "DESC;"
con.query(sql, [user, gender1, gender2,user, user, gender1, gender2,user, user, user, user], cb);
}

exports.test2 = function(user, gender1, gender2, tags, dist, cb) {
	var sql = "SELECT users.username, suggid, dist_rel, restag, (dist_rel + IFNULL(restag,0))/2 as matching, concat, countsugg, dist "+
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
			  		 		"WHERE users.gender in (?, ?) and users.id < 800 and users.id != ?"+
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
			  		  			   		  "WHERE users.gender in (?, ?) and users.id < 800 and users.id != ?"+
			  		  			   		  ") as diff2"+
			  		  			   ") as mint "+
			  		  "ON 1 = 1"+
			  		 ") as tab_dist "+
			  "LEFT JOIN ("+
			  			  "SELECT user_id, count(tag_id) as countsugg, count(tag_id) as restag, GROUP_CONCAT(label SEPARATOR ' ') as concat "+
			  			  "FROM tag_user "+
			  			  "INNER JOIN tags "+
			  			  "ON tag_user.tag_id = tags.id "+
			  			  "WHERE find_in_set(label, '"+tags+"') "+
			  			  "GROUP BY tag_user.user_id"+
			  			 ") as tab_tag "+
			  "ON tab_dist.suggid = tab_tag.user_id "+
			  "INNER join users "+
			  "ON tab_dist.suggid = users.id "+
			  "WHERE dist < "+dist+" "+
			  "ORDER BY restag "+
			  "DESC "+
			  "LIMIT 1000 ;"
con.query(sql, [user, gender1, gender2,user, user, gender1, gender2,user, user, tags, dist], cb);
}

