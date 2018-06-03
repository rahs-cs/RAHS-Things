const mongoose = require('mongoose')
const PostModel = require('./Post')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  avatar: String,
  googleId: String,
  googleRToken: String,
  api_token: { type: String, required: true },
  background: String,
  settings: {
    // For future use
  },
})

userSchema.methods.token_reset = function(cb) {
  this.api_token = require('crypto').randomBytes(92).toString('base64')
  this.save((err) => {
    if(err) {
      cb(err)
    } else {
      if(err) {
        cb(err)
      } else {
        cb(null, this.toObject())
      }
    }
  })
}

userSchema.methods.create_post = function(post_data, cb) {
  PostModel.create(post_data).then(post => {
    this.save().then(() => {
      cb(null, post)
    }).catch(err => {
      cb(err)
    })
  }).catch(err => {
    cb(err)
  })
}

let User = mongoose.model('User', userSchema)

User.get_posts = function(user_id, cb) {
  PostModel.find({'author._id': mongoose.Types.ObjectId(user_id)}).then(posts => {
    cb(null, posts)
  }).catch(err => {
    cb(err)
  })
}

module.exports = User
