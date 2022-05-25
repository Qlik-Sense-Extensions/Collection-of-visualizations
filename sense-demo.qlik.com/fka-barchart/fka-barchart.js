define( ["qlik", "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js", "css!./fka-barchart.css"],
	function ( qlik, d3 ) {
		"use strict";
		return {
			template: '<div class="horizontal-bar-chart"><div class="chart"></div><div class="clear"></div></div>',
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 5,
						qHeight: 20
					}]
				}
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					dimensions: {
						uses: "dimensions",
						min: 3,
						max: 3
					},
					measures: {
						uses: "measures",
						min: 1,
						max: 1
					},
					sorting: {
						uses: "sorting"
					},
					settings: {
						uses: "settings",
						items: {
							BarHeight: {
								type: "number",
								label: "Bar Height",
								ref: "barHeight",
								min: 1,
								max: 500,
								defaultValue: 50
							},
							AxisWidth: {
								type: "number",
								label: "Axis Width",
								ref: "axisWidth",
								min: 0,
								max: 1000,
								defaultValue: 150
							},
							AxisHeight: {
								type: "number",
								label: "Axis Height",
								ref: "axisHeight",
								min: 0,
								max: 1000,
								defaultValue: 20
							},
							PaddingRight: {
								type: "number",
								label: "Padding Right",
								ref: "paddingRight",
								min: 0,
								max: 500,
								defaultValue: 0
							},
						}
					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			paint: function (element, layout) {
				var props = {
					barHeight: layout.barHeight ? layout.barHeight : 50,
					axisWidth: layout.axisWidth ? layout.axisWidth : 150,
					axisHeight: layout.axisHeight ? layout.axisHeight : 0,
					paddingRight: layout.paddingRight ? layout.paddingRight : 50
				}
				this.$scope.render(props);

				//needed for export
				return qlik.Promise.resolve();
			},
			controller: ["$scope", "$element", function ( $scope, $element ) {
				// $scope.getPercent = function ( val ) {
				// 	return Math.round( (val * 100 / props.qHyperCube.qMeasureInfo[0].qMax) * 100 ) / 100;
				// };
				// $scope.sel = function ( $event ) {
				// 	if ( $event.currentTarget.hasAttribute( "data-row" ) ) {
				// 		var row = parseInt( $event.currentTarget.getAttribute( "data-row" ), 10 ), dim = 0,
				// 			cell = $scope.$parent.layout.qHyperCube.qDataPages[0].qMatrix[row][0];
				// 		cell.qState = (cell.qState === "S" ? "O" : "S");
				// 		$scope.selectValues( dim, [cell.qElemNumber], true );
				// 		$element.find( $event.currentTarget ).addClass( "selected" );
				// 	}
				// };
				// var attrs = {chartHeight: $element.height()-props.axisHeight, staticAxisHeight: props.axisHeight};

				// $element.find(".chart").css('height', attrs.chartHeight);
				// $element.find(".static-axis").css('height', attrs.staticAxisHeight).css('top', attrs.chartHeight + "px");

				// var eleHeight = parseFloat(attrs.chartHeight) + parseFloat(attrs.staticAxisHeight);
				// $element.find(".clear").css('height', eleHeight + "px");
				var attrs = {};
				var container = $element.find(".horizontal-bar-chart");
				var staticAxis = $element.find(".static-axis");
				var chart = $element.find(".chart");

				// var barHeight = props.barHeight;
				// var margin = {top:0, bottom: 0, left: props.axisWidth, right: 50};
				// var chartHeight = chart.height() - margin.top - margin.bottom,
				// 	staticAxisHeight = staticAxis.height(),
				// 	width = container.width() - margin.left - margin.right;

				var staticAxisSvg = d3.select(staticAxis[0]).append("svg")
				  .append("g");

				var chartSvg = d3.select(chart[0]).append("svg")
				  .append("g");

				 chartSvg.append("g")
						.attr("class", "y axis");

				staticAxisSvg.append("g")
						.attr("class", "x axis");
				
				var percents = eval(attrs.percents);
				if (percents) {
					var tickFormat = d3.format(".0%");
				} else {
					var tickFormat = d3.format(",.f");
				}

				$scope.render = function(props) {
					var data = $scope.layout.qHyperCube.qDataPages[0].qMatrix;
					if(data === undefined) {return;}

					var attrs = {chartHeight: $element.height()-props.axisHeight, staticAxisHeight: props.axisHeight};

					$element.find(".chart").css('height', attrs.chartHeight);
					$element.find(".static-axis").css('height', attrs.staticAxisHeight).css('top', attrs.chartHeight + "px");

					var eleHeight = parseFloat(attrs.chartHeight) + parseFloat(attrs.staticAxisHeight);
					$element.find(".clear").css('height', eleHeight + "px");

					var container = $element.find(".horizontal-bar-chart");

					var barHeight = props.barHeight;
					var margin = {top:0, bottom: 0, left: props.axisWidth, right: props.paddingRight};
					var chartHeight = chart.height() - margin.top - margin.bottom,
						staticAxisHeight = staticAxis.height(),
						width = container.width() - margin.left - margin.right;

					var staticAxisSvg = d3.select(staticAxis[0]).select("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", staticAxisHeight)
					  .select("g")
					  	.attr("transform", "translate(0," + -staticAxisHeight + ")");
					
					var chartSvg = d3.select(chart[0]).select("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", data.length * barHeight)
					  .select("g")
					  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					staticAxisSvg.select("g").attr("transform", "translate(" + margin.left + "," + staticAxisHeight + ")");

					var y = d3.scale.ordinal()
						.domain(data.map(function (d){return d[0].qText}))
						.rangeBands([0, data.length * barHeight], .25);
					var yAxis = d3.svg.axis()
						.scale(y)
						.orient("left")
						.outerTickSize(0);

					var x = d3.scale.linear()
						// .domain([d3.min(data, function (d){return d[3].qNum}), d3.max(data, function (d){return d[3].qNum}) ])
						.domain([0, Math.max(1,d3.max(data, function (d){return d[3].qNum})) ])
						.range([0, width]);
					var xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom")
						.tickFormat(tickFormat)
						.ticks(3)
						.innerTickSize(-chartHeight)
						.outerTickSize(0);

					chartSvg.select(".y.axis")
						//.transition()
						.call(yAxis)
						.selectAll("text")
						.data(data)
						.on("click", function (d){ $scope.selectValues(0, [d[0].qElemNumber], true) })
						.style("font-family", "tahoma")
						.style("text-anchor", "start")
						.attr("x", "-" + margin.left);
					
					chartSvg.select(".y.axis")
						.selectAll(".tick")
						.data(data)
					// 	.select(".playerimage")
					// 	.data(function(d) { return d; })
					//   .enter()
					  .append("svg:image")
					  	.attr("class", "playerimage")
					  	.attr("width", 36)
						.attr("height", 36)
						.attr("transform", "translate(-40, -18)")
					  	// .attr("xlink:href", function() { return require.toUrl('../Extensions/fka-barchart/Players/ADEL/ATKINS Rory_t.png'); });
						.attr("xlink:href", function(d) { return require.toUrl('../Extensions/fka-barchart/logos/' + d[1].qText); });
						

					staticAxisSvg.select(".x.axis")
						//.transition()
						.call(xAxis);

					var bars = chartSvg.selectAll(".bar")
						.data(data);

					bars
					  .exit()
						.transition()
						.remove();

					bars
						.attr("fill", function(d) { return d[2].qText; })
						.transition()
					  	.attr("y", function (d){return y(d[0].qText)})
					  	.attr("width", function (d){return x(d[3].qNum)});

					//Enter bar
					bars
					  .enter().append("rect")
					  	.attr("class", "bar")
					  	.on("click", function (d){ $scope.selectValues(0, [d[0].qElemNumber], true) }) //app.field(attrs.field).selectMatch(d[0].qText,true)
						.attr("fill", function(d) { return d[2].qText; })
					  	.attr("y", function (d){return y(d[0].qText)})
					  	.attr("height", y.rangeBand())
					  	.attr("x", x(0))
					  	.attr("width", x(0))
					  	.transition()
					  	.attr("width", function (d){return x(d[3].qNum)});


					var barText = chartSvg.selectAll(".bartext")
						.data(data);

					barText
					  .exit()
						.remove();

					barText
						.attr("y", function (d,i){return y(d[0].qText) + y.rangeBand()/2 })
					  	.attr("x", function (d){return x(d[3].qNum) + 4})
					  	.text(function (d){return d[3].qText })
					  	.attr("opacity", 0)
					  	.transition()
					  	.attr("opacity", 1);

					barText
					  .enter().append("text")
					  	.attr("class", "bartext")
						.on("click", function (d){ $scope.selectValues(0, [d[0].qElemNumber], true) })
					  	.attr("text-anchor", "start")
					  	.attr("fill", "#666")
					  	.attr("y", function (d,i){return y(d[0].qText) + y.rangeBand()/2 })
					  	.attr("dy", ".4em")
					  	.attr("x", function (d){return x(d[3].qNum) + 4})
					  	.text(function (d){return d[3].qText })
					  	.attr("opacity", 0)
					  	.transition()
					  	.attr("opacity", 1);

				}

				// $(window).resize(function () {

				// 	width = container.width() - margin.left - margin.right;

				// 	var staticAxisSvg = d3.select(staticAxis[0]).select("svg");
				// 	var chartSvg = d3.select(chart[0]).select("svg");

				// 	staticAxisSvg.attr("width", width + margin.left + margin.right);
				// 	chartSvg.attr("width", width + margin.left + margin.right);

				// 	data = scope.data;
					
				// 	if(data === undefined) {return;}
					
				// 	staticAxisSvg = d3.select(staticAxis[0]).select("svg").select("g");
				// 	chartSvg = chartSvg
				// 		.attr("height", data.length * barHeight)
				// 		.select("g");

				// 	var y = d3.scale.ordinal()
				// 		.domain(data.map(function (d){return d[0].qText}))
				// 		.rangeBands([0, data.length * barHeight], .25);
				// 	var yAxis = d3.svg.axis()
				// 		.scale(y)
				// 		.orient("left")
				// 		.outerTickSize(0);

				// 	var x = d3.scale.linear()
				// 		// .domain([d3.min(data, function (d){return d[3].qNum}), d3.max(data, function (d){return d[3].qNum}) ])
				// 		.domain([0, d3.max(data, function (d){return d[3].qNum}) ])
				// 		.range([0, width]);
				// 	var xAxis = d3.svg.axis()
				// 		.scale(x)
				// 		.orient("bottom")
				// 		.tickFormat(tickFormat)
				// 		.ticks(3)
				// 		.innerTickSize(-chartHeight)
				// 		.outerTickSize(0);

				// 	chartSvg.select(".y.axis")
				// 		//.transition()
				// 		.call(yAxis)
				// 		.selectAll("text")
				// 		.style("text-anchor", "start")
				// 		.attr("x", "-" + margin.left);

				// 	staticAxisSvg.select(".x.axis")
				// 		//.transition()
				// 		.call(xAxis);

				// 	chartSvg.selectAll(".bar")
				// 		.data(data)
				// 		//.transition()
				// 	  	.attr("y", function (d){return y(d[0].qText)})
				// 	  	.attr("width", function (d){return x(d[3].qNum)});

				// 	chartSvg.selectAll(".bartext")
				// 		.data(data)
				// 		.attr("y", function (d,i){return y(d[0].qText) + y.rangeBand()/2 })
				// 	  	.attr("x", function (d){return x(d[3].qNum) + 4})
				// 	  	.text(function (d){return d[3].qText })
				// 	  	.attr("opacity", 0)
				// 	  	//.transition()
				// 	  	.attr("opacity", 1);
				// });

			}]
		};

	} );
