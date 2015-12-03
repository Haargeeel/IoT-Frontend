var Stomp = require('stompjs')
  , SockJS = require('sockjs-client');

module.exports = me = {};

var data = [];
var consoleTextarea;
var consoleData = [];

me.connect = function() {
  var sock = new SockJS('http://192.168.99.100:15674/stomp');
  var client = Stomp.over(sock);
  client.connect('guest', 'guest', function() {
    console.log('connect');
    var subscription = client
                       .subscribe('/exchange/friss_exch/#', function(msg) {
      var obj = {
        time: Date.now(),
        value: JSON.parse(msg.body).values.length
      };

      data.push(obj);

      if (data.length > 50)
        data.splice(0, 1);

      if (consoleData) {
        consoleData = consoleTextarea.value.split('\n');
        var line = 'Gateway: ' + JSON.parse(msg.body).gateway_name
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

me.getData = function() {
  return data;
};

me.setConsoleTextarea = function(t) {
  consoleTextarea = t;
};
