const iconOptions = [
	{
		label: "plus / minus",
		value: 0
	},
	{
		label: "plus / minus circle",
		value: 1
	},
	{
		label: "arrow",
		value: 2
	},
	{
		label: "chevron",
		value: 3
	},
	{
		label: "angle-double",
		value: 4
	}
]


export default function (variableList) {
	return {
		type: "items",
		component: "accordion",
		items: {
			Settings: {
				label: "Settings",
				type: "items",
				items: {
					RangeSettings: {
						label: "Range Settings",
						type: "items",
						items: {
							variableName: {
								label: "Select variable",
								ref: "props.variableName",
								type: 'string',
								component: 'dropdown',
								options: variableList
							},
							variableValue: {
								label: "Selected variable current value",
								ref: "props.currentValue",
								type: "string",
								expression: "optional",
								defaultValue: '',
							},
							rangeOrList: {
								label: "Value options",
								ref: "props.rangeType",
								type: "integer",
								component: "buttongroup",
								options: [{
									value: 0,
									label: "Range",
									tooltip: "Select for vertical"
								}, {
									value: 1,
									label: "List",
									tooltip: "Select for horizontal"
								}],
								defaultValue: 0

							},
							rangeMax: {
								label: "Range maximum",
								ref: "props.rangeMax",
								type: "integer",
								expression: "optional",
								defaultValue: 5,
								show: (layout) => {
									return layout.props.rangeType === 0
								}

							},
							rangeMin: {
								label: "Range minimum",
								ref: "props.rangeMin",
								type: "integer",
								expression: "optional",
								defaultValue: 1,
								show: (layout) => {
									return layout.props.rangeType === 0
								}
							},
							rangeStep: {
								label: "Step",
								ref: "props.rangeStep",
								type: "integer",
								expression: "optional",
								defaultValue: 1,
								show: (layout) => {
									return layout.props.rangeType === 0
								}
							},
							values: {
								type: 'items',
								label: 'Values',
								show: function (layout) {
									return layout.props.rangeType === 1;
								},
								items: {
									options: {
										type: 'array',
										ref: 'props.listOptions',
										label: 'List',
										itemTitleRef: 'value',
										allowAdd: true,
										allowRemove: true,
										addTranslation: 'Add list item',
										items: {
											value: {
												type: 'string',
												ref: 'value',
												label: 'Value',
												expression: 'optional'
											}
										}
									}
								}
							}
						}
					},
				}
			},
			appearance: {
				uses: "settings",
				type: "items",
				items: {
					presentation: {
						label: "Presentation",
						type: "items",
						items: {
							buttonSize: {
								label: "Button size",
								component: "slider",
								type: "number",
								min: 20,
								max: 100,
								step: 1,
								defaultValue: 30,
								ref: "props.buttonSize",
							},
							icons: {
								label: "Icons",
								type: "integer",
								component: "dropdown",
								options: iconOptions,
								defaultValue: 0,
								ref: "props.icons",
							},
							inactiveBackgroundColor: {
								label: "Inactive background color",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#cccccc",
									index: "-1"
								},
								ref: "props.inactiveBackgroundColor",
							},
							inactiveIconColor: {
								label: "Inactive icon color",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#565656",
									index: "-1"
								},
								ref: "props.inactiveIconColor",
							}
						}
					},
					previous: {
						label: "Previous button",
						type: "items",
						items: {
							backgroundColor: {
								label: "Background color",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#009845",
									index: "-1"
								},
								ref: "props.previousBackgroundColor",
							},
							iconColor: {
								label: "Icon color",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#ffffff",
									index: "-1"
								},
								ref: "props.previousIconColor",
							}
						}
					},
					next: {
						label: "Next button",
						type: "items",
						items: {
							backgroundColor: {
								label: "Background color",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#009845",
									index: "-1"
								},
								ref: "props.nextBackgroundColor",
							},
							iconColor: {
								label: "Icon color",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#ffffff",
									index: "-1"
								},
								ref: "props.nextIconColor",
							}
						}
					}
				}
			},
			about: {
				type: "items",
				label: "About",
				items: {
					Name: {
						label: 'Name: Variable Drill',
						component: 'text'
					},
					Version: {
						label: 'Version: 1.0.0',
						component: 'text'
					},
					Author: {
						label: 'Author: Christopher Braley',
						component: 'text'
					},
				}
			}
		}
	};
}