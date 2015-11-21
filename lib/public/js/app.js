var chart = require('./chart')
  , dashboard = require('./dashboard');

window.onload = function() {
  chart.render();
  dashboard.render();
};
