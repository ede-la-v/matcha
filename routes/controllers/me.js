const express = require('express')
const router = express.Router()
const fs = require('fs')

const Users = require('../models/users')
const Likes = require('../models/likes')
const Pictures = require('../models/pictures')
const Tags = require('../models/tags')
const crypto = require('crypto');

const { isAuthenticated } = require('../middlewares/auth')
const Mail = require('../middlewares/mail')

var bcrypt = require('bcrypt');
const saltRounds = 10;

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

router.get('/', isAuthenticated, (req, res) => {
  let payload = {}

	Users.getProfile(req.decoded.id, req.decoded.id, (err, result) => {
    if (err) res.status(500).json(err)
    else {
      payload.user = result[0]
      Tags.getSelected(req.decoded.id, (err, tags) => {
        if (err) res.status(500).json(err)
        else {
          payload.tags = tags
          Pictures.getUserPictures(req.decoded.id, (err, pictures) => {
            if (err) return res.status(500).json(err)
            payload.pictures = []
            pictures.forEach(picture => {
              const file = fs.readFileSync(`${__dirname}/../../${picture.path}.png`)
              const data = new Buffer(file).toString('base64')
              payload.pictures.push({ id: picture.id, data: data, rank: picture.rank })
            })
            res.json(payload)
          })
        }
      })
    }
	})
})

router.put('/', isAuthenticated, (req, res, next) => {
  const { type, input } = req.body
  let message = ''

  switch(type) {
    case 'password':
      if (input.length < 8 || !(/\d/.test(input))) {
        message = 'Mot de passe invalide. Au moins 8 caractères et un chiffre requis.'
      }
      break
    case 'email':
      if (!validateEmail(input)){
        message = 'Adresse email invalide.'
      }
      break
    default :
      message = ''
  }

  if (message.length) {
    res.status(400).json({ message })
  } else {
    Users.updateOneField(type, input, req.decoded.id, err => {
      if (err) res.status(500).json(err)
      else {
        res.send()
      }
    })
  }
})

/*
** TAGS
*/

router.get('/tags', isAuthenticated, (req, res, next) => {
  Tags.getSelected(req.decoded.id, (err, tags) => {
    if (err) read.status(500).send()
    else {
      res.json(tags)
    }
  })
})

router.put('/tags', isAuthenticated, (req, res, next) => {
  const { input } = req.body
  
  if (!input || input.length <= 1 || input.length > 50) {
    res.status(400).json({ message: 'Tag invalide. Le tag doit être compris entre 2 et 50 caractères', input })
  } else {
    Tags.create(input, err => {
      if (err) res.status(500).json(err)
      else {
        Tags.addToUser(req.decoded.id, input, (error, result) => {
          if (error) res.status(500).json(error)
          else {
            res.status(201).json(result[1])
          }
        })
      }
    })
  }
})

router.delete('/tags/:id(\\d+)', isAuthenticated, (req, res, next) => {
  const { id } = req.params

  if (!Number.isInteger(parseInt(id)) || parseInt(id) < 1) {
    res.status(400).json({ message: 'Le champ id du tag doit être un nombre entier valide supérieur a 0', id })
  } else {
    Tags.deleteFromUser(id, req.decoded.id, err => {
      if (err) res.status(500).json(err)
      else {
        res.send()
      }
    })
  }
})

/*
** RESET AND ACTIVATION
*/

router.post('/activate', (req, res) => {
	const { token } = req.body

  Users.findToken(token, (err, result) => {
    if (err) res.status(500).json(err)
    else if (!result.length) {
      res.status(400).json({ message: 'Le token est invalide', token })
    }
    else {
      Users.activate(token, err => {
        if (err) res.status(500).send(err)
        else {
          res.send()
        }
      })
    }
  })
})

router.post('/reset', (req, res) => {
  const { input } = req.body
  
  Users.findOne(input, (err, result) => {
    if (err) res.status(500).json(err)
    else if (!result[0] || !result[0].id) {
      res.status(404).json({ message: 'L\'utilisateur est introuvable' })
    } else if (!result[0].activated) {
      res.status(400).json({ message: 'Le compte n\'est pas activé' })
    } else {
      var token = crypto.randomBytes(64).toString('hex')
      const email = result[0].email
      Users.updateToken(token, email, (err, result) => {
        if (err) return res.status(500).json(err)
        else {
          Mail.resetPassword(email, token)
          return res.send()
        }
      })
    }
  })
});

router.put('/reset', (req, res) => {
  const { token, password } = req.body

  Users.findToken(token, (err, result) => {
    if (err) res.status(500).json(err)
    else if (!result.length) {
      res.status(400).json({ message: 'Le token est invalide.', token })
    } else if (password.length < 8 || !(/\d/.test(password))) {
      res.status(400).json({ message: 'Mot de passe invalide. Au moins 8 caractères et un chiffre requis.', password })
    } else {
      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync(password, salt);
      Users.resetPassword(hash, token, err => {
        if (err) return res.status(500).json(err)
        else res.send()
      })
    }
  })
})

/*
** MATCHING
*/

router.post('/suggestions', isAuthenticated, (req, res, next) => {
  const { orientation, gender } = req.body
  let gender1, gender2 = ''

  switch (orientation) {
    case 'femme':
      gender1 = 'femme'
      gender2 = 'femme'
      break
    case 'homme':
      gender1 = 'homme'
      gender2 = 'homme'
      break
    default:
      gender1 = 'homme'
      gender2 = 'femme'
  }

  Users.suggestions(req.decoded.id, gender1, gender2, gender, (err, result) => {
    if (err) res.status(500).json(err)
    else {
      result.forEach(res => {
        const file = fs.readFileSync(`${__dirname}/../../${res.path}.png`)
        const data = new Buffer(file).toString('base64')
        res.data = data
        delete res.path
      })
      res.json(result)
    }
  })
})

module.exports = router
