var React = require('react');

var rabbit = require('../js/rabbit');

var Console = React.createClass({

  getInitialState: function() {
    return {
      data: []
    };
  },

  componentDidMount: function() {
    rabbit.setConsoleTextarea(document.getElementById('textarea'));
  },

  render: function() {
    return (
      <div id='console' className='realtime'>
        <textarea id='textarea' className='textarea'>
        </textarea>
      </div>
    );
  }
});

module.exports = Console;
