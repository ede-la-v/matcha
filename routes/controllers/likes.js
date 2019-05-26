const express = require('express');
const router = express.Router();

const Likes = require('../models/likes');
const { isAuthenticated } = require('../middlewares/auth')

router.get('/', isAuthenticated, (req, res, next) => {
  Likes.getAllForUser(req.decoded.id, (err, likes) => {
    if (err) throw err;
    res.json(likes);
  });
});

router.post('/', isAuthenticated, (req, res, next) => {
  const { like } = req.body

  Likes.create(like, req.session.user[0].id, (err, status) => {
    if (err) res.status(500).json(err)
    else res.status(201).send()
  });
});

router.delete('/', isAuthenticated, (req, res, next) => {
  Likes.delete(like, req.session.user[0].id, (err, status) => {
    if (err) res.status(500).json(err)
    else res.status(200).send()
  });
})

module.exports = router;
