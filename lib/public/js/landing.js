var React = require('react')
  , ReactDOM = require('react-dom')
  , Landing = React.createFactory(require('../../../build/public/react/Landing'));

module.exports = me = {};

me.render = function() {
  var $container = document.querySelector('#landing');
  var $rdt = document.querySelector('#rdt');
  if (!$container || !$rdt) return;

  var data = JSON.parse($rdt.innerHTML);

  ReactDOM.render(new Landing(data), $container);
}
