const express = require('express')
const app = express()
const logger = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport')

const User = require('./models/User')

const config = require('./config.json')

app.set('port', 3066)
app.use(logger('dev'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://localhost/rahsthings')
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log(`DB at ${'mongodb://localhost/rahsthings'} Ready!`)
})

app.use(session({
  secret: config.sessionSecret,
  store: new MongoStore({ url: config.db.url }),
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
}))

passport.serializeUser((user, done) => {
  User.findById(user._id, (err, userDb) => {
    if (err) {
      done (err)
    } else {
      done(null, userDb)
    }
  })
})
passport.deserializeUser((obj, done) => {
  User.findById(obj._id, (err, userDb) => {
    if (err) {
      done (err)
    } else {
      done(null, userDb)
    }
  })
})

app.use(passport.initialize())
app.use(passport.session())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/api', require('./routes/api'))
app.use('/auth', require('./routes/auth')(passport))


app.use((req, res) => {
  res.status(404).send('not found')
})

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = err

  // render the error page
  res.status(err.status || 500)
  res.render('error', {err: err})
})

app.listen(app.get('port'), () => {
  console.log('Listening on port: ', app.get('port'))
})
