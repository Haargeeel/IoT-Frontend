require('node-jsx').install({extension: '.jsx'});
var express = require('express')
  , bodyParser = require('body-parser')
  , chart = require('./lib/app/controller/chart')
  //, login = require('./lib/app/controller/login')
  //, gateways = require('./lib/app/controller/gateways')
  , dashboard = require('./lib/app/controller/dashboard')
  , test = require('./lib/app/controller/test')
  , usercontroller = require('./lib/app/controller/usercontroller');

var app = express();

app.set('views', __dirname + '/build/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/build/public'));
app.use(bodyParser.json());

// Frontend

app.get('/',
  dashboard.render
);

app.get('/chart',
  chart.render
);

//app.get('/login',
  //login.render
//);

//app.get('/gateways',
  //gateways.render
//);

app.get('/createTest',
  test.createTable
);

// Api

app.get('/users/all',
  usercontroller.allUsers
);

app.post('/users/register',
  usercontroller.registerUser
);

app.get('/users/login',
  usercontroller.loginUser
);

app.delete('/users/delete/:id',
  usercontroller.deleteUser
);

app.delete('/users/admin/delete/:id',
  usercontroller.deleteUser
);

app.put('/users/admin/change/:id/:role',
  usercontroller.changeUserRole
);


var server = app.listen(3000, function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Server running at http://%s:%s', host, port)
})
