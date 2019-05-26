var express = require('express');
var router = express.Router();
var Notifs = require('../models/notifs');

var { isAuthenticated } = require('../middlewares/auth')

router.get('/notifs_user', isAuthenticated, function(req, res, next) {
  Notifs.getNotifsUser(req.decoded.id, function(err, notifs){
    if (err) throw err;
    res.json(notifs);
  });
});

router.get('/vu', isAuthenticated, function(req, res, next) {
  Notifs.vuNotifsUser(req.decoded.id, function(err, test){
    if (err) throw err;
    res.end()
  });
});

router.post('/click', function(req, res, next) {
  var action = req.body.action
  var like = req.body.like
  if (action == "add")
  {
    Likes.addLike(like, req.decoded.id, function(err, tags){
      if (err) console.log(err);
    });
  }
  else
  {
    Likes.delLike(like, req.decoded.id, function(err, tags){
      if (err) console.log(err);
    });
  }
  res.end();
});

router.post('/test', isAuthenticated, function(req, res, next) {
  if (req.body.gender == "both" || req.body.gender == null)
  {
    var gender1 = "homme"
    var gender2 = "femme"
  }
  else if (req.body.gender == "femme")
  {
    var gender1 = "femme"
    var gender2 = "femme"
  }
  else if (req.body.gender == "homme")
  {
    var gender1 = "homme"
    var gender2 = "homme"
  }
  Notifs.test(req.decoded.id, gender1, gender2, function(err, test){
    if (err) throw err;
    res.json(test)
  });
});

router.post('/test2', isAuthenticated, function(req, res, next) {
  if (req.body.gender.length == 0 || req.body.gender.length == 2)
  {
    var gender1 = "homme"
    var gender2 = "femme"
  }
  else
    {
    var gender1 = req.body.gender[0]
    var gender2 = req.body.gender[0]
  }
  Notifs.test2(req.decoded.id, gender1, gender2, req.body.tags, Number(req.body.dist), function(err, test){
    if (err) throw err;
    res.json(test)
  });
});

module.exports = router;
