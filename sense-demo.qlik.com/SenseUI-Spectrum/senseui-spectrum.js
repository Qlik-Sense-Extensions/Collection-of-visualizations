define([
	"qlik",
	"jquery",
	"qvangular",
	'underscore',
	// "core.utils/theme",  // For Qlik Sense < 3.1.2
	"text!themes/old/sense/theme.json", // For Qlik Sense >= 3.1.2
	"css!./senseui-spectrum.css",
	'./d3-tip'
], function(qlik, $, qvangular, _, Theme) {
'use strict';

	Theme = JSON.parse(Theme);

	// Define properties
	var me = {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 6,
					qHeight: 500
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1,
					max: 1
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 5
				},
				sorting: {
					uses: "sorting"
				},
				settings : {
					uses : "settings",
					items: {
						general: {
							type: "items",
							label: "General",
							items: {
								Color: {
									type: "string",
									expression: "none",
									label: "Text color",
									defaultValue: "#000000",
									ref: "vars.color"
								},
								FontSize: {
									type: "string",
									expression: "none",
									label: "Font Size",
									defaultValue: "11",
									ref: "vars.fontSize"
								},
							},
						},
						line: {
							type: "items",
							label: "Line",
							items: {
								lineStroke: {
									type: "string",
									expression: "none",
									label: "Line stroke",
									defaultValue: "1",
									ref: "vars.line.stroke"
								},
								lineHeight: {
									type: "string",
									expression: "none",
									label: "Line height",
									defaultValue: "30",
									ref: "vars.line.height"
								},
								linepadding: {
									type: "string",
									expression: "none",
									label: "Line padding",
									defaultValue: "5",
									ref: "vars.line.padding"
								},
							},
						},
						xaxis: {
							type: "items",
							label: "X axis",
							items: {
								xaxisVisible: {
									type: "boolean",
									component: "switch",
									label: "On / Off",
									ref: "vars.xaxis.visible",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								}
							},
						},
						yaxis: {
							type: "items",
							label: "Y axis",
							items: {
								yaxisVisible: {
									type: "boolean",
									component: "switch",
									label: "On / Off",
									ref: "vars.yaxis.visible",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								yaxisWidth: {
									type: "number",
									expression: "none",
									label: "Label width",
									defaultValue: 150,
									ref: "vars.yaxis.width",
								},
								yaxisCharacters: {
									type: "number",
									expression: "none",
									label: "Number of visible characters",
									defaultValue: 50,
									ref: "vars.yaxis.characters",
								},
							},
						},
						legend: {
							type: "items",
							label: "Legend",
							items: {
								legendheight: {
									type: "number",
									expression: "none",
									label: "Height",
									defaultValue: 50,
									ref: "vars.legend.height",
								},
								legendTop: {
									type: "number",
									expression: "none",
									label: "Top Padding",
									defaultValue: 10,
									ref: "vars.legend.top",
								},
								labelsVisible: {
									type: "boolean",
									component: "switch",
									label: "Show labels?",
									ref: "vars.legend.labelsVisible",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								numbersVisible: {
									type: "boolean",
									component: "switch",
									label: "Show numbers?",
									ref: "vars.legend.numbersVisible",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								middleVisible: {
									type: "boolean",
									component: "switch",
									label: "Show In between Legend labels?",
									ref: "vars.legend.middleVisible",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: false
								}, //middleVisible
							},
						},
						indicator: {
							type: "items",
							label: "Indicator",
							items: {
								indicatorUrl: {
									type: "string",
									expression: "none",
									label: "Url",
									defaultValue: "https://sense-demo.qlik.com/extensions/senseui-spectrum/pinhead.png",
									ref: "vars.indicator.url",
								},
								indicatorWidth: {
									type: "string",
									expression: "none",
									label: "Width",
									defaultValue: 20,
									ref: "vars.indicator.width",
								},
								indicatorHeight: {
									type: "string",
									expression: "none",
									label: "Height",
									defaultValue: 30,
									ref: "vars.indicator.height",
								},
							},
						},
					}
				}
			}
		}
	};
	
	// Get Engine API app for Selections
	me.app = qlik.currApp(this);
	
	me.snapshot = {
		canTakeSnapshot : true
	};

	me.paint = function($element,layout) {
		var vars = {
			v: '1.0.3',
			id: layout.qInfo.qId,
			data: layout.qHyperCube.qDataPages[0].qMatrix,
			height: $element.height(),
			width: $element.width(),
			stacked: (layout.qHyperCube.qSize.qcx > 2) ? true : false,	
			color: (layout.vars.color)?layout.vars.color:'#000000',
			fontSize: (layout.vars.fontSize)?layout.vars.fontSize + 'px':'11px',
			dot: {
				size: 3.5,
			},
			line: {
				stroke: (layout.vars.line.stroke)?parseInt(layout.vars.line.stroke):1,
				height: (layout.vars.line.height)?parseInt(layout.vars.line.height):30,
				padding: (layout.vars.line.padding)?parseInt(layout.vars.line.padding):5,
			},
			label: {
				visible: layout.vars.yaxis.visible,
				width: (layout.vars.yaxis.width) ? layout.vars.yaxis.width:150,
				characters: (layout.vars.yaxis.characters) ? layout.vars.yaxis.characters:50,
				padding: 15,
				minWidth: 150,
			},
			footer: {
				visible: layout.vars.xaxis.visible,
				height: 20
			},
			canvas: {
				width: null,
				height: null,
				padding: 10,
			},
			legend: {
				height: (layout.vars.legend && layout.vars.legend.height) ? layout.vars.legend.height : 50,
				padding: 10,
				top: (layout.vars.legend && layout.vars.legend.top) ? layout.vars.legend.top : 10,
				color: '#999999',
				labelVisible: (layout.vars.legend && layout.vars.legend.labelsVisible) ? true : false,
				numbersVisible: (!layout.vars.legend || !layout.vars.legend.numbersVisible) ? false : true,
				middleVisible: (!layout.vars.legend || !layout.vars.legend.middleVisible) ? false : true,
			},
			css: {
				breakpoint: 500,
			},
			indicator: {
				url: (layout.vars.indicator && layout.vars.indicator.url) ? layout.vars.indicator.url : 'https://sense-demo.qlik.com/extensions/senseui-spectrum/pinhead.png',
				width: (layout.vars.indicator && layout.vars.indicator.width) ? layout.vars.indicator.width : 20,
				height: (layout.vars.indicator && layout.vars.indicator.height) ? layout.vars.indicator.height : 30,
			},
			tooltip: {},
			template: '',
			dimensionTitle: layout.qHyperCube.qDimensionInfo, //[0].qFallbackTitle
			measureTitle: layout.qHyperCube.qMeasureInfo, //[0].qFallbackTitle
			verticalGridSpace: 60,
			verticalGridLines: null,
			enableSelections: (layout.vars.enableSelections)? true : false,
		};

		vars.verticalGridLines = Math.round((vars.width-vars.label.width)/vars.verticalGridSpace);
		vars.template = '\
			<div qv-extension class="ng-scope senseui-spectrum" id="' + vars.id + '">\
				<div class="legend"></div>\
				<div class="content"></div>\
		';
		if (vars.footer.visible) {
			vars.template += '<div class="footer"></div>';
		};
		vars.template += '</div>';
		
		// CSS
		$( '#' + vars.id ).css( "color", vars.color );

		if (document.getElementById(vars.id)) {
			$element.empty();
		}

		// Check the height of the combines rects
		var calculatedHeight = vars.data.length * (vars.line.height + vars.line.padding);

		// Adjust the label width based on viewport
		if (vars.width < vars.css.breakpoint) {
			// vars.label.width = vars.width*0.6;
			vars.label.width = vars.label.minWidth;
		}

		$element.append($(vars.template).width(vars.width).height(vars.height));
		if (vars.footer.visible) {
			$('#' + vars.id + ' .content').height(vars.height-vars.footer.height);
			$('#' + vars.id + ' .footer').height(vars.footer.height);
		} else {
			$('#' + vars.id + ' .content').height(vars.height);
		}

		// $('#' + vars.id + ' .legend').width(vars.width-vars.label.width);
		// $('#' + vars.id + ' .legend').css('margin-left',vars.label.width);
		// Loop through results
		for (var i = 0; i < vars.data.length; i++) {
			vars.data[i].max = d3.max(vars.data[i], function(d,i) { 
				if (i>0) {
					return d.qNum;
				} 
			});
			for (var j = 0; j < vars.data[i].length; j++) {
				vars.data[i][j].ypos = i; // The parent array index
			}
		}

		vars.canvas.height = (vars.data.length * (vars.line.height+(vars.line.padding*2)+3));
		vars.canvas.width = vars.width - vars.canvas.padding;

		var x = d3.scale.linear()
			.domain([1,vars.data[0].length-1]) // get the number of all measures
			.range([vars.label.width, vars.canvas.width-vars.dot.size-vars.legend.padding]);

		var y = d3.scale.linear()
			.domain([0,vars.data.length])
			.range([10,vars.canvas.height]);

		var svg = d3.select('#' + vars.id + ' .content')
			.append('svg')
			.attr({'width':vars.width,'height':vars.canvas.height});

		if (vars.footer.visible) {
			var svgFooter = d3.select('#' + vars.id + ' .footer')
				.append('svg')
				.attr({'width':vars.width,'height':vars.footer.height});
		}

		// Draw the tooltip
		if ($('.' + vars.id + ' .d3-tip').length > 0) {
			$('.' + vars.id + ' .d3-tip ').remove();
		}
		var tip = d3.tip()
			.attr('class', vars.id + ' d3-tip')
			.offset([-10, 0]) 
			.extensionData(vars.tooltip)
			.html(function(j, d, i) {
				var html = '\
					<div class="dimension">' + vars.data[j-1][0].qText + '</div>\
					<div class="measure">' + vars.measureTitle[i-1].qFallbackTitle + ' :' + vars.data[j-1][i].qText + '</div>\
				';
				return html;
			})

		svg.call(tip);

		var	xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom');

		var	yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.tickSize(0)
			.tickFormat(function(d,i){
				return vars.data[i][0].qText; 
			})
			.tickValues(d3.range(vars.data.length));

		// Y Axis labels
	 	if (vars.label.visible){
			var y_xis = svg.append('g')
				.attr("transform", "translate("+vars.label.width+", -10)")
				.attr('id','yaxis')
				.attr('width', vars.label.width-10)

			y_xis.call(yAxis)
				.selectAll("text")  
					.style("text-anchor", "start")
					.attr("x", "-"+vars.label.width)
					.attr("y", 30)
					.attr('style', 'fill:' + vars.color + '; font-size:' + vars.fontSize + ';')
					.call(wrap, vars.label.width);
		}

		// X Axis labels
		if (vars.footer.visible) {
			svgFooter.append('g')
				.attr("transform", "translate("+((vars.label.visible)?vars.label.width:0)+",0)")
				.attr('id','xaxis')
				.attr('style', 'fill:' + vars.color)
				.call(xAxis
					.tickSize(1)
			    	.ticks(vars.verticalGridLines)
			    );
		}
		
		function wrap(text, width) {
			text.each(function() {
				var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1, // ems
				x = text.attr("x"),
				y = text.attr("y"),
				dy = parseFloat(text.attr("dy")),
				// tspan = text.text(null).append("tspan").attr("x", -vars.label.width).attr("y", y).attr("dy", dy + "em");
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
				while (word = words.pop()) {
					line.push(word);
					tspan.text(line.join(" "));
					if (tspan.node().getComputedTextLength() > width - 20) {
						line.pop();
						tspan.text(line.join(" "));
						line = [word];
						// tspan = text.append("tspan").attr("x", -vars.label.width).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
						tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
					}
				}
			});
		}
		
		var svgLegend = d3.select('#' + vars.id + ' .legend')
			.append('svg')
			.attr("width", vars.width - vars.legend.padding)
			.attr("height", vars.legend.top + vars.legend.height);

		// Add the legend line
		svgLegend
			.append("line")
			.attr('x1',(vars.width < vars.css.breakpoint) ?vars.legend.padding:vars.label.width + vars.legend.padding)
			.attr('x2',vars.canvas.width - (vars.legend.padding*2))
			.attr("y1", vars.legend.top)
			.attr("y2", vars.legend.top)
			.attr("stroke-width", 1)
			.attr("shape-rendering", "crispEdges")
			.attr("stroke", vars.legend.color);


		// Numbers
		if (vars.legend.numbersVisible) {
			svgLegend
				.append("text")
					.attr('style', 'font-size:' + vars.fontSize + '; fill: ' +  vars.color + '; font-style: italic;font-weight: bold;')
					.text(1)
					.attr('x',(vars.width < vars.css.breakpoint) ?0:vars.label.width)
					.attr('dy',0)
					.attr('y',vars.legend.top);

			svgLegend
				.append("text")
					.attr('style', 'font-size:' + vars.fontSize + '; fill: ' +  vars.color + '; font-style: italic; font-weight: bold; text-anchor: end;')
					.text(vars.measureTitle.length)
					.attr('x',vars.canvas.width - vars.legend.padding)
					.attr('dy',0)
					.attr('y',vars.legend.top);
		}

		// Text underneath
		if (vars.legend.labelVisible) {
			svgLegend
				.append("text")
					.attr('style', 'font-size:' + vars.fontSize + '; fill: ' +  vars.legend.color + '; font-style: italic;font-weight: bold;')
					.text(vars.measureTitle[0].qFallbackTitle)
					.attr('x',(vars.width < vars.css.breakpoint) ?0:vars.label.width)
					.attr('dy',0)
					.attr('y',vars.legend.top + (vars.legend.padding*2));
			// If you want to show the inbetween labels
			if (vars.legend.middleVisible) {
				svgLegend
					.selectAll("path")
					.data(vars.measureTitle)
					.enter()
					.append("text")
						.attr('style', 'font-size:' + vars.fontSize + '; fill: ' +  vars.legend.color + '; font-style: italic; font-weight: bold; text-anchor: middle;')
						.text(function(d,i){
							if (i!=0 && i!=vars.measureTitle.length-1) {
								return d.qFallbackTitle;
							}
						})
						.attr('x', function(d,i){
							if (i!=0 && i!=vars.measureTitle.length-1) {
								return x(i+1);
							}
						})
						.attr('dy',0)
						.attr('y',vars.legend.top + (vars.legend.padding*2));
			}

			svgLegend
				.append("text")
					.attr('style', 'font-size:' + vars.fontSize + '; fill: ' +  vars.legend.color + '; font-style: italic; font-weight: bold; text-anchor: end;')
					.text(vars.measureTitle[vars.measureTitle.length-1].qFallbackTitle)
					.attr('x',vars.canvas.width - vars.legend.padding)
					.attr('dy',0)
					.attr('y',vars.legend.top + (vars.legend.padding*2));

			svgLegend
				.selectAll("text") 
					.call(wrap, vars.width/2);

		}

		// Add Legend Dots
		svgLegend
			.selectAll("path")
			.data(vars.measureTitle)
			.enter()
			.append("circle")
			.attr("cx", function(d,i) { 
				if(i==0) {
					return vars.label.width + vars.legend.padding + 2;
				} else if(i==vars.measureTitle.length-1) {
					return x(i+1)-8;
				} else {
					return x(i+1);
				} 
			})
			.attr("cy", vars.legend.padding)
			.attr("r", vars.dot.size)
			.style("fill", "#999999")
			.style("stroke", "#999999");

		var lines = svg.selectAll(".content")
			.data(vars.data);

		lines
			.enter()
			.append("g").attr('class','lines')
			.append('line')
				.attr('x1',vars.label.width)
				.attr('x2',vars.canvas.width - vars.legend.padding)
				.attr('y1', function(d,i){
					return y(i)+19;
				})
				.attr('y2', function(d,i){
					return y(i)+19;
				})
				.attr("stroke-width", 1)
				.attr("shape-rendering", "crispEdges")
				.attr("stroke", "#999999");
		// Add the dots
		lines
			.enter()
			.append("g").attr('class','dots')
			.selectAll('#' + vars.id + ' dots')
			.append("circle")
			.data(function(e,j) { 
				return e; 
			})
			.enter().append("circle")
			.attr("cx", function(d,i) { 
				if(i>0) {
					return x(i);
				} 
			})
			.attr("cy", function(d,i){
				if(i>0) {
					return y(d.ypos)+19;
				}
			})
			.attr("r", function(d,i) { 
				if(i>0  && d.qNum!=vars.data[d.ypos].max) {
					return (d.qNum==vars.data[d.ypos].max) ? 10 : vars.dot.size;
				} else {
					return 0;
				}
			})
			.style("fill", function(d,i) { 
				if(i>0) {
					return "#999999";
				} 
			})
			.style("stroke", function(d,i) { 
				if(i>0 && d.qNum!=vars.data[d.ypos].max) {
					return "#999999";
				} else {
					return "#FFFFFF";
				}
			});

		lines
			.enter()
			.append("g").attr('class','ind')
			.selectAll('#' + vars.id + ' ind')
			.data(function(e,j) { 
				return e; 
			})
			.enter()
			.append("svg:image")
			.attr("xlink:href", vars.indicator.url)
			.attr("x", function(d,i){	
				return x(i)-10;
			})
			.attr("y", function(d,i){
				return y(d.ypos)-10;
			})
			.attr("width", vars.indicator.width)
			.attr("height", vars.indicator.height)
			.attr('style', function(d,i) { 
				if(i>0 && d.qNum==vars.data[d.ypos].max) {
					return 'visibility:visible;';
				} else {
					return 'visibility:hidden;';
				}
			});

		// // Add the Text
		lines
			.enter()
			.append("g").attr('class','text')
			.selectAll('#' + vars.id + ' text')
			.append("text")
			.data(function(e,j) { 
				return e; 
			})
			.enter().append("text")
			// .attr('style', 'font-size:' + vars.fontSize + '; fill: ' +  vars.color + ';')
			.attr('style', function(d,i) {
				var style = 'font-size:' + vars.fontSize + '; fill: ' +  vars.color + ';';
				if (i==1) {
					style += 'text-anchor: start';
				} else if (i==vars.measureTitle.length) {
					style += 'text-anchor: end';
				} else {
					style += 'text-anchor: middle';
				}
				return style;
			})
			.text( function(d,i) {
				if (i>0) {
					return d.qText;
				}
			})
			.attr('x', function(d,i){
				if (i==1) {
					return x(i)-3;
				} else if (i==vars.measureTitle.length) {
					return x(i)+3;
				} else {
					return x(i);
				}
			})
			.attr('y', function(d,i){
				if (i>0) {
					return y(d.ypos)+33;
				}
			});
		me.log('info', 'SenseUI-Spectrum ' + vars.v + ':', '#' + vars.id + ' Loaded!');
	};

	// Controller for binding
	me.controller =['$scope', '$rootScope', function($scope, $rootScope){
	}];

	// me.template = template;


	// Custom Logger
	me.log = function (type, header, message) {
		if (type==='info') {
			console.info('%c ' + header + ': ', 'color: red', message);
		} else if (type==='error') {
			console.error('%c ' + header + ': ', 'color: red', message);
		} else {
			console.log('%c ' + header + ': ', 'color: red', message);
		}
	};

	return me;
});
