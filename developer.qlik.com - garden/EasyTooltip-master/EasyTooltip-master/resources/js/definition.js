define([], function () {
    'use strict';
    
	return {
		type: "items",
		component: "accordion",
		items: {
			measures: {
				uses: "measures",
				min: 1,
				max: 2
			},
			addons: {
				uses: "addons",
				items: {
					dataHandling: {
						uses: "dataHandling",
						items: {
							calcCond: {
								uses: "calcCond"
							}
						}
					}
				}
			},
			settings: {
				type: "items",
				component: "expandable-items",
				uses: "settings",
				items: {
					text: {
						type: "items",
						label: "Easy Tooltip : Text",
						items: {
							type: {
								type: "string",
								component: "dropdown",
								label: "Type",
								ref: "eTooltip.type",
								options: [
									{
										value: "text",
										label: "Text"
									},
									{
										value: "image",
										label: "Image"
									}
								],
								defaultValue: "text"
							},
							textColor: {
								ref: "eTooltip.textColor",
								label: "Text color",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#010101"
								},
								show: function(e, n, i) {
									return e.eTooltip.type == 'text';
								}
							},
							fontSize: {
								ref: "eTooltip.fontSize",
								label: "Font size",
								type: "string",
								defaultValue: "14px",
								expression: "optional",
								show: function(e, n, i) {
									return e.eTooltip.type == 'text';
								}
							},
							border: {
								ref: "eTooltip.border",
								label: "Border",
								type: "boolean",
								defaultValue: true
							},
							borderColor: {
								ref: "eTooltip.borderColor",
								label:"Border color",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#333333"
								},
								show: function(e, n, i) {
									return e.eTooltip.border;
								}
							},
							cursor: {
								type: "string",
								component: "dropdown",
								label: "Cursor",
								ref: "eTooltip.cursor",
								options: [
									{
										value: "pointer",
										label: "Pointer"
									},
									{
										value: "default",
										label: "Default"
									},
									{
										value: "help",
										label: "Help"
									},
									{
										value: "crosshair",
										label: "Crosshair"
									}
								],
								defaultValue: "pointer"
							},
							backgroundColor: {
								ref: "eTooltip.backgroundColor",
								label: "Background color",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#fcfcfc"
								}
							},
							verticalPosition: {
								type: "string",
								component: "dropdown",
								label: "Vertical position",
								ref: "eTooltip.verticalPosition",
								options: [
									{
										value: "top",
										label: "Top"
									},
									{
										value: "middle",
										label: "Middle"
									},
									{
										value: "bottom",
										label: "Bottom"
									}
								],
								defaultValue: "middle"
							},
							alignement: {
								type: "string",
								component: "dropdown",
								label: "Alignement",
								ref: "eTooltip.alignement",
								options: [
									{
										value: "left",
										label: "Left"
									},
									{
										value: "center",
										label: "Center"
									},
									{
										value: "right",
										label: "Right"
									}
								],
								defaultValue: "center"
							}
						}
					},
					tooltip: {
						type: "items",
						label: "Easy Tooltip : Tooltip",
						items: {
							tooltipType: {
								type: "string",
								component: "dropdown",
								label: "Tooltip type",
								ref: "eTooltip.tooltipType",
								options: [
									{
										value: "text",
										label: "Text"
									},
									{
										value: "image",
										label: "Image"
									}
								],
								defaultValue: "text"
							},
							tooltipTextColor: {
								ref: "eTooltip.tooltipTextColor",
								label: "Tooltip text color",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#fefefe"
								},
								show: function(e, n, i) {
									return e.eTooltip.tooltipType == 'text';
								}
							},
							tooltipFontSize: {
								ref: "eTooltip.tooltipFontSize",
								label: "Tooltip font size",
								type: "string",
								defaultValue: "14px",
								expression: "optional",
								show: function(e, n, i) {
									return e.eTooltip.tooltipType == 'text';
								}
							},
							tooltipBackgroundColor: {
								ref: "eTooltip.tooltipBackgroundColor",
								label: "Tooltip background",
								component: "color-picker",
								type: "object",
								defaultValue: {
									color: "#010101"
								}
							},
							tooltipPosition: {
								type: "string",
								component: "dropdown",
								label: "Tooltip position",
								ref: "eTooltip.tooltipPosition",
								options: [
									{
										value: "left",
										label: "Left"
									},
									{
										value: "top",
										label: "Top"
									},
									{
										value: "right",
										label: "Right"
									},
									{
										value: "bottom",
										label: "Bottom"
									}
								],
								defaultValue: "top"
							},
							tooltipAlignement: {
								type: "string",
								component: "dropdown",
								label: "Tooltip alignement",
								ref: "eTooltip.tooltipAlignement",
								options: [
									{
										value: "left",
										label: "Left"
									},
									{
										value: "center",
										label: "Center"
									},
									{
										value: "right",
										label: "Right"
									}
								],
								defaultValue: "center"
							},
							tooltipWidth: {
								ref: "eTooltip.tooltipWidth",
								label: "Tooltip width",
								type: "string",
								defaultValue: "300px",
								expression: "optional"
							}
						}
					}
				}
			},
			aboutPanel: {
				translation:"Common.About",
				type:"items",
				items: {
					about: {
						component: "EasyAbout",
						translation: "Common.About"
					}
				}
			}
		}
	};
	
});





















