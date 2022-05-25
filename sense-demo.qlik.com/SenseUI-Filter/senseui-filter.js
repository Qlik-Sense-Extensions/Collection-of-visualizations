/**
 *
 * @title Sense UI - Filter
 * @description Simple Filter with totals
 *
 * @author yianni.ververis@qlik.com
 *
 * @example https://github.com/yianni-ververis/
 */

define([
	"qlik",
	"jquery",
	"qvangular",
	'underscore',
	"css!./senseui-filter.css",
], function(qlik, $, qvangular, _) {
'use strict';
	
	// Define properties
	var me = {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 2,
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
					max: 1
				},
				sorting: {
					uses: "sorting",
				},
				settings: {
					uses : "settings",
					items: {
						DropDown: {
							type: "items",
							label: "SenseUI-Filter Settings",
							items: {	
								TotalsVisibility: {
									type: "boolean",
									label: 'Measure Visibility',
									ref: 'vars.totals.visible',
									defaultValue: true
							    },
								rowTextColor: {
									type: "string",
									expression: "none",
									label: "Text color (#000000 OR rgb(0,0,0) OR rgba(0,0,0,1) ",
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
								rowTextDeactivatedColor: {
									type: "string",
									expression: "none",
									label: "Text deselected color",
									defaultValue: "#000000",
									ref: "vars.row.textDeactivatedColor"
								},
								rowBackgroundColor: {
									type: "string",
									expression: "none",
									label: "Background color",
									defaultValue: "#FFFFFF",
									ref: "vars.row.backgroundColor"
								},
								deselected: {
									type: "boolean",
									component: "switch",
									label: "Background of deactived",
									ref: "vars.deselected",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								rowBackgroundDeactiveColor: {
									type: "string",
									expression: "none",
									label: "Background deactived color",
									defaultValue: "#CCCCCC",
									ref: "vars.row.backgroundDeactiveColor"
								},
								rowBackgroundHoverColor: {
									type: "string",
									expression: "none",
									label: "Background hover color",
									defaultValue: "#77b62a",
									ref: "vars.row.backgroundHoverColor"
								},
								rowBorderWeight: {
									type: "number",
									expression: "none",
									label: "Border weight",
									component: "slider",
									ref: "vars.row.borderWeight",
									defaultValue: 0,
									min: 0,
									max: 3
								},
								rowBorderColor: {
									type: "string",
									expression: "none",
									label: "Border color",
									defaultValue: "#404040",
									ref: "vars.row.borderColor"
								},
								rowSpacing: {
									type: "number",
									expression: "none",
									label: "Spacing",
									component: "slider",
									ref: "vars.row.spacing",
									defaultValue: 3,
									min: 3,
									max: 10
								},
								rowHeight: {
									type: "number",
									expression: "none",
									label: "Element height",
									component: "slider",
									ref: "vars.row.height",
									defaultValue: 10,
									min: 10,
									max: 50
								},
								OrderBySelection: {
									type: "boolean",
									component: "switch",
									label: "Order By Selection",
									ref: "vars.orderBySelection",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
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
								Horizontal: {
									type: "boolean",
									component: "switch",
									label: "Horziontal / Vertical",
									ref: "vars.horizontal",
									options: [{
										value: true,
										label: "Horizontal"
									}, {
										value: false,
										label: "Vertical"
									}],
									defaultValue: true
								},
								Separator: {
									type: "string",
									expression: "none",
									label: "Separator",
									defaultValue: "|",
									ref: "vars.separator",
									show : function(data) {
										return data.vars.horizontal;
									}
								},
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
	me.paint = function($element,layout) {
		var vars = {
			v: '1.1.2',
			id: layout.qInfo.qId,
			field: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle,
			data: layout.qHyperCube.qDataPages[0].qMatrix,
			height: $element.height(),
			width: $element.width(),
			this: this,
			totals: {
				visible: (layout.vars.totals.visible) ? true : false,
			},
			row: {
				height: (layout.vars.row.height)?layout.vars.row.height:10,
				padding: (layout.vars.row.spacing)?layout.vars.row.spacing:3,
				border: layout.vars.row.borderWeight,
				textColor: (layout.vars.row.textColor)?layout.vars.row.textColor:'#000000',
				textHoverColor: (layout.vars.row.textHoverColor)?layout.vars.row.textHoverColor:'#FFFFFF',
				textDeactivatedColor: (layout.vars.row.textDeactivatedColor)?layout.vars.row.textDeactivatedColor:'#000000',
				backgroundColor: (layout.vars.row.backgroundColor)?layout.vars.row.backgroundColor:'#FFFFFF',
				backgroundHoverColor: (layout.vars.row.backgroundHoverColor)?layout.vars.row.backgroundHoverColor:'#77b62a',
				backgroundDeactiveColor: (layout.vars.row.backgroundDeactiveColor)?layout.vars.row.backgroundDeactiveColor:'#CCCCCC',
				borderColor: (layout.vars.row.borderColor)?layout.vars.row.borderColor:'#404040'
			},
			orderBySelection: (layout.vars.orderBySelection) ? true : false,
			multipleSelections: (layout.vars.multipleSelections) ? true : false,
			deselected: (layout.vars.deselected || typeof layout.vars.deselected==='undefined') ? true : false,
			horizontal: (layout.vars.horizontal) ? true : false,
			separator: (layout.vars.separator) ? layout.vars.separator : '|',
		}

		// For old uses of the extension
		// @TODO remove after we check all the mashups that use this extension
		if (_.isUndefined(layout.vars.orderBySelection)) {
			vars.orderBySelection = true
		}

		vars.data = vars.data.map(function(d) {
			return {
				"dimension":d[0].qText,
				"measure":d[1].qText,
				"measureNum":d[1].qNum,
				"qElemNumber":d[0].qElemNumber,
				"qState":d[0].qState,
			}
		});

		//Get Selection Bar
		me.app.getList("SelectionObject", function(reply){
			var selectedFields = reply.qSelectionObject.qSelections;
			var selected = _.where(selectedFields, {'qField': vars.field});
			if (selected.length) {
				var selectedInfo = selected[0].qSelectedFieldSelectionInfo;
				for (i = 0; i < selectedInfo.length; i++) { 
					$( '#' + vars.id + '_filter a:contains("' + selectedInfo[i].qName + '")' ).css( "color", vars.row.textHoverColor );
					$( '#' + vars.id + '_filter a:contains("' + selectedInfo[i].qName + '")' ).css( "background-color", vars.row.backgroundHoverColor );
					$( '#' + vars.id + '_filter a:contains("' + selectedInfo[i].qName + '")' ).unbind('mouseenter mouseleave');
				}
			}
		});

		vars.template = '\
			<div qv-extension class="senseui-filter" id="' + vars.id + '_filter">\
				<div class="scrollable">\
					<ul>\
		';

		var templateSelected = '',
			templateDeSelected = '',
			templateDeActivated = '',
			cssType = 'vertical',
			separator = '';

			if (vars.horizontal) {
				cssType = 'horizontal';
				separator = vars.separator;
			}

		if (vars.orderBySelection) {
			for (var i=0; i < vars.data.length; i++) {
				var cssClass = '',
					totals = (vars.totals.visible) ? ' (' + vars.data[i].measure + ')':'';
				if (vars.data[i].qState=='S') {
					templateSelected += '<li class="active ' + cssType + '"><a data-qElemNumber="' + vars.data[i].qElemNumber + '">' + vars.data[i].dimension + totals + '</a></li>' + separator; 
				} else if (vars.data[i].qState=='X') {
					var cssDeselected = (vars.deselected) ? 'deactive' : '';
					templateDeActivated += '<li class="' + cssDeselected + ' ' + cssType + '"><a data-qElemNumber="' + vars.data[i].qElemNumber + '">' + vars.data[i].dimension + totals + '</a></li>' + separator; 
				} else {
					templateDeSelected += '<li class="' + cssType + '"><a data-qElemNumber="' + vars.data[i].qElemNumber + '">' + vars.data[i].dimension + totals + '</a></li>' + separator; 
				}
			}
			
			vars.template += templateSelected;
			vars.template += templateDeSelected;
			vars.template += templateDeActivated;
		} else {
			for (var i=0; i < vars.data.length; i++) {
				separator = (i==vars.data.length-1) ? '' : separator;
				var cssClass = 'open';
				if (vars.data[i].qState=='S') {
					cssClass = 'active';
				} else if (vars.data[i].qState=='X' && vars.deselected) {
					cssClass = 'deactive';
				}
				var	totals = (vars.totals.visible) ? ' (' + vars.data[i].measure + ')':'';
				vars.template += '<li class="'+ cssClass + ' ' + cssType + '"><a data-qElemNumber="' + vars.data[i].qElemNumber + '">' + vars.data[i].dimension + totals + '</a></li>' + separator; 
			}
		}
		
		// CSS
		vars.css = '\n\
			div[tid="rowHeight"] { \n\
				border-bottom: 1px solid #9D9D9D\n\
			} \n\
			#' + vars.id + '_filter li {\n\
				padding: ' + vars.row.padding + 'px; \n\
			}\n\
			#' + vars.id + '_filter li a {\n\
				color: ' + vars.row.textColor + '; \n\
			}\n\
			#' + vars.id + '_filter li a:hover {\n\
				color: ' + vars.row.textHoverColor + '; \n\
			}\n\
			#' + vars.id + '_filter li.active a {\n\
				color: ' +  vars.row.textHoverColor + '; \n\
			}\n\
			#' + vars.id + '_filter li:hover, \n\
			#' + vars.id + '_filter li.active {\n\
				background-color: ' + vars.row.backgroundHoverColor + '; \n\
			}\n\
			#' + vars.id + '_filter li.deactive a {\n\
				color: ' + vars.row.textDeactivatedColor + '; \n\
			}\n\
			#' + vars.id + '_filter li.deactive {\n\
				background-color: ' + vars.row.backgroundDeactiveColor + '; \n\
			}\n\
			#' + vars.id + '_filter li:not(.active,.deactive) {\n\
				background-color: ' + vars.row.backgroundColor + '; \n\
			}\n\
			#' + vars.id + '_filter li.open:hover{\n\
				background-color: ' + vars.row.backgroundHoverColor + '; \n\
			}\n\
		';
		$("<style>").html(vars.css).appendTo("head");

		vars.template += '\
					</ul>\
				</div>\
			</div>\n\
		';

		$element.html(vars.template);
		
		$( '#' + vars.id + '_filter a' ).click(function(e) {
			var qElemNumber = parseInt(this.getAttribute('data-qElemNumber'));
			vars.this.backendApi.selectValues(0, [qElemNumber], vars.multipleSelections);
		});
		
		console.info('%c SenseUI-Filter ' + vars.v + ': ', 'color: red', '#' + vars.id + ' Loaded!');
	};

	// define HTML template
	// me.template = '';

	// Controller for binding
	me.controller =['$scope','$rootScope', function($scope,$rootScope){
	}];

	// Return Ordinal Numbers 1st, 2nd etc.
	me.getGetOrdinal = function (n) {
		var s = ["th","st","nd","rd"],
			v = n%100;
		return n+(s[(v-20)%10]||s[v]||s[0]);
	}

	return me;
});
