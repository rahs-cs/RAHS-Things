const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({hi: 'Welcome to the API!'})
})

module.exports = router
