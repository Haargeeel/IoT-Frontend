var React = require('react')
  , d3 = require('d3')
  , Stomp = require('stompjs')
  , SockJS = require('sockjs-client');

var Chart = React.createClass({

  getInitialState: function() {
    var data = [21, 23, 25, 30, 33, 30];
    return {
      //data: null,
      //sensorType: '',
      //dateFn: null,
      //amountFn: null,
      //svg: null,
      //x: null,
      //y: null,
      //xAxis: null,
      //yAxis: null,
      //gx: null,
      //gy: null,
      //graph: null,
      //line: null,
    };
  },

  componentDidMount: function() {
    var that = this;
    //var sock = new SockJS('http://192.168.99.100:15674/stomp');
    //var client = Stomp.over(sock);
    //client.connect('guest', 'guest', function() {
      //console.log('connect');
      //var subscription = client
                         //.subscribe('/exchange/friss_exch/#', function(msg) {
        //if (!that.state.sensorType) {
          //that.setState({sensorType: msg.headers.sensor_type});
        //}
        //var data = that.state.data;
        //var newData = JSON.parse(msg.body).physical_values;
        //newData.forEach(function(d) {
          //data.push(d.value);
        //});
        //that.state.graph.append('svg:path').attr('d', that.state.line(data));
        //that.setState({data: data});
      //});
    //});

    //var m = [80, 80, 80, 80]; // margin
    //var w = 1000 - m[1] - m[3];
    //var h = 400 - m[0] - m[2];

    //var x = d3.scale.linear()
              //.domain([0, 1000])
              //.range([0, w]);
    //var y = d3.scale.linear()
              //.domain([0, 50])
              //.range([h, 0]);

    //var line = d3.svg.line()
      //.x(function(d,i){
        //return x(i);
      //})
      //.y(function(d){
        //return y(d);
      //});

    //var graph = d3.select('#graph').append('svg:svg')
        //.attr('width', w + m[1] + m[3])
        //.attr('height', h + m[0] + m[2])
      //.append('svg:g')
        //.attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');

    //var xAxis = d3.svg.axis()
        //.scale(x)
        //.tickSize(-h)
        //.tickSubdivide(true);

    //graph.append('svg:g')
            //.attr('class', 'x axis')
            //.attr('transform', 'translate(0,' + h + ')')
            //.call(xAxis)
          //.append('text')
            //.attr('transform', 'rotate(-90)')
            //.attr('x', 200)
            //.style('text-anchor', 'start')
            //.text(that.state.sensorType);

    //var yAxisLeft = d3.svg.axis()
        //.scale(y)
        //.ticks(4)
        //.orient('left');

    //graph.append('svg:g')
      //.attr('class', 'y axis')
      //.attr('transform', 'translate(-25,0)')
      //.call(yAxisLeft);

    //graph.append('svg:path').attr('d', line(that.state.data));

    //that.setState({graph: graph, line: line}, function() {
      //this.update();
    //});

    //JSONData = [
      //{ "id": 3, "created_at": "Sun May 05 2013", "amount": 12000},
      //{ "id": 1, "created_at": "Mon May 13 2013", "amount": 2000},
      //{ "id": 2, "created_at": "Thu Jun 06 2013", "amount": 17000},
      //{ "id": 4, "created_at": "Thu May 09 2013", "amount": 15000},
      //{ "id": 5, "created_at": "Mon Jul 01 2013", "amount": 16000}
    //]
    JSONData = { type: 'temperatur',
      data: [
        {time: 1, value: 33},
        {time: 2, value: 34},
        {time: 3, value: 38},
        {time: 4, value: 30},
        {time: 5, value: 28},
      ]};

    var margin = {top: 20, right: 0, bottom: 20, left: 0}
      , width = this.props.dimension[0] - margin.right - margin.left
      , height = this.props.dimension[1] - margin.top - margin.bottom;
    

    var data = JSONData.data.slice()
    //var format = d3.time.format("%a %b %d %Y")
    var amountFn = function(d) { return d.value }
    //var dateFn = function(d) { return format.parse(d.created_at) }
    var dateFn = function(d) { return d.time }

    //var x = d3.time.scale()
    var x = d3.scale.linear()
      .range([0, width])
      .domain(d3.extent(data, dateFn));

    var y = d3.scale.linear()
      .range([height, 0])
      .domain(d3.extent(data, amountFn));

    var xAxis = d3.svg.axis()
      .scale(x)
      //.ticks(d3.time.weeks)
      //.tickSize(6, 0)
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


    this.setState({data: data,
                   height: height,
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
      this.update();
    });

  },

  customAxis: function(g) {
    g.selectAll("text")
        .attr("x", 4)
        .attr("dy", -4);
  },


  refreshGraph: function() {
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
      .attr("r", 4)
      .attr("cx", function(d) { return x(that.state.dateFn(d)) })
      .attr("cy", function(d) { return y(that.state.amountFn(d)) }) 

    this.setState({svg: svg, x: x, y: y, xAxis: xAxis, yAxis: yAxis, gx: gx, gy: gy});
  },

  setXGraph: function() {
  },

  //update: function() {
    //var that = this;
    //var interval = setInterval(function() {
      //var data = that.state.data;
      //for (var i = 0; i < 20; i++) {
        //var delta = Math.random() * (2 - -2) + -2;
        //data.push(data[data.length-1] + delta);
      //}
      //that.state.graph.append('svg:path').attr('d', that.state.line(data));
      //that.setState({data: data});
    //}, 1000);
  //},

  update: function() {
    var that = this;
    setInterval(function() {
      var data = that.state.data;
      //var start = d3.min(data, that.state.dateFn)
      //var end = d3.max(data, that.state.dateFn)
      //var time = start.getTime() + Math.random() * (end.getTime() - start.getTime())
      //var date = new Date(time)

      //obj = {
        //'id': Math.floor(Math.random() * 70),
        //'amount': Math.floor(1000 + Math.random() * 20001),
        //'created_at': date.toDateString()
      //}
      obj = {
        time: data.length,
        value: Math.random() * (40 - 20) + 20
      }

      data.push(obj);
      that.setState({data: data}, function() {
        that.refreshGraph()
      });
    }, 500);
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
