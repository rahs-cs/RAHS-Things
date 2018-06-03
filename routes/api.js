const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

router.get('/', (req, res) => {
  res.json({hi: 'Welcome to the API!'})
})

router.get('/user', (req, res) => {
  if(req.user) {
    res.json(req.user)
  } else {
    res.status(401).send('not logged in :(')
  }
})

router.get('/posts', (req, res) => {
  Post.find({}, function(err, posts) {
    res.send(posts)
  })
})

router.get('/posts/:id', (req, res) => {
  if(req.params.id == 'me') {
    if(req.user) {
      User.get_posts(req.user.id, (err, posts) => {
        if(err) {
          throw err
        } else {
          res.json(posts)
        }
      })
    } else {
      res.status(401).send('not logged in :(')
    }
  } else {
    User.get_posts(req.params.id, (err, posts) => {
      if(err) {
        throw err
      } else {
        res.json(posts)
      }
    })
  }
})

router.post('/post/create', (req, res, next) => {
  if (!req.body || !req.body.title || !req.body.content) {
    res.status(400).json({err: 'missing param!'})
  } else {
    let posty = req.body
    try {
      for (let key in posty) {
        posty[key] = posty[key].replace(/&/g, '&amp;').replace(/</g, '&lt;')
      }
    } catch (err) {
      // oh well
    }
    req.body.author = cleanUser(req.user)
    req.user.create_post(req.body, (err, post) => {
      if (err) {
        next(err)
      } else {
        res.json(post)
      }
    })
  }
})

module.exports = router

function cleanUser(user) {
  delete user.token
  delete user.googleRToken
  return user
}
