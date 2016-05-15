/**
 * Created by Urriel.
 */

var fs         = require('fs');
var express    = require('express');
var bodyParser = require('body-parser');

global.credentials = {
  site              : 'https://accounts.spotify.com/',
  authorizationPath : 'https://accounts.spotify.com/authorize',
  tokenPath         : 'https://accounts.spotify.com/api/token'
};

var app = express();


process.on('uncaughtException', function (e) {
  console.error('-------------------------------');
  console.error('Runtime Error');
  console.error(e);
  console.error('-------------------------------');
});

fs.readFile('credentials.json', 'utf8', function (err, data) {
  data = JSON.parse(data);

  for (var key in data) {
    if (data.hasOwnProperty(key))
      global.credentials[key] = data[key];
  }
});


app.set('view engine', 'jade');

app.use(bodyParser.json({}));
app.use(express.static('public'));


app.get('/', function (ignored, res) { // index
  res.render('index');
});

app.use('/api', require('./api')); // /api routes

app.listen(3000, function () {
  console.info('Server running on localhost:3000');
});
