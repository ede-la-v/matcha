var express = require('express');
var router = express.Router();
var Tags = require('../models/tags');
const { isAuthenticated } = require('../middlewares/auth')

router.get('/', isAuthenticated, (req, res, next) => {
  Tags.getAll((err, tags) => {
    if (err) res.status(500).json(err)
    else {
      res.json(tags)
    }
  })
})

router.post('/search', isAuthenticated, (req, res, next) => {
  const { input } = req.body
  
  if (!input || input.length <= 1 || input.length > 50) {
    res.status(400).json({ message: 'Valeur de recherche invalide. La valeur doit être comprise entre 2 et 50 caractères' })
  } else {
    Tags.search(req.decoded.id, input, (err, tags) => {
      if (err) res.status(500).json(err)
      else {
        res.json(tags);
      }
    })
  }
})

router.get('/', isAuthenticated, (req, res, next) => {
  Tags.getAllAndSelectedTags(req.decoded.id, (err, tags) => {
    if (err) throw err
    res.json(tags)
  })
})

router.get('/:id', (req, res, next) => {
  Tags.getSelectedTags(req.params.id, (err, tags) => {
    if (err) throw err
    res.json(tags)
  })
})

router.put('/:id', isAuthenticated, (req, res, next) => {
    Tags.addTag(req.params.id, req.decoded.id, (err) => {
			if (err) throw err
			res.end()
    })
})

router.delete('/:id', isAuthenticated, (req, res, next) => {
	Tags.deleteTag(req.params.id, req.decoded.id, (err) => {
		if (err) throw err
		res.end()
	})
})



router.post('/new_tag', function(req, res, next) {
      //res.send('respond with a resource');
    var tag = validator.escape(req.body.tag);
    if (validator.isLength(tag, {min: 1, max: 50}))
    {
        Tags.tagExist( tag, function(err, tag1){
            if (err) throw err;
            if (tag1.length === 0)
            {
                Tags.newTag(tag, function(err, tag2){
                    if (err) console.log(tag2);
                    Tags.tagExistUser(tag2[1][0].id, req.session.user[0].id, function(err, tag3){
                        if (err) console.log("la");
                        Tags.newTagUser(tag2[1][0].id, req.session.user[0].id, function(err, tag4){
                            if (err) console.log(tag2[1]);
                        }); 
                    });
                });
            }
            else
            {
                Tags.tagExistUser(tag1[0].id, req.session.user[0].id, function(err, tag3){
                    if (err) throw err;
                    if (tag3.length === 0)
                    {
                        Tags.newTagUser(tag1[0].id, req.session.user[0].id, function(err, tag4){
                            if (err) throw err;
                                
                        });
                     }   
                });
                    
            }

        });
    }
    

});

router.post('/del_tag', function(req, res, next) {
      //res.send('respond with a resource');
    var tag = validator.escape(req.body.tag);
    if (validator.isLength(tag, {min: 1, max: 50}))
    {
        console.log(tag);
        Tags.delTag(tag, req.session.user[0].id, function(err){
            if (err) throw err;
            Tags.getTagsUser(req.session.user[0].id, function(err, tags){
                if (err) throw err;
                res.json(tags);
            });
        });
    }
    

});
 


module.exports = router;
