define(["jquery", "text!./parallelcoordinates.css", "./d3.min"], function($, cssContent) {'use strict';
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
					uses : "settings"
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
				// for the grouping dimension, the first metric, and the second metric
				var retdata = {};
				
				var i;
				for	(i = 1; i < d.length; i++) {
					retdata[measureLabels[i - 1]] = d[i].qNum;
				}
								
				// retdata[measureLabels[0]] = d[1].qText;
				// retdata[measureLabels[1]] = d[2].qText;
				// retdata[measureLabels[2]] = d[3].qText;
				
				return retdata;
			});

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
			
			vizParallelcoordinates(data, measureLabels, width, height, id);
		}
	};
});


var vizParallelcoordinates = function (data, labels, width, height, id) {
	var margin = {top: 30, right: 10, bottom: 10, left: 10},
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

	var x = d3.scale.ordinal().rangePoints([0, width], 1),
		y = {},
		dragging = {};

	var line = d3.svg.line(),
		axis = d3.svg.axis().orient("left"),
		background,
		foreground;

	var svg = d3.select("#"+id).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		// Extract the list of dimensions and create a scale for each.
	x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
	return (y[d] = d3.scale.linear()
		.domain(d3.extent(data, function(p) { return +p[d]; }))
		.range([height, 0]));
	}));
	  
	  
	// Add grey background lines for context.
	background = svg.append("g")
	  .attr("class", "background")
	.selectAll("path")
	  .data(data)
	.enter().append("path")
	  .attr("d", path);

	// Add blue foreground lines for focus.
	foreground = svg.append("g")
	  .attr("class", "foreground")
	.selectAll("path")
	  .data(data)
	.enter().append("path")
	  .attr("d", path);

	// Add a group element for each dimension.
	var g = svg.selectAll(".dimension")
	  .data(dimensions)
	.enter().append("g")
	  .attr("class", "dimension")
	  .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
	  .call(d3.behavior.drag()
		.origin(function(d) { return {x: x(d)}; })
		.on("dragstart", function(d) {
		  dragging[d] = x(d);
		  background.attr("visibility", "hidden");
		})
		.on("drag", function(d) {
		  dragging[d] = Math.min(width, Math.max(0, d3.event.x));
		  foreground.attr("d", path);
		  dimensions.sort(function(a, b) { return position(a) - position(b); });
		  x.domain(dimensions);
		  g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
		})
		.on("dragend", function(d) {
		  delete dragging[d];
		  transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
		  transition(foreground).attr("d", path);
		  background
			  .attr("d", path)
			.transition()
			  .delay(500)
			  .duration(0)
			  .attr("visibility", null);
		}));

	// Add an axis and title.
	g.append("g")
	  .attr("class", "axis")
	  .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
	.append("text")
	  .style("text-anchor", "middle")
	  .attr("y", -9)
	  .text(function(d) { return d; });

	// Add and store a brush for each axis.
	g.append("g")
	  .attr("class", "brush")
	  .each(function(d) {
		d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
	  })
	.selectAll("rect")
	  .attr("x", -8)
	  .attr("width", 16);
//	});
	
	

	function position(d) {
	  var v = dragging[d];
	  return v == null ? x(d) : v;
	}

	function transition(g) {
	  return g.transition().duration(500);
	}

	// Returns the path for a given data point.
	function path(d) {
	  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
	}

	function brushstart() {
	  d3.event.sourceEvent.stopPropagation();
	}

	// Handles a brush event, toggling the display of foreground lines.
	function brush() {
	  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
		  extents = actives.map(function(p) { return y[p].brush.extent(); });
	  foreground.style("display", function(d) {
		return actives.every(function(p, i) {
		  return extents[i][0] <= d[p] && d[p] <= extents[i][1];
		}) ? null : "none";
	  });
	}
 
 }