var viz = function($element, layout, _this) {
	var id = senseUtils.setupContainer($element,layout,"d3vl_bar"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	// D3 code
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = ext_width - margin.left - margin.right,
	    height = ext_height - margin.top - margin.bottom;

	var x = d3.scale.ordinal();

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10);

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	var label_width = getLabelWidth(yAxis,svg);

	margin.left = margin.left + label_width;
	width = ext_width - margin.left - margin.right;
	x.rangeRoundBands([0, width], .1);

	var plot = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x.domain(data.map(function(d) { return d.dim(1).qText; }));
	y.domain([0, d3.max(data, function(d) { return d.measure(1).qNum; })]);

	plot.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	plot.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text(senseUtils.getMeasureLabel(1,layout));

	plot.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.dim(1).qText); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.measure(1).qNum); })
	      .attr("height", function(d) { return height - y(d.measure(1).qNum); })
	      .on("click",function(d) {
	      	return d.dim(1).qSelect();
	      });
	
};