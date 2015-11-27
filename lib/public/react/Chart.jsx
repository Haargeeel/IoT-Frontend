var React = require('react')
  , d3 = require('d3')
  , Stomp = require('stompjs')
  , SockJS = require('sockjs-client');

var Chart = React.createClass({

  getInitialState: function() {
    return {
      data: [],
      startTime: Date.now()
    };
  },

  componentDidMount: function() {
    this.connectToRabbit();
    this.createGraph();
  },

  connectToRabbit: function() {
    var that = this;
    var sock = new SockJS('http://192.168.99.100:15674/stomp');
    var client = Stomp.over(sock);
    client.connect('guest', 'guest', function() {
      console.log('connect');
      var subscription = client
                         .subscribe('/exchange/friss_exch/#', function(msg) {
        var data = that.state.data;
        //var newData = JSON.parse(msg.body).values;
        var obj = {
          time: Date.now(),
          value: data.length
                  ? data[data.length - 1].value + 1
                  : 1
        };
        data.push(obj);
        if (data.length > 500)
          data.splice(0, 1);
        that.setState({data: data}, function() {
          that.refreshGraph();
        });
      });
    });
  },

  createGraph: function() {
    var that = this;
    var margin = {top: 20, right: 0, bottom: 20, left: 0}
      , width = this.props.dimension[0] - margin.right - margin.left
      , height = this.props.dimension[1] - margin.top - margin.bottom;
    
    var amountFn = function(d) { return d.value }
    var dateFn = function(d) { return Math.floor((d.time - that.state.startTime) / 1000) }

    var x = d3.scale.linear()
      .range([0, width])
      .domain(d3.extent(that.state.data, dateFn));

    var y = d3.scale.linear()
      .range([height, 0])
      .domain(d3.extent(that.state.data, amountFn));

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


    this.setState({height: height,
                   width: width,
                   dateFn: dateFn,
                   amountFn: amountFn,
                   x: x,
                   y: y,
                   xAxis: xAxis,
                   yAxis: yAxis,
                   gx: gx,
                   gy: gy,
                   svg: svg}, function() {
      this.refreshGraph();
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
    if (Date.now() - lastRefresh < 25) return;

    var that = this
      , svg = this.state.svg
      , height = this.state.height
      , width = this.state.width
      , x = this.state.x
      , y = this.state.y
      , xAxis = this.state.xAxis
      , yAxis = this.state.yAxis
      , gx = this.state.gx
      , gy = this.state.gy;

    x.domain(d3.extent(this.state.data, this.state.dateFn));
    y.domain(d3.extent(this.state.data, this.state.amountFn));

    xAxis.scale(x);
    yAxis.scale(y);

    gx.transition()
      .call(xAxis);

    gx.call(xAxis);

    gy.transition()
      .call(yAxis)
      .call(that.customAxis);

    gy.call(that.customAxis);

    var circles = svg.selectAll('circle').data(this.state.data);
    circles.transition()
      .attr("cx", function(d) { return x(that.state.dateFn(d)) })
      .attr("cy", function(d) { return y(that.state.amountFn(d)) }) 

    circles.enter()
      .append("svg:circle")
      .attr("r", 2)
      .attr("cx", function(d) { return x(that.state.dateFn(d)) })
      .attr("cy", function(d) { return y(that.state.amountFn(d)) }) 

    circles.exit()
      .remove();

    this.setState({svg: svg,
                   x: x,
                   y: y,
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

