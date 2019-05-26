const jwt = require('jsonwebtoken')
const config = require('../../config')
const Blocked = require('../models/blocked')

exports.isAuthenticated = (req, res, next) => {
  const authHeader = req.get('authorization')
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    try {
      req.decoded = jwt.verify(token, config.jwtSecret)
    } catch(err) {
      return res.status(401).json({ error: 'Token not valid' })
    }
    next()
  } else {
    res.status(401).json({ error: 'No token provided' })
  }
}

exports.isBlocked = (req, res, next) => {
  Blocked.isBlocked(req.params.id, req.decoded.id, (err, results) => {
    if (err) throw err
    if (results.length) {
      res.status(403).json({ error: 'You do not have permission to see that user' })
    } else {
      next()
    }
  })
}