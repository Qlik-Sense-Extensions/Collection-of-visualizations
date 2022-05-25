define( [ "qlik",
          "text!./css/PopupMessage.css",
          "text!./css/styles.css",
		  "./properties",
		  'angular'
],
function ( qlik, cssContent, cssButton, props, angular) {
	'use strict';
	$("<style>").html(cssContent).appendTo("head");
	$("<style>").html(cssButton).appendTo("head");

	function getNumber(obj) {

		var Result = (obj.qContent).qString;

		return Result;
	};

	function isEmpty(obj) {
		return (obj === null || obj === undefined || obj === '' || obj.length ===0);	
	};

	function cleanVariable(obj) {
		return obj.replace('"', '').replace('"', '');
	}
	/**
	 * Functopm courtesy of Stefan Wather: Githun - sense-extension-reciper
	 *
	 * Usage of backendApi.setProperties.
	 * @description Note that this is only possible if you first retrieve the properties using
	 * backendApi.getProperties()
	 */
	function useSetProperties($scope, val) {

		// var val = '=' + $scope.layout.myproperties.myVarKPI; //Hello World'; // $( '#' + $scope.layout.qInfo.qId + '_text1' ).val();
		var current = $scope.layout.myproperties.myOldKPIvalue;
					
		if(val != current) {

			$scope.backendApi.getProperties()
				.then( function ( reply ) {
					reply.myproperties.myOldKPIvalue = val;
					$scope.backendApi.setProperties( reply )
						.then( function ( reply ) {
							// console.log( 'useSetProperties.setProperties -> promise', reply );
							angular.noop();
						} );
				} );
		}
	};

	function parseJSON (obj) {

		var result = 0;
		var s1 = obj.split(':{');
		var s2 = s1[1];
		var s3 = s2.split(',');

		if(s3[0].indexOf("qString") > 0) {
			var r = s3[0].split(':');
			result = r[1];
		} else {
			var r = s3[1].split(':');
			result = r[1];
		}
		s1 = undefined;
		s2 = undefined;
		s3 = undefined;
		r  = undefined;

		return result;
	};

	function getVariableValue($scope, ext, name) {
		
		var app    = qlik.currApp(ext);
		var result = app.variable.getContent(name, function(reply) {
			// alert(JSON.stringify(reply));
			var json  = JSON.stringify(reply);
			result    = parseJSON(json);

			// Stefan Walther's suggestion

			useSetProperties($scope, result);
			return (JSON.stringify(reply));
		});

		app = undefined;
		// delete(app);

		return result;
	};

	function setVariableValue(ext, name, value) {

		var app = qlik.currApp(ext);

		if( isNaN(value) ) {
			app.variable.setStringValue(name, value);
		} else {
			// it did not work with setNumValue() ???
			app.variable.setStringValue(name, value.toString());
		}

		app = undefined;
		// delete(app);
	};

	return {
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		definition: props,

		paint: function ($element, layout) {

			var $scope     = this.$scope;
			var myRefresh  = false;
			var myEditMode = this._inEditState;

			if(this.selectionsEnabled || (this._interactionState === 2 && this.selectionsEnabled === undefined)) {
				myRefresh = true;
			}

			if ( this.selectionsEnabled ) {
				// Selection  Enabled === true
				// this is run-time mode
				//
				$element.find( '.selectable' ).on( 'qv-activate', function () {
					if ( this.hasAttribute( "data-value" ) ) {
						var value = parseInt( this.getAttribute( "data-value" ), 10 ), dim = 0;
						self.selectValues( dim, [value], true );
						$( this ).toggleClass( "selected" );
					}
				} );
			}

			if(myRefresh === true) {
				
			    // ##############################################################
			    // If current KPI and previous KPI are the same we do not show a
			    // popup message regardless of the Limit Expression result,
			    // because nothing happened between calls to the Extension.
			    // ##############################################################

			    //add your rendering code here
			    // console.log('My Layout');
			    // console.log(layout);

			    // console.log('This');
			    // console.log(this);
			    // console.log('Element');
			    // console.log($element);

			    // console.log('Qlik');
			    // console.log(qlik);

			    // Interaction-State:
			    //    1 - Run Time
			    //    2 - Edit Mode

			    // Selection Enabled
			    //    true  - Run Time
			    //    false - Edit Mode

			    // initializing some variables
			    var myqInfoqId     = layout.qInfo.qId;
			    var myTarget       = '';
			    var myLabel        = '';
			    var myLimit        = false;
			    var myShowPrompt   = false;
			    var myKPIcurrent   = 0;
			    
			    var myKPIPrevious  = 0;
			    var myKPIwork      = 0;
			    
			    var myOldKPIvar    = '';
			    var myVarKPIText   = '';
			    var myVarLastCheck = '';
			    var myKPIchanged   = false;
			    var myFlagShowCustom = false;
			    var myFlagShowIFrame = false;
            
                var myContentMessage     = '';
                var myHeaderMessage      = '';
                var myPromptMessage      = '';
                var myWorkingFineMessage = '';		

                var myModalHeader  = '';
                var myModalFooter  = '';
                var myTopLowerBG   = '';
                var myTopLowerFG   = '';

                var myPopupStyle   = 'b';
                var myRenderPanels = '';
                var myRenderSeq    = '';

			    var today     = new Date();
			    var date      = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
			    var time      = String(today.getHours()).padStart(2,'0') + ":" + String(today.getMinutes()).padStart(2,'0') + ":" + String(today.getSeconds()).padStart(2,'0');
			    var myRunTime = String(date)+' '+String(time);


			    var myPopupId  = 'myPopup' + myqInfoqId.trim();
			    var myPopupFn  = 'myPopupFunction("' + myPopupId.trim() + '")';
			    var myIFrameId = 'myIframe' + myqInfoqId.trim();

			    // Get Current KPI
			    if(isEmpty(layout.myproperties.myKPIcurrent)) {
				    myKPIcurrent = 0;
			    } else {
				    myKPIcurrent = layout.myproperties.myKPIcurrent;
			    }

			    // Get Previous KPI
			    //  - note if the variable is not available we do not compare
			    //    with the previous KPI

			    if(isEmpty(layout.myproperties.myOldKPIvar)) {
				    myOldKPIvar  = '';
				    myKPIchanged = true;
			    } else {

				    myOldKPIvar = layout.myproperties.myOldKPIvar;
				    // getting my previous KPI figure
					if(isEmpty(myOldKPIvar)) {

						myKPIPrevious=0;

					} else {

				    	myKPIPrevious = getVariableValue($scope, this, myOldKPIvar);

				    	if(isEmpty(layout.myproperties.myOldKPIvalue)) {

				    		myKPIPrevious = 0;

				    	} else {
				    		myKPIPrevious = layout.myproperties.myOldKPIvalue;
				    		myKPIPrevious = cleanVariable(myKPIPrevious);
				    		myKPIPrevious = parseFloat(myKPIPrevious);

				    	}
				    }

				    myKPIcurrent = parseFloat(myKPIcurrent);
				    myKPIchanged = !(myKPIcurrent === myKPIPrevious);


				    if(myKPIchanged === true && !myEditMode) {

					    setVariableValue(this, myOldKPIvar, myKPIcurrent);
				    }
			    }

			    // Get Last Check Variable, if present we return the last time
			    // this Extension returned an action
			    if(isEmpty(layout.myproperties.myLastCheck)) {
				    myVarLastCheck = '';
			    } else {
				    myVarLastCheck = layout.myproperties.myLastCheck;
			    }

			    // Do we break the Limit?
			    if(isEmpty(layout.myproperties.myLimit)) {
				    myLimit = false;
			    } else {
				    if(layout.myproperties.myLimit === '-1' ||
				       layout.myproperties.myLimit === '1') {
					    myLimit = true;
				    }
			    }
			    // Do we show prompt?
			    if(isEmpty(layout.myproperties.myShowPrompt)) {
				    myShowPrompt = false;
			    } else {
				    if(layout.myproperties.myShowPrompt === true) {
					    myShowPrompt = true;
				    }
			    }

                // Get Prompt Message
                if(isEmpty(layout.myproperties.myPromptMessage)) {
                    myPromptMessage      = '';
                } else {
                    myPromptMessage      = layout.myproperties.myPromptMessage;
                }

			    // My Prompt Label!
			    if(isEmpty(layout.myproperties.myButtonLabel)) {
				    myLabel = myPromptMessage;
			    } else {
				    myLabel  = layout.myproperties.myButtonLabel;
			    }
			    // Get IFrame content
			    if(isEmpty(layout.myproperties.myContent)) {
				    myTarget = '';
			    } else {
				    myTarget = layout.myproperties.myContent;
				    if(myTarget.length > 0) {
					    myFlagShowIFrame = true;
				    }
			    }
                // Get Content Message
                if(isEmpty(layout.myproperties.myContentMessage)) {
                    myContentMessage = '';
                } else {
                    myContentMessage = layout.myproperties.myContentMessage;
                    myFlagShowCustom = true;
                }
                // Get Header Message            
                if(isEmpty(layout.myproperties.myHeaderMessage)) {
                    myHeaderMessage      = '';
                } else {
                    myHeaderMessage      = layout.myproperties.myHeaderMessage;
                }

                // Get Working Fine Message
                if(isEmpty(layout.myproperties.myWorkingFineMessage)) {
                    myWorkingFineMessage = '';
                } else {
                    myWorkingFineMessage = layout.myproperties.myWorkingFineMessage;
                }			

                // Get Modal Header
                if(isEmpty(layout.myproperties.myModalHeader)) {
            	    myModalHeader = '';
                } else {
            	    myModalHeader = layout.myproperties.myModalHeader;
                }

                // Get Modal Footer
                if(isEmpty(layout.myproperties.myModalFooter)) {
            	    myModalFooter = '';
                } else {
            	    myModalFooter = layout.myproperties.myModalFooter;
                }

                // Get Header-Footer Background
                if(isEmpty(layout.myproperties.myBGColour)) {
            	    myTopLowerBG = '';
                } else {
            	    myTopLowerBG = layout.myproperties.myBGColour;
                }

                // Get Header-Footer Foreground            
                if(isEmpty(layout.myproperties.myFGColour)) {
            	    myTopLowerFG = '';
                } else {
            	    myTopLowerFG = layout.myproperties.myFGColour;
                }

			    // initializing additional variables
			    myPopupStyle      = layout.myproperties.myPopupStyle;
			    myRenderPanels    = layout.myproperties.myRenderPanels;
			    myRenderSeq       = layout.myproperties.myRenderSeq;
			    var myWidth       = layout.myproperties.myWidth;
			    var myHeight      = layout.myproperties.myHeight;
			    var myBodyHeight  = 0;
			    var myHtml        = '';
			    var myModalHeight = 0;

			    if(myRenderPanels === "c") {
				    myFlagShowIFrame = false;
			    }

			    if(isEmpty(layout.myproperties.myBodyHeight)) { 
				    myBodyHeight = 0; 
			    } else {
			    	myBodyHeight = layout.myproperties.myBodyHeight;
			    }

			    if(myFlagShowIFrame === false) {
				    // myBodyHeight is ignored when the message contains a KPI - this could be improved
				    if(myBodyHeight === 0) {
					    if(myPopupStyle === 'b') {
						    myBodyHeight  = myHeight;
						    myModalHeight = myHeight;
					    } else {
						    myBodyHeight = myHeight;
					    }					
				    } else {
					    if(myPopupStyle === 'b') {
					    	myHeight      = myBodyHeight;
						    myModalHeight = myBodyHeight;
					    } else {
						    // for Modal's layout when myBodyHeight is present, the popup message Height is the expression
						    //    we include the heights of the Header and Footer panels when they are present.
						    
						    myModalHeight = +myBodyHeight + Math.sign(myModalHeader.length) * 31.25 + Math.sign(myModalFooter.length) * 17.25;
						    myHeight      = +myHeight - +myModalHeight;						    
					    }
				    }
			    } else {
				    // IFrame logic
				    if(myFlagShowCustom) {					
					    if(myBodyHeight === 0) {
						    if(myPopupStyle === 'b') {
							    myBodyHeight  = myHeight;
							    myModalHeight = myHeight;
						    } else {
							    myBodyHeight = myHeight;
						    }					
					    } else {
						    if(myPopupStyle === 'b') {
							    myHeight      = +myHeight - myBodyHeight;
							    myModalHeight = +myBodyHeight;
						    } else {
							    // for Modal's layout when myBodyHeight is present, the popup message Height is the expression
							    //    we include the heights of the Header and Footer panels when they are present.
							    myModalHeight = +myBodyHeight + Math.sign(myModalHeader.length) * 31.25 + Math.sign(myModalFooter.length) * 17.25;
							    myHeight      = +myHeight - +myModalHeight;
						    }
					    }
				    }
			    }

			    // var myStyleSize   = "style='width:" + myWidth + "px; height:" + myHeight/mySplit + "px;'";
			    var myStyleSize   = "style='width:" + myWidth + "px; height:" + myModalHeight + "px;'";
			    var myStyleWidth  = "style='width:" + myWidth + "px;'";
			    var myStyleColour = 'style="background-color:' + myTopLowerBG.color + '; color:' + myTopLowerFG.color + ';"';
			    var myStyleFooter = 'style="background-color:' + myTopLowerBG.color + '; color:' + myTopLowerFG.color + '; width:' + (myWidth - 32) +'px;"';
			    var myStyleSizeWF = "style='border-style: groove; width:" + myWidth + "px; height:" + myModalHeight + "px;'";

			    // header message
			    if(myHeaderMessage.length>0) {
				    myHtml  += "<div><b>" + myHeaderMessage + "</b></div>";
			    }

			    // prepare IFrame HTML
			    var myIFrameHTML = '';
			    if(myFlagShowIFrame) {
				    // we should show IFrame, building it
				    myIFrameHTML = "<iframe src='" + myTarget + "' style='border-style: groove' width='" + myWidth +"' height='" + myHeight + "'></iframe>";
			    }

			    // prepare Custom Content Message HTML
			    var myCustomHTML = '';
			    if(myFlagShowCustom) {
				    // when we have a custom message to show
				    if(myPopupStyle === 'b') {
					    // basic style
					    if(myShowPrompt) {
					    	myCustomHTML  = "<span class='close'>&times;</span>";
					    } else {
					    	myCustomHTML  = "<span class='close' onclick='" + myPopupFn.trim() + "'>&times;</span>";
					    }
					    
					    myCustomHTML += "<div " + myStyleSize + ">" + myContentMessage + "</div>";					
				    } else {
					    // modal style
    				    myCustomHTML  = "<div id='id01' style='display: block;' width='" + myWidth + "' height='" + myHeight + "'>";
      				    myCustomHTML += " <div class='popupmessage-modal-content popupmessage-animate-top popupmessage-card-4' " + myStyleSize + ">";

      				    if(myModalHeader.length>0) {
      					    myCustomHTML += '   <header class="popupmessage-container popupmessage-display-container" ' + myStyleColour + '>';
      					    // myCustomHTML += '     ::before';
      					    myCustomHTML += '     <span onclick="' + "document.getElementById('id01').style.display='none'; document.getElementById('" + myPopupId + "').classList.toggle('show');" + '" class="popupmessage-button popupmessage-xlarge popupmessage-display-topright popupmessage-hover-red popupmessage-hover-opacity">&times;</span>';
      					    myCustomHTML += '     <span style="font-size:24px; font-weight: bolder; text-align: left">' + myModalHeader + '</span>';
      					    // myCustomHTML += '     ::after';
      					    myCustomHTML += '   </header>';
      				    }

      				    myCustomHTML += '   <div class="popupmessage-container">';
      				    myCustomHTML += '   <span style="color: black">' + myContentMessage + '</span>';
      				    myCustomHTML += '   </div>';

      				    if(myModalFooter.length > 0) {
      					    myCustomHTML += '   <footer class="popupmessage-container-footer" ' + myStyleFooter + '>';
      					    myCustomHTML += '     <span style="text-align: left">' + myModalFooter + '</span>';
      					    myCustomHTML += '   </footer>';
      				    }

      				    myCustomHTML += ' </div>';
				        myCustomHTML += '</div>';
				    }
			    }

			    // building html code
			    // show prompt message - logic to render the prompt
			    //  - My Prompt open a <div> that is closed at the end of building the HTML page
			    var myPrompt = '';
			    if(myShowPrompt) {
				    // when the prompt is required, the onclick event is part of the <div> and we included the prompt label
				    if(myPopupStyle = 'b') { // myqInfoqId
					    // myPrompt = "<div class='popup' onclick='myPopupFunction()' style='position: fixed'>" + myLabel;
					    myPrompt = "<div class='popup' onclick='" + myPopupFn.trim() +"' style='position: fixed'>" + myLabel;
			        } else {
			    	    // myPrompt = "<div class='popup' onclick='myPopupFunction(); document.getElementById('id01').style.display='block' style='position: fixed'>" + myLabel;
			    	    myPrompt = "<div class='popup' onclick='" + myPopupFn.trim() + "; document.getElementById('id01').style.display='block' style='position: fixed'>" + myLabel;			    	    
			        }
			    } else {
				    // otherwise, there is not onclick event and prompt label
				    // myPrompt  = "<iframe id='myIframe' srcdoc='<!doctype html><html><body>Hello World</body></html>' onload='myPopupFunction()'></iframe>'";
				    myPrompt  = "<iframe id='" + myIFrameId + "' srcdoc='<!doctype html><html><body></body></html>' onload=" + myPopupFn.trim() + " style='border-style: none; width: 10px; height: 10px;'></iframe>'";				    
				    myPrompt += "<div class='popup' style='position: fixed'>";
			    }

			    // Was the limit broken
			    if(myLimit && myKPIchanged === true)
			    {
				    myHtml += myPrompt;				    
				    if(myRenderSeq === 'k') {
					    // myHtml += "<div id='myPopup' class='popuptext'><span>" + myIFrameHTML + myCustomHTML + "</span></div>";
					    myHtml += "<div id='" + myPopupId + "' class='popuptext'><span>" + myIFrameHTML + myCustomHTML + "</span></div>";
				    } else {
					    // myHtml += "<div id='myPopup' class='popuptext'><span>" + myCustomHTML + myIFrameHTML + "</span></div>";
					    myHtml += "<div id='" + myPopupId + "' class='popuptext'><span>" + myCustomHTML + myIFrameHTML + "</span></div>";
				    }
			    } else {
				    myHtml += myPrompt;
				    // myHtml +=      "<span class='popuptext' id='myPopup'><div style='border-style: groove' width='" + myWidth +"' height='" + myHeight + "'>" + myWorkingFineMessage + "</div></span>";
				    myHtml +=      "<span class='popuptext' id='" + myPopupId + "'><div " + myStyleSizeWF + ">" + myWorkingFineMessage + "</div></span>";
			    }
		
			    // Updating control variables

			    if(myKPIchanged === true && !myEditMode) {
				    setVariableValue(this, myVarLastCheck, myRunTime);
			    }

                myHtml += "</div>";

			    $element.html(myHtml);

			    // cleansing 
			    myHtml         = undefined;
			    myPrompt       = undefined;
			    myCustomHTML   = undefined;
			    myIFrameHTML   = undefined;

			    myTarget       = undefined;
			    myLabel        = undefined;
			    myLimit        = undefined;
			    myShowPrompt   = undefined;
			    myKPIcurrent   = undefined;
			    myKPIPrevious  = undefined;
			    myKPIwork      = undefined;
			    
			    myOldKPIvar    = undefined;
			    myVarKPIText   = undefined;
			    myVarLastCheck = undefined;
			    myKPIchanged   = undefined;
			    myFlagShowCustom = undefined;
			    myFlagShowIFrame = undefined;
            
                myContentMessage     = undefined;
                myHeaderMessage      = undefined;
                myPromptMessage      = undefined;
                myWorkingFineMessage = undefined;

                myModalHeader  = undefined;
                myModalFooter  = undefined;
                myTopLowerBG   = undefined;
                myTopLowerFG   = undefined;

                myStyleSize    = undefined;
			    myStyleWidth   = undefined;
			    myStyleColour  = undefined;
			    myStyleFooter  = undefined;
			    myStyleSizeWF  = undefined;

                myPopupStyle   = undefined;
                myRenderPanels = undefined;
                myRenderSeq    = undefined;

                myPopupId      = undefined;
			    myPopupFn      = undefined;
			    myIFrameId     = undefined;
				
			}
			//needed for export
			return qlik.Promise.resolve();

			// tidying up
			// $scope = undefined;
		}

	};

} );

var myPopupFunction = function(myTargetId) {
  var popup = document.getElementById(myTargetId);
  popup.classList.toggle("show");
  popup = undefined;
};


