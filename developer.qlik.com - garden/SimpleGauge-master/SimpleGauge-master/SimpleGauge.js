define( [
	"qlik",
	"css!./css/style.css",
	"./js/progressbar",
	"./Properties"
],
function ( qlik, style,ProgressBar,properties ) {
	'use strict';	
	$( '<https://fonts.googleapis.com/css?family=Raleway:400,300,600,800,900" rel="stylesheet" type="text/css">' ).appendTo( "head" );
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 5,
					qHeight : 1
				}]
			},			
		},
		definition: properties,
		support: {
			export: true,
			exportData: true,
			snapshot: true
		},
		
		resize: function ( $element, layout ) {
			render( $element, layout );			
		},

		paint: function ( $element, layout) {
			var qTitleMatrix = new Array();		
			var qTextColorMatrix = new Array();		//measure		
			var qColorMatrix = new Array();			//background
			var qLabelColorMatrix = new Array();	//label
			var qSizeMatrix = new Array();
			var qAlignMatrix = new Array();
			var qFontMatrix = new Array();
			
			// the measures properties values			
			layout.qHyperCube.qMeasureInfo.forEach(function (measure) {
         		qTitleMatrix.push(measure.qFallbackTitle);
         		//label
         		if(measure.meascolorlabelbool){
         			qLabelColorMatrix.push(measure.meascolorlabelcustom);
         		}else{
         			qLabelColorMatrix.push(measure.meascolorlabelsingle.color);
         		}
         		//measure
         		if(measure.meascolormeasurebool){
         			qTextColorMatrix.push(measure.meascolormeasurecustom);
         		}else{
         			qTextColorMatrix.push(measure.meascolormeasuresingle.color);
         		}
         		//background
         		if(measure.meascolorbackbool){
         			qColorMatrix.push(measure.meascolorbackcustom);
         		}else{
         			qColorMatrix.push(measure.meascolorbacksingle.color);
         		}
         	
         		qSizeMatrix.push(measure.meassize);
         		qAlignMatrix.push(measure.measalign);
         		qFontMatrix.push(measure.measfont);
         	})
			var qVal    = layout.qHyperCube.qGrandTotalRow[0].qNum;
            var qTxt    = layout.qHyperCube.qGrandTotalRow[0].qText;   
            var vExtraText = layout.extrattext;     
            
            var vddd = new Date();
			var vnnn = vddd.getTime();
			var vrrr = vnnn.toString();
			var vSufixId = vrrr.substr(vrrr.length - 5);
			var vContainerId = 'container_' + vSufixId;

            var compareMaxVal = 80;
            if(layout.extratbool){
            	qTxt += '  ' + vExtraText;
            	compareMaxVal = 60;
            }    
            var qTitle  = qTitleMatrix[0];   
            var qFont   = qFontMatrix[0];
                        
            var gaugeType = layout.gaugetype;
            var showMeasTitle = layout.showmeastitle;
            var minVal = layout.minValue;
            var maxVal = layout.maxValue;	  
            var animeSecs = layout.animeSecs + 's';
            var animeMiliSecs = layout.animeSecs * 1000;
            var backgroundcolor  = qColorMatrix[0];
            var textcolor = qTextColorMatrix[0];
            var labelcolor = qLabelColorMatrix[0];            
           
            var qBorderBool = layout.borderbool;
            var qBorderColor = layout.bordercolor.color;
            var qBorderWidth = layout.borderwidth + 'px';
            var qBackgroundBox = 'transparent';

            if(!layout.backgroundbool){
            	qBackgroundBox = layout.backgroundcolorbox.color;
            }
            if(!qBorderBool){
            	qBorderWidth = 0;
            }
            // the css dynamic values
            var cssWidth = ((qVal - minVal) / (maxVal-minVal))*100;
            if(minVal < 0) {
            	cssWidth = Math.round(((maxVal + qVal) / (Math.abs(minVal) + maxVal))*100);            	
            }	
            
            var cssRadius = '20px 20px 20px 0px';
            var cssMarginLeft = '10px';
            var cssAMarginLeft = '20px';
            var cssMaxWidth = '50px';
            if(qTxt.length > 4){
            	cssMaxWidth = qTxt.length * 13 + 'px';
            }              
            if(cssWidth>compareMaxVal){
            	if(cssWidth>100){ 
            		cssWidth = 100;
            	}
            	cssRadius = '20px 20px 0px 20px';	            	
            	switch ( true ) {
					case (qTxt.length<5):
						cssMarginLeft  = '-50px';
						cssAMarginLeft = '-45px';
						cssMaxWidth = qTxt.length * 13 + 'px';
						break;
					case (qTxt.length==5):
						cssMarginLeft  = '-65px';
						cssAMarginLeft = '-55px';
						cssMaxWidth = qTxt.length * 13 + 'px';
						break;
					case (qTxt.length==6):
						cssMarginLeft  = '-80px';
						cssAMarginLeft = '-65px';
						cssMaxWidth = qTxt.length * 13 + 'px';
						break;
					case (qTxt.length>6 && qTxt.length<11):
						cssMarginLeft  = '-100px';
						cssAMarginLeft = '-85px';
						cssMaxWidth = qTxt.length * 13 + 'px';
						break;
					case (qTxt.length>10):
						cssMarginLeft  = '-120px';
						cssAMarginLeft = '-105px';
						cssMaxWidth = qTxt.length * 10 + 'px';						
						break;
				}
            }else{
            	if(isNaN(cssWidth) || cssWidth < minVal){
            		cssWidth = 0;
            	}
            }
            
            /* The visualization */
            var vPadding = '0px'
            if(gaugeType == 'line'){
            	vPadding = '40px 40px 20px 0px'
            }
            //Navigation
            var vSideTitle,vSideCursor;
            switch (layout.gaugenavbool){
     			case 'none':
     				vSideTitle = 'No navigation';
     				vSideCursor = '';
     			break;

     			case 'sheet':
     				vSideTitle = layout.gaugesheetid;		         				
     				vSideCursor = 'SimpleGauge-cursor-sheet';
     			break;

     			case 'url':
     				vSideTitle = layout.gaugenavurl;
     				vSideCursor = 'SimpleGauge-cursor-url';
     			break;

     			default:
     				vSideTitle ='No navigation';
     				vSideCursor = '';
     			break;
     		}
            var html = 
            '<div qv-extension style = "width:100%;height:100%">' +
				'<div class="SimpleGauge-box ' + vSideCursor + '" style = "padding:' + vPadding + ';--my-border-width:' + qBorderWidth + ';--my-border-color:' + qBorderColor + ';background:' + qBackgroundBox +'" title = "' + vSideTitle + '">';
				if(gaugeType == 'line' || !gaugeType){
					html += '<div class="SimpleGauge-container-line">' +
						'<div class="SimpleGauge SimpleGauge-color" style = "--my-anime-secs:' + animeSecs + ';--my-anime-width:' + cssWidth + '%;--my-max-width: ' + cssMaxWidth + ';--my-color-var: ' + backgroundcolor + ';color:' + textcolor + ';--my-border-radius:' + cssRadius + ';--my-margin-left: ' + cssMarginLeft + ' ">' +
							'<a class="SimpleGauge-a SimpleGauge-font-m" style = "--my-a-margin-left: ' + cssAMarginLeft + ';--my-anime-secs: ' + animeSecs + ';font-family:' + qFont + '">' + qTxt + '</a>' +
						'</div>' +							
					'</div>';
					if(showMeasTitle){
						html += '<div class="SimpleGauge-content">' +
	                        '<h5 class="SimpleGauge-title ' + qSizeMatrix[0] +'" style = "font-family:' + qFont + ';--my-color-var: ' + qLabelColorMatrix[0] + '">' + qTitle + '</h5>' +
                    	'</div>';
                    }
				}else{
					html += '<div id="' + vContainerId + '" class = "SimpleGauge-container-circle"></div>';					
				}
					
            
            if(qSizeMatrix.length > 1){
				var txtval1 = layout.qHyperCube.qGrandTotalRow[1].qText;				

            	html += '<table class="SimpleGauge-table">' +                     
				'<tr class="tr-first ' + qSizeMatrix[1] + '">' +
					'<td style = "font-family:' + qFontMatrix[1] + ';color:' + qLabelColorMatrix[1] + '">' + qTitleMatrix[1] +'</td>' +
					'<td style = "font-family:' + qFontMatrix[1] + ';text-align:' + qAlignMatrix[1] + ';color:' + qTextColorMatrix[1] + '">' + txtval1 + '</td>' +
				'</tr>';
				
				if(qSizeMatrix.length > 2){		
					var txtval2 = layout.qHyperCube.qGrandTotalRow[2].qText;					
					html += '<tr class="tr-second ' + qSizeMatrix[2] + '">' +
						'<td style = "font-family:' + qFontMatrix[2] + ';color:' + qLabelColorMatrix[2] + '">' + qTitleMatrix[2] +'</td>' +
						'<td style = "font-family:' + qFontMatrix[2] + ';text-align:' + qAlignMatrix[2] + ';color:' + qTextColorMatrix[2] + '">' + txtval2 + '</td>' +
					'</tr>';											
				}

				if(qSizeMatrix.length > 3){		
					var txtval3 = layout.qHyperCube.qGrandTotalRow[3].qText;					
					html += '<tr class="tr-second ' + qSizeMatrix[3]  + '" style = "font-family:' + qFontMatrix[3] + '">' +
						'<td style = "font-family:' + qFontMatrix[3] + ';color:' + qLabelColorMatrix[3] + '">' + qTitleMatrix[3] +'</td>' +
						'<td style = "font-family:' + qFontMatrix[3] + ';text-align:' + qAlignMatrix[3] + ';color:' + qTextColorMatrix[3] + '">' + txtval3 + '</td>' +
					'</tr>';											
				}

				if(qSizeMatrix.length > 4){		
					var txtval4 = layout.qHyperCube.qGrandTotalRow[4].qText;					
					html += '<tr class="tr-second ' + qSizeMatrix[4] + '" style = "font-family:' + qFontMatrix[4] + '">' +
						'<td style = "font-family:' + qFontMatrix[4] + ';color:' + qLabelColorMatrix[4] + '">' + qTitleMatrix[4] +'</td>' +
						'<td style = "font-family:' + qFontMatrix[4] + ';text-align:' + qAlignMatrix[4] + ';color:' + qTextColorMatrix[4] + '">' + txtval4 + '</td>' +
					'</tr>';											
				}
				html += '</table>';
			}
			if(layout.extrapbool){
            	html += '<p class = "SimpleGauge-division"></p><p style = "margin: 10px 0px;"><a class="SimpleGauge-footer ' + layout.extrapsize + '" style = "color:' + layout.extrapcolor.color +';font-family:' + layout.extrapfont +'">' + layout.extraptext + '</a></p>';
            }
			html += '</div></div>';
			
			$element.html(html);	
			
			if(gaugeType == 'circle'){
				// progressbar.js@1.0.0 version is used
				// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/
				var vContainerWidth = document.getElementById(vContainerId).clientWidth;
				var container = document.getElementById(vContainerId);
				var bar = new ProgressBar.Circle(container, {
					color: qTextColorMatrix[0],
					// This has to be the same size as the maximum width to
					// prevent clipping
					strokeWidth: 4,
					trailWidth: 3.5,
					easing: 'easeInOut',
					duration: animeMiliSecs,
					text: {
						autoStyleContainer: false
					},
					from: { color: backgroundcolor, width: 4 },
					to: { color: backgroundcolor, width: 4 },
					// Set default step function for all animate calls
					step: function(state, circle) {
					    circle.path.setAttribute('stroke', state.color);
					    circle.path.setAttribute('stroke-width', state.width);
					    circle.setText(qTxt);
					}
				});
				bar.text.style.fontFamily = qFont;
				bar.text.style.fontSize = '2.0vw';//"400%";//(vContainerWidth / 5) + 'px';
				var topRound = qVal / maxVal;
				if(qVal > maxVal){
					topRound = 1;
				}else{
					if(qVal < 0){
						topRound = 0;
					}
				}
				bar.animate(topRound);
			}
			$('.SimpleGauge-cursor-sheet').on('click', function(event){
				if(qlik.navigation.getMode() == 'analysis' || qlik.navigation.getMode() == 'play'){
					qlik.navigation.gotoSheet(this.title);
				}
			})
			//navigate to a url, open a new tab
			$('.SimpleGauge-cursor-url').on('click', function(event){
				if((qlik.navigation.getMode() == 'analysis' || qlik.navigation.getMode() == 'play') && this.title != 'undefined'){
					window.open(this.title);
				}
			})
		}
	};
});