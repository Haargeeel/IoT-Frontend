var React = require('react');

var Landing = React.createClass({

  getInitialState: function() {
    return null;
  },

  componentDidMount: function() {

  },

  render: function() {
    return (
      <div>
      {this.props.greetings}
      </div> 
    );
  }
});

module.exports = Landing;
