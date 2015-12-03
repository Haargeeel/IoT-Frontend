var React = require('react')
  , d3 = require('d3')
  , rabbit = require('../js/rabbit');

var Chart = React.createClass({

  getInitialState: function() {
    return {
      data: [],
      startTime: Date.now()
    };
  },

  componentDidMount: function() {
    //var that = this;
    //console.log('mount');
    //setTimeout(function() {
      //console.log('first timeout over');
      //that.setState({data: rabbit.getTest});
      //setTimeout(function() {
        //console.log('second timeout over');
        //that.createGraph()
      //}, 4000);
    //}, 1000);
    this.update();
    //this.connectToRabbit();
    //this.createGraph();
  },

  update: function() {
    var that = this;
    setTimeout(function() {
      setInterval(function() {
        var data = rabbit.getTest();
        if (data && data.length) {
          that.setState({data: data}, function() {
            if (that.state.isGraphCreated)
              that.refreshGraph();
            else
              that.createGraph();
          });
        }
      }, 25);
    }, 1000);
  },

  createGraph: function() {
    var that = this;
    var margin = {top: 20, right: 0, bottom: 20, left: 0}
      , width = this.props.dimension[0] - margin.right - margin.left
      , height = this.props.dimension[1] - margin.top - margin.bottom;
    
    var amountFn = function(d) { return d.value }
    //var dateFn = function(d) { return Math.floor((d.time - that.state.startTime) / 1000) }
    var dateFn = function(d) { return (d.time - that.state.startTime) / 100 }

    var x = d3.scale.linear()
      .range([0, width])
      //.domain(d3.extent(that.state.data, dateFn));
      .domain([0, that.state.data[0].length + 10]);

    var y = d3.scale.linear()
      .range([height, 0])
      //.domain(d3.extent(that.state.data, amountFn));
      .domain([0, 200]);

    var line = d3.svg.line()
      .x(function(d) {
        return x(dateFn(d));
      })
      .y(function(d) {
        return y(amountFn(d));
      })
      .interpolate('basis');

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(width)
      //.tickFormat(formatCurrency)
      .orient("right");

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var gx = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var gy = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .call(that.customAxis);

    var lines = svg.selectAll('.line').data(this.state.data);

    var aLineContainer = lines.enter().append('g').attr('class', 'line');

    aLineContainer.append('path')
      .attr('d', line);

    aLineContainer.selectAll(".dot")
      .data( function( d, i ) { return d; } )
      .enter()
      //.append("circle")
      //.attr("class", "dot")
      //.attr("cx", line.x())
      //.attr("cy", line.y())
      //.attr("r", 2);

    //svg.append('svg:path').attr('d', line(this.state.data));


    this.setState({height: height,
                   width: width,
                   dateFn: dateFn,
                   amountFn: amountFn,
                   x: x,
                   y: y,
                   line: line,
                   lines: lines,
                   aLineContainer: aLineContainer,
                   xAxis: xAxis,
                   yAxis: yAxis,
                   gx: gx,
                   gy: gy,
                   isGraphCreated: true,
                   svg: svg}, function() {
      //this.refreshGraph();
    });
  },

  customAxis: function(g) {
    g.selectAll("text")
        .attr("x", 4)
        .attr("dy", -4);
  },


  refreshGraph: function() {
    var lastRefresh = this.state.lastRefresh
                      ? this.state.lastRefresh
                      : this.state.startTime;
    //if (Date.now() - lastRefresh < 25) return;

    var that = this
      , svg = this.state.svg
      , height = this.state.height
      , width = this.state.width
      , x = this.state.x
      , y = this.state.y
      , lines = this.state.lines
      , line = this.state.line
      , aLineContainer = this.state.aLineContainer
      , xAxis = this.state.xAxis
      , yAxis = this.state.yAxis
      , gx = this.state.gx
      , gy = this.state.gy;

    var xMin = this.state.data[0];
    var xMax = this.state.data[0][this.state.data.length - 1];
    x.domain(d3.extent(this.state.data[0], this.state.dateFn));
    //x.domain([xMin, xMax]);
    //y.domain(d3.extent(this.state.data, this.state.amountFn));
    //y.domain([0, 150]);

    lines = svg.selectAll('g').data(this.state.data);

    //aLineContainer = lines.enter().append('g');

    aLineContainer.selectAll('path').remove();

    aLineContainer.append('path')
      .attr('d', line);

    aLineContainer.selectAll(".dot")
      .data( function( d, i ) { return d; } )
      .enter()
      //.append("circle")
      //.attr("class", "dot")
      //.attr("cx", line.x())
      //.attr("cy", line.y())
      //.attr("r", 2);

    //var line = d3.svg.line()
      //.x(function(d) {
        //return x(that.state.dateFn(d));
      //})
      //.y(function(d) {
        //return y(that.state.amountFn(d));
      //})
      //.interpolate('linear');

    //svg.selectAll('path')
      //.data([this.state.data])
      ////.attr('transform', 'translate(' + x(1) + ')')
      //.attr('d', line)
      ////.transition()
      ////.ease('linear')
      ////.duration(25)
      ////.attr('transform', 'translate(' + x(0) + ')');

    xAxis.scale(x);
    yAxis.scale(y);

    gx.transition()
      .call(xAxis);

    gx.call(xAxis);

    gy.transition()
      .call(yAxis)
      .call(that.customAxis);

    gy.call(that.customAxis);

    //var lineGraph = svg.append('path')
                       //.attr('d', line(this.state.data))
                       //.attr('stroke', 'blue')
                       //.attr('stroke-width', 2)
                       //.attr('fill', 'none');

    //var circles = svg.selectAll('circle').data(this.state.data);
    //circles.transition()
      //.attr("cx", function(d) { return x(that.state.dateFn(d)) })
      //.attr("cy", function(d) { return y(that.state.amountFn(d)) })

    //circles.enter()
      //.append("svg:circle")
      //.attr("r", 2)
      //.attr("cx", function(d) { return x(that.state.dateFn(d)) })
      //.attr("cy", function(d) { return y(that.state.amountFn(d)) })

    //circles.exit()
      //.remove();

    this.setState({svg: svg,
                   x: x,
                   y: y,
                   line: line,
                   lines: lines,
                   aLineContainer: aLineContainer,
                   xAxis: xAxis,
                   yAxis: yAxis,
                   gx: gx,
                   gy: gy,
                   lastRefresh: Date.now()});
  },

  render: function() {
    return (
      <div id='graph'
           className='aGraph'
           style={{height: this.props.dimension[1]}}>
      </div>
    );
  }
});

module.exports = Chart;

