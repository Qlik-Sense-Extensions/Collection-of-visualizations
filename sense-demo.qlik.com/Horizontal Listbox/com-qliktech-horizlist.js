define(["jquery", "text!./horizlist.css"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qListObjectDef : {
				qShowAlternatives : true,
				qFrequencyMode : "V",
				qInitialDataFetch : [{
					qWidth : 2,
					qHeight : 50
				}]
			},
			fixed : true,
			width : 25,
			percent : true,
			selectionMode : "CONFIRM"
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				width : {
					type : "items",
					label : "Width and Selections",
					items : {
						fixed : {
							ref : "fixed",
							label : "Fixed width",
							type : "boolean",
							defaultValue : true
						},
						width : {
							ref : "width",
							label : "Width",
							type : "number",
							defaultValue : 25,
							show : function(data) {
								return data.fixed;
							}
						},
						percent : {
							ref : "percent",
							type : "boolean",
							label : "Unit",
							component : "switch",
							defaultValue : true,
							options : [{
								value : true,
								label : "Percent"
							}, {
								value : false,
								label : "Pixels"
							}],
							show : function(data) {
								return data.fixed;
							}
						},
						selection : {
							type : "string",
							component : "dropdown",
							label : "Selection mode",
							ref : "selectionMode",
							options : [{
								value : "NO",
								label : "No selections"
							}, {
								value : "CONFIRM",
								label : "Confirm selections"
							}, {
								value : "QUICK",
								label : "Quick selection"
							}]
						}
					}
				},
				dimension : {
					type : "items",
					translation : "properties.dimension",
					ref : "qListObjectDef",
					min : 1,
					max : 1,
					items : {
						label : {
							type : "string",
							ref : "qListObjectDef.qDef.qFieldLabels.0",
							translation : "properties.label",
							show : true
						},
						libraryId : {
							type : "string",
							component : "library-item",
							libraryItemType : "dimension",
							ref : "qListObjectDef.qLibraryId",
							translation : "properties.dimension",
							show : function(data) {
								return data.qListObjectDef && data.qListObjectDef.qLibraryId;
							}
						},
						field : {
							type : "string",
							expression : "always",
							expressionType : "dimension",
							ref : "qListObjectDef.qDef.qFieldDefs.0",
							translation : "properties.field",
							show : function(data) {
								return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
							}
						},
						frequency : {
							type : "string",
							component : "dropdown",
							label : "Frequency mode",
							ref : "qListObjectDef.qFrequencyMode",
							options : [{
								value : "N",
								label : "No frequency"
							}, {
								value : "V",
								label : "Absolute value"
							}, {
								value : "P",
								label : "Percent"
							}, {
								value : "R",
								label : "Relative"
							}],
							defaultValue : "V"
						}
					}
				},
				settings : {
					uses : "settings"
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element, layout) {
			var self = this, html = "<ul>", style;
			if(layout.fixed) {
				style = 'style="width:' + layout.width + (layout.percent ? '%' : 'px') + ';"';
			} else {
				style = '';
			}
			this.backendApi.eachDataRow(function(rownum, row) {
				html += '<li ' + style + ' class="data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText;
				if(row[0].qFrequency) {
					html += '<span>' + row[0].qFrequency + '</span>';
				}
				html += '</li>';
			});
			html += "</ul>";
			$element.html(html);
			if(this.selectionsEnabled && layout.selectionMode !== "NO") {
				$element.find('li').on('qv-activate', function() {
					if(this.hasAttribute("data-value")) {
						var value = parseInt(this.getAttribute("data-value"), 10), dim = 0;
						if(layout.selectionMode === "CONFIRM") {
							self.selectValues(dim, [value], true);
							$(this).toggleClass("selected");
						} else {
							self.backendApi.selectValues(dim, [value], true);
						}
					}
				});
			}
		}
	};
});
