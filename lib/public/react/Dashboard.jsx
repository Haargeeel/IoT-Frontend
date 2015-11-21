var React = require('react')
  , Chart = require('./Chart');

var Dashboard = React.createClass({

  getInitialState: function() {
    return {
    };
  },

  componentDidMount: function() {
    if (typeof window === 'undefined') return;
    var graph = document.getElementsByClassName('graph')[0];   
    var dimension = [graph.offsetWidth, graph.offsetHeight];
    this.setState({dimension: dimension});
    console.log(dimension);
  },

  renderChart: function() {
    if (this.state.dimension) {
      return (
        <Chart dimension={this.state.dimension} />
      );
    }
  },

  render: function() {
    return (
      <div>
      {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <ul className="dropdown menu" data-dropdown-menu>
              <li className="menu-text">Dashboard</li>
              <li className="has-submenu">
                <a href="#">One</a>
                <ul className="submenu menu vertical" data-submenu>
                  <li><a href="#">One</a></li>
                  <li><a href="#">Two</a></li>
                  <li><a href="#">Three</a></li>
                </ul>
              </li>
              <li><a href="#">Two</a></li>
              <li><a href="#">Three</a></li>
            </ul>
          </div>
        </div>
        {/* Top Bar end */}
        {/* Input area */}
        <div className='input-area'>
          <h1>Input</h1>
          <hr className='seperator-line'/>
          <div className='realtime-wrapper'>
            <div className='console'>
            </div>
            <div className='graph'>
              {this.renderChart()}
            </div>
          </div>
        </div>
        {/* Input area end */}
        <div className='input-area'>
          <h1>Views</h1>
          <hr className='seperator-line'/>
        </div>
        {/* Button area */}
        <div className='input-area'>
          <div className='button-area-wrapper'>
            <div className='add-area'>
              <h1>Add</h1>
              <hr className='seperator-line'/>
              <button type='button' className='button alert'>
                Sensor
              </button>
              <button type='button' className='button alert'>
                Gateway
              </button>
            </div>
            <div className='edit-area'>
              <h1>Edit</h1>
              <hr className='seperator-line'/>
              <button type='button' className='button alert'>
                Sensor
              </button>
              <button type='button' className='button alert'>
                Sensor
              </button>
              <button type='button' className='button alert'>
                Gateway
              </button>
            </div>
          </div>
        </div>
        {/* Button area end */}
      </div> 
    );
  }
});

module.exports = Dashboard;
