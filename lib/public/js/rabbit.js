var Stomp = require('stompjs')
  , SockJS = require('sockjs-client');

module.exports = me = {};

var test = [];
var testData = [];
var consoleTextarea;
var consoleData = [];

me.connect = function() {
  //var sock = new SockJS('http://localhost:15674/stomp');
  var sock = new SockJS('http://192.168.99.100:15674/stomp');
  var client = Stomp.over(sock);
  client.debug = null
  client.connect('guest', 'guest', function() {
    console.log('connect');
    var subscription = client
                       .subscribe('/exchange/friss_exch/#', function(msg) {

      var obj = {
        time: new Date(),
        value: JSON.parse(msg.body).values.length,
        color: colorMap[msg.headers.sensor_type]
      };

      if (!test.length) {
        test.push(msg.headers.sensor_type);
        testData.push([obj]);
      } else {
        if (test.indexOf(msg.headers.sensor_type) > -1) {
          testData[test.indexOf(msg.headers.sensor_type)].push(obj);
        } else {
          test.push(msg.headers.sensor_type);
          testData.push([obj]);
        }
      }

      testData.forEach(function(t) {
        if (t.length > 10)
          t.splice(0, 1);
      });

      if (consoleData) {
        consoleData = consoleTextarea.value.split('\n');
        var line = '[' + Date.now() + '] Gateway: ' + JSON.parse(msg.body).gateway_name
                 + ' - Sensor Type: ' + msg.headers.sensor_type;
        consoleData.push(line);
        if (consoleData.length > 20)
          consoleData.splice(0, 1);
        consoleTextarea.value = consoleData.join('\n');
        consoleTextarea.scrollTop = consoleTextarea.scrollHeight;
      }
    });
  });
};

var colorMap = {
  scalar: 'steelblue',
  orientation: 'red',
  location: 'green',
  acceleration: 'orange'
};

me.getTest = function() {
  return testData;
};

me.setConsoleTextarea = function(t) {
  consoleTextarea = t;
};
