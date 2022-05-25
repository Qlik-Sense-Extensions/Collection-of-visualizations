/**
 * @ngdoc function
 * @name Google Timeline Chart
 * @author Florian Käfert
 * @email florian.kaefert@scarafaggio-t.de
 * @description
 * Google Timeline Chart as found
 * https://developers.google.com/chart/interactive/docs/gallery/timeline
 */
 
define([
	"qlik",
	"./lib/moment.min",
	"https://www.gstatic.com/charts/loader.js"
],
function(qlik, moment) {
	'use strict';
	
	var palette = [
			"#b0afae",
			"#7b7a78",
			"#545352",
			"#4477aa",
			"#7db8da",
			"#b6d7ea",
			"#46c646",
			"#f93f17",
			"#ffcf02",
			"#276e27",
			"#ffffff",
			"#000000"
		];

	return {
		initialProperties : {
			version : 1.8,
			chartType : "timeline",
			showRowLabels : true,
			showBarLabels : true,
			tooltipIsHTML : false,
			showTooltip : true,
			groupByRowLabel : true,
			colorByRowLabel : false,
			useSingleColor : false,
			useQlikColor : false,
			useBackgroundColor : false,
			loadLimitedData : true,
			handleNullAll : true,
			handleNullPoint : true,
			loadNumRows : 500
		},
		//property panel
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1,
					max : 2
				},
				measures : {
					uses : "measures",
					min : 2,
					max : 3
				},
				sorting : {
					uses : "sorting"
				},
				addons : {
					uses : "addons",
					items: {
						labels: {
                            type: "items",
                            translation: "properties.data",
                            items: {
								loadLimitedData: {
									type : "boolean",
									component : "switch",
									label : "Limit loaded data [500 rows]",
									ref : "loadLimitedData",
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }]
								},
								loadNumRows: {
									type : "integer",
									label : "Max loaded rows [1 - 10000]",
									defaultValue: 500,
									min: 1,
									max: 10000,
									ref : "loadNumRows",
									show: function (e) { return !e.loadLimitedData; }
								}
                            }
						}
					}
				},
				settings : {
					uses : "settings",
					items : {
						nullhandling: {
                            type: "items",
							translation: "Null Value Handling",
                            items: {
								handleNullAll: {
									type : "boolean",
									component : "switch",
									label : "Remove rows with NULL values",
									ref : "handleNullAll",
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }]
								},
								handleNullPoint: {
									type : "boolean",
									component : "switch",
									label : "Make point if start/end is NULL",
									ref : "handleNullPoint",
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }],
									show: function (e) { return e.handleNullAll }
								}
                            },
                        },
						labels: {
                            type: "items",
							translation: "properties.labels",
                            items: {
								showRowLabels: {
									type : "boolean",
									component : "switch",
									label : "Row labels",
									ref : "showRowLabels",
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }]
								},
								showBarLabels: {
									type : "boolean",
									component : "switch",
									label : "Bar labels",
									ref : "showBarLabels",
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }]
								}
                            }
                        },
						tooltip: {
                            type: "items",
							label: "Tooltip",
                            items: {
								showTooltip: {
									type : "boolean",
									component : "switch",
									label : "Show Tooltip",
									ref : "showTooltip",
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }],
								},
								tooltipIsHTML: {
									type : "boolean",
									component : "switch",
									label : "Tooltip is HTML",
									ref : "tooltipIsHTML",
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }],
									show: function (e) { return e.qHyperCubeDef.qMeasures.length == 3 && e.showTooltip; }
								}
							}
						},
						group: {
                            type: "items",
                            translation: "Visualizations.Descriptions.Group",
                            items: {
								groupByRowLabel: {
									type : "boolean",
									component : "switch",
									label : "Group by 1st Dimension",
									ref : "groupByRowLabel",
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }]
								}
							}
						},
						color: {
                            type: "items",
                            translation: "properties.color",
                            items: {
								useBackgroundColor: {
									type : "boolean",
									component : "switch",
									translation : "AppDetails.SheetBackgroundColor",
									ref : "useBackgroundColor",
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }],
								},
								backgroundColor: {
									component : "color-picker",
									translation: "properties.color",
									ref : "backgroundColor",
									type: "object",
									defaultValue: {
										 color: '#ffffff',
										 index: "-1"
									},
									show: function (e) { return e.useBackgroundColor }
								},
								useSingleColor: {
									type : "boolean",
									component : "switch",
									translation : "library.colors.onecolor",
									ref : "useSingleColor",
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }]
								},
								singleColor: {
									component : "color-picker",
									translation: "properties.color",
									ref : "singleColor",
									type: "object",
									defaultValue: {
										 color: '#46c646',
										 index: "-1"
									},
									show: function (e) { return e.useSingleColor }
								},
								colorByRowLabel: {
									type : "boolean",
									component : "switch",
									translation : "properties.colorMode.byDimension",
									ref : "colorByRowLabel",
									show: function (e) { return e.qHyperCubeDef.qDimensions.length > 1 && !e.useSingleColor; },
									options : [{ value : true, translation : "properties.on" },{ value : false, translation : "properties.off" }]
								},
								useQlikColor: {
									type : "boolean",
									component : "switch",
									label : "Palette",
									ref : "useQlikColor",
									options : [{ value : true, label : "Qlik 10" },{ value : false, label : "Google" }],
									show: function (e) { return !e.useSingleColor }
								}
							}
						}
					}
				}
			}
		},
		support: {
			snapshot: false,
			export: true,
			exportData: true
		},
		
		paint : function($element, layout) {
			
			// clear element
			$element.empty();
			
			var self = this;
			
			// Initialize Google Visualizations
			if (typeof google.visualization === 'undefined') {
				google.charts.load('current', {packages:["corechart", "timeline", "table"]});
			}
						
			this.backendApi.cacheCube.enabled = false;
			
			var columns = layout.qHyperCube.qSize.qcx;
			var totalheight = layout.qHyperCube.qSize.qcy;
			
			// Load limited Data
			if (layout.loadLimitedData) {
				totalheight = 500;
			} else {
				totalheight = layout.loadNumRows;
			};
			
			var pageheight = Math.floor(10000 / columns);
			var numberOfPages = Math.ceil(totalheight / pageheight);
			var Promise = qlik.Promise;
			
			var promises = Array.apply(null, Array(numberOfPages)).map(function(data, index) {
				var page = {
					qTop: (pageheight * index) + index,
					qLeft: 0,
					qWidth: columns,
					qHeight: pageheight
				};
				
				return this.backendApi.getData([page]);
				
			}, this)
			
			var elemNos = [];
			var rowCnt = 0;
			var readRow = true;
			
			// Get dimension and measure info
			var dCnt = this.backendApi.getDimensionInfos().length;
			var mCnt = this.backendApi.getMeasureInfos().length;
			
			// Get DateFormat from Qlik
			var dateFormat = this.backendApi.localeInfo.qDateFmt;
			var timestampFormat = this.backendApi.localeInfo.qTimestampFmt;
			
			// Wait for google charts to load
			google.charts.setOnLoadCallback(prepareData);
			
			function prepareData() {
				
				// Get basic DataTable
				var result = new google.visualization.DataTable();
				
				// Create needed columns
				result.addColumn  ({ type: 'string', id: 'Label' });
				if(dCnt == 2) { result.addColumn({ type: 'string', id: 'Name' }); };
				if(mCnt == 3) { result.addColumn({ type: 'string', role: 'tooltip' }); };
				result.addColumn  ({ type: 'date', id: 'Start' });
				result.addColumn  ({ type: 'date', id: 'End' });
				
				// Start rendering
				Promise.all(promises).then(function(data) {
					render(data);
				});
				
				function render(data) {
					
					 // Copy Dimensions and Measures to DataTable
					 
					 // Loop over pages
					 data.forEach(function(page, pageNo){
						 
						// Loop over rows
						page[0].qMatrix.forEach(function(row, rowNo) {
							
							readRow = totalheight > 0;
							
							if (readRow) {
								
								var values = [];
								var cellCnt = row.length;
								var point = null;
								
								totalheight = totalheight - 1;
								
								// Null value handling
								if (layout.handleNullAll && !layout.handleNullPoint && row[dCnt].qText == '-') { return; };
								
								if (layout.handleNullAll && !layout.handleNullPoint && row[dCnt + 1].qText == '-') { return; };
								
								if (layout.handleNullAll && layout.handleNullPoint && row[dCnt].qText == '-' && row[dCnt + 1].qText != '-') {
									point = moment(row[dCnt + 1].qText, timestampFormat);
								};
								
								if (layout.handleNullAll && layout.handleNullPoint && row[dCnt].qText != '-' && row[dCnt + 1].qText == '-') {
									point = moment(row[dCnt].qText, timestampFormat);
								};
								
								if (layout.handleNullAll && layout.handleNullPoint && row[dCnt].qText == '-' && row[dCnt + 1].qText == '-') {
									return;
								};
								
								// Dim 1 - Row Label
								values.push(row[0].qText);
								
								// Dim 2 - Bar Label
								if(dCnt == 2) { values.push(row[1].qText); };
								
								// Mes 3 - Tooltip
								if(mCnt == 3) { values.push(row[cellCnt - 1].qText); };
								
								// Mes 1 - Start time
								var start = moment(row[dCnt].qText, timestampFormat);
								values.push( (point != null) ? point.toDate() : start.toDate() );
								// Mes 2 - End time
								var end = moment(row[dCnt + 1].qText, timestampFormat);
								values.push( (point != null) ? point.toDate() : end.toDate() );
								
								// Add values to result
								result.addRows([values]);
								
								//selections will always be on first dimension
								elemNos.push(row[0].qElemNumber);
								
							};
						});
					});
					
					//Create options-object
					var options = {
						avoidOverlappingGridLines: true,
						backgroundColor: (layout.useBackgroundColor) ? layout.backgroundColor.color : layout.backgroundColor.defaultValue,
						colors: (layout.useQlikColor) ? palette : null,
						enableInteractivity: true,
						fontName: 'Arial',
						fontSize: 'automatic',
						timeline: {
							barLabelStyle: {fontName: null, fontSize: null},
							colorByRowLabel: layout.colorByRowLabel,
							groupByRowLabel: layout.groupByRowLabel,
							rowLabelStyle: {color: null, fontName: null, fontSize: null},
							showBarLabels: layout.showBarLabels,
							showRowLabels: layout.showRowLabels,
							singleColor: (layout.useSingleColor) ? layout.singleColor.color : null,
						},
						tooltip: {
							isHtml: layout.tooltipIsHTML,
							trigger: (layout.showTooltip) ? 'focus' : 'none'
						},
						redrawTrigger : null
					};
					
					
					// Initialize Chart
					var chart = new google.visualization.Timeline($element[0]);
					
					// Draw Chart
					chart.draw(result, options);
					
					//Events - Selections
					google.visualization.events.addListener(chart, 'select', selectHandler);
					
					
					//Handle Selections
					function selectHandler(e) {
						var selections = [];
						var chartSel = chart.getSelection();
						
						selections[0] = elemNos[chartSel[0].row];
						self.selectValues(0, selections, true);
					};
					
					return qlik.Promise.resolve();
				};
			};
		}
	};

});
