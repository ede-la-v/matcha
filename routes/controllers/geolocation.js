const express = require('express')
const request = require('request')
const googleGeocoder = require('google-geocoder');

const Users = require('../models/users');

const router = express.Router()

const googleGeo = googleGeocoder({
  key: 'AIzaSyAhpg0ZmwnpxTJbhJ54skNGQNSCaNzSJ2o'
})

const { isAuthenticated } = require('../middlewares/auth')

const getClientIp = req => {
  var ipAddress;
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};

const geolocateFromCoords = (req, res, coords) => {
	if (!coords || (coords.latitude === 0 && coords.longitude === 0)) {
		coords = {
			latitude: 48.8922332,
			longitude: 2.3193057
		}
	}
	googleGeo.reverseFind(coords.latitude, coords.longitude, (err, resp) => {
    if (err) res.status(500).json({ message: 'Adresse saisie invalide.' }) 
    else if (!resp[0] || !resp[0].location || !resp[0]['formatted_address']) {
      res.status(404).json({ message: 'Impossible de localiser cette adresse.'})
    } else {
      const { lat, lng } = resp[0].location
      const address = resp[0]['formatted_address']
      Users.updateAddress(address, lat, lng,
        req.decoded.id, (err) => {
          if (err) res.status(500).json(err)
      else res.json({ address, lat, lon: lng })
      })
    }
	})
}

const geolocateFromAddress = (req, res) => {
  const { city, country, address } = req.body

  if (!city || !country || !address) {
    res.status(400).json({ message: 'Adresse saisie invalide.', city, country, address })
  } else {
    googleGeo.find(`${address} ${city} ${country}`, (err, resp) => {
      if (err) res.status(500).json(err)
      else if (!resp[0] || !resp[0].location || !resp[0]['formatted_address']) {
        res.status(404).json({ message: 'Impossible de localiser cette adresse.'})
      } else {
        const { lat, lng } = resp[0].location
        const address = resp[0]['formatted_address']
        Users.updateAddress(address, lat, lng,
          req.decoded.id, (err) => {
            if (err) res.status(500).json(err)
        else res.json({ address, lat, lon: lng })
        })
      }
    })
  }
}

router.post('/', isAuthenticated, (req, res) => {
  const { type } = req.body

	if (type === 'ip') {
		request({
			uri: `http://freegeoip.net/json/${getClientIp(req)}`
		}, (err, resp, body) => {
			if (!err && resp.statusCode === 200) {
        try {
					const coords = JSON.parse(body)
					geolocateFromCoords(req, res, coords)
				} catch (e) {
					geolocateFromCoords(req, res, null)
				}
      } else {
				geolocateFromCoords(req, res, null)
			}
		})
	} else if (type === 'form') {
    geolocateFromAddress(req, res)  
  } else {
		geolocateFromCoords(req, res, req.body)
	}
})

module.exports = router
