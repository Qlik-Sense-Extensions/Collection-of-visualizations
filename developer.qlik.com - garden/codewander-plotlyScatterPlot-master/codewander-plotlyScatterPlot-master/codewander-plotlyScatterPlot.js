define( ["qlik", "text!./codewander-plotlyScatterPlot.ng.html", "css!./codewander-plotlyScatterPlot.css"
,"https://cdn.plot.ly/plotly-latest.min.js"],
	function ( qlik, template,css,Plotly ) {
		"use strict";
		return {
			template: template,
			initialProperties: {
				qHyperCubeDef: {
					qMode:"S",
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 11	,
						qHeight: 1
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
						min: 2,
						max: 10
					},
					settings:{
						uses: "settings",
						items:{
						SeriesSettings: {
							type: "array",
							ref: "seriesSettings",
							label: "Series",
							itemTitleRef: "seriesName",
							allowAdd: true,
							allowRemove: true,
							addTranslation: "Add Series",
							items: {
								seriesName: {
									type: "string",
									ref: "seriesName",
									label: "Series Name",									
									defaultValue: "" 
								},
								seriesColor: {
									type: "string",
									ref: "seriesColor",
									label: "Series Color",
									defaultValue: ""
								},
								
								seriesType: {
									type: "string",
									component: "dropdown",
									label: "Series Type",
									ref: "seriesType",
									options: [{value:'lines',label:'lines'},{value:'markers',label:'markers'},{value:'lines+markers',label:'lines+markers'}],
									defaultValue:'markers'
								},
								markerSize: {
									type: "integer",
									label: "Marker Size",
									ref: "markerSize",
									defaultValue: 12
								},
								highlightFirstPoint:{
									type: "boolean",
									ref: "highlightFirstPoint",
									label: "Highlight First Point",									
									defaultValue: false								
								}
								
								
							}
						},
						XAxisSettings: {
							type: "items",
							ref: "xAxisSettings",
							label: "X Axis",
							items: {
								xTitle:{
									type:"string",
									ref: "xAxisSettings.xTitle",
									defaultValue:"",
									expression: "always"
									
								},
								showGrid: {
									type: "boolean",
									ref: "xAxisSettings.showGrid",
									label: "Show Grid",									
									defaultValue: true
								},
								showLine: {
									type: "boolean",
									ref: "xAxisSettings.showLine",
									label: "Show Line",
									defaultValue: true
								},
								
								showZeroLine: {
									type: "boolean",
									label: "Show Zero Line",
									ref: "xAxisSettings.showZeroLine",
									defaultValue:true
								},
								showTicklabels: {
									type: "boolean",
									label: "Show Tick Labels",
									ref: "xAxisSettings.showTicklabels",
									defaultValue: true
								}
							}
						},
						YAxisSettings: {
							type: "items",
							ref: "yAxisSettings",
							label: "Y Axis",
							items: {
								yTitle:{
									type:"string",
									ref: "yAxisSettings.yTitle",
									defaultValue:"",
									expression: "always"
									
								},
								showGrid: {
									type: "boolean",
									ref: "yAxisSettings.showGrid",
									label: "Show Grid",									
									defaultValue: true
								},
								showLine: {
									type: "boolean",
									ref: "yAxisSettings.showLine",
									label: "Show Line",
									defaultValue: true
								},
								
								showZeroLine: {
									type: "boolean",
									label: "Show Zero Line",
									ref: "yAxisSettings.showZeroLine",
									defaultValue:true
								},
								showTicklabels: {
									type: "boolean",
									label: "Show Tick Labels",
									ref: "yAxisSettings.showTicklabels",
									defaultValue: true
								}
							}
						},
						GeneralSettings: {
							type: "items",
							ref: "generalSettings",
							label: "General Settings",
							items: {
								DisplayModeBar:{
								type: "string",
								component: "dropdown",
								label: "Display Mode Bar",
								ref: "generalSettings.displayModeBar",
								options: [{value:'1',label:'Always'},{value:'0',label:'on Hover'},{value:'-1',label:'Never'}],
								defaultValue:'0'
								},
								showLegend: {
									type: "boolean",
									ref: "generalSettings.showLegend",
									label: "Show Legend",									
									defaultValue: true
								}
								
							}
						},
						
						}
					
					},
					sorting: {
						uses: "sorting"
					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			paint: function (layout) {
				var self =this;
				var heightofChart = this.$element.height();
				var widthofChart= this.$element.width();
				var leftMargin = 10
				var rightMargin = 10
				var topMargin =30
				var bottomMargin =10
				
				if (self.$scope.layout.xAxisSettings.xTitle != null && self.$scope.layout.xAxisSettings.xTitle !=''){
					bottomMargin = bottomMargin +20				
				}
				if (self.$scope.layout.xAxisSettings.showTicklabels ){
					bottomMargin = bottomMargin +20				
				}
				if (self.$scope.layout.yAxisSettings.yTitle != null && self.$scope.layout.yAxisSettings.yTitle !=''){
					leftMargin = leftMargin +20				
				}
				if (self.$scope.layout.yAxisSettings.showTicklabels ){
					leftMargin = leftMargin +20				
				}
				if (self.$scope.layout.generalSettings.showLegend){
					rightMargin=rightMargin + 100
				}
				
				
				//var ff=window.getComputedStyle(getElementsByTagName("body")[0],null).getPropertyValue("font-family") ;
				var pdisplayModeBar=false
					if (self.$scope.layout.generalSettings.displayModeBar=='1') {pdisplayModeBar=true}
					else if (self.$scope.layout.generalSettings.displayModeBar=='-1') {pdisplayModeBar= false;}
					else {pdisplayModeBar=null;}
				var graph_layout_setting ={responsive:true}
				if (pdisplayModeBar !=null){graph_layout_setting.displayModeBar=pdisplayModeBar}
				var graph_layout = {
					 
				  font:{
					family: 'QlikView Sans'
				  },
				  showlegend: self.$scope.layout.generalSettings.showLegend,					  
				  xaxis: {
					showline: self.$scope.layout.xAxisSettings.showLine,
					showgrid: self.$scope.layout.xAxisSettings.showGrid,
					showticklabels: self.$scope.layout.xAxisSettings.showTicklabels,
					zeroline: self.$scope.layout.xAxisSettings.showZeroLine,
					linecolor: 'rgb(204,204,204)',
					tickangle: 'auto',
					title: self.$scope.layout.xAxisSettings.xTitle
				  },
				  yaxis: {
					showline: self.$scope.layout.yAxisSettings.showLine,
					showgrid: self.$scope.layout.yAxisSettings.showGrid,
					showticklabels: self.$scope.layout.yAxisSettings.showTicklabels,
					zeroline: self.$scope.layout.yAxisSettings.showZeroLine,
					linecolor: 'rgb(204,204,204)',
					tickangle: 'auto',
					title:self.$scope.layout.yAxisSettings.yTitle
				  },
				  hovermode:'closest',
				  autosize: false,
				  width: widthofChart,
				  height: heightofChart,
				  margin: {
					autoexpand: false,
					l: leftMargin,
					r: rightMargin,
					t: topMargin,
					b:bottomMargin
				  },
				  annotations: [
					
				  ]
				};
				var qElemNumber=[];
				var min_x=0;
				var max_x=0;
				var min_y=0;
				var max_y=0;
				var max_z=1;
				var dataMatrix=[];
				var cols=[];
				var dimensions_count= this.$scope.layout.qHyperCube.qDimensionInfo.length;
				var measures_count=this.$scope.layout.qHyperCube.qMeasureInfo.length;
				if (measures_count % 2 != 0  && measures_count > 0) {
					$('#myDiv').text("The chart requires even number of measures to plot series");
					return;
				}
				else{
					$('#myDiv').empty();
				}
				$.each(this.$scope.layout.qHyperCube.qDimensionInfo,function(index,item){
				 	cols.push((item.title !=null && item.title!="")?item.title : item.qFallbackTitle);					
				});
				$.each(this.$scope.layout.qHyperCube.qMeasureInfo,function(index,item){
				 	cols.push((item.title !=null && item.title!="")?item.title : item.qFallbackTitle);					
				});				 
				
				

				 //loop through the rows we have and render
				 this.backendApi.eachDataRow( function ( rownum, row ) {
							self.$scope.lastrow = rownum;
							dataMatrix.push(row);
				 });
				 
				var data=convert(dataMatrix);
				
					
				/*for (var i =0 ; i<data.length; i++)
				{
					var start_annotation= {
					  xref: 'x',
					  yref: 'y',
					  
					  text: '',
					  //font:{
						//family: 'Arial',
						//size: 30,
						//color: 'rgb(37,37,37)'
					  //},
					  showarrow: true
					}
					start_annotation.x= data[i].x[0];
					start_annotation.y= data[i].y[0];
					start_annotation.text= 'start';
					graph_layout.annotations.push(  start_annotation)
					
				}*/
				render(data);
				//needed for export
				this.$scope.selections = [];
				
				 if(this.backendApi.getRowCount() > self.$scope.lastrow +1){
						  var requestPage = [{
								qTop: self.$scope.lastrow + 1,
								qLeft: 0,
								qWidth: 10, //should be # of columns
								qHeight: Math.min( 1000, this.backendApi.getRowCount() - self.$scope.lastrow )
							}];

						   this.backendApi.getData( requestPage ).then( function ( dataPages ) {
									//when we get the result trigger paint again
									self.paint(layout );
						   } );
				 }
				 
				
				function convert(Matrix)
				{
				 var data=[];
				 var total_series_count = measures_count/2;
				 var series_array =[]
				 var settingArrayLength = self.$scope.layout.seriesSettings.length;
				 var settingArray=self.$scope.layout.seriesSettings;
				 for (var i =0 ;i<total_series_count;i++)
				 {
					 var series={}
					 series.x=[];
					 series.y=[];
					 if (i<=settingArrayLength-1){
						series.mode=settingArray[i].seriesType;
						 series.type="scatter";
						 series.text=[];
						 series.name=settingArray[i].seriesName != null ? settingArray[i].seriesName : ""
						 series.marker={size:12} 	
						 series.marker.size= settingArray[i].markerSize 
						 if (settingArray[i].seriesColor != null && settingArray[i].seriesColor !="")
						 {
							series.marker.color=settingArray[i].seriesColor							
						 }
						 if (settingArray[i].highlightFirstPoint){ 
							series.marker.line={
							  color: ['rgb(0, 0, 0)'],
							  width: [3	,1]
							}
						}
					 }
					 else{
						 
					 series.mode="markers";
					 series.type="scatter";
					 series.text=[];
					 series.marker={size:12}
					 }
					 series_array.push(series);
				 }
				 $.each(Matrix,function(index,item){
				 	data[index]={};
					qElemNumber[item[0].qText]=item[0].qElemNumber;
				 	
					/*$.each(cols,function(col_index,col){
				try {					
					data[index][col]= col_index<= dimensions_count-1 ? item[col_index].qText : item[col_index].qNum;
						if (col_index<= dimensions_count-1){
							if(qElemNumber[col_index]==null)qElemNumber[col_index]={};
							qElemNumber[col_index][item[col_index].qText]=item[col_index].qElemNumber;
						}
					}
					catch (e){
						console.log(col_index);
						
						console.log(e);
					}
						
						
					})*/
					for (var s=0;s<series_array.length;s++)
						{
							var range_start= 2*s+1;
							if (! isNaN(item[range_start].qNum) && !isNaN(item[range_start+1].qNum)){
							series_array[s].x.push(item[range_start].qNum);
							series_array[s].y.push(item[range_start+1].qNum);
							series_array[s].text.push(item[0].qText);	
							}
								
						}
					
					
				 })
				
				 console.log(series_array);
				 //return data;
				return series_array
				}
			
				function render(data){
					
					Plotly.newPlot('myDiv', data, graph_layout,graph_layout_setting);
					document.getElementById('myDiv').on('plotly_click', function(e){
					var pts = '';
					var DimVal= e.points[0].text;
					//var SecondDimVal = e.points[0].text;
					self.$scope.makeSelection(qElemNumber[DimVal]);
					
					
				  });
				}
				


				
			},
			controller: ["$scope", "$element", function ( $scope ) {
				$scope.getPercent = function ( val ) {
					return Math.round( (val * 100 / $scope.layout.qHyperCube.qMeasureInfo[0].qMax) * 100 ) / 100;
				};
				
				
				$scope.lastrow = 0;
				
				$scope.selections = [];
				$scope.makeSelection = function (first){
					this.backendApi.selectValues(0,[first],true);
					//this.backendApi.selectValues(2,[second],true);
					
				}

				$scope.sel = function ( $event ) {
					if ( $event.currentTarget.hasAttribute( "data-row" ) ) {
						var row = parseInt( $event.currentTarget.getAttribute( "data-row" ), 10 ), dim = 0,
							cell = $scope.$parent.layout.qHyperCube.qDataPages[0].qMatrix[row][0];
						if ( cell.qIsNull !== true ) {
							cell.qState = (cell.qState === "S" ? "O" : "S");
							if ( $scope.selections.indexOf( cell.qElemNumber ) === -1 ) {
								$scope.selections.push( cell.qElemNumber );
							} else {
								$scope.selections.splice( $scope.selections.indexOf( cell.qElemNumber ), 1 );
							}
							$scope.selectValues( dim, [cell.qElemNumber], true );
						}
					}
				};
			}]
		};

	} );
