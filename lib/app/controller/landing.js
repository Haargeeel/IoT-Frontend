require('node-jsx').install({extension: '.jsx'});
var React = require('react')
  , ReactDOM = require('react-dom/server')
  , Landing = React.createFactory(
      require('../../public/react/Landing')
    );

module.exports = me = {};

me.render = function(req, res) {
  var out = {greetings: 'Hallo Welten'};
  var landing = new Landing(out);
  var body = ReactDOM.renderToString(landing);

  res.render('index', {body: body, reactData: out});
};
