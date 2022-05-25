//http://public.opencpu.org/js/archive/


define( ["jquery", "./opencpu-0.4"], // "text!./ArimaForecast.css"
function ($,oc) {
	'use strict';
	$("body.qv-client.qv-story-disabled.qv-sheet-enabled.qv-view-sheet").css("font-size", "13px");
	$("body.qv-client.qv-story-disabled.qv-sheet-enabled.qv-view-sheet").css("font-family", '"QlikView Sans", sans-serif')
	var mySession;
	var val = new Array();
	var mean = new Array();
	var upper = new Array();
	var lower = new Array();
	var data = new Array();
	var rData = new Array();
	var myJsondata;
	//$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 1000
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
					min: 1,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings",
					items : {
						rforecast : {
							type : "items",
							label : "R Arima Options",
							items : {
								RServer : {
									ref : "r_server",
									label : "R Server",
									type : "string",
									expression: "optional"
								},
								rmodel : {
									ref : "rmodel",
									type : "string",
									component : "dropdown",
									label : "Forecast Model",
									options : [{
										value : "auto.arima",
										label : "auto.arima"
									}, {
										value : "Arima",
										label : "Arima"
									}, {
										value : "bats",
										label : "bats"
									}],
									defaultValue : "auto.arima"
								}, 
								Freq : {
									ref : "frequency",
									label : "Frequency",
									type : "integer",
									expression: "optional"
								},
								Start : {
									ref : "start",
									label : "Start",
									type : "string",
									expression: "optional"
								},
								nPeriods : {
									ref : "nperiods",
									label : "Max Number of Forecasting Periods",
									type : "string",
									expression: "optional"
								}
							}
						}
					}
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ( $element, layout ) {
			// declare vars
			var forecastPeriods = layout.nperiods;
			var csv = new Array();
			var self = this;
						
			// Define HTML
			var html = '';
			html += '<style>';
			html += 'body {';
			html += '  font: 10px sans-serif;';
			html += '}';
			html += '.axis path,';
			html += '.axis line {';
			html += '  fill: none;';
			html += '  stroke: #000;';
			html += '  shape-rendering: crispEdges;';
			html += '}';
			html += '.x.axis path {';
			html += '  display: none;';
			html += '}';
			html += '.line {';
			html += '  fill: none;';
			html += '  stroke: steelblue;';
			html += '  stroke-width: 1.5px;';
			html += '}';
			html += 'div.err {';
			html += '  font: 10px san-serif;';
			html += '  color: red;'; 
			html += '}'; 
			html += '</style>';
			html += '<div id="lblNumPeriods'+layout.qInfo.qId+'"  width="70%">'+layout.nperiods+'</div>';
			html += '<div id="lblStatus'+layout.qInfo.qId+'" width="30%"></div></ br>';
			html += '<form><div id="inputSlider'+layout.qInfo.qId+'"><input id="sliderNumPeriods'+layout.qInfo.qId+'" type="range" name="points" min="0" max="'+layout.nperiods+'" value="'+layout.nperiods+'"></div></form>'; 
			html += '<div id="chart'+layout.qInfo.qId+'" style="height:100%;width:100%" ></div><br>';
			html += '<div id="outforecast'+layout.qInfo.qId+'" scroll="overflow" ></div><br>';
			html += '<div id="msg'+layout.qInfo.qId+'" class="err"></div><br>';

			
			var prop = self.backendApi.getProperties();
			var appendHtml="";
			
			// Get the data from qlik
			data=[];
			rData=[];
			var	dimensions = layout.qHyperCube.qDimensionInfo,
				matrix = layout.qHyperCube.qDataPages[0].qMatrix;
			if ( dimensions && dimensions.length > 0 ) {
				matrix.forEach(function ( row ) {
					if((row[1].qNum)!='NaN'){
						var obj = { "date":row[0].qNum, "Actual":row[1].qNum};
						data.push(obj);
						rData.push(row[1].qNum);
					}
				});
			}
			
			function r_forecast() {	
				var st = new ocpu.Snippet(layout.start);
				ocpu.seturl("https://" + layout.r_server + "/ocpu/library/stats/R");

				var timeSeries = ocpu.call('ts', 
					{	'data': rData, 
						'start': st,
						'frequency': layout.frequency //12
					},
					function(tsSession){
						// Set the library to be used: Forecast
						ocpu.seturl("https://" + layout.r_server + "/ocpu/library/forecast/R");
						mySession = '';
						var req = ocpu.call(layout.rmodel, 
							{x:tsSession}, 
							function(session2){
								mySession = session2;
								var reqJson = ocpu.rpc("forecast", {object : mySession, h : forecastPeriods, force : "true"},
										function(jsondata){
											myJsondata = jsondata;
											// plot it
											var plotreq = $("#chart"+layout.qInfo.qId).rplot("plot.splineforecast", {x : jsondata}).fail(function(){
												$("#msg"+layout.qInfo.qId).text("R returned an error: " + plotreq.responseText);
											});
											// clear out the status message
											$("#lblStatus"+layout.qInfo.qId).html("");
										}).fail(function(){
											$("#msg"+layout.qInfo.qId).text("Error: " + reqJson.responseText);
										});
							}).fail(function(){
								$("#msg"+layout.qInfo.qId).text("Error: " + req.responseText);
							}); 
					}).fail(function(){
						$("#msg").text("Error: " + timeSeries.responseText);
					}); 
			}
			// set the html code for the ext objext
			$element.html( html );
			
			// call to R server to perform forecast
			r_forecast();
		
			//setup listener for changes made to slider
			$("#sliderNumPeriods"+layout.qInfo.qId).change(function() {
				forecastPeriods = $(this).val() + '';
				if(forecastPeriods<1){
					forecastPeriods=1;
					$(this).val=1;
				};
				r_forecast();
				$("#lblNumPeriods"+layout.qInfo.qId).text( forecastPeriods );
				$("#lblStatus"+layout.qInfo.qId).html("Contacting R server " + layout.r_server + "...");
			});
		} //paint function
	}; // return
}); // define
