const express = require('express')
const con = require('./connection')

exports.create = (id, rank, path, cb) => {
  const sql = 'DELETE FROM pictures WHERE id_user = ? AND rank = ?;\
                INSERT INTO pictures (id_user, rank, path)\
                VALUES(?, ?, ?);\
                SELECT LAST_INSERT_ID()'
  
  con.query(sql, [id, rank, id, rank, path], cb)
}

exports.getCount = (id, cb) => {
  const sql = 'SELECT COUNT(*) AS count FROM pictures WHERE id_user = ?'

  con.query(sql, [id], cb)
}

exports.getUserPictures = (id, cb) => {
  const sql = 'SELECT * FROM pictures WHERE id_user = ?'

  con.query(sql, [id], cb)
}

exports.deleteUserAtRank = (id, rank, cb) => {
  const sql = 'DELETE FROM pictures WHERE id_user = ? AND rank = ?'

  con.query(sql, [id, rank], cb)
}