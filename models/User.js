const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  avatar: String,
  token: String,
  googleId: String,
  api_token: { type: String, required: true },
  background: String,
  settings: {
    // For future use
  },
})

userSchema.methods.setting_manager = function(setting, cb) {
  this.settings.subreddits = Array.isArray(setting.subreddits) ? setting.subreddits.map(r => {return encodeURI(r)}) : []
  this.settings.degreeType = setting.degreeType == 'C' ? 'C' : 'F'
  this.save((err) => {
    if(err) {
      cb(err)
    } else {
      this.save((err) => {
        cb(null, this.toObject())
      })
    }
  })
}

userSchema.methods.token_reset = function(cb) {
  this.api_token = require('crypto').randomBytes(92).toString('base64')
  this.save((err) => {
    if(err) {
      cb(err)
    } else {
      this.save((err) => {
        cb(null, this.api_token)
      })
    }
  })
}

module.exports = mongoose.model('User', userSchema)
