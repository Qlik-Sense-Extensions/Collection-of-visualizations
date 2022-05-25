"use strict";
/**
 * @name SenseUI-BiPartite
 * @author yianni.ververis@qlik.com
 * @requires string: 
 * @param {string} leftColumnDimensionLabel
 * @param {string} leftColumnMeasureLabel
 * @param {string} rightColumnDimensionLabel
 * @param {string} rightColumnMeasureLabel
 * @description
 * A simple template to create extensions
 */

define( [ 
	"qlik",
	"jquery",
	"./d3.min",
	"./biPartite"
], 
(qlik, $, d3) => {
	// Define properties
	var me = {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 4,
					qHeight: 1000
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 2,
					max: 2
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings : {
					uses : "settings",
					items: {
						custom: {
							type: "items",
							label: "BiPartite Settings",
							items: {
								leftColumnDimensionLabel: {
									type: "string",
									expression: "none",
									label: "Left Column Dimension Label",
									defaultValue: "Leaving from",
									ref: "vars.leftColumnDimensionLabel"
								},
								leftColumnMeasureLabel: {
									type: "string",
									expression: "none",
									label: "Left Column Measure Label",
									defaultValue: "People",
									ref: "vars.leftColumnMeasureLabel"
								},
								rightColumnDimensionLabel: {
									type: "string",
									expression: "none",
									label: "Right Column Dimension Label",
									defaultValue: "Moving to",
									ref: "vars.rightColumnDimensionLabel"
								},
								rightColumnMeasureLabel: {
									type: "string",
									expression: "none",
									label: "Right Column Measure Label",
									defaultValue: "People",
									ref: "vars.rightColumnMeasureLabel"
								},
								colors: {
									type: "string",
									expression: "none",
									label: "Color Palette",
									defaultValue: "#A6CEE3,#1F78B4,#B2DF8A,#33A02C,#FB9A99,#E31A1C,#FDBF6F,#FF7F00,#CAB2D6,#6A3D9A,#FFFF99",
									ref: "vars.colors"
								},
							}
						}
					}
				}
			}
		}
	};

	me.support = {
		snapshot: true,
		export: true,
		exportData : false
	};

	// Get Engine API app for Selections
	me.app = qlik.currApp(this);

	me.paint = function ($element, layout) {
		var vars = $.extend({
			v: '1.3',
			id: layout.qInfo.qId,
			name: 'SenseUI-BiPartite',
			// width: ($element.width() < 450) ? 450 : $element.width(),
			width: $element.width(),
			height: $element.height(),
			chart: {
				id: `${layout.qInfo.qId}_byPartite`,
				width: $element.width(),
				height: $element.height()-20,
				margin: {
					b:0,
					t:20,
					l:205,
					r:0
				},
				display: {
					value: true,
					percent: true
				},
				b: 20, // Width of the colored rect 
				bb: 500, // Width of the Inner Graph
				c1: [-205, 25], // Label [part1, part2]
				c2: [-40, 190], // Value (-50,100)
				c3: [-4, 225], // percent
			},
			labelCharLength: 20,
			roundMeasureNum: true,
			// colors: ["#A6CEE3","#1F78B4","#B2DF8A","#33A02C","#FB9A99","#E31A1C","#FDBF6F","#FF7F00","#CAB2D6","#6A3D9A","#FFFF99","#B15928"],
			isCreated: false,
			data: [],
		}, layout.vars);	
		vars.this = this;	
		vars.isCreated = $(`#${vars.chart.id}`).length;
		vars.colors = (vars.colors) ? vars.colors.split(",") :  ["#A6CEE3","#1F78B4","#B2DF8A","#33A02C","#FB9A99","#E31A1C","#FDBF6F","#FF7F00","#CAB2D6","#6A3D9A","#FFFF99","#B15928","#A6CEE3","#1F78B4","#B2DF8A","#33A02C","#FB9A99","#E31A1C","#FDBF6F","#FF7F00","#CAB2D6","#6A3D9A","#FFFF99","#B15928","#A6CEE3","#1F78B4","#B2DF8A","#33A02C","#FB9A99","#E31A1C","#FDBF6F","#FF7F00","#CAB2D6","#6A3D9A","#FFFF99","#B15928"];
// console.log(vars.this)
		// Make sure we have all rows
		var columns = layout.qHyperCube.qSize.qcx;
		var totalheight = layout.qHyperCube.qSize.qcy;  
		var pageheight = Math.floor(10000 / columns);  
		var numberOfPages = Math.ceil(pageheight / totalheight);
console.log("Pages: " + numberOfPages)				
		if (numberOfPages>0) {
			// var promises = Array.apply(null, Array(numberOfPages)).map(function(layout.qHyperCube.qDataPages[0].qMatrix, index) {  
			// var page = {  
			// 		qTop: (pageheight * index) + index,  
			// 		qLeft: 0,  
			// 		qWidth: columns,  
			// 		qHeight: pageheight,  
			// 		index: index  
			// 	};                                                                                             
			// 	// return model.getHyperCubeData('/qHyperCubeDef', [page]);  
			// 	return this.backendApi.getData( page )
			// }, this);                                                                  
			// Promise.all(promises).then(function(data) {  
			// 	console.log(data)
			// 	// for (var j=0; j<data.length; j++) {  
			// 	// 	for (var k=0; k<data[j].qDataPages[0].qMatrix.length; k++) {                                                         
			// 	// 		qTotalData.push(data[j].qDataPages[0].qMatrix[k])  
			// 	// 	}  
			// 	// }  
			// 	// deferred.resolve(qTotalData);  
			// });  
			var lastrow = 0;
			//loop through the rows we have and render
			vars.this.backendApi.eachDataRow( function ( rownum, row ) {
console.log("Row Num: " + rownum)	
				lastrow = rownum;
				//do something with the row..
			});
console.log("Last Row: " + lastrow)				
			if(totalheight > lastrow +1){
				//we havent got all the rows yet, so get some more, 1000 rows
				var requestPage = [{
					qTop: lastrow + 1,
					qLeft: 0,
					qWidth: columns,
					qHeight: Math.min( 1000, totalheight - lastrow )
				}];
				vars.this.backendApi.getData( requestPage ).then( function ( dataPages ) {
console.log("Redraw: Success")	
					// when we get the result trigger paint again
					vars.this.paint($element, layout);
				});
			}
			// console.log(lastrow)
		}

		if ( $element.width() < 400 ) { 
			vars.chart.display.value = false;
			vars.chart.display.percent = false;
			vars.labelCharLength =  10,
			vars.chart.margin.l = 100;
			vars.chart.c1 = [-100, 12]
			vars.chart.c3 = [-20, 100]
			vars.chart.b = 10
		 } else if ( $element.width() < 450 ) { 
			vars.chart.display.value = false;
			vars.chart.display.percent = false;
			vars.chart.margin.l = 140;
			vars.chart.c1 = [-140, 12]
			vars.chart.c3 = [-20, 150]
			vars.chart.b = 10
		} else if ($element.width() < 515) {
			vars.chart.display.value = false;
			vars.chart.display.percent = true;
			vars.chart.margin.l = 170;
			vars.chart.c1 = [-170, 25]
			vars.chart.c3 = [-10, 190]
			vars.chart.b = 20
		}  else {
			vars.chart.display.value = true;
			vars.chart.display.percent = true;
			vars.chart.margin.l = 205;
			vars.chart.c1 = [-205, 25]
			vars.chart.c2 = [-40, 190]
			vars.chart.c3 = [-4, 225]
			vars.chart.b = 20
		}
		vars.chart.bb = vars.width - ((vars.chart.margin.l*2)+(vars.chart.b*2));

		// console.log(layout.qHyperCube.qDataPages)
		vars.data = [];
		// $.each(layout.qHyperCube.qDataPages, function(key1, value1) {
		// 	$.each(value1.qMatrix, function(key2, value2) {
		// 		// if (value2[0].qText !== '-' && value2[1].qText !== '-' && value2[2].qNum>0) {
		// 			vars.data.push([value2[0].qText, value2[1].qText, value2[2].qNum]);
		// 		// }
		// 	});
		// });
		for (var i=0; i<layout.qHyperCube.qDataPages.length; i++) {
			for (var j=0; j<layout.qHyperCube.qDataPages[i].qMatrix.length; j++) {
				var value = layout.qHyperCube.qDataPages[i].qMatrix[j]
				if (value[0].qText !== '-' && value[1].qText !== '-' && value[2].qNum>0 && value[0].qText!==value[1].qText) {
					vars.data.push([value[0].qText, value[1].qText, value[2].qNum]);
				}
			}
		}
		console.log(vars.data)

		// CSS
		vars.css = `
			#${vars.chart.id} {
			}
			#${vars.id} .scrollable {
				height: auto;
				overflow-x: hidden;
				z-index: 9999999;
				max-height: ${vars.height}px;
			}
			.node rect {
				cursor: move;
				shape-rendering: crispEdges;
			}
			.node text {
				pointer-events: none;
				text-shadow: 1px 1px 2px #fff;
				font-size: 0.8em;
				font-family: sans-serif;
			}
			svg text {
				cursor: pointer;
				font-size:12px;
			}
			rect {
				cursor: pointer;
				shape-rendering:crispEdges;
			}
		`;

		// TEMPLATE
		vars.template = `
			<div id="${vars.chart.id}"></div>
		`;

		// Write Css and html
		$("<style>").html(vars.css).appendTo("head")

		var data = [ 
			{
				data:bP.partData(vars.data,2), 
				id:`${vars.chart.id}_inner`, 
				header:[
					[
						vars.leftColumnDimensionLabel,
						vars.leftColumnMeasureLabel
					],[
						vars.rightColumnDimensionLabel,
						vars.rightColumnMeasureLabel
					]
				]
			}
		];

		// if (!vars.isCreated) {
			$element.html(vars.template)

			bP.init(vars)

			var svg = d3.select(`#${vars.chart.id}`)
				.append("svg").attr('width', vars.chart.width).attr('height', vars.chart.height+20)
				.append("g").attr("transform","translate(" + vars.chart.margin.l + "," + vars.chart.margin.t + ")");

			bP.draw(data, svg, function () {
				$(vars.chart.id).addClass('animated fadeInRight')
			});
		// } else {
		// 	bP.redraw(data, svg)
		// }

		console.info('%c SenseUI-BiPartite: ', 'color: red', 'v' + vars.v)
		//needed for export
		return qlik.Promise.resolve()
	};

	// define HTML template	
	// me.template = '';

	// The Angular Controller for binding
	// me.controller = ["$scope", "$rootScope", "$element", function ( $scope, $rootScope, $element ) {}]

	return me
} );

