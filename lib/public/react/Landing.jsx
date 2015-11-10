var React = require('react'),
    d3 = require('d3');

var Landing = React.createClass({

  getInitialState: function() {
    var data = [4, 8, 15, 16, 23, 42];
    return {
      data: data
    };
  },

  componentDidMount: function() {
    // bar chart example
    //d3.select('.chart')
      //.selectAll('div')
        //.data(this.state.data)
      //.enter().append('div')
        //.style('width', function(d) { return d * 10 + 'px'; })
        //.text(function(d) { return d; });

    var m = [80, 80, 80, 80];
    var w = 1000 - m[1] - m[3];
    var h = 400 - m[0] - m[2];
    var x = d3.scale.linear().domain([0, this.state.data.length]).range([0, w]);
    var y = d3.scale.linear().domain([0, 50]).range([h, 0]);

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

    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
    graph.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis);

    var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient('left');
    graph.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(-25,0)')
      .call(yAxisLeft);

    graph.append('svg:path').attr('d', line(this.state.data));
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
