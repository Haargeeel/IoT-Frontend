var React = require('react');

var Login = React.createClass({

  getInitialState: function() {
    return {
    };
  },

  componentDidMount: function() {
  },

  render: function() {
    return (
      <div>
        <div className='row column login-container'>
          <div className='callout'>
            <div className='row'>
              <div className='large-12 columns'>
                <input type='text' placeholder='User'></input>
                <input type='password' placeholder='Password'></input>
              </div>
              <div className='large-12 columns buttonwrapper'>
                <a href='/dashboard'>
                  <button className='button' type='button'>
                    Log In
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Login;

