"use strict";

define(["qlik", "jquery", "qvangular", 'underscore',
// "core.utils/theme",  // For Qlik Sense < 3.1.2
// "text!themes/old/sense/theme.json", // For Qlik Sense >= 3.1.2
// "./bootstrapv4/util",
// "./bootstrapv4/dropdown",
"./bootstrap.min",
// "css!./bootstrapv4/bootstrap.css",
"css!./bootstrap.css"], function (qlik, $, qvangular, _) {
	'use strict';

	// if (Theme) Theme = JSON.parse(Theme);

	// Define properties

	var me = {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qSortCriterias: {
					qSortByState: 1
				},
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 100
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
				settings: {
					uses: "settings",
					items: {
						Chart: {
							type: "items",
							label: "Settings",
							items: {
								btnBgColor: {
									type: "string",
									expression: "optional",
									component: "color-picker",
									label: "Button Background Color",
									ref: "vars.btnBgColor",
									defaultValue: 10
								},
								btnTxtColor: {
									type: "string",
									expression: "optional",
									component: "color-picker",
									label: "Button Text Color",
									ref: "vars.btnTxtColor",
									defaultValue: 11
								},
								btnBgColorHex: {
									type: "string",
									label: "Custom Background Color (HEX)",
									ref: "vars.btnBgColorHex",
									defaultValue: ''
								},
								btnTxtColorHex: {
									type: "string",
									label: "Custom Text Color (HEX)",
									ref: "vars.btnTxtColorHex",
									defaultValue: ''
								},
								MultipleSelections: {
									type: "boolean",
									component: "switch",
									label: "Multiple Selections",
									ref: "vars.multipleSelections",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: false
								},
								btnLabel: {
									type: "string",
									label: "Button Label",
									ref: "vars.btnLabel",
									defaultValue: 'Select Text'
								},
								rowTextColor: {
									type: "string",
									expression: "none",
									label: "Text color",
									defaultValue: "#000000",
									ref: "vars.row.textColor"
								},
								rowTextHoverColor: {
									type: "string",
									expression: "none",
									label: "Text hover color",
									defaultValue: "#FFFFFF",
									ref: "vars.row.textHoverColor"
								},
								rowBackgroundColor: {
									type: "string",
									expression: "none",
									label: "Background color",
									defaultValue: "#FFFFFF",
									ref: "vars.row.backgroundColor"
								},
								rowBackgroundDeactiveColor: {
									type: "string",
									expression: "none",
									label: "Background deactived color",
									defaultValue: "#DDDDDD",
									ref: "vars.row.backgroundDeactiveColor"
								},
								rowBackgroundHoverColor: {
									type: "string",
									expression: "none",
									label: "Background hover color",
									defaultValue: "#77b62a",
									ref: "vars.row.backgroundHoverColor"
								},
								popupHeight: {
									type: "string",
									expression: "none",
									label: "Popup Height",
									defaultValue: 200,
									ref: "vars.popupHeight"
								},
								popupWidth: {
									type: "string",
									expression: "none",
									label: "Popup Width",
									defaultValue: 100,
									ref: "vars.popupWidth"
								},
								borderRadius: {
									type: "string",
									label: "Border Radius",
									ref: "vars.borderRadius",
									defaultValue: 4
								}
							}
						}
					}
				}
			}
		}
	};

	// Get Engine API app for Selections
	me.app = qlik.currApp(this);

	// Alter properties on edit	
	me.paint = function ($element, layout) {
		// Set height of the drop down
		var vars = {
			v: '1.4.3',
			id: layout.qInfo.qId,
			field: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle,
			data: layout.qHyperCube.qDataPages[0].qMatrix,
			height: $element.height(),
			width: $element.width(),
			this: this,
			multipleSelections: layout.vars.multipleSelections ? true : false,
			btnHeight: 50,
			btnBgColor: layout.vars.btnBgColor ? layout.vars.btnBgColor : '#ffffff',
			btnLabel: layout.vars.btnLabel ? layout.vars.btnLabel : 'Select Text',
			row: {
				textColor: layout.vars.row.textColor ? layout.vars.row.textColor : '#000000',
				textHoverColor: layout.vars.row.textHoverColor ? layout.vars.row.textHoverColor : '#FFFFFF',
				backgroundColor: layout.vars.row.backgroundColor ? layout.vars.row.backgroundColor : '#FFFFFF',
				backgroundHoverColor: layout.vars.row.backgroundHoverColor ? layout.vars.row.backgroundHoverColor : '#77b62a',
				backgroundDeactiveColor: layout.vars.row.backgroundDeactiveColor ? layout.vars.row.backgroundDeactiveColor : '#DDDDDD'
			},
			btnTxtColor: '#333333',
			divPadding: 10,
			popupHeight: layout.vars.popupHeight ? parseInt(layout.vars.popupHeight) : 200,
			popupWidth: layout.vars.popupWidth < $element.width() ? parseInt(layout.vars.popupWidth) : $element.width() - 35,
			borderRadius: layout.vars.borderRadius ? parseInt(layout.vars.borderRadius) : 4
		};

		vars.data = vars.data.map(function (d) {
			return {
				"dimension": d[0].qText,
				"measure": d[1].qText ? d[1].qText : null,
				"measureNum": d[1].qNum ? d[1].qNum : null,
				"qElemNumber": d[0].qElemNumber,
				"qState": d[0].qState
			};
		});
		vars.popupHeight = vars.popupHeight > $element.height() ? $element.height() : vars.popupHeight;
		vars.popupHeight -= 40; // minus the button height
		//Get Selection Bar
		me.app.getList("SelectionObject", function (reply) {
			var selectedFields = reply.qSelectionObject.qSelections;
			var selected = _.where(selectedFields, { 'qField': vars.field });
			if (selected.length) {
				var selectedInfo = selected[0].qSelectedFieldSelectionInfo;
				for (i = 0; i < selectedInfo.length; i++) {
					layout.vars.selected = selectedInfo[i].qName;
				}
			} else {
				layout.vars.selected = null;
			}
		});

		for (var i = 0; i < vars.data.length; i++) {
			if (vars.data[i].qState == 'S') {
				vars.btnLabel = vars.data[i].dimension;
			}
		}

		var dropDownElements = '';
		var elements = {
			o: [],
			x: [],
			s: []
		};
		for (var i = 0; i < vars.data.length; i++) {
			var cssClass = '';
			if (vars.data[i].qState === 'S') {
				cssClass = 'active';
			} else if (vars.data[i].qState === 'X') {
				cssClass = 'not-active';
			}
			dropDownElements += "<li><a class=\"" + cssClass + "\" data-qElemNumber=\"" + vars.data[i].qElemNumber + "\">" + vars.data[i].dimension + "</a></li>";
		}
		vars.template = "\n\t\t\t<div  id=\"" + vars.id + "_senseui_dropdown\" >\n\t\t\t\t<div class=\"dropdown\">\n\t\t\t\t\t<button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\n\t\t\t\t\t\t" + vars.btnLabel + "\n\t\t\t\t\t\t<span class=\"caret\"></span>\n\t\t\t\t\t</button>\n\t\t\t\t\t<ul class=\"dropdown-menu scrollable-menu\" aria-labelledby=\"dropdownMenu\">\n\t\t\t\t\t\t" + dropDownElements + "\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t";

		// CSS

		// Button Colors
		// vars.btnBgColor = (layout.btnBgColorHex !== '') ? layout.btnBgColorHex : Theme.palette[layout.btnBgColor];
		// vars.btnTxtColor = (layout.btnTxtColorHex !== '') ? layout.btnTxtColorHex : Theme.palette[layout.btnTxtColor];

		vars.css = "\t\n\t\t\t#" + vars.id + "_senseui_dropdown {\n\t\t\t\theight: 100%;\n\t\t\t\tposition: relative;\n\t\t\t\toverflow: hidden;\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown .scrollable-menu {\n\t\t\t\theight: auto;\n\t\t\t\tz-index: 9999999 !important;\n\t\t\t\tmin-width: " + vars.popupWidth + "px;\n\t\t\t\tmax-height: " + vars.popupHeight + "px;\n\t\t\t\toverflow-x: hidden;\n\t\t\t\toverflow-y: auto;\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown ul {\n\t\t\t\tpadding: 0;\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown li {\n\t\t\t\tborder-bottom: 1px solid white;\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown li a.not-active:hover,\n\t\t\t#" + vars.id + "_senseui_dropdown li a:hover,\n\t\t\t#" + vars.id + "_senseui_dropdown li a.active {\n\t\t\t\tcolor: " + vars.row.textHoverColor + ";\n\t\t\t\tbackground-color: " + vars.row.backgroundHoverColor + "\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown li a.not-active {\n\t\t\t\tbackground-color: " + vars.row.backgroundDeactiveColor + ";\n\t\t\t}\t\n\t\t";
		var test = "\n\t\t\t#" + vars.id + "_senseui_dropdown #dropdownP {\n\t\t\t\tpadding: 5px;\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown .qv-object-senseui-dropdown {\n\t\t\t\toverflow: visible !important;\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown .btn-default.dropdown-toggle {\n\t\t\twhite-space: nowrap;\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown li a.active {\n\t\t\t\tcolor: " + vars.row.textHoverColor + ";\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown li a {\n\t\t\t\tpadding: 3px 10px;\n\t\t\t\tcursor: pointer;\n\t\t\t\tdisplay: block;\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown .dropdown-menu,\n\t\t\t#" + vars.id + "_senseui_dropdown .btn-default {\n\t\t\t\tborder-radius: " + vars.borderRadius + "px;\n\t\t\t\twidth: " + (vars.popupWidth + 30) + "px;\n\t\t\t\ttext-align: left;\n\t\t\t}\n\t\t\t#" + vars.id + "_senseui_dropdown .btn-default {\n\t\t\t\tcolor: " + vars.btnTxtColor + "px;\n\t\t\t\tbackground-color: " + vars.btnBgColor + "x;\n\t\t\t}\n\t\t";

		//hack to show the popup on top of the container, including on a mashup for the API
		$("div[tid=\"" + vars.id + "\"] article, #" + vars.id + " article").css("overflow", 'visible');

		$("<style>").html(vars.css).appendTo("head");
		$element.html(vars.template);

		$("#" + vars.id + "_senseui_dropdown a").click(function (e) {
			var qElemNumber = parseInt(this.getAttribute('data-qElemNumber'));
			vars.this.backendApi.selectValues(0, [qElemNumber], vars.multipleSelections);
		});

		// This will allow the popup on top of other elements
		$('[tid=NckfKv] .qv-object .qv-inner-object').css("overflow", "visible");

		window.addEventListener("load", function () {});
		console.info("%c SenseUI-DropDown " + vars.v + ": ", 'color: red', "#" + vars.id + " Loaded!");
	};

	// define HTML template	
	// me.template = ``;

	// The Angular Controller for binding
	me.controller = ["$scope", "$rootScope", "$element", "$timeout", function ($scope, $rootScope, $element, $timeout) {
		$scope.$on('$viewContentLoaded', function () {});
		$rootScope.$on('$includeContentLoaded', function () {});
	}];

	return me;
});
