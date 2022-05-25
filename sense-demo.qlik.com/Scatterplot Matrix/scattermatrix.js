define(["jquery", "text!./scattermatrix.css", "./d3.min"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 1000
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1,
					max : 1
				},
				measures : {
					uses : "measures",
					min : 2,
					max : 9
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element, layout) {
			// get qMatrix data array
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			// create a new array that contains the measure labels
			var measureLabels = layout.qHyperCube.qMeasureInfo.map(function(d) {
				return d.qFallbackTitle;
			});
			// Create a new array for our extension with a row for each row in the qMatrix
			var data = qMatrix.map(function(d) {
				// for each element in the matrix, create a new object that has a property
				// for the grouping dimension, the first to forth metrics
				var retdata = {};
				var i;
				for	(i = 1; i < d.length; i++) {
					retdata[measureLabels[i - 1]] = d[i].qNum;
				}
				retdata["#Dim1"] = d[0].qText;
				
				return retdata;
			});
			
		
/* 			var MeasuresMinMax = {};
			var i;
			for	(i = 0; i < measureLabels.length; i++) {
				MeasuresMinMax[measureLabels[i]] = [layout.qHyperCube.qMeasureInfo[i].qMin, layout.qHyperCube.qMeasureInfo[i].qMax];
			}
 */
			// Chart object width
			var width = $element.width();
			// Chart object height
			var height = $element.height();
			// Chart object id
			var id = "container_" + layout.qInfo.qId;

			// Check to see if the chart element has already been created
			if (document.getElementById(id)) {
				// if it has been created, empty it's contents so we can redraw it
				$("#" + id).empty();
			}
			else {
				// if it hasn't been created, create it with the appropiate id and size
				$element.append($('<div />').attr("id", id).width(width).height(height));
			}
			
			vizScattermatrix(data, measureLabels, width, height, id);
		}
	};
});


var vizScattermatrix = function (data, labels, width, height, id) {
	//var width = width;
	var width = Math.min(width, height);
	//var size = 150;
	var padding = 19.5;
	
	var size = (width - padding * labels.length) / labels.length;

	var x = d3.scale.linear()
		.range([padding / 2, size - padding / 2]);

	var y = d3.scale.linear()
		.range([size - padding / 2, padding / 2]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(5);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(5);

	var color = d3.scale.category10();

	
	var domainByTrait = {},
	  traits = d3.keys(data[0]).filter(function(d) { return d !== "#Dim1"; }),
	  n = traits.length;

	traits.forEach(function(trait) {
		domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
	});


	xAxis.tickSize(size * n);
	yAxis.tickSize(-size * n);

	var brush = d3.svg.brush()
	  .x(x)
	  .y(y)
	  .on("brushstart", brushstart)
	  .on("brush", brushmove)
	  .on("brushend", brushend);

	var svg = d3.select("#"+id).append("svg")
	  .attr("width", size * n + padding)
	  .attr("height", size * n + padding)
	.append("g")
	  .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

	svg.selectAll(".x.axis")
	  .data(traits)
	.enter().append("g")
	  .attr("class", "x axis")
	  .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
	  .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

	svg.selectAll(".y.axis")
	  .data(traits)
	.enter().append("g")
	  .attr("class", "y axis")
	  .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
	  .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

	var cell = svg.selectAll(".cell")
	  .data(cross(traits, traits))
	.enter().append("g")
	  .attr("class", "cell")
	  .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
	  .each(plot);

	// Titles for the diagonal.
	cell.filter(function(d) { return d.i === d.j; }).append("text")
	  .attr("x", padding)
	  .attr("y", padding)
	  .attr("dy", ".71em")
	  .text(function(d) { return d.x; });

	cell.call(brush);

	
	function plot(p) {
	var cell = d3.select(this);

	x.domain(domainByTrait[p.x]);
	y.domain(domainByTrait[p.y]);

	cell.append("rect")
		.attr("class", "frame")
		.attr("x", padding / 2)
		.attr("y", padding / 2)
		.attr("width", size - padding)
		.attr("height", size - padding);

	cell.selectAll("circle")
		.data(data)
	  .enter().append("circle")
		.attr("cx", function(d) { return x(d[p.x]); })
		.attr("cy", function(d) { return y(d[p.y]); })
		.attr("r", 3)
		.style("fill", function(d) { return color(d.Dim1); });
	}

	var brushCell;

	// Clear the previously-active brush, if any.
	function brushstart(p) {
	if (brushCell !== this) {
	  d3.select(brushCell).call(brush.clear());
	  x.domain(domainByTrait[p.x]);
	  y.domain(domainByTrait[p.y]);
	  brushCell = this;
	}
	}

	// Highlight the selected circles.
	function brushmove(p) {
	var e = brush.extent();
	svg.selectAll("circle").classed("hidden", function(d) {
	  return e[0][0] > d[p.x] || d[p.x] > e[1][0]
		  || e[0][1] > d[p.y] || d[p.y] > e[1][1];
	});
	}

	// If the brush is empty, select all circles.
	function brushend() {
	if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
	}

	function cross(a, b) {
	var c = [], n = a.length, m = b.length, i, j;
	for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
	return c;
	}

	d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");

}