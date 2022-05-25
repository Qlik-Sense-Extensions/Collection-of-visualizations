
var _app;

define( ["jquery", "qlik"], function ( $, qlik ) {
	'use strict';

	_app=qlik.currApp();
	
	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 20,
					qHeight: 1
				}]
			}
		},
		//property panel
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 2,
					max: 20
					
				},
				variable: {
					type: "items",
					label: "Variable",
					items:{
						VariableName: {
							type: "string",
							label: "List Variable Name",
							ref: "variable.variablename",
							defaultValue: "vDimensionList"
						}
					}
					
				},
				/* measures: {
					uses: "measures",
					min: 1,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},*/
				settings: {
					uses: "settings"
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},

		paint: function ( $element, layout ) {

			var divName = layout.qInfo.qId;

			var self = this, html = '<table width="100%" id="dimensionListTable_' + divName + '">';
			var dimensions = layout.qHyperCube.qDimensionInfo;
			
			
			var vVariableValue='Test value';
			var varName=layout.variable.variablename;

			_app.variable.create(varName);
			
			_app.variable.getContent(varName, function(varContent) { 
				
				var vCurrentSelected = ''+varContent.qContent.qString;

				if ( dimensions && dimensions.length > 0 ) {
				
					if(vCurrentSelected.trim()=='')
					{
						vCurrentSelected=dimensions[0].qGroupFieldDefs;
						//console.info('Setting initial: ' + dimensions[0].qGroupFieldDefs);
						selectDimension(dimensions[0].qFallbackTitle, dimensions[0].qGroupFieldDefs, varName, divName);
					}
				
					for(var dim in dimensions) {
						var vBGColor=dimensions[dim].qGroupFieldDefs==vCurrentSelected ? '#00ff00' : '#ffffff';
							
						html += '<tr><td style="background-color: '+ vBGColor +'" onclick="selectDimension(\'' + dimensions[dim].qFallbackTitle + '\', \'' + dimensions[dim].qGroupFieldDefs + '\', \'' + varName + '\', \'' + divName + '\')">';
						html += dimensions[dim].qFallbackTitle;
						html += "</td></tr>";
						
					} 
				}
				html += "</table>";
				$element.html( html );


			} );
			
			
		}
	};

} );

function selectDimension(dimText, dimName, varName, divName)
{
	// if the varName is passed, put the dimension into the variable 
	if(varName)
		_app.variable.setContent(varName, dimName);
		
	// First locate the table, then set each td to a white background, finally filter the tds by dimension text and set to green background 	
	$("#dimensionListTable_"+divName).find("td").css('background-color', '#ffffff').filter(function() {
		return $(this).text() == dimText;
	}).css('background-color', '#00ff00');
}



