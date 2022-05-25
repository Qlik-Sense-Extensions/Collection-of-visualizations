define( [], function () {
    'use strict';

    // *****************************************************************************
    // Dimensions & Measures
    // *****************************************************************************
    var dimensions = {
        uses: "dimensions",
        min: 2,
		max: 2,
		items:{
			one: {
				ref: "qAttributeExpressions.0.qExpression",
				label: "Node Label",
				type: "string",
				component: "expression"
			},
			two: {
				ref: "qAttributeExpressions.1.qExpression",
				label: "Node Description",
				type: "string",
				component: "expression"
			},
			three: {
				ref: "qAttributeExpressions.2.qExpression",
				label: "Node Color",
				type: "string",
				component: "expression"
			}
		}
	};

    var measures = {
        uses: "measures",
        min: 0,
		max: 2,
		items:{
			one: {
				ref: "qDef.mapping",
				label: "Maps to",
				type: "",
				expression: "optional",
				component: "dropdown",
				options: [{
					value: "q_edge_weight",
					label: "Edge Weight"
				}, {
					value: "q_edge_color",
					label: "Edge Color"
				}],
				defaultValue: "q_edge_weight"
			}
		}
    };

    // *****************************************************************************
    // Appearance Section
    // *****************************************************************************
    var appearanceSection = {
        uses: "settings",
		items: {
            oNodes: {
				type: "items",
				label: "Nodes",
				items: {
					one: {
						ref: "props.q_defaultnodecolor",
						label: "Default Node Color",
						type: "string",
						expression: "optional",
						defaultValue: "#999999"
					},
					two: {
                        ref: "props.q_init_node_min",
                        label: "Initial Node Size Min",
                        type: "number"
					},
					three: {
                        ref: "props.q_init_node_max",
                        label: "Initial Node Size Max",
                        type: "number"
					}
				}
			},
			oEdges: {
				type: "items",
				label: "Edges",
				items: {
					one: {
						ref: "props.q_defaultedgecolor",
						label: "Default Edge Color",
						type: "string",
						expression: "optional",
						defaultValue: "#999999"
					},
					two: {
						ref: "props.q_minlinewidth",
						label: "Min Edge Width (pixels)",
						type: "number",
						expression: "optional",
						defaultValue: 2
					},
					three: {
						ref: "props.q_maxlinewidth",
						label: "Max Edge Width (pixels)",
						type: "number",
						expression: "optional",
						defaultValue: 10
					},
					four: {
						ref: "props.q_force_strength",
						label: "Force Directed Strength",
						type: "number"
					},
					five: {
						ref: "props.q_force_distanceMax",
						label: "Force Distance Max",
						type: "number"
					}
				}				
			},
			oLabels: {
				type: "items",
				label: "Labels",
				items: {
					one: {
						ref: "props.q_defaultlabelsize",
						label: "Label Size",
						type: "number",
						expression: "optional",
						defaultValue: 10
                    },
                    two: {
						ref: "props.q_defaultlabelfont",
						label: "Label Font",
						type: "string",
						expression: "optional",
						defaultValue: "Arial"
                    },
                    three: {
						ref: "props.q_defaultlabelthreshold",
						label: "Show on Zoom Ratio",
						type: "number",
						expression: "optional",
						defaultValue: 0
					},
					four: {
						ref: "props.q_defaultlabelcolor",
						label: "Label Color",
						type: "string",
						expression: "optional",
						defaultValue: "#333333"
                    }
				}	
            },
            oOptions: {
				type: "items",
				label: "Options",
				items: {
					one: {
						ref: "props.q_alphadecay",
						label: "AlphaDecay (0.00 - 1.00)",
						type: "number",
						expression: "optional",
						defaultValue: 0.05
					},
					two: {
						ref: "props.q_showdegree",
						label: "Degree",
						type: "boolean",
						expression: "optional"
					},
					three: {
						ref: "props.q_showbetweenness",
						label: "Betweenness",
						type: "boolean",
						expression: "optional"
                    },
                    four: {
						ref: "props.q_showeigenvector",
						label: "Eigenvector",
						type: "boolean",
						expression: "optional"
                    },
                    five: {
                        ref: "props.q_menu_x",
                        label: "Menu Position X",
                        type: "",
                        expression: "optional",
                        component: "dropdown",
                        options: [{
							value: "left",
							label: "Left"
						}, {
							value: "center",
							label: "Center"
						},{
                            value: "right",
                            label: "Right"
                        }],
						defaultValue: "center"
                    },
                    six: {
                        ref: "props.q_menu_y",
                        label: "Menu Position Y",
                        type: "",
                        expression: "optional",
                        component: "dropdown",
                        options: [{
							value: "top",
							label: "Top"
						}, {
							value: "bottom",
							label: "Bottom"
						}],
						defaultValue: "top"
                    },
                    seven: {
                        ref: "props.q_node_warn",
                        label: "Node Count Warning",
                        type: "number",
                        expression: "optional"
					}
				}	
			}
		}
    };

    // *****************************************************************************
    // Main property panel definition
    // ~~
    // Only what's defined here will be returned from properties.js
    // *****************************************************************************

	

    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: dimensions,
            measures: measures,
            appearance: appearanceSection

        }
    };

} );
