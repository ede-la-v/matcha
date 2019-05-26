var express = require('express');
const request = require('request');

var router = express.Router();

var Users = require('../models/users');
var Likes = require('../models/likes');
var Tags = require('../models/tags');
const Pictures = require('../models/pictures')
const Blocked = require('../models/blocked')
var Mail = require('../middlewares/mail');
const crypto = require('crypto');
const socketIO = require('socket.io');
var { isAuthenticated, isBlocked } = require('../middlewares/auth')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const formidable = require('formidable');
const fs = require('fs')
const path = require('path')
var bcrypt = require('bcrypt');
const saltRounds = 10;

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

router.get('/', isAuthenticated, (req, res) => {
	Users.getAll(function(err, users){
		res.json(users);
	})
})

router.post('/', (req, res) => {
	const { username, password, firstname, lastname, email, date } = req.body

	if (!username || !password || !firstname, !lastname, !email, !date) {
		res.status(400).json({ message: 'Champs manquants' })
	} else {
		const timestamp = Date.parse(date)
		if (password.length < 8 || !(/\d/.test(password))) {
			res.status(400).json({ message: 'Mot de passe invalide. Au moins 8 caractères et un chiffre requis.', password })
		} else if (!validateEmail(email)) {
			res.status(400).json({ message: 'Format de l\'adresse email invalide' })
		} else if (isNaN(timestamp)) {
			res.status(400).json({ message: 'Format de la date invalide' })
		} else {
			Users.findEmailOrUsername(username, email, (err, result) => {
				if (err) res.status(500).json(err)
				else if (result.length) {
					res.status(400).json({ message: 'Pseudo ou email déjà utilisé'})
				}
				else {
					const token = crypto.randomBytes(32).toString('hex');
					
					var salt = bcrypt.genSaltSync(saltRounds);
					var hash = bcrypt.hashSync(password, salt);
					Users.create(username, firstname, lastname, email, hash, token, date, (err, login) => {
						if (err) res.status(500).send(err)
						else {
							Mail.newAccount(email, token)
							res.status(201).send()
						}
					})
				}
			})
		}
	}
})



router.put('/:id(\\d+)/like', isAuthenticated, isBlocked, (req, res) => {
	const { id } = req.params

	if (!Number.isInteger(parseInt(id)) || parseInt(id) < 1) {
		res.status(400).json({ message: 'Le champ id doit être un nombre entier valide supérieur a 0', id })		
	} else {
		Likes.create(req.decoded.id, id, (err) => {
			if (err) res.status(500).json(err)
			else {
				Users.updateScore(id, (err) => {
					if (err) res.status(500).json(err)
					else res.send()
				})
			}
		})
	}
})

router.delete('/:id(\\d+)/like', isAuthenticated, isBlocked, (req, res) => {
	const { id } = req.params

	if (!Number.isInteger(parseInt(id)) || parseInt(id) < 1) {
		res.status(400).json({ message: 'Le champ id doit être un nombre entier valide supérieur a 0', id })		
	} else {
		Likes.delete(req.decoded.id, id, (err) => {
			if (err) res.status(500).json(err)
			else {
				Users.updateScore(req.decoded.id, (err) => {
					if (err) res.status(500).json(err)
					else res.send()
				})
			}
		})
	}
})

router.put('/:id(\\d+)/block', isAuthenticated, (req, res) => {
	const { id } = req.params

	if (!Number.isInteger(parseInt(id)) || parseInt(id) < 1) {
		res.status(400).json({ message: 'Le champ id doit être un nombre entier valide supérieur a 0', id })		
	} else {
		Blocked.add(id, req.decoded.id, (err) => {
			if (err) res.status(500).json(err)
			else res.send()
		})
	}
})

router.post('/:id(\\d+)/signal', isAuthenticated, (req, res) => {
	const { id } = req.params

	if (!Number.isInteger(parseInt(id)) || parseInt(id) < 1) {
		res.status(400).json({ message: 'Le champ id doit être un normbre entier valide supérieur a 0', id })		
	} else {
		Mail.signal(id, req.decoded.username)
		res.send()
	}
})

router.get('/:id(\\d+)', isAuthenticated, isBlocked, (req, res) => {
	const { id } = req.params
	let payload = {}

	if (!Number.isInteger(parseInt(id)) || parseInt(id) < 1) {
		res.status(400).json({ message: 'Le champ id doit être un nombre entier valide supérieur a 0', id })		
	} else {
		Users.getProfile(id, req.decoded.id, (err, user) => {
			if (err) res.json(err)
			else if (!user.length) res.status(404).json({ message: 'Aucun utilisateur trouvé', id })
			else {
				payload.user = user[0]
				Likes.doesLike(id, req.decoded.id, (err, likesMe) => {
					if (err) return res.json(err)
					payload.likesMe = likesMe[0].does_like
					Likes.doesLike(req.decoded.id, id, (err, liked) => {
						if (err) return res.json(err)
						payload.liked = liked[0].does_like
						Pictures.getUserPictures(id, (err, pictures) => {
							if (err) return res.json(err)
							payload.pictures = []
							pictures.forEach(picture => {
								const file = fs.readFileSync(`${__dirname}/../../${picture.path}.png`)
								const data = new Buffer(file).toString('base64')
								payload.pictures.push({ id: picture.id, data: data, rank: picture.rank })
							})
							Tags.getSelected(id, (err, tags) => {
								if (err) return res.json(err)
								payload.tags = tags
								res.json(payload)
							})
						})
					})
				})
			}
		})
	}
})

router.put('/gender', isAuthenticated, (req, res) => {
	const { gender } = req.body

	if (gender !== 'homme' && gender !== 'femme') {
		return res.status(400).send()
	}
	Users.updateOneField('gender', gender, req.decoded.id, (err, result) => {
		if (err) throw err
		res.status(201).send()
	})
})

router.put('/orientation', isAuthenticated, (req, res) => {
	const { orientation } = req.body

	if (orientation !== 'homme' && orientation !== 'femme' && orientation !== 'both') {
		return res.status(400).send()
	}
	Users.updateOneField('orientation', orientation, req.decoded.id, (err, result) => {
		if (err) throw err
		res.status(201).send()
	})
})

router.put('/bio', isAuthenticated, (req, res) => {
	const { bio } = req.body

	Users.updateOneField('bio', bio, req.decoded.id, (err, result) => {
		if (err) throw err
		res.status(201).send()
	})
})

router.post('/pictures', isAuthenticated, (req, res, next) => {
	const { rank } = req.body

	Pictures.getCount(req.decoded.id, (err, count) => {
		if (err) throw err
		if (count[0].count >= 5) {
			res.status(400).json({ message: 'Maximum 5 photos par utilisateur.' })
		} else {
			const form = new formidable.IncomingForm()
			form.parse(req, (err, fields, files) => {
				const ext = path.extname(files.file.name)
				if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
					res.status(400).json({ message: 'Formats acceptés: jpg, jpeg et png.' })
				} else {
					const oldPath = files.file.path
					const fileName = `${req.decoded.username}-${new Date().toISOString()}`
					const newPath = `${__dirname}/../../public/upload/${fileName}.png`
					fs.copyFile(oldPath, newPath, (err) => {
						if (err) throw err
						Pictures.create(req.decoded.id, fields.rank, `public/upload/${fileName}`, (err, result) => {
							if (err) throw err
							const file = fs.readFileSync(newPath)
							const data = new Buffer(file).toString('base64')
							res.status(201).json({ id: result[2][0]['LAST_INSERT_ID()'], rank: parseInt(fields.rank), data })
						})
					});
				}
			})
		}
	})
})

router.delete('/pictures/:rank', isAuthenticated, (req, res, next) => {
	const { rank } = req.params

	Pictures.deleteUserAtRank(req.decoded.id, rank, err => {
		if (err) throw err
		res.send()
	})
})

router.get('/pictures', isAuthenticated, (req, res, next) => {
	let payload = []

	Pictures.getUserPictures(req.decoded.id, (err, pictures) => {
		pictures.forEach(picture => {
			const file = fs.readFileSync(picture.path)
			const data = new Buffer(file).toString('base64')
			payload = [...payload, { id: picture.id, data: data, rank: picture.rank }]
		})
		res.json(payload)
	})
})

router.post('/search', isAuthenticated, (req, res, next) => {
	const { dist, tags, orientation, age, score, page } = req.body
	let gender1, gender2 = ''

	if (!Number.isInteger(dist) || dist < 0) {
		res.status(400).send({ message: 'La distance fournie est invalide' })
	} else if (!Array.isArray(orientation)) {
		res.status(400).send({ message: 'L\'orientation doit être un tableau' })
	} else if (!Array.isArray(age)) {
		res.status(400).send({ message: 'L\'age doit être un tableau' })		
	} else if (!Array.isArray(score)) {
		res.status(400).send({ message: 'Le score doit être un tableau' })		
	} else {
		if (!orientation.length || orientation.length > 2) {
			gender1 = 'homme'
			gender2 = 'femme'
		} else {
			gender1 = (orientation[0] === 'homme' || orientation[0] === 'femme') ? orientation[0] : ''
			gender2 = (orientation[1] === 'homme' || orientation[1] === 'femme') ? orientation[1] : ''
		}
		
		Users.search(req.decoded.id, gender1, gender2, tags, dist, age, score, page*100, (err, result) => {
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
	}
})
	
module.exports = router;
