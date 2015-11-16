var express = require('express')
  //, amqp = require('./lib/app/controller/amqp')
  , bodyParser = require('body-parser')
  , landing = require('./lib/app/controller/landing')
  , test = require('./lib/app/controller/test');

var app = express();

app.set('views', __dirname + '/build/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/build/public'));
app.use(bodyParser.json());

app.get('/',
  landing.render
);

app.get('/createTest',
  test.createTable
);

var server = app.listen(3000, function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Server running at http://%s:%s', host, port)
})
