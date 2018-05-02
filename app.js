const express = require('express');
const app = express();
const fs = require('fs')
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

app.set('port', 3066);
app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/api', require('./routes/api'))


app.use((req, res, next) => {
  res.status(404).send('not found')
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error', {err: err});
});

app.listen(app.get('port'), () => {
  console.log('Listening on port: ', app.get('port'))
})
