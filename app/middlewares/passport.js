let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let nodeifyit = require('nodeifyit')
let User = require('../models/user')

function configure() {
  passport.serializeUser(nodeifyit(async (user) => {
    return user.id
  }))

  passport.deserializeUser(nodeifyit(async (id) => {
    return await User.promise.findById(id)
  }))

  // login strategy
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, nodeifyit(async (req, email, password) => {
    if (!email) return [false, {message: 'Invalid username.'}]

    let user = await User.findOne({
      'email': email.toLowerCase()
    }).exec()

    if (!user) return [false, {message: 'Invalid user.'}]
    if (!await user.validatePassword(password)) return [false, {message: 'Invalid password.'}]
    return user
  }, {spread: true})))

  // create user
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, nodeifyit(async (req, email, password) => {
    email = (email || '').toLowerCase()

    if (await User.findOne({'email': email}).exec()) {
      return [false, {message: 'That email is already taken.'}]
    }
    let user = req.user || new User()
    let ret = await user.createUser(email, password)
    return ret
  }, {spread: true})))

  return passport
}

module.exports = {passport, configure}