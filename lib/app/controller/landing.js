var React = require('react')
  , Landing = React.createFactory(
      require('../../../build/public/react/Landing')
    );

module.exports = me = {};

me.render = function(req, res) {
  var out = {greetings: 'Hallo Welten'};
  var landing = new Landing(out);
  var body = React.renderToString(landing);

  res.render('index', {body: body, reactData: out});
};
