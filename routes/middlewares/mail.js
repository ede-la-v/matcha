var express = require('express');
var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({sendmail: true});

exports.resetPassword = (email, token) => {
  const subject = 'You requested a new password!'
  const body = '<h1>Reset your password</h1>\
                <p>\
                  Click on <a href="http://localhost:3000/new/' + token +'">this link</a>\
                  <br />\
                  <br />\
                  Matcha Team\
                </p>'

  sendEmail(email, subject, body)
}

exports.newAccount = (email, token) => {
  const subject = 'Welcome on Matcha'
  const body = '<h1>Activate your account</h1>\
  <p>\
    Click on <a href="http://localhost:3000/activate/' + token +'">this link</a>\
    <br />\
    <br />\
    Matcha Team\
  </p>'

  sendEmail(email, subject, body)
}

exports.signal = (id, username) => {
  const subject = 'User has been signaled'
  const body = '<h1>Un utilisateur a été signalé</h1>\
  <p>L\'utilisateur avec pour id ' + id + ' a été signalé par ' + username + '</p>'

  sendEmail('delaby.h@gmail.com', subject, body)
}

const sendEmail = (to, subject, html) => {
	const mailOptions = {
		from: '"Hugo from Matcha" <no-reply@matcha.com>',
		to: to,
		subject: subject,
		html: html
  }
  
  transporter.sendMail(mailOptions).catch(err => console.log(err))
}

