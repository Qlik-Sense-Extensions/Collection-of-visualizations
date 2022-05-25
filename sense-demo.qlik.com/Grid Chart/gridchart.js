define(["jquery", "text!./gridchart.css","./d3.min"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 4,
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
					min : 2,
					max:2
				},
				measures : {
					uses : "measures",
					min : 1,
					max:2
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items: {
						colorPanel:{
							type:"items",
							label:"Color",
							items: {
								item1: {
									ref: "nodeColor.value",
									label: "Color",
									type: "string",
									defaultValue: "#4682B4"
								},
								item2:{
									ref:"nodeColor.transSwitch",
									component:"switch",
									type:"boolean",
									label:"Transparency",
									options: [ 
										{
											value: true,
											label: "On"
										},
										{
											value: false,
											label: "Off"
										}
									],
									defaultValue:true
								}
							}
						}
					}
				}

			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element,layout) {
			// Create a reference to the app, which will be used later to make selections
			var self = this;
			// Get the data
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			var data = qMatrix.map(function(d) {
				return {
					"Dim1":d[0].qText,
					"Dim1_key":d[0].qElemNumber,
					"Dim2":d[1].qText,
					"Dim2_key":d[1].qElemNumber,
					"Value":d[2].qNum,
					"Text":d[2].qText,
					"InputColor": d[3] ? d[3].qText : "N/A"
				}
			});

			// Get the selected counts for the 2 dimensions, which will be used later for custom selection logic
			var selections = {
				dim1_count: layout.qHyperCube.qDimensionInfo[0].qStateCounts.qSelected,
				dim2_count: layout.qHyperCube.qDimensionInfo[1].qStateCounts.qSelected
			};

			// Get the extension container properties
			var ext_prop = {
				height: $element.height(),
				width: $element.width(),
				id: "container_" + layout.qInfo.qId
			};

			// Get the user properties
			var user_prop = layout.nodeColor;

			// Create or empty the chart container
			if(document.getElementById(ext_prop.id)) {
				$("#" + ext_prop.id).empty();
			}
			else {
				$element.append($("<div />").attr("id",ext_prop.id).width(ext_prop.width).height(ext_prop.height));
			}

			// Draw the visualization
			viz(self,data,ext_prop,selections,user_prop);

			function viz(self,data,ext_prop,selections,user_prop) {

				// define initial margin
				var chart_margin = {
					top:10,
					bottom:20,
					left:10,
					right:10
				};

				// Define the width and height, which will match in this example
				var width = ext_prop.width;
				var height = ext_prop.height;

				// Create the svg and append a group to it
				var svg = d3.select("#" + ext_prop.id).append("svg")
					.attr("width",width)
					.attr("height",height)
					.append("g");

				// Set up an initial yAxis so we can determine the left margin width
				var y = d3.scale.ordinal()
					.domain(data.map(function(d) {return d.Dim2;}))
					.rangeBands([0,height]);

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

				var yAxis_g = svg.append("g")
			    	.attr("class", "y axis")
			    	.call(yAxis);

			    // Determine the width of the axis
				var yAxis_width = yAxis_g[0][0].getBoundingClientRect().width;

				// Remove the test yAxis
				yAxis_g.remove();

				// Update chart margin based on the yAxis width
				chart_margin.left = chart_margin.left + yAxis_width; 

				// Create the chart height and width based on the new margin values
				var chart_height = height - chart_margin.top - chart_margin.bottom;
				var chart_width = width - chart_margin.left - chart_margin.right;

				// Move the svg group based on the new chart margins
				svg.attr("transform","translate(" + chart_margin.left + "," + chart_margin.top + ")");


				// Create the x scale and axis	
				var x = d3.scale.ordinal()
			    	.domain(data.map(function(d) {return d.Dim1;}))
			    	.rangeBands([0, chart_width]);

				var xAxis = d3.svg.axis()
				    .scale(x)
				    .orient("bottom");

				// Update y scale based on new chart height
				y.rangeBands([0,chart_height]);

				// Create a scale for the bubble size
				var max_r = Math.min(x.rangeBand(),y.rangeBand())/2;
				var min_to_max_ratio = d3.min(data,function(d) {return d.Value})/d3.max(data,function(d) {return d.Value});
				var min_r = max_r*min_to_max_ratio;

				var r = d3.scale.linear()
					.domain([d3.min(data,function(d) {return d.Value}),d3.max(data,function(d) {return d.Value})])
					.range([min_r,max_r]);

			    // Create an opacity scale
			    var opacity = d3.scale.linear()
					.domain([d3.min(data,function(d) {return d.Value}),d3.max(data,function(d) {return d.Value})])
					.range([min_to_max_ratio,1]);

				// Add the circles
				var circles = svg.selectAll(".circles")
					.data(data)
					.enter()
					.append("circle")
					.attr("class","circles")
					.attr("cx",function(d) {return x(d.Dim1) + x.rangeBand()/2;})
					.attr("cy",function(d) {return y(d.Dim2) + y.rangeBand()/2;})
					.attr("r",function(d) {return r(d.Value)})
					.attr("fill",function(d) {return d.InputColor == "N/A" ? user_prop.value : ARGBtoRGBA(d.InputColor);});

				// Add title text for the circles
				circles
					.append("title")
					.text(function(d) {return d.Text;});

				// Add the selection logic on clicking the circles
				circles.on("click",function(d) {
					
					// Logic for appropriate circle selection
					if(selections.dim1_count!=1 && selections.dim2_count==1) {
						self.backendApi.selectValues(0,[d.Dim1_key],true);
					}
					else if(selections.dim2_count!=1 && selections.dim1_count==1) {
						self.backendApi.selectValues(1,[d.Dim2_key],true);
					}
					else {
						self.backendApi.selectValues(0,[d.Dim1_key],true);
						self.backendApi.selectValues(1,[d.Dim2_key],true);
					}
					
				});

				// Add transparency if the user enabled it
				if(user_prop.transSwitch==true) {
					circles.attr("fill-opacity",function(d) {return opacity(d.Value)})
				}

				// Add the x-axis
				svg.append("g")
			    	.attr("class", "x axis")
			    	.attr("transform","translate(0," + chart_height + ")")
			    	.call(xAxis);

			    // Add the y-axis
			    svg.append("g")
			    	.attr("class", "y axis")
			    	.call(yAxis);

			    // x-axis click to select
			    d3.selectAll(".x.axis .tick").on("click",function(d) {
					self.backendApi.selectValues(0,[getProp(data,"Dim1",d,"Dim1_key")],true);
				});

			    // y-axis click to select
				    d3.selectAll(".y.axis .tick").on("click",function(d) {
					self.backendApi.selectValues(1,[getProp(data,"Dim2",d,"Dim2_key")],true);
				});


			};

			// Helper functions
			function distinctValues(array,prop) {
				var values = [];
				array.forEach(function(d) {
					if(values.indexOf(d[prop])==-1) {
						values.push(d[prop]);
					}
				})
				return values;
			}

			function getProp(array,source_prop,source_val,target_prop) {
				var output;
				for (var i =0; i<=array.length;i++) {
					if(array[i][source_prop]==source_val) {
						output = array[i][target_prop];
						break;
					}
				}
				return output;
			}

			function ARGBtoRGBA(text) {
				if (text.slice([0],[3]).toLowerCase()==="rgb") {
					return text;
				}
				else if (text.slice([0],[4]).toLowerCase()==="argb") {
					var new_a_val = text.slice([5],[text.indexOf(",")])/255;
					return "rgba(" + text.slice([text.indexOf(",")+1]).replace(")","") + "," + new_a_val + ")"

				}
			}

		}
	};
});

