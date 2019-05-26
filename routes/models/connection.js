var express = require('express');
var mysql = require('mysql');

var con = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'root',
		  database : 'matcha',
		  multipleStatements: true
});

con.connect();

module.exports = con;
