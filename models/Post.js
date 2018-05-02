const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = require('./User.js')

const TodoSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: User.schema,
  added: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Todo', TodoSchema)
