define([
	"qlik",
	"jquery",
	"qvangular",
	// "css!./senseui-search.css",
], function(qlik, $, qvangular) {
'use strict';

	// Define properties
	var me = {
		initialProperties : {
			version : 1.0,
			qListObjectDef : {
				qShowAlternatives : true,
				qFrequencyMode : "V",
				qSortCriterias : {
					qSortByState : 1
				},
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
				dimension : {
					type : "items",
					label : "Dimensions",
					ref : "qListObjectDef",
					min : 1,
					max : 1,
					items : {
						label : {
							type : "string",
							ref : "qListObjectDef.qDef.qFieldLabels.0",
							label : "Label",
							show : true
						},
						libraryId : {
							type : "string",
							component : "library-item",
							libraryItemType : "dimension",
							ref : "qListObjectDef.qLibraryId",
							label : "Dimension",
							show : function(data) {
								return data.qListObjectDef && data.qListObjectDef.qLibraryId;
							}
						},
						field : {
							type : "string",
							expression : "always",
							expressionType : "dimension",
							ref : "qListObjectDef.qDef.qFieldDefs.0",
							label : "Field",
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
						},
						qSortByLoadOrder:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Load Order",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByLoadOrder",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
							defaultValue : 0,
							
						},
						qSortByState:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by State",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByState",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
							defaultValue : 0,
							
						},
						qSortByFrequency:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Frequence",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByFrequency",
							options : [{
								value : -1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : 1,
								label : "Descending"
							}],
							defaultValue : 0,
							
						},
						qSortByNumeric:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Numeric",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByNumeric",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
							defaultValue : 0,
							
						},
						qSortByAscii:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Alphabetical",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByAscii",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
							defaultValue : 0,							
						}
					}
				},
				settings : {
					uses : "settings",
					items: {
						Chart: {
							type: "items",
							label: "Settings",
							items: {
								bgColor: {
									type: "string",
									label: "Background Color",
									ref: "vars.bgColor",
									defaultValue: '#FFFFFF'
								},
								txtColor: {
									type: "string",
									label: "Text Color",
									ref: "vars.txtColor",
									defaultValue: '#000000'
								},
								rowTextColor: {
									type: "string",
									expression: "none",
									label: "Row Text color",
									defaultValue: "#000000",
									ref: "vars.row.textColor"
								},
								rowTextHoverColor: {
									type: "string",
									expression: "none",
									label: "Row text hover color",
									defaultValue: "#FFFFFF",
									ref: "vars.row.textHoverColor"
								},
								rowBackgroundColor: {
									type: "string",
									expression: "none",
									label: "Row Background color",
									defaultValue: "#FFFFFF",
									ref: "vars.row.backgroundColor"
								},
								rowBackgroundHoverColor: {
									type: "string",
									expression: "none",
									label: "Row Background hover color",
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
								text: {
									type: "string",
									label: "Placeholder",
									ref: "vars.placeholder",
									defaultValue: 'Search'
								},
								Padding: {
									type: "string",
									label: "Button Padding",
									ref: "vars.padding",
									defaultValue: 10
								},
								borderColor: {
									type: "string",
									label: "Border Color",
									ref: "vars.border.color",
									defaultValue: '#CCCCCC'
								},
								borderWidth: {
									type: "string",
									label: "Border Width",
									ref: "vars.border.width",
									defaultValue: 1
								},
								borderRadius: {
									type: "string",
									label: "Border Radius",
									ref: "vars.border.radius",
									defaultValue: 4
								},
								popupWidth: {
									type: "string",
									expression: "none",
									label: "Popup Width",
									defaultValue: 100,
									ref: "vars.popupWidth"
								},
							}
						}
					}
				},
			}
		}
	};
	
	// Get Engine API app for Selections
	me.app = qlik.currApp(this);

	// Alter properties on edit		
	me.paint = function($element,layout) {
// console.log($.ui)
// console.log(layout)
		var vars = {
			v: '1.0.5',
			id: layout.qInfo.qId,
			field: layout.qListObject.qDimensionInfo.qGroupFieldDefs[0],
			data: layout.qListObject.qDataPages[0].qMatrix,
			datarf: [],
			height: $element.height(),
			width: $element.width(),
			this: this,
			padding: (layout.vars.padding) ? layout.vars.padding : 10,
			bgColor: (layout.vars.bgColor) ? layout.vars.bgColor : '#ffffff',
			txtColor: (layout.vars.txtColor) ? layout.vars.txtColor : '#000000',
			placeholder: (layout.vars.placeholder) ? layout.vars.placeholder : 'Search',
			border: {
				color: (layout.vars.border.color) ? layout.vars.border.color : '#CCCCCC',
				width: (layout.vars.border.width) ? layout.vars.border.width : 1,
				radius: (layout.vars.border.radius) ? layout.vars.border.radius : 4,
			},
			row: {
				textColor: (layout.vars.row.textColor)?layout.vars.row.textColor:'#000000',
				textHoverColor: (layout.vars.row.textHoverColor)?layout.vars.row.textHoverColor:'#FFFFFF',
				backgroundColor: (layout.vars.row.backgroundColor)?layout.vars.row.backgroundColor:'#FFFFFF',
				backgroundHoverColor: (layout.vars.row.backgroundHoverColor)?layout.vars.row.backgroundHoverColor:'#77b62a',
			},
			popupWidth: (layout.vars.popupWidth)?layout.vars.popupWidth: 100,
		}
		
		vars.css = '\
			#' + vars.id + '_senseui_search input {\n\
				padding: ' + vars.padding + 'px;\n\
				color: ' + vars.txtColor + ';\n\
				border: ' + vars.border.width + 'px solid ' + vars.border.color + ';\n\
				border-radius: ' + vars.border.radius + ';\n\
				width: ' + vars.popupWidth + 'px;\n\
			}\n\
			#' + vars.id + '_senseui_search .ui-autocomplete.ui-front.ui-menu.ui-widget.ui-widget-content{\n\
				z-index: 9999999;\n\
			}\n\
			#' + vars.id + '_senseui_search {\n\
				height: auto;\n\
				overflow-x: hidden;\n\
				z-index: 9999999;\n\
			}\n\
			#' + vars.id + '_senseui_search ul {\n\
				border-left: ' + vars.border.width + 'px solid ' + vars.border.color + ';\n\
				border-right: ' + vars.border.width + 'px solid ' + vars.border.color + ';\n\
				width: ' + vars.popupWidth + 'px;\n\
				z-index: 9999999;\n\
			}\n\
			#' + vars.id + '_senseui_search ul li {\n\
				color: ' + vars.row.textColor + ';\n\
				background-color: ' + vars.row.backgroundColor + ';\n\
				border-bottom: ' + vars.border.width + 'px solid ' + vars.border.color + ';\n\
				padding: ' + vars.padding + 'px;\n\
				cursor: pointer;\n\
			}\n\
			#' + vars.id + '_senseui_search ul li:hover {\n\
				color: ' + vars.row.textHoverColor + ';\n\
				background-color: ' + vars.row.backgroundHoverColor + ';\n\
			}\n\
		';
		
		vars.template = '\
			<div qv-extension class="senseui-search" id="' + vars.id + '_senseui_search">\
				<input type="text" name="search" id="search">\n\
			</div>\n\
		';

		$("<style>").html(vars.css).appendTo("head");
		$element.html(vars.template);

		$.each(vars.data, function(key, value) {
			vars.datarf[key] = value[0].qText;
		});

		$( '#' + vars.id + '_senseui_search #search' ).autocomplete({
			source: vars.datarf,
			appendTo: '#' + vars.id + '_senseui_search',
		});

		//hack to show the popup on top of the container
		$( 'div[tid="' + vars.id + '"] article' ).css( "overflow", 'visible' );

		console.info('%c SenseUI-Search ' + vars.v + ': ', 'color: red', '#' + vars.id + ' Loaded!');
	};

	// define HTML template	
	// me.template = '';

	// Controller for binding
	// me.controller =['$scope', function($scope){}];

	return me;
});
