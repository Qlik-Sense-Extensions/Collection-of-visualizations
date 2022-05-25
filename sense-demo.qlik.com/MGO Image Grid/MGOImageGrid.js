/*globals define*/
define(["jquery","text!./MGOImageGrid.css"], 
function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 3,
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
					min : 1,
					max: 1

				},
				measures: {
					uses: "measures",
					min : 0,
					max: 2

				},
				sorting: {
					uses: "sorting"
				},
				externalimages: {
					label:"External Images",
					component: "expandable-items",
					items: {
					imageSource: {
						type:"items",
						label:"Image source",
						items: {
							imgSourceType : {
								ref: "qDef.IMGSRCTYPEMGO",
								type: "boolean",
								component: "buttongroup",
								label: "Location of image folder",
								options: [{
									value: true,
									label: "ONLINE",
									tooltip: "Use a web based folder"
								}, {
									value: false,
									label: "LOCAL",
									tooltip: "Use the predefined local folder"
								}],
								defaultValue: true
								},
							imgSourceFolder : {
								ref: "qDef.IMGSRCMGO",
								label: "Full URL to online image folder",
								type: "string",
								expression: "optional",
								defaultValue: "",
								show: function(layout) { return layout.qDef.IMGSRCTYPEMGO} 
								},
							imgSourceFolderLocal : {
								ref: "qDef.IMGSRCLOCALMGO",
								label: "Place your images folder here: >Qlik >Sense >Extensions >MGOImageGrid >Local_images",
								type: "string",
								expression: "optional",
								defaultValue: "folder name",
								show: function(layout) { if(layout.qDef.IMGSRCTYPEMGO == false){ return true } else { return false }} 
								}
							}
						},
					measureDisplay: {
						type:"items",
						label:"Measure display options",
						items: {
							measOverStyle : {
								ref: "qDef.IMGMEASDISPLAYSTYLE",
								type: "boolean",
								component: "buttongroup",
								label: "If a measure used, display as number or bar",
								options: [{
									value: true,
									label: "Bar",
									tooltip: "Display as bar"
								}, {
									value: false,
									label: "Number",
									tooltip: "Display as number"
								}],
								defaultValue: false
								},
							measColOne : {
								ref: "qDef.IMGMEASDISPLAYSTYLEBARCOL1",
								label: "Bar colour for 1st measure (HEX)",
								type: "string",
								expression: "optional",
								defaultValue: "FFF",
								show: function(layout) { return layout.qDef.IMGMEASDISPLAYSTYLE } 
								},
							measColtwo : {
								ref: "qDef.IMGMEASDISPLAYSTYLEBARCOL2",
								label: "Bar colour for 2nd measure (HEX)",
								type: "string",
								expression: "optional",
								defaultValue: "FFF",
								show: function(layout) { return layout.qDef.IMGMEASDISPLAYSTYLE } 
								}
							}
						},	

					imageStyling: {
						type:"items",
						label:"Image grid options",
						items: {
							imageClickAction : {
								ref: "qDef.IMGLINK",
								type: "boolean",
								component: "buttongroup",
								label: "Image action, select data or popup image in new window",
								options: [{
									value: true,
									label: "Select",
									tooltip: "Make selections on the field"
								}, {
									value: false,
									label: "Popup",
									tooltip: "Pop up the image in a new window"
								}],
								defaultValue: true
								},
							imageScalingGrid : {
								type: "string",
								component: "buttongroup",
								label: "Custom scaling options",
								ref: "qDef.IMGSCALEGRIDOPT",
								options: [{
									value: "a",
									label: "Always fit",
									tooltip: "Always fit image in grid cell"
								}, {
									value: "s",
									label: "Stretch",
									tooltip: "Stretch image to fit cell"
								}],
								defaultValue: "a",
								},
							customImageSize : {
								ref : "qDef.IMGSIZING",
								label : "Custom image size",
								type : "boolean",
								defaultValue : false
								},
							customImageWidth : {
								ref: "qDef.IMGWIDTH",
								label: "Image width (px)",
								type: "number",
								expression: "optional",
								defaultValue: 100,
								show: function(layout) { return layout.qDef.IMGSIZING} 
								},
							customImageHeight : {
								ref: "qDef.IMGHEIGHT",
								label: "Image height (px)",
								type: "number",
								expression: "optional",
								defaultValue: 100,
								show: function(layout) { return layout.qDef.IMGSIZING } 
								},
							customImageOpacity : {
								ref : "qDef.IMGOPACITY",
								label : "Custom image opacity",
								type : "boolean",
								defaultValue : false
								},
							customImageOpacityVal : {
								ref: "qDef.IMGOPACITYVAL",
								label: "Image opacity (range 1-100) %",
								type: "number",
								expression: "optional",
								defaultValue: 100,
								show: function(layout) { return layout.qDef.IMGOPACITY } 
								},
							customImageBGCol : {
								ref : "qDef.IMGOBGCOL",
								label : "Custom image background colour",
								type : "boolean",
								defaultValue : false
								},
							customImageBGColvalue : {
								ref: "qDef.IMGOBGCOLVAL",
								label: "Image border colour (HEX)",
								type: "string",
								expression: "optional",
								defaultValue: "FFF",
								show: function(layout) { return layout.qDef.IMGOBGCOL } 
								},
							imageBorder : {
								ref: "qDef.IMGBORDER",
								label: "Custom image border",
								type: "boolean",
								expression: "optional",
								defaultValue: 0
								},
							customImageBorderSize: {
								type: "number",
								component: "slider",
								label: "Image border",
								ref: "qDef.IMGBORDERDEFSIZE",
								min: 0,
								max: 20,
								step: 1,
								defaultValue: 0,
								show: function(layout) { return layout.qDef.IMGBORDER} 
								},
							customImageBorderCol : {
								ref: "qDef.IMGBORDERDEFCOL",
								label: "Image border colour (HEX)",
								type: "string",
								expression: "optional",
								defaultValue: "FFF",
								show: function(layout) { return layout.qDef.IMGBORDER } 
								}	

							}
						},
					singleimages: {
						type:"items",
						label:"Single image options",
						items: {
							singleImageDisplayHeader : {
								ref: "qDef.SINGLEIMGHEADER",
								label: "Display image name and link",
								type: "boolean",
								defaultValue: true
								},
							singleImageDisplay : {
								ref : "qDef.SINGLEIMGDISPLAY",
								label : "Scaling of image:",
								component: "switch",
								type : "boolean",
								options: [{
									value: true,
									label: "Auto"
								}, {
									value: false,
									label: "Custom"
								}],
								defaultValue: true
								},
							customSingleImageDisplay : {
								type: "string",
								component: "buttongroup",
								label: "Custom scaling options",
								ref: "qDef.SINGLEIMGDISPLAYOPT",
								options: [{
									value: "w",
									label: "Width",
									tooltip: "Fit to width"
								}, {
									value: "h",
									label: "Height",
									tooltip: "Fit to height"
								}, {
									value: "s",
									label: "Stretch",
									tooltip: "Stretch to fit"
								}],
								defaultValue: "w",
								show: function(layout) { if(layout.qDef.SINGLEIMGDISPLAY == false){ return true } else { return false } } 
								}
							}
						},
					imageDisplayLimit: {
						type:"items",
						label:"Limit display and loading",
						items: {
					
							customImagePaging : {
								ref : "qDef.IMGPAGING",
								label : "Use custom limit for number of images to initiallly display",
								type : "boolean",
								defaultValue : false
								},
							initFetchRows : {
								ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
								label : "No. of images to initially display",
								type : "number",
								defaultValue : 100,
								show: function(layout) { return layout.qDef.IMGPAGING } 
								}

							}
						}			
					}

				},
				settings: {
					uses: "settings"				
				}
				
			}		
		},
		snapshot: {
			canTakeSnapshot: true
		},
		
		paint: function ( $element,layout ) {
			var html = "", self = this, lastrow = 0, morebutton = false, imgSelectType = layout.qDef.IMGLINK, rowcount = this.backendApi.getRowCount(), imgFolderLocation = "", qData = layout.qHyperCube.qDataPages[0], mymeasureCount = layout.qHyperCube.qMeasureInfo.length, imageOpacity = 100, measBarCol1 = "FFF", measBarCol2="FFF", measBarHeight=10,  imgScaleSingle = "mgoImgScaleFit", imgBGCol = "FFF", imgBorderCol = "FFF", imgBorderSize = 0, imgCHeight = 100, imgCWidth = 100, imgScaleGrid = "mgoImgScaleFit";
			

			//local or online image source
				if(layout.qDef.IMGSRCTYPEMGO){
					imgFolderLocation = layout.qDef.IMGSRCMGO; 
				} else {
					imgFolderLocation = "/Extensions/MGOImageGrid/Local_images/" + layout.qDef.IMGSRCLOCALMGO + "/";
				};

			//Set up grid image scale
				if(layout.qDef.IMGSIZING){
					imgCHeight=layout.qDef.IMGHEIGHT;
					imgCWidth=layout.qDef.IMGWIDTH;
				} else {
					imgCHeight=100;
					imgCWidth=100;
				};	

			//Set up grid image scaling
				if(layout.qDef.IMGSCALEGRIDOPT=="s"){
					imgScaleGrid = "mgoImgScaleStretch";
				} else {
					imgScaleGrid = "mgoImgScaleFit";
				};
			
			//set up image opcaity value
			if(layout.qDef.IMGOPACITY){
					imageOpacity = (layout.qDef.IMGOPACITYVAL / 100); 
				} else {
					imageOpacity = 100;
				};
			
			//set up measure bar size
			if(imgCHeight > 20){
					measBarHeight = 10; 
				} else {
					measBarHeight = 3;
				};
			
			//set up BG and Borders
			if(layout.qDef.IMGBORDER){
				imgBorderSize = layout.qDef.IMGBORDERDEFSIZE;
				imgBorderCol = layout.qDef.IMGBORDERDEFCOL;
			} else {
				imgBorderSize = 0;
				imgBorderCol = "FFF";
			};
			if(layout.qDef.IMGOBGCOL){
				imgBGCol = layout.qDef.IMGOBGCOLVAL;
			} else {
				imgBGCol = "FFF";
			};

			//Set up single image scaling
			if(layout.qDef.SINGLEIMGDISPLAY){
				imgScaleSingle = "mgoImgScaleFit";
			} else {
				if(layout.qDef.SINGLEIMGDISPLAYOPT == "w"){
					imgScaleSingle = "mgoImgScaleFitWidth";
				} else if (layout.qDef.SINGLEIMGDISPLAYOPT == "h"){
					imgScaleSingle = "mgoImgScaleFitHeight";
				} else {
					imgScaleSingle = "mgoImgScaleStretch";
				};
			};

			
			var parentscope = angular.element($element).scope().$parent.$parent;
			$element.html(parentscope.editmode ? 'In Edit Mode' : 'Not in Edit mode');
		
			//render data
				$.each(qData.qMatrix, function ( key, row  ) {
					var dim = row[0], meas1 = row[1], meas2 = row[2];
					lastrow = key;
					//Check count and choose Grid or Single pic layout
					if(rowcount > 1){
						//GRID LAYOUT
						//Check if popup or selectable
						if(!layout.qDef.IMGLINK){
							//if pop up add link
							if(parentscope.editmode){
								//disable pop up in edit mode
								html += '<span class="mgoPopinEdit">';
							} else {
								html += '<a href="' + imgFolderLocation + dim.qText + '" target="blank" class="mgotooltip">';
							};
							
							//render image
							html += '<span class="mgoPicGrid '+imgScaleGrid+'" style="height:' + imgCHeight + 'px; width:' + imgCWidth + 'px; background-image: url(' + imgFolderLocation + dim.qText + '); background-color: #' + imgBGCol +'; border-bottom: '+ imgBorderSize + 'px solid #' + imgBorderCol +'; border-right: '+ imgBorderSize + 'px solid #' + imgBorderCol +'; opacity: '+ imageOpacity +';">';
							html += '</span>';
						
							//check if measure added
							if(mymeasureCount==1){
								// For 1 measure
								
								// render measure
								// check style
								if(!layout.qDef.IMGMEASDISPLAYSTYLE){
									//number
									html += '<span class="mgoMeasureSingle" style="width:' + (imgCWidth-4) + 'px; height:' + (imgCHeight-4) + 'px; margin-left: -'+(imgCWidth+imgBorderSize)+'px;">'+ layout.qHyperCube.qMeasureInfo[0].qFallbackTitle +': '+ meas1.qNum+'</span>';
									
								} else {
									//bar
									//set if thresholds
									var meas1Max = layout.qHyperCube.qMeasureInfo[0].qMax;
									var meas1Factor = (imgCWidth - 10)/meas1Max;
									var meas1barw = Math.floor(meas1.qNum*meas1Factor);
									measBarCol1 = layout.qDef.IMGMEASDISPLAYSTYLEBARCOL1;
									html += '<span class="mgoMeasureSingleBar" style="margin-top: 0px; margin-left: -'+(imgCWidth+imgBorderSize)+'px; height:'+measBarHeight+'px; width:'+meas1barw+'px; background-color:#'+measBarCol1+';"><br></span>';
									
								};
							} else if(mymeasureCount==2){
									// For 2 measures
									// render measure
									// check style
									if(!layout.qDef.IMGMEASDISPLAYSTYLE){
										//number
										html += '<span class="mgoMeasureSingle" style="width:' + (imgCWidth-4) + 'px; height:' + (imgCHeight-4) + 'px; margin-left: -'+(imgCWidth+imgBorderSize)+'px;"> '+ layout.qHyperCube.qMeasureInfo[0].qFallbackTitle +': '+ meas1.qNum+'<br> '+ layout.qHyperCube.qMeasureInfo[1].qFallbackTitle +': '+ meas2.qNum+'</span>';
										
									} else {
										//bar
										//set if thresholds
										var meas1Max = layout.qHyperCube.qMeasureInfo[0].qMax;
										var meas1Factor = (imgCWidth - 10)/meas1Max;
										var meas1barw = Math.floor(meas1.qNum*meas1Factor);
										measBarCol1 = layout.qDef.IMGMEASDISPLAYSTYLEBARCOL1;
										var meas2Max = layout.qHyperCube.qMeasureInfo[1].qMax;
										var meas2Factor = (imgCWidth - 10)/meas2Max;
										var meas2barw = Math.floor(meas2.qNum*meas2Factor);
										measBarCol2 = layout.qDef.IMGMEASDISPLAYSTYLEBARCOL2;
										html += '<span class="mgoMeasureSingleBar" style="margin-top: 0px; margin-left: -'+(imgCWidth+imgBorderSize)+'px; height:'+measBarHeight+'px; width:'+meas1barw+'px; background-color:#'+measBarCol1+';"><br></span>';
										html += '<span class="mgoMeasureSingleBar" style="margin-top: 11px; margin-left: -'+(imgCWidth+imgBorderSize)+'px; height:'+measBarHeight+'px; width:'+meas2barw+'px; background-color:#'+measBarCol2+';"><br></span>';
										
									};
									
				
							};




							//Open in new window overlay
							html += '<span class="mgoimghoversm" style="margin-left:-'+ (24 + imgBorderSize) +'px;"><span style="font-family: QlikView Icons; font-size: 22px;">w</span></span>';
							
							if(parentscope.editmode){
								//close element for pop up in edit mode
								html += '</span>';
							} else {
								html += '</a>';
							};
							
						
						} else {
							//render selectable image
							html += '<span class="selectable" data-value="'+ dim.qElemNumber + '">';
							// render image 
								html += '<span class="mgoPicGrid '+imgScaleGrid+'" style="height:' + imgCHeight + 'px; width:' + imgCWidth + 'px; background-image: url(' + imgFolderLocation + dim.qText + '); background-color: #' + imgBGCol +'; border-bottom: '+ imgBorderSize + 'px solid #' + imgBorderCol +'; border-right: '+ imgBorderSize + 'px solid #' + imgBorderCol +'; opacity: '+ imageOpacity +';">';
								html += '</span>';
							

							//check if measure added
							if(mymeasureCount==1){
								// For 1 measure
								
								// render measure
								// check style
								if(!layout.qDef.IMGMEASDISPLAYSTYLE){
									//number
									html += '<span class="mgoMeasureSingle" style="width:' + (imgCWidth-4) + 'px; height:' + (imgCHeight-4) + 'px; margin-left: -'+(imgCWidth+imgBorderSize)+'px;">'+ layout.qHyperCube.qMeasureInfo[0].qFallbackTitle +': '+ meas1.qNum+'</span>';
									html += '</span>';
								} else {
									//bar
									//set if thresholds
									var meas1Max = layout.qHyperCube.qMeasureInfo[0].qMax;
									var meas1Factor = (imgCWidth - 10)/meas1Max;
									var meas1barw = Math.floor(meas1.qNum*meas1Factor);
									measBarCol1 = layout.qDef.IMGMEASDISPLAYSTYLEBARCOL1;
									html += '<span class="mgoMeasureSingleBar" style="margin-top: 0px; margin-left: -'+(imgCWidth+imgBorderSize)+'px; height:'+measBarHeight+'px; width:'+meas1barw+'px; background-color:#'+measBarCol1+';"><br></span>';
									
								};
							} else if(mymeasureCount==2){
									// For 2 measures
									// render measure
									// check style
									if(!layout.qDef.IMGMEASDISPLAYSTYLE){
										//number
										html += '<span class="mgoMeasureSingle" style="width:' + (imgCWidth-4) + 'px; height:' + (imgCHeight-4) + 'px; margin-left: -'+(imgCWidth+imgBorderSize)+'px;">'+ layout.qHyperCube.qMeasureInfo[0].qFallbackTitle +': '+ meas1.qNum+'<br>'+ layout.qHyperCube.qMeasureInfo[1].qFallbackTitle +': '+ meas2.qNum+'</span>';
										html += '</span>';
									} else {
										//bar
										//set if thresholds
										var meas1Max = layout.qHyperCube.qMeasureInfo[0].qMax;
										var meas1Factor = (imgCWidth - 10)/meas1Max;
										var meas1barw = Math.floor(meas1.qNum*meas1Factor);
										measBarCol1 = layout.qDef.IMGMEASDISPLAYSTYLEBARCOL1;
										var meas2Max = layout.qHyperCube.qMeasureInfo[1].qMax;
										var meas2Factor = (imgCWidth - 10)/meas2Max;
										var meas2barw = Math.floor(meas2.qNum*meas2Factor);
										measBarCol2 = layout.qDef.IMGMEASDISPLAYSTYLEBARCOL2;
										html += '<span class="mgoMeasureSingleBar" style="margin-top: 0px; margin-left: -'+(imgCWidth+imgBorderSize)+'px; height:'+measBarHeight+'px; width:'+meas1barw+'px; background-color:#'+measBarCol1+';"><br></span>';
										html += '<span class="mgoMeasureSingleBar" style="margin-top: 11px; margin-left: -'+(imgCWidth+imgBorderSize)+'px; height:'+measBarHeight+'px; width:'+meas2barw+'px; background-color:#'+measBarCol2+';"><br></span>';
										
									};
									html += '</span>';
				
							};
							
							html += '</span>';

						};

					
					} else { 
						//SINGLE PIC (based on selection not load limitation)
						// render image 
						html += '<div class="mgoSinglePic '+imgScaleSingle+'" style="background-image: url(' + imgFolderLocation + dim.qText + ');background-color: #' + imgBGCol +';">';
						
						//check if measure added
							if(mymeasureCount==1){
								// For 1 measure
								
								// render measure
								html += '<span class="mgoMeasureSinglePic" style="height:auto; margin-left: 0px;">'+ layout.qHyperCube.qMeasureInfo[0].qFallbackTitle +': '+ meas1.qNum+'</span>';
								
								
							} else if(mymeasureCount==2){
								// For 2 measures
								// render measure
									
								html += '<span class="mgoMeasureSinglePic" style="height:auto; margin-left: 0px;">'+ layout.qHyperCube.qMeasureInfo[0].qFallbackTitle +': '+ meas1.qNum+'<br>'+ layout.qHyperCube.qMeasureInfo[1].qFallbackTitle +': '+ meas2.qNum+'</span>';
								
				
							};


						//Show header
						if(layout.qDef.SINGLEIMGHEADER){
							html += '<div class="mgoHeader"><a href="' + imgFolderLocation + dim.qText + '" target="blank"> <span style="font-family: QlikView Icons; font-size: 20px;">w</span> ' + dim.qText + '</a></div>';
						};
						html += '</div>';

						
						
					}					

					
					

				} );
			
			
			//add 'more...' button
			if(this.backendApi.getRowCount() > lastrow + 1) {
				//if(layout.qDef.IMGPAGINGTOG){
				//	html += '<br>' + '<button id="more" class="qui-outlinebutton qv-pt-meta-button ng-scope" style="margin:4px 0px">' + (lastrow + 1) + ' of ' + this.backendApi.getRowCount() + ' - Load More</button>';	
				//	morebutton = true;
				//} else {
					html += '<br>' + '<div style="font-size:12px; color:#AAA; margin:4px 0px">Display limited to first ' + (lastrow + 1) + ' of ' + this.backendApi.getRowCount() + ' images</div>';
				//};
				

			}
			
			$element.html( html );
			
			if(morebutton) {
				var requestPage = [{
					qTop : lastrow + 1,
					qLeft : 0,
					qWidth : 3, //should be # of columns
					qHeight : Math.min(50, this.backendApi.getRowCount() - lastrow)
				}];
				$element.find("#more").on("qv-activate", function() {
					self.backendApi.getData(requestPage).then(function(dataPages) {
						self.paint($element, layout);
					});
				});
			}			
			
			// selections
			$element.find('.selectable').on('qv-activate', function() {
				if(this.hasAttribute("data-value")) {
					var value = parseInt(this.getAttribute("data-value"), 10), dim = 0;
						self.selectValues(dim, [value], true);
						$(this).toggleClass("selected");
				}
			});
			
			
		}
		
	};
} );
