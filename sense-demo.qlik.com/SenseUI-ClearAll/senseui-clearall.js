define([
	"qlik",
	"jquery",
	"qvangular",
	"css!./bootstrap.css",
], function(qlik, $, qvangular) {
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
					qHeight: 100
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				settings : {
					uses : "settings",
					items: {
						Chart: {
							type: "items",
							label: "Settings",
							items: {
								BgColor: {
									type: "string",
									label: "Background Color (HEX)",
									ref: "vars.bgColor",
									defaultValue: '#FFFFFF'
								},
								TxtColor: {
									type: "string",
									label: "Text Color (HEX)",
									ref: "vars.txtColor",
									defaultValue: '#000000'
								},
								text: {
									type: "string",
									label: "Button text",
									ref: "vars.text",
									defaultValue: 'CLEAR ALL'
								},
								Padding: {
									type: "string",
									label: "Button Padding",
									ref: "vars.padding",
									defaultValue: 10
								},
								borderWidth: {
									type: "string",
									label: "Border Width",
									ref: "vars.borderWidth",
									defaultValue: 1
								},
								borderRadius: {
									type: "string",
									label: "Border Radius",
									ref: "vars.borderRadius",
									defaultValue: 4
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
			height: $element.height(),
			width: $element.width(),
			this: this,
			padding: (layout.vars.padding) ? layout.vars.padding : 10,
			bgColor: (layout.vars.bgColor) ? layout.vars.bgColor : '#ffffff',
			txtColor: (layout.vars.txtColor) ? layout.vars.txtColor : '#000000',
			text: (layout.vars.text) ? layout.vars.text : 'CLEAR ALL',
			borderWidth: (layout.vars.borderWidth) ? layout.vars.borderWidth : 1,
			borderRadius: (layout.vars.borderRadius) ? layout.vars.borderRadius : 4,
		}
		
		vars.template = '\
			<div qv-extension id="' + vars.id + '_senseui_clearall">\
				<button class="btn btn-default btn-block" type="button">\n\
					' + vars.text + '\n\
				</button>\n\
			</div>\n\
		';

		vars.css = '\n\
			#' + vars.id + '_senseui_clearall button {\n\
				padding: ' + vars.padding + '; \n\
			}\n\
			#' + vars.id + '_senseui_clearall .btn-default {\n\
				color: ' + vars.txtColor + '; \n\
				background-color: ' + vars.bgColor + '; \n\
				border-width: ' + vars.borderWidth + '; \n\
				border-radius: ' + vars.borderRadius + 'px; \n\
			}\n\
		';

		$("<style>").html(vars.css).appendTo("head");
		$element.html(vars.template);

// eHmVzCY_senseui_clearall
		$( '#' + vars.id + '_senseui_clearall' ).click(function(e) {
			console.log(555555555555555)
			me.app.clearAll();
		});

		console.info('%c SenseUI-ClearAll Button ' + vars.v + ': ', 'color: red', '#' + vars.id + ' Loaded!');
	};

	return me;
});
