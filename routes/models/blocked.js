const express = require('express')
const con = require('./connection')

exports.isBlocked = (idBlocked, idFrom, cb) => {
  const sql = 'SELECT id FROM blocked WHERE id_blocked = ? AND id_from = ? LIMIT 1'

  con.query(sql, [idBlocked, idFrom], cb)
}

exports.add = (idBlocked, idFrom, cb) => {
  const sql = 'INSERT INTO blocked (id_blocked, id_from) VALUES (?, ?)'

  con.query(sql, [idBlocked, idFrom], cb)
}