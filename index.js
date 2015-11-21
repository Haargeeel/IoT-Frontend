require('node-jsx').install({extension: '.jsx'});
var express = require('express')
  , bodyParser = require('body-parser')
  , chart = require('./lib/app/controller/chart')
  , dashboard = require('./lib/app/controller/dashboard')
  , test = require('./lib/app/controller/test');

var app = express();

app.set('views', __dirname + '/build/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/build/public'));
app.use(bodyParser.json());

app.get('/',
  dashboard.render
);

app.get('/chart',
  chart.render
);


app.get('/createTest',
  test.createTable
);

var server = app.listen(3000, function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Server running at http://%s:%s', host, port)
})
