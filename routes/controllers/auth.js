const express = require('express')
const jwt = require('jsonwebtoken')

const config = require('../../config')
const Users = require('../models/users')
const Tags = require('../models/tags')
const Pictures = require('../models/pictures')
const fs = require('fs')
var bcrypt = require('bcrypt');
const saltRounds = 10;

let router = express.Router()

router.post('/', (req, res) => {
  const { username, password } = req.body
  let payload = {}

  Users.findOne(username, (err, user) => {
    if (!user.length) {
      res.status(401).json({ error: 'Oups ! Nous n\'avons trouvé personne avec ce nom d\'utilisateur' })
    } else {
      const validUser = user[0]
      if (!validUser.activated) {
        return res.status(401).json({ error: 'Le compte n\'est pas activé' })
      } else if (!bcrypt.compareSync(password, validUser.password)) {
        res.status(401).json({ error: 'Le mot de passe est invalide' })
      } else {        
        const token = jwt.sign({
          id: validUser.id,
          username: validUser.username,
          email: validUser.email
        }, config.jwtSecret, {
          expiresIn: '2h'
        })
        payload.token = token
        Users.getProfile(validUser.id, validUser.id, (err, result) => {
          if (err) res.status(500).json(err)
          else {
            payload.user = result[0]
            Tags.getSelected(validUser.id, (err, tags) => {
              if (err) res.status(500).json(err)
              else {
                payload.tags = tags
                Pictures.getUserPictures(validUser.id, (err, pictures) => {
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
      }
    }
  })
})

module.exports = router