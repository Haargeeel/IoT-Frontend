var React = require('react')
  , d3 = require('d3')
  , Stomp = require('stompjs')
  , SockJS = require('sockjs-client');

var Landing = React.createClass({

  getInitialState: function() {
    var data = [21, 23, 25, 30, 33, 30];
    return {
      data: data,
      sensorType: '',
      graph: null,
      line: null,
      xAxis: null,
      yAxis: null
    };
  },

  componentDidMount: function() {
    var that = this;
    var sock = new SockJS('http://192.168.99.100:15674/stomp');
    var client = Stomp.over(sock);
    client.connect('guest', 'guest', function() {
      console.log('connect');
      var subscription = client
                         .subscribe('/exchange/friss_exch/#', function(msg) {
        if (!that.state.sensorType) {
          that.setState({sensorType: msg.headers.sensor_type});
          var m = [80, 80, 80, 80]; // margin
          var w = 1000 - m[1] - m[3];
          var h = 400 - m[0] - m[2];

          var x = d3.scale.linear()
                    .domain([0, 1000])
                    .range([0, w]);
          var y = d3.scale.linear()
                    .domain([0, 50])
                    .range([h, 0]);

          var line = d3.svg.line()
            .x(function(d,i){
              return x(i);
            })
            .y(function(d){
              return y(d);
            });

          var graph = d3.select('#graph').append('svg:svg')
              .attr('width', w + m[1] + m[3])
              .attr('height', h + m[0] + m[2])
            .append('svg:g')
              .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');

          var xAxis = d3.svg.axis()
              .scale(x)
              .tickSize(-h)
              .tickSubdivide(true);

          graph.append('svg:g')
                  .attr('class', 'x axis')
                  .attr('transform', 'translate(0,' + h + ')')
                  .call(xAxis)
                .append('text')
                  .attr('transform', 'rotate(-90)')
                  .attr('x', 200)
                  .style('text-anchor', 'start')
                  .text(that.state.sensorType);

          var yAxisLeft = d3.svg.axis()
              .scale(y)
              .ticks(4)
              .orient('left');

          graph.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(-25,0)')
            .call(yAxisLeft);

          graph.append('svg:path').attr('d', line(that.state.data));

          that.setState({graph: graph, line: line});
        }
        var data = that.state.data;
        var newData = JSON.parse(msg.body).physical_values;
        newData.forEach(function(d) {
          data.push(d.value);
        });
        that.state.graph.append('svg:path').attr('d', that.state.line(data));
        that.setState({data: data});
      });
    });

  },

  setXGraph: function() {
  },

  render: function() {
    return (
      <div id='graph'
           className='aGraph'
           style={{position: 'absolute', top: 0, left: 0, float: 'left'}}>
      </div>
    );
  }
});

module.exports = Landing;
