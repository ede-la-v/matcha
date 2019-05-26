var express = require('express');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("DROP DATABASE IF EXISTS matcha", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
  con.query("CREATE DATABASE IF NOT EXISTS matcha", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  con.query("use matcha", function (err, result) {
    if (err) throw err;
    console.log("matcha selected");
  });
  con.query(
  	"CREATE TABLE IF NOT EXISTS users (\
  	  id INT AUTO_INCREMENT PRIMARY KEY,\
  	  username VARCHAR(30) NOT NULL UNIQUE,\
  	  firstname VARCHAR(30) NOT NULL,\
  	  lastname VARCHAR(30) NOT NULL,\
  	  password VARCHAR(200) NOT NULL,\
  	  token VARCHAR(200),\
  	  gender VARCHAR(10),\
  	  orientation VARCHAR(10) DEFAULT 'both',\
  	  bio LONGTEXT,\
  	  address VARCHAR(300),\
  	  lat FLOAT(11,8),\
      lon FLOAT(11,8),\
      score FLOAT(3,2),\
      email VARCHAR(50) NOT NULL UNIQUE,\
      birthdate DATE NOT NULL DEFAULT '1995-11-12',\
      status DATETIME,\
      activated TINYINT NOT NULL DEFAULT 0,\
      add_date DATETIME DEFAULT CURRENT_TIMESTAMP\
    )",
	function (err, result) {
	    if (err) throw err;
	    console.log("users table created");
  	}
  );
  con.query(
  	"CREATE TABLE IF NOT EXISTS tags (\
  	  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      label VARCHAR(50) UNIQUE NOT NULL\
    )",
	  function (err, result) {
	    if (err) throw err;
	    console.log("tags table created");
  	}
  );

  con.query(
  	"CREATE TABLE IF NOT EXISTS tag_user (\
  	  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  	  tag_id INT NOT NULL,\
      user_id INT NOT NULL,\
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,\
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,\
      UNIQUE KEY uk_chosen (tag_id, user_id)\
    )",
	  function (err, result) {
	    if (err) throw err;
	    console.log("tag_user table created");
  	}
  );

  con.query(
    "CREATE TABLE IF NOT EXISTS likes (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      id_liking INT NOT NULL,\
      id_liked INT NOT NULL,\
      add_date datetime DEFAULT CURRENT_TIMESTAMP,\
      FOREIGN KEY (id_liking) REFERENCES users(id) ON DELETE CASCADE,\
      FOREIGN KEY (id_liked) REFERENCES users(id) ON DELETE CASCADE,\
      UNIQUE KEY uk_like (id_liking, id_liked)\
    )",
    function (err, result) {
      if (err) throw err;
      console.log("table likes created");
    }
  );

  con.query(
    "CREATE TABLE IF NOT EXISTS notifs (\
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
      type VARCHAR(30) NOT NULL,\
      id_notifier INT NOT NULL,\
      id_notified INT NOT NULL,\
      vu INT(1) DEFAULT 0,\
      add_date datetime DEFAULT CURRENT_TIMESTAMP\
    )",
    function (err, result) {
      if (err) throw err;
      console.log("table notifications created");
    }
  );

  con.query(
    "CREATE TABLE IF NOT EXISTS messages (\
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
      message VARCHAR(300) NOT NULL,\
      id_messager INT NOT NULL,\
      id_messaged INT NOT NULL,\
      vu INT(1) DEFAULT 0,\
      add_date datetime DEFAULT CURRENT_TIMESTAMP\
    )",
    function (err, result) {
      if (err) throw err;
      console.log("table messages created");
    }
  );

  con.query(
    "CREATE TABLE IF NOT EXISTS pictures (\
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
      id_user INT NOT NULL,\
      rank INT(1) NOT NULL,\
      path TEXT NOT NULL\
    )",
    function (err, result) {
      if (err) throw err;
      console.log("table pictures created");
    }
  );

  con.query(
    'CREATE TABLE IF NOT EXISTS blocked (\
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
      id_blocked INT NOT NULL,\
      id_from INT NOT NULL,\
      FOREIGN KEY (id_blocked) REFERENCES users(id) ON DELETE CASCADE,\
      FOREIGN KEY (id_from) REFERENCES users(id) ON DELETE CASCADE\
    )', (err, result) => {
      if (err) throw err
      console.log('table blocked created')
    }
  )

  con.end();
});
