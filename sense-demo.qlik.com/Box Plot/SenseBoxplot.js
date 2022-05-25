define(["jquery", "text!./SenseBoxplot.css", "./d3.min", "general.utils/property-resolver", "translator"], function ($, cssContent, d3, propresolve, trans) {
	'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version : 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
						qWidth : 4,
						qHeight : 500
					}
				]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					type : "array",
					component : "dimensions",
					translation : "Common.Dimensions",
					ref : "qHyperCubeDef.qDimensions",
					disabledRef : "qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions",
					label : "Fields",
					min : 2,
					max : 2,
					allowAdd : !0,
					allowRemove : !0,
					allowMove : !0,
					addTranslation : "properties.dimensions.add",
					grouped : !0,
					items : {
						libraryId : {
							type : "string",
							component : "library-item",
							libraryItemType : "dimension",
							ref : "qLibraryId",
							translation : "Common.Dimension",
							show : function (a) {
								return a.qLibraryId
							}
						},
						inlineDimension : {
							component : "inline-dimension",
							show : function (a) {
								return !a.qLibraryId
							}
						},
						autoSort : {
							ref : "qDef.autoSort",
							type : "boolean",
							defaultValue : !0,
							show : !1
						},
						cId : {
							ref : "qDef.cId",
							type : "string",
							show : !1
						},
						nullSuppression : {
							type : "boolean",
							ref : "qNullSuppression",
							defaultValue : !1,
							translation : "properties.dimensions.showNull",
							inverted : !0
						},
						dimensionLimits : {
							type : "items",
							items : {
								otherMode : {
									type : "string",
									component : "dropdown",
									ref : "qOtherTotalSpec.qOtherMode",
									translation : "properties.dimensionLimits.limitation",
									options : [{
											value : "OTHER_OFF",
											translation : "properties.dimensionLimits.none"
										}, {
											value : "OTHER_COUNTED",
											translation : "properties.dimensionLimits.fixedNumber"
										}, {
											value : "OTHER_ABS_LIMITED",
											translation : "properties.dimensionLimits.exactValue"
										}, {
											value : "OTHER_REL_LIMITED",
											translation : "properties.dimensionLimits.relativeValue"
										}
									],
									defaultValue : "OTHER_OFF",
									readOnly : function (a, b) {
										return 0 === b.getMeasures().length
									},
									change : function (b) {
										var c,
										d = propresolve.getValue(b, "qOtherTotalSpec.qOtherMode");
										"OTHER_REL_LIMITED" === d ? (c = propresolve.getValue(b, "qOtherTotalSpec.qOtherLimit.qv", "0"), c.length && "%" !== c[c.length - 1] && g.isNumeric(c) && (b.qOtherTotalSpec.qOtherLimit || propresolve.setValue(b, "qOtherTotalSpec.qOtherLimit", {
													qv : "0"
												}), b.qOtherTotalSpec.qOtherLimit.qv = c + "%")) : "OTHER_ABS_LIMITED" === d && (c = propresolve.getValue(b, "qOtherTotalSpec.qOtherLimit.qv", "0"), c.length && "%" === c[c.length - 1] && (b.qOtherTotalSpec.qOtherLimit || propresolve.setValue(b, "qOtherTotalSpec.qOtherLimit", {
													qv : "0"
												}), b.qOtherTotalSpec.qOtherLimit.qv = c.substr(0, c.length - 1)))
									}
								},
								otherSortMode : {
									type : "string",
									component : "buttongroup",
									ref : "qOtherTotalSpec.qOtherSortMode",
									options : [{
											value : "OTHER_SORT_DESCENDING",
											translation : "Common.Top"
										}, {
											value : "OTHER_SORT_ASCENDING",
											translation : "Common.Bottom"
										}
									],
									defaultValue : "OTHER_SORT_DESCENDING",
									show : function (b, c) {
										return "OTHER_COUNTED" === propresolve.getValue(b, "qOtherTotalSpec.qOtherMode") && c.getMeasures().length > 0
									}
								},
								otherCounted : {
									component : "expression",
									expressionType : "ValueExpr",
									ref : "qOtherTotalSpec.qOtherCounted",
									defaultValue : {
										qv : "10"
									},
									show : function (b, c) {
										return "OTHER_COUNTED" === propresolve.getValue(b, "qOtherTotalSpec.qOtherMode") && c.getMeasures().length > 0
									}
								},
								otherLimitMode : {
									type : "string",
									component : "buttongroup",
									ref : "qOtherTotalSpec.qOtherLimitMode",
									options : [{
											value : "OTHER_GE_LIMIT",
											label : ">=",
											tooltipTranslation : "properties.greaterOrEqualTo"
										}, {
											value : "OTHER_GT_LIMIT",
											label : ">",
											tooltipTranslation : "properties.greaterThan"
										}, {
											value : "OTHER_LT_LIMIT",
											label : "<",
											tooltipTranslation : "properties.lessThan"
										}, {
											value : "OTHER_LE_LIMIT",
											label : "<=",
											tooltipTranslation : "properties.lessOrEqualTo"
										}
									],
									defaultValue : "OTHER_GE_LIMIT",
									icon : !0,
									smallIconFont : !0,
									show : function (b, c) {
										var d = propresolve.getValue(b, "qOtherTotalSpec.qOtherMode");
										return ("OTHER_ABS_LIMITED" === d || "OTHER_REL_LIMITED" === d) && c.getMeasures().length > 0
									}
								},
								otherLimit : {
									component : "expression",
									expressionType : "ValueExpr",
									ref : "qOtherTotalSpec.qOtherLimit",
									defaultValue : {
										qv : "0"
									},
									show : function (b, c) {
										var d = propresolve.getValue(b, "qOtherTotalSpec.qOtherMode");
										return ("OTHER_ABS_LIMITED" === d || "OTHER_REL_LIMITED" === d) && c.getMeasures().length > 0
									}
								},
								calculatedAgainstMessage : {
									component : "text",
									label : function (a, b) {
										var c = b.getMeasureLayouts()[0];
										return c ? trans.get("Properties.DimensionLimits.CalculatedAgainst", c.qFallbackTitle) : trans.get("Properties.DimensionLimits.NoMeasure")
									},
									show : function (b) {
										var c = propresolve.getValue(b, "qOtherTotalSpec.qOtherMode");
										return "OTHER_OFF" !== c
									}
								}
							}
						},
						others : {
							type : "items",
							items : {
								suppressOther : {
									type : "boolean",
									ref : "qOtherTotalSpec.qSuppressOther",
									translation : "properties.dimensionLimits.showOthers",
									inverted : !0,
									defaultValue : !1,
									show : function (b, c) {
										return "OTHER_OFF" !== propresolve.getValue(b, "qOtherTotalSpec.qOtherMode") && c.getMeasures().length > 0
									}
								},
								othersLabel : {
									type : "string",
									expression : "optional",
									ref : "qDef.othersLabel",
									translation : "properties.dimensionLimits.othersLabel",
									defaultValue : function () {
										return trans.get("properties.dimensionLimits.others")
									},
									show : function (b, c) {
										return !propresolve.getValue(b, "qOtherTotalSpec.qSuppressOther") && "OTHER_OFF" !== propresolve.getValue(b, "qOtherTotalSpec.qOtherMode") && c.getMeasures().length > 0
									}
								}
							}
						}
					}
				},
				measures : {
					uses : "measures",
					min : 0,
					max : 1
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
		paint : function ($element, layout) {

			var _this = this,
			id = "sb_" + layout.qInfo.qId;

			//if extension has already been loaded, empty it, if not attach unique id
			if (document.getElementById(id)) {
				$("#" + id).empty();
			} else {
				$element.append($('<div />').attr("id", id));
			}

			var destElement = document.getElementById(id);

			//Bring in Data
			var qData = layout.qHyperCube.qDataPages[0];
			var qMatrix = qData.qMatrix;

			var source = qMatrix.map(function (d) {
					return {
						"Dim" : d[0].qText,
						"Meas" : d[1].qNum,
						"nodeelem" : d[0].qElemNumber //first dimension!
					}
				});

			var min = Infinity,
			max = -Infinity;

			var dataArray = [];

			for (var i = 0; i < source.length; i++) {
				var insideArray = [];
				insideArray.push(source[i].Dim, []);
				dataArray.push(insideArray);

			}

			var DimsAll = [];
			for (var i = 0; i < source.length; i++) {
				DimsAll.push(source[i].Dim);
			}
			var dimsUnique = _.uniq(DimsAll)

				var filterednames;
			var dataArray = [];

			var measureArray = [];

			dimsUnique.forEach(function (d) {
				var insideArray = [];
				filterednames = source.filter(function (obj) {
						return (obj.Dim === d);
					});

				var insideMeas = [];
				for (var i = 0; i < filterednames.length; i++) {
					insideMeas.push(filterednames[i].Meas)
					measureArray.push(filterednames[i].Meas)
				}

				insideArray.push(d);
				insideArray.push(insideMeas);
				dataArray.push(insideArray);
			});

			min = Math.min.apply(Math, measureArray);
			max = Math.max.apply(Math, measureArray);
			//End Data Load

			//Set X and Y axis titles
			var xAxisTitle;
			var yAxisTitle;
			var titleint = 1;
			$.each(this.backendApi.getDimensionInfos(), function (key, value) {

				if (titleint === 1) {
					xAxisTitle = value.qFallbackTitle;
					titleint = titleint + 1
				}

				if (titleint === 2) {
					yAxisTitle = value.qFallbackTitle;
				}
			});

			d3.box = function () {
				var width = 1,
				height = 1,
				duration = 600,
				domain = null,
				value = Number,
				whiskers = boxWhiskers,
				quartiles = boxQuartiles,
				showLabels = true, // whether or not to show text labels
				numBars = 4,
				curBar = 1,
				tickFormat = null;

				// For each small multiple…
				function box(g) {
					g.each(function (data, i) {
						var d = data[1].sort(d3.ascending);

						var g = d3.select(this),
						n = d.length,
						min = d[0],
						max = d[n - 1];

						// Compute quartiles. Must return exactly 3 elements.
						var quartileData = d.quartiles = quartiles(d);

						// Compute whiskers. Must return exactly 2 elements, or null.
						var whiskerIndices = whiskers && whiskers.call(this, d, i),
						whiskerData = whiskerIndices && whiskerIndices.map(function (i) {
								return d[i];
							});

						// Compute outliers. If no whiskers are specified, all data are "outliers".
						// We compute the outliers as indices, so that we can join across transitions!
						var outlierIndices = whiskerIndices
							 ? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
							 : d3.range(n);

						// Compute the new x-scale.
						var x1 = d3.scale.linear()
							.domain(domain && domain.call(this, d, i) || [min, max])
							.range([height, 0]);

						// Retrieve the old x-scale, if this is an update.
						var x0 = this.__chart__ || d3.scale.linear()
							.domain([0, Infinity])
							.range(x1.range());

						// Stash the new scale.
						this.__chart__ = x1;

						// Note: the box, median, and box tick elements are fixed in number,
						// so we only have to handle enter and update. In contrast, the outliers
						// and other elements are variable, so we need to exit them! Variable
						// elements also fade in and out.

						// Update center line: the vertical line spanning the whiskers.
						var center = g.selectAll("line.center")
							.data(whiskerData ? [whiskerData] : []);

						//vertical line
						center.enter().insert("line", "rect")
						.attr("class", "center")
						.attr("x1", width / 2)
						.attr("y1", function (d) {
							return x0(d[0]);
						})
						.attr("x2", width / 2)
						.attr("y2", function (d) {
							return x0(d[1]);
						})
						.style("opacity", 1e-6)
						.transition()
						.attr("x", 320)
						.duration(1000) // this is 1s
						.delay(100)
						.duration(duration)
						.style("opacity", 1)
						.attr("y1", function (d) {
							return x1(d[0]);
						})
						.attr("y2", function (d) {
							return x1(d[1]);
						});

						center.transition()
						.duration(duration)
						.style("opacity", 1)
						.attr("y1", function (d) {
							return x1(d[0]);
						})
						.attr("y2", function (d) {
							return x1(d[1]);
						});

						center.exit().transition()
						.duration(duration)
						.style("opacity", 1e-6)
						.attr("y1", function (d) {
							return x1(d[0]);
						})
						.attr("y2", function (d) {
							return x1(d[1]);
						})
						.remove();

						// Update innerquartile box.
						var box = g.selectAll("rect.box")
							.data([quartileData]);

						box.enter().append("rect")
						.attr("class", "box")
						.attr("x", 0)
						.attr("y", function (d) {
							return x0(d[2]);
						})
						.attr("width", width)
						.attr("height", function (d) {
							return x0(d[0]) - x0(d[2]);
						})
						.transition()
						.duration(duration)
						.attr("y", function (d) {
							return x1(d[2]);
						})
						.attr("height", function (d) {
							return x1(d[0]) - x1(d[2]);
						});

						box.transition()
						.duration(duration)
						.attr("y", function (d) {
							return x1(d[2]);
						})
						.attr("height", function (d) {
							return x1(d[0]) - x1(d[2]);
						});

						// Update median line.
						var medianLine = g.selectAll("line.median")
							.data([quartileData[1]]);

						medianLine.enter().append("line")
						.attr("class", "median")
						.attr("x1", 0)
						.attr("y1", x0)
						.attr("x2", width)
						.attr("y2", x0)
						.transition()
						.duration(duration)
						.attr("y1", x1)
						.attr("y2", x1);

						medianLine.transition()
						.duration(duration)
						.attr("y1", x1)
						.attr("y2", x1);

						// Update whiskers.
						var whisker = g.selectAll("line.whisker")
							.data(whiskerData || []);

						whisker.enter().insert("line", "circle, text")
						.attr("class", "whisker")
						.attr("x1", 0)
						.attr("y1", x0)
						.attr("x2", 0 + width)
						.attr("y2", x0)
						.style("opacity", 1e-6)
						.transition()
						.duration(duration)
						.attr("y1", x1)
						.attr("y2", x1)
						.style("opacity", 1);

						whisker.transition()
						.duration(duration)
						.attr("y1", x1)
						.attr("y2", x1)
						.style("opacity", 1);

						whisker.exit().transition()
						.duration(duration)
						.attr("y1", x1)
						.attr("y2", x1)
						.style("opacity", 1e-6)
						.remove();

						// Update outliers.
						var outlier = g.selectAll("circle.outlier")
							.data(outlierIndices, Number);

						outlier.enter().insert("circle", "text")
						.attr("class", "outlier")
						.attr("r", 5)
						.attr("cx", width / 2)
						.attr("cy", function (i) {
							return x0(d[i]);
						})
						.style("opacity", 1e-6)
						.transition()
						.duration(duration)
						.attr("cy", function (i) {
							return x1(d[i]);
						})
						.style("opacity", 1);

						outlier.transition()
						.duration(duration)
						.attr("cy", function (i) {
							return x1(d[i]);
						})
						.style("opacity", 1);

						outlier.exit().transition()
						.duration(duration)
						.attr("cy", function (i) {
							return x1(d[i]);
						})
						.style("opacity", 1e-6)
						.remove();

						// Compute the tick format.
						var format = tickFormat || x1.tickFormat(8);

						// Update box ticks.
						var boxTick = g.selectAll("text.box")
							.data(quartileData);
						if (showLabels == true) {
							boxTick.enter().append("text")
							.attr("class", "box")
							.attr("dy", ".3em")
							.attr("dx", function (d, i) {
								return i & 1 ? 6 : -6
							})
							.attr("x", function (d, i) {
								return i & 1 ?  + width : 0
							})
							.attr("y", x0)
							.attr("text-anchor", function (d, i) {
								return i & 1 ? "start" : "end";
							})
							.text(format)
							.transition()
							.duration(duration)
							.attr("y", x1);
						}

						boxTick.transition()
						.duration(duration)
						.text(format)
						.attr("y", x1);

						// Update whisker ticks. These are handled separately from the box
						// ticks because they may or may not exist, and we want don't want
						// to join box ticks pre-transition with whisker ticks post-.
						var whiskerTick = g.selectAll("text.whisker")
							.data(whiskerData || []);
						if (showLabels == true) {
							whiskerTick.enter().append("text")
							.attr("class", "whisker")
							.attr("dy", ".3em")
							.attr("dx", 6)
							.attr("x", width)
							.attr("y", x0)
							.text(format)
							.style("opacity", 1e-6)
							.transition()
							.duration(duration)
							.attr("y", x1)
							.style("opacity", 1);
						}
						whiskerTick.transition()
						.duration(duration)
						.text(format)
						.attr("y", x1)
						.style("opacity", 1);

						whiskerTick.exit().transition()
						.duration(duration)
						.attr("y", x1)
						.style("opacity", 1e-6)
						.remove();
					});
					d3.timer.flush();
				}

				box.width = function (x) {
					if (!arguments.length)
						return width;
					width = x;
					return box;
				};

				box.height = function (x) {
					if (!arguments.length)
						return height;
					height = x;
					return box;
				};

				box.tickFormat = function (x) {
					if (!arguments.length)
						return tickFormat;
					tickFormat = x;
					return box;
				};

				box.duration = function (x) {
					if (!arguments.length)
						return duration;
					duration = x;
					return box;
				};

				box.domain = function (x) {
					if (!arguments.length)
						return domain;
					domain = x == null ? x : d3.functor(x);
					return box;
				};

				box.value = function (x) {
					if (!arguments.length)
						return value;
					value = x;
					return box;
				};

				box.whiskers = function (x) {
					if (!arguments.length)
						return whiskers;
					whiskers = x;
					return box;
				};

				box.showLabels = function (x) {
					if (!arguments.length)
						return showLabels;
					showLabels = x;
					return box;
				};

				box.quartiles = function (x) {
					if (!arguments.length)
						return quartiles;
					quartiles = x;
					return box;
				};

				return box;
			};

			function boxWhiskers(d) {
				return [0, d.length - 1];
			}

			function boxQuartiles(d) {
				return [
					d3.quantile(d, .25),
					d3.quantile(d, .5),
					d3.quantile(d, .75)
				];
			}

			var labels = true; // show the text labels beside individual boxplots?

			var margin = {
				top : 30,
				right : 50,
				bottom : 70,
				left : 50
			};
			var width = $element.width() - margin.left - margin.right;
			var height = $element.height() - margin.top - margin.bottom;

			var chart = d3.box()
				.whiskers(iqr(1.5))
				.height(height)
				.domain([min, max])
				.showLabels(labels);

			var svg = d3.select(destElement).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("class", "box")
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// the x-axis
			var x = d3.scale.ordinal()
				.domain(dataArray.map(function (d) {
						return d[0]
					}))
				.rangeRoundBands([0, width], 0.7, 0.3);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

			// the y-axis
			var y = d3.scale.linear()
				.domain([min, max])
				.range([height + margin.top, 0 + margin.top]);

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");

			// draw the boxplots
			svg.selectAll(".box")
			.data(dataArray)
			.enter().append("g")
			.attr("transform", function (d) {
				return "translate(" + x(d[0]) + "," + margin.top + ")";
			})
			.call(chart.width(x.rangeBand()));

			// add a title
			svg.append("text")
			.attr("x", (width / 2))
			.attr("y", 0 + (margin.top / 2))
			.attr("text-anchor", "middle")
			.style("font-size", "18px")
			.text(xAxisTitle);

			// draw y axis
			svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text") // and text1
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.style("font-size", "16px")
			.text(yAxisTitle);

			// draw x axis
			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (height + margin.top + 10) + ")")
			.call(xAxis)
			.append("text") // text label for the x axis
			.attr("x", (width / 2))
			.attr("y", 10)
			.attr("dy", ".71em")
			.style("text-anchor", "middle")
			.style("font-size", "16px")
			.text(xAxisTitle);

			// Returns a function to compute the interquartile range.
			function iqr(k) {
				return function (d, i) {
					var q1 = d.quartiles[0],
					q3 = d.quartiles[2],
					iqr = (q3 - q1) * k,
					i = -1,
					j = d.length;
					while (d[++i] < q1 - iqr);
					while (d[--j] > q3 + iqr);
					return [i, j];
				};
			}
		}

	};
});
