/**
 * @name SenseUI-ValueStackedBarChart
 * @author yianni.ververis@qlik.com
 * @requires string: 1 Dimension and 1 Measure
 * @param {integer} vars.font.size: 
 * @param {string} vars.font.color: 
 * @param {boolean} vars.font.visible: Display or not the Text
 * @param {boolean} vars.enableSelections: Allow Selections
 * @param {string} vars.bar.color: Comma separated Hex alues 
 * @param {integer} vars.font.size: 
 * @param {integer} vars.font.size: 
 * @param {integer} vars.font.size: 
 * @param {integer} vars.font.size: 
 * @param {integer} vars.font.size: 
 * @version 1.0: Initial Setup
 * @description
 * A simple Stacked Bar based on the values of one measure and not not on the numbers of measures
 */

define( [ 
	"qlik",
	"jquery",
	'css!./SenseUI-ValueStackedBarChart.css'
],
(qlik, $, css, d3) => {
	// Define properties
	var me = {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 2,
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
					min: 1,
					max: 1
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
						general: {
							type: "items",
							label: "General",
							items: {
								fontSize: {
									type: "integer",
									expression: "none",
									label: "Text Size",
									defaultValue: "10",
									ref: "vars.font.size"
								},
								fontColor: {
									type: "string",
									expression: "none",
									label: "Font Color",
									defaultValue: "#000000",
									ref: "vars.font.color"
								},
								enableSelections: {
									type: "boolean",
									component: "switch",
									label: "Enable Selections",
									ref: "vars.enableSelections",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								precision: {
									type: "boolean",
									component: "switch",
									label: "Display decimals?",
									ref: "vars.precision",
									options: [{
										value: true,
										label: "Yes"
									}, {
										value: false,
										label: "No"
									}],
									defaultValue: false
								}
							},
						},
						customBar: {
							type: "items",
							label: "Bar",
							items: {
								barColor: {
									type: "string",
									expression: "none",
									label: "Bar Colors",
									defaultValue: "#332288,#88CCEE,#117733,#DDCC77,#CC6677,#3399CC,#CC6666,#99CC66,#275378,#B35A01,#B974FD,#993300,99CCCC,#669933,#898989,#EDA1A1,#C6E2A9,#D4B881,#137D77,#D7C2EC,#FF5500,#15DFDF,#93A77E,#CB5090,#BFBFBF",
									ref: "vars.bar.color"
								},
								barColorHover: {
									type: "string",
									expression: "none",
									label: "Bar Hover Color",
									defaultValue: "#77B62A",
									ref: "vars.bar.hover"
								},
								displaydimension: {
									type: "boolean",
									component: "switch",
									label: "Display Dimension Text on the bar",
									ref: "vars.text.dimension",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								displayValue: {
									type: "boolean",
									component: "switch",
									label: "Display Measure Text on the bar",
									ref: "vars.text.measure",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
							},
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

	me.paint = function($element,layout) {
		var vars = $.extend({
			v: '1.1',
			id: layout.qInfo.qId,
			name: 'SenseUI-ValueStackedBarChart',
			width: $element.width(),
			contentWidth: $element.width(),
			height: $element.height(),
			margin: {top: 20, right: 20, bottom: 40, left: 40},
			dimension: layout.qHyperCube.qDimensionInfo[0].title,
			measure1: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
			data: [],
			this: this
		}, layout.vars);
		if (typeof layout.vars.bar.color === 'string') {
			layout.vars.bar.color = layout.vars.bar.color.split(',');
		}
		if (typeof layout.vars.font.color === 'string') {
			layout.vars.font.color = layout.vars.font.color.split(',');
		}
		// CSS
		vars.css = `
			#${vars.id}_inner {
				width: ${vars.width}px;
				height: ${vars.height}px;
				overflow-x: auto !important;
				overflow-y: hidden !important;
			}
			#${vars.id}_inner .content {
				width: ${vars.contentWidth}px;
				display: -webkit-flex; /* Safari */
				display: flex;
				-webkit-flex-direction: row; /* Safari */
				flex-direction: row;
				-webkit-align-items: baseline; /* Safari */
				align-items: baseline;
			}
			#${vars.id}_inner .content div {
				height: ${vars.height}px;
				font-size: ${vars.font.size}px;
				display: -webkit-inline-flex; /* Safari */
				display: inline-flex;
				justify-content: center;
				flex-direction: column;
				text-align: center;
				cursor: pointer;
				line-height: 1em;
			}
			#${vars.id}_inner .content div:hover {
				background-color: ${vars.bar.hover} !important;
			}
		`;

		var html = '', total=0;

		// vars.data = layout.qHyperCube.qDataPages[0].qMatrix;
		vars.data = layout.qHyperCube.qDataPages[0].qMatrix.map(function(value, index) {
			total += value[1].qNum;	
			var num = me.roundNumber(value[1].qNum, vars.precision)		
			return {
				"dimension":value[0].qText,
				"qElemNumber":value[0].qElemNumber,
				"measure": value[1].qText,
				"measureNum": value[1].qNum,
				"measureNumDisplay": num
			}
		});

		for (var i = 0; i < vars.data.length; i++) {
			vars.data[i].width = Math.round(vars.data[i].measureNum/total * 100);
			// Generate the HTML
			html += `
				<div style="background-color:${vars.bar.color[vars.data[i].qElemNumber]}; color: ${vars.font.color[i]}; width: ${vars.data[i].width}%" data-qelementnum="${vars.data[i].qElemNumber}">`;
			if (vars.text.dimension) {
				html += `
						${vars.data[i].dimension} <br>
				`;
			}
			if (vars.text.measure) {
				html += `
						${vars.data[i].measureNumDisplay}
				`;
			}
			html += `
				</div>`;
		}

		// TEMPLATE
		vars.template = `
			<div id="${vars.id}_inner">
				<div class="content">
					${html}
				</div>
			</div>
		`;

		// Write Css and html
		$("<style>").html(vars.css).appendTo("head")
		$element.html(vars.template)
		
		if (vars.enableSelections){
			$( `#${vars.id}_inner div` ).click(function(e) {
				vars.this.backendApi.selectValues(0, [$(this).data("qelementnum")], true);
			});
		}
		
		console.info(`%c ${vars.name}: `, 'color: red', `v ${vars.v}`)
		//needed for export
		return qlik.Promise.resolve()
	};

	me.roundNumber = (num, precision) => {
		//check if the string passed is number or contains formatting like 13%
		if (/^[0-9.]+$/.test(num)) {
			num = (precision) ? parseFloat(num).toFixed(2) : Math.round(num);
			if (num >= 1000 && num<1000000) {
				num = (precision) ? parseFloat(num/1000).toFixed(2)  + 'K' : Math.round(num/1000) + 'K';
			} else if (num >= 1000000 && num<1000000000) {
				num = (precision) ? parseFloat(num/1000000).toFixed(2)  + 'M' : Math.round(num/1000000) + 'M';
			} else if (num >= 1000000000) {
				num = (precision) ? parseFloat(num/1000000000).toFixed(2)  + 'G' : Math.round(num/1000000000) + 'G';
			}
		}
		return num;
	}
	
	// define HTML template	
	// me.template = '';

	// The Angular Controller for binding
	// me.controller = ["$scope", "$rootScope", "$element", function ( $scope, $rootScope, $element ) {}]

	return me
} );

