const mongoose = require('mongoose')
const User = require('./User')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: User, ref: 'User', required: true, index: true },
  added: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Post', PostSchema)
