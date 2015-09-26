let _ = require('lodash')
let then = require('express-then')

module.exports = (app) => {
  let passport = app.passport

  // Authentication
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/mystock',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/mystock',
    failureRedirect: '/signup',
    failureFlash: true
  }))
}