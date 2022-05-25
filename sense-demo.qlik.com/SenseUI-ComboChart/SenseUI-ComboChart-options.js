// Define properties
var options = {
	initialProperties: {
		qHyperCubeDef: {
			qDimensions: [],
			qMeasures: [],
			qInitialDataFetch: [{
				qWidth: 5,
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
				max: 2
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
							displayLegend: {
								type: "boolean",
								component: "switch",
								label: "Display Legend",
								ref: "vars.legend",
								options: [{
									value: true,
									label: "On"
								}, {
									value: false,
									label: "Off"
								}],
								defaultValue: true
							},
							legendAlignment: {
								type: "string",
								component: "radiobuttons",
								label: "Align Legend",
								ref: "vars.legendAlignment",
								options: [{
									value: "left",
									label: "Left"
								}, {
									value: "center",
									label: "Center"
								}, {
									value: "right",
									label: "Right"
								}],
								defaultValue: "center",
								show : function(data) {
									if (data.vars.legend) {
										return true;
									}
								}
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
							yAxisMax: {
								type: "integer",
								expression: "none",
								label: "Y-Axis Max (0 for Auto)",
								defaultValue: 0,
								ref: "vars.yaxis.max"
							},
							yAxisMin: {
								type: "integer",
								expression: "none",
								label: "Y-Axis Min (0 for Auto)",
								defaultValue: 0,
								ref: "vars.yaxis.min"
							},
							// footerExpression: {
							// 	type: "string",
							// 	expression: "none",
							// 	label: "X-Axis Values Expression",
							// 	defaultValue: "",
							// 	ref: "vars.footerExpression"
							// },
							barWidth: {
								type: "integer",
								expression: "none",
								label: "Bar Width (0 for auto scaling)",
								defaultValue: "0",
								ref: "vars.bar.width"
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
							},
							tooltipVisible: {
								type: "boolean",
								component: "switch",
								label: "Show Tooltip?",
								ref: "vars.tooltip.visible",
								options: [{
									value: true,
									label: "On"
								}, {
									value: false,
									label: "Off"
								}],
								defaultValue: true
							},
							tooltipMashup: {
								type: "boolean",
								component: "switch",
								label: "Will this be in a mashup?",
								ref: "vars.tooltip.mashup",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: false,
								show : function(data) {
									if (data.vars.tooltip && data.vars.tooltip.visible) {
										return true;
									}
								}
							},
							tooltipMashupDiv: {
								type: "string",
								expression: "none",
								label: "What is the mashup div id to calculate correct positioning",
								defaultValue: "maincontent",
								ref: "vars.tooltip.divid",
								show : function(data) {
									if (data.vars.tooltip && data.vars.tooltip.visible && data.vars.tooltip.mashup) {
										return true;
									}
								}
							},
							tooltipShowAllMeasures: {
								type: "boolean",
								component: "switch",
								label: "Show All measures in the Tooltip?",
								ref: "vars.tooltip.showAll",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: false,
								show : function(data) {
									if (data.vars.tooltip && data.vars.tooltip.visible) {
										return true;
									}
								}
							},
						},
					},
					measure1: {
						type: "items",
						label: "Measure 1",
						items: {
							measure1type: {
								type: "boolean",
								component: "switch",
								label: "Bar / Line",
								ref: "vars.measure1.type",
								options: [{
									value: true,
									label: "Bar"
								}, {
									value: false,
									label: "line"
								}],
								defaultValue: true
							},
							measure1color: {
								type: "string",
								expression: "none",
								label: "Color",
								defaultValue: "#4477AA",
								ref: "vars.measure1.color"
							},
							measure1stroke: {
								type: "string",
								expression: "none",
								label: "Line Width/Bar Border Width",
								defaultValue: "1",
								ref: "vars.measure1.stroke"
							},
							measure1colorHover: {
								type: "string",
								expression: "none",
								label: "Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure1.colorHover"
							},
							measure1strokeColor: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Color",
								defaultValue: "#77B62A",
								ref: "vars.measure1.strokeColor"
							},
							measure1strokeColorHover: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Hover Color",
								defaultValue: "#77b62a",
								ref: "vars.measure1.strokeColorHover"
							},
							measure1radius: {
								type: "string",
								expression: "none",
								label: "Dot Radius",
								defaultValue: "5",
								ref: "vars.measure1.radius",
								show : function(data) {
									if (!data.vars.measure1.type) {
										return true;
									}
								}
							},
						},
					},
					measure2: {
						type: "items",
						label: "Measure 2",
						show : function(data) {
							if (data.qHyperCubeDef.qMeasures.length>=2) {
								return true;
							}
						},
						// vars.measure2.type: 1 for bar, 0 for Line
						items: {
							measure2type: {
								type: "boolean",
								component: "switch",
								label: "Bar / Line",
								ref: "vars.measure2.type",
								options: [{
									value: true,
									label: "Bar"
								}, {
									value: false,
									label: "line"
								}],
								defaultValue: false
							},
							measure2visible: {
								type: "boolean",
								component: "switch",
								label: "Visible",
								ref: "vars.measure2.visible",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: true
							},
							measure2color: {
								type: "string",
								expression: "none",
								label: "Color",
								defaultValue: "#ec5e08",
								ref: "vars.measure2.color"
							},
							measure2colorHover: {
								type: "string",
								expression: "none",
								label: "Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure2.colorHover"
							},
							measure2stroke: {
								type: "string",
								expression: "none",
								label: "Line Width/Bar Border Width",
								defaultValue: "1",
								ref: "vars.measure2.stroke"
							},
							measure2strokeColor: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Color",
								defaultValue: "#77B62A",
								ref: "vars.measure2.strokeColor"
							},
							measure2strokeColorHover: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Hover Color",
								defaultValue: "#77b62a",
								ref: "vars.measure2.strokeColorHover"
							},
							measure2radius: {
								type: "string",
								expression: "none",
								label: "Dot Radius",
								defaultValue: "5",
								ref: "vars.measure2.radius",
								show : function(data) {
									if (!data.vars.measure2.type) {
										return true;
									}
								}
							},
						}
					},
					measure3: {
						type: "items",
						label: "Measure 3",
						show : function(data) {
							if (data.qHyperCubeDef.qMeasures.length>=3) {
								return true;
							}
						},
						items: {
							measure3type: {
								type: "boolean",
								component: "switch",
								label: "Bar / Line",
								ref: "vars.measure3.type",
								options: [{
									value: true,
									label: "Bar"
								}, {
									value: false,
									label: "line"
								}],
								defaultValue: false
							},
							measure3visible: {
								type: "boolean",
								component: "switch",
								label: "Visible",
								ref: "vars.measure3.visible",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: true
							},
							measure3color: {
								type: "string",
								expression: "none",
								label: "Color",
								defaultValue: "#1F78B4",
								ref: "vars.measure3.color"
							},
							measure3colorHover: {
								type: "string",
								expression: "none",
								label: "Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure3.colorHover"
							},
							measure3stroke: {
								type: "string",
								expression: "none",
								label: "Line Width/Bar Border",
								defaultValue: "1",
								ref: "vars.measure3.stroke"
							},
							measure3strokeColor: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Color",
								defaultValue: "#77B62A",
								ref: "vars.measure3.strokeColor"
							},
							measure3strokeColorHover: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Hover Color",
								defaultValue: "#77b62a",
								ref: "vars.measure3.strokeColorHover"
							},
							measure3radius: {
								type: "string",
								expression: "none",
								label: "Dot Radius",
								defaultValue: "5",
								ref: "vars.measure3.radius",
								show : function(data) {
									if (!data.vars.measure3.type) {
										return true;
									}
								}
							},
						}
					},
					measure4: {
						type: "items",
						label: "Measure 4",
						show : function(data) {
							if (data.qHyperCubeDef.qMeasures.length>=4) {
								return true;
							}
						},
						items: {
							measure4type: {
								type: "boolean",
								component: "switch",
								label: "Bar / Line",
								ref: "vars.measure4.type",
								options: [{
									value: true,
									label: "Bar"
								}, {
									value: false,
									label: "line"
								}],
								defaultValue: false
							},
							measure4visible: {
								type: "boolean",
								component: "switch",
								label: "Visible",
								ref: "vars.measure4.visible",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: true
							},
							measure4color: {
								type: "string",
								expression: "none",
								label: "Color",
								defaultValue: "#117733",
								ref: "vars.measure4.color"
							},
							measure4colorHover: {
								type: "string",
								expression: "none",
								label: "Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure4.colorHover"
							},
							measure4stroke: {
								type: "string",
								expression: "none",
								label: "Line Width/Bar Border",
								defaultValue: "1",
								ref: "vars.measure4.stroke"
							},
							measure4strokeColor: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Color",
								defaultValue: "#117733",
								ref: "vars.measure4.strokeColor"
							},
							measure4strokeColorHover: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure4.strokeColorHover"
							},
							measure4radius: {
								type: "string",
								expression: "none",
								label: "Dot Radius",
								defaultValue: "5",
								ref: "vars.measure4.radius",
								show : function(data) {
									if (!data.vars.measure4.type) {
										return true;
									}
								}
							},
						}
					},
					measure5: {
						type: "items",
						label: "Measure 5 - Footer KPI",
						show : function(data) {
							if (data.qHyperCubeDef.qMeasures.length>=5) {
								return true;
							}
						},
						items: {
						}
					}
				}
			}
		}
	}
};

define(options);