
define( ["jquery", "./js/canvasXpress.min"], function ( $, CanvasXpress ) {

	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 500
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
					min: 1,
					max: 1
				},
				measures: {
					uses: "measures",
					min: 5,
					max: 5
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},

		paint: function ( $element, layout ) {
		
			// Assign the extension object to a local variable
			var _this = this;

			// Get the chart ID from the QlikView document for this control - will be something like "CH2340091" or "CH01"
			var divName = layout.qInfo.qId;

			// Calculate the height and width that user has drawn the extension object
            var vw = $element.width(); // <= $element.height() ? $element.width() : $element.height();
            var vh = $element.height() * 0.9; // <= $element.width() ? $element.height() : $element.width();
			
			html = "<canvas id='canvas1" + divName + "' width='" + vw + "' height='" + vh + "'></canvas>";
			//html = "<canvas id='canvas1" + divName + "' width='" + vw + "' height='" + vh + "' style='width: " + vw + "px; height: " + vh + "px; left: 0; top: 0; position: absolute; z-index: 999;'></canvas>";

			$element.html( html );

			$('#canvas1' + divName).css('background-color', 'rgba(158, 167, 184, 0.2)');
			
			drawChart(_this, layout, divName, vw, vh);
			
		}
	};

} );

/// drawChart cycles through the data and calls another function to draw the pies
function drawChart(_this, layout, divName, frameX, frameY) {
	var dimensions = layout.qHyperCube.qDimensionInfo,
		measures = layout.qHyperCube.qMeasureInfo,
		qData = layout.qHyperCube.qDataPages[0].qMatrix;

	var dimname = dimensions[0].qFallbackTitle;
	var xaxisname = measures[0].qFallbackTitle,
		yaxisname = measures[1].qFallbackTitle,
		zaxisname = measures[2].qFallbackTitle,
		valuename = measures[3].qFallbackTitle,
		secondaryvaluename = measures[4].qFallbackTitle;
		
	var numRows=layout.qHyperCube.qSize.qcy;
	
	var mydata=[];
	var myvars=[];
	var idarray = new Array();
	
	$.each( qData, function ( key, value ) {
		myvars.push(value[0].qText);
		mydata.push([Math.round(value[1].qNum * 100) / 100, Math.round(value[2].qNum * 100) / 100, Math.round(value[3].qNum * 100) / 100, Math.round(value[4].qNum * 100) / 100, Math.round(value[5].qNum * 100) / 100]);
		idarray[value[0].qText]=value[0].qElemNumber;
	} );
	
	//alert( $('#canvas1'+ divName) );
	var cx1 = new CanvasXpress('canvas1'+divName,
	 
	{
	   
		'y': {'smps': [xaxisname, yaxisname, zaxisname, valuename, secondaryvaluename],
			'vars': myvars,
			'data': mydata,
		
			  }
			  
		},


		{'graphType': 'Scatter3D',
		'show3DGrid': true, 
		'x3DRatio': 1,
		"canvasBox": true,
		"xAxisTitle": xaxisname,
		"xAxis": [
			xaxisname
		],
		"xAxisTicks": 0,
		"yAxisTitle": yaxisname,
		"yAxis": [
			yaxisname
		],
		"yAxisTicks": 0,
		"zAxisTitle": zaxisname,
		"zAxis": [
			zaxisname
		],
		"sizeBy": valuename,
		"colorBy": secondaryvaluename,
		"disableToolbar": true,
		"disableDataFilters": true,
		"disableDataTable": true,
		"disableEvents": false,
		"disableMenu": true,
		"showDataTable": false,
		"showDataTableOnSelect": false
		},
		
		{
		  'click': function(o) {
				var tx="";
				//for(var name in o.y.data)
				//	tx+=name + ':' + o.y.data[name] + '\r\n';
				//prompt("o:", tx);
				//alert(o.y.data[0][3]);
				_this.backendApi.selectValues(0, [idarray[o.y.vars]], true);
		  }
		  /*
		  ,
		  'mousemove': function(o) {
				var tx='<table><tr><th colspan="2">' + o.y.vars + '</th></tr>';
				tx+='<tr><td>' + xaxisname + '</td><td align="right">' + o.y.data[1] + '</td></tr>';
				tx+='<tr><td>' + yaxisname + '</td><td align="right">' + o.y.data[2] + '</td></tr>';
				tx+='<tr><td>' + zaxisname + '</td><td align="right">' + o.y.data[3] + '</td></tr>';
				tx+='<tr><td>' + valuename + '</td><td align="right">' + o.y.data[4] + '</td></tr>';
				tx+='</table>'
				popS;
				$("#hoverBox p").html(tx)
				//for(var name in o.y.data)
				//	tx+=name + ':' + o.y.data[name] + '\r\n';
				//prompt("o:", tx);
				//alert(o.y.smps);
		  }
		  */
	});

}
	
/// Shows the popup.  Called by the mouse events over the segments
/// Parameters:
///     e    -    page parameters
///
function popS(e) {
    $("#hoverBox").show();
    var t, n;
    if (e.pageY) {
        t = e.pageY - ($("#hoverBox").height() - 20);
        n = e.pageX + 20
    } else {
        t = e.clientY - ($("#hoverBox").height() - 20);
        n = e.clientX + 20
    }
    $("#hoverBox").offset({
        top: t,
        left: n
    })
}	

/// Formats a number by adding commas for the thousand values
function addCommas(str) {
    var parts = (str + "").split("."),
    main = parts[0],
    len = main.length,
    output = "",
    i = len - 1;

	if(parts.length>1)
		dec = Math.round(parseFloat('0.' + parts[0])*100);
	else
		dec = "00";
	
	
    while (i >= 0) {
        output = main.charAt(i) + output;
        if ((len - i) % 3 === 0 && i > 0) {
            output = "," + output;
        }
        --i;
    }
    // put decimal part back
    if (parts.length > 1) {
        output += "." + dec; //parts[1];
    }
    return output;
}
