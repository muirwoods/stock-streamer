let mongoose = require('mongoose')
let crypto = require('crypto')
let _ = require('lodash')
const PEPPER = 'SEED_KEY'

require('songbird')

let userSchema = mongoose.Schema({
    email: String,
    password: String
})

userSchema.methods.generateHash = async function(password) {
  let hash = await crypto.promise.pbkdf2(password, PEPPER, 4096, 512, 'sha256')
  return hash.toString('hex')
}

userSchema.methods.validatePassword = async function(password) {
  let hash = await crypto.promise.pbkdf2(password, PEPPER, 4096, 512, 'sha256')
  return hash.toString('hex') === this.password
}


userSchema.methods.createUser = async function(email, password) {
  this.email = email
  this.password = await this.generateHash(password)
  await this.save()
  return this
}

module.exports = mongoose.model('User', userSchema)