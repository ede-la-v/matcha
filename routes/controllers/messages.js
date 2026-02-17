var express = require('express');
var router = express.Router();
var Messages = require('../models/messages');
var { isAuthenticated } = require('../middlewares/auth')

router.post('/conv', isAuthenticated, function(req, res, next) {
  Messages.getConv(req.body.id, req.decoded.id, function(err, messages){
      if (err) console.log(err);
      Messages.setVu(req.body.id, req.decoded.id, function(err, messages){
          if (err) console.log(err);
      });
      res.json(messages)
  });
    

});

router.post('/new', isAuthenticated, function(req, res, next) {
  Messages.newMess(req.body.message, req.body.id, req.decoded.id, function(err, messageId){
      if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Failed to create message' });
      }
      Messages.countMessages(req.body.id, function(err, count){
          if (err) {
              console.log(err);
              return res.status(500).json({ error: 'Failed to count messages' });
          }
          res.json({ 
              id: messageId, 
              notifiedCount: count && count[0] ? count[0].count : 0
          });
      });
  });
    

});

router.get('/convs', isAuthenticated, function(req, res, next) {
  Messages.getConvs(req.decoded.id, function(err, convs){
      if (err) console.log(err);
      Messages.getNonVu(req.decoded.id, function(err, nonVu){
      if (err) console.log(err);
      for (var i = 0; i < convs.length; i++)
      {
        for (var j = 0; j < nonVu.length; j++)
        {
          if (convs[i].username == nonVu[j].new_id)
            convs[i].nonVu = nonVu[j].nonvu;
        }
      }
      res.json(convs)
    });
  });
});

router.post('/searchMatchs', isAuthenticated, function(req, res, next) {
  Messages.searchMatchs(req.body.matchs, req.decoded.id, function(err, matchs){
      if (err) console.log(err);
      res.json(matchs)
  });
});

router.get('/countMessages', isAuthenticated, function(req, res, next) {
      //res.send('respond with a resource');  
  Messages.countMessages(req.decoded.id, function(err, messages){
      if (err) console.log(err);
      res.json(messages)
  });
});


 


module.exports = router;
