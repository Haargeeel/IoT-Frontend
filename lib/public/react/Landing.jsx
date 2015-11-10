var React = require('react'),
    d3 = require('d3');

var Landing = React.createClass({

  getInitialState: function() {
    var m = [80, 80, 80, 80];
    var w = 1000 - m[1] - m[3];
    var h = 400 - m[0] - m[2];
    var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];
    var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
    var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
    return {
      m: m,
      w: w,
      h: h,
      data: data,
      x: x,
      y: y
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

    var that = this;
    var line = d3.svg.line()
      .x(function(d,i){
        return that.state.x(i);
      })
      .y(function(d){
        return that.state.y(d);
      });
    var graph = d3.select('#graph').append('svg:svg')
        .attr('width', that.state.w + that.state.m[1] + that.state.m[3])
        .attr('height', that.state.h + that.state.m[0] + that.state.m[2])
      .append('svg:g')
        .attr('transform', 'translate(' + that.state.m[3] + ',' + that.state.m[0] + ')');

    var xAxis = d3.svg.axis().scale(that.state.x).tickSize(-that.state.h).tickSubdivide(true);
    graph.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + that.state.h + ')')
      .call(xAxis);

    var yAxisLeft = d3.svg.axis().scale(that.state.y).ticks(4).orient('left');
    graph.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(-25,0)')
      .call(yAxisLeft);

    graph.append('svg:path').attr('d', line(that.state.data));
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
