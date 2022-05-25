/*globals define, console*/
/*
	ToDo:
	Create HTML canvas like the textbox for entering html		
*/
 
define(["jquery","./com-itelligence-htmlBox-properties"], function($,properties) {

	return {
		type : "it.HTML Box",
		//Refer to the properties file
		definition : properties,

		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 0,
					qHeight : 0
				}]
			},
			fontSize : {
				min : 8,
				max : 24
			}
		},
		snapshot : {
			canTakeSnapshot : false
		},
		paint : function($element, layout) { 
	
				$element.html(layout.qDef['HTML']) ; 
				
		}	
	};
});
