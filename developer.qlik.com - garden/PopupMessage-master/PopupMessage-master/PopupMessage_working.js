define( [ "qlik",
          "text!./css/PopupMessage.css",
          "text!./css/styles.css",
		  "./properties"
],
function ( qlik, cssContent, cssButton, props) {
	'use strict';
	$("<style>").html(cssContent).appendTo("head");
	$("<style>").html(cssButton).appendTo("head");

	function getVariableValue(ext, name) {
		var app = qlik.currApp(ext);

		var result = app.variable.getContent(name, function(reply) {
			// alert(JSON.stringify(reply));
			return reply.qnum;
		});

		app = undefined;
		// delete(app);

		return result;
	}

	function setVariableValue(ext, name, value) {
		var app = qlik.currApp(ext);

		if( isNaN(value) ) {
			app.variable.setStringValue(name, value);
		} else {
			// it did not work with setNumValue() ???
			app.variable.setStringValue(name, value);
		}

		app = undefined;
		// delete(app);
	}

	return {
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		definition: props,
		paint: function ($element, layout) {
			// ##############################################################
			// If current KPI and previous KPI are the same we do not show a
			// popup message regardless of the Limit Expression result,
			// because nothing happened between calls to the Extension.
			// ##############################################################

			//add your rendering code here
			// s('My Layout');
			// console.log(layout);
			//console.log('This');
			//console.log(this);
			//console.log('Element');
			//console.log($element);

			console.log('Interaction State ', this._interactionState);
			console.log('Selection Enabled ', this.selectionsEnabled);

			// Interaction-State:
			//    1 - Run Time
			//    2 - Edit Mode

			// Selection Enabled
			//    true  - Run Time
			//    false - Edit Mode

			// initializing some variables
			var myTarget       = '';
			var myLabel        = '';
			var myLimit        = false;
			var myShowPrompt   = false;
			var myKPIcurrent   = 0;
			var myKPIprevious  = 0;
			var myMessage      = 'no message';
			var myVarKPI       = '';
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
            var myRederSeq     = '';

			var today     = new Date();
			var date      = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
			var time      = String(today.getHours()).padStart(2,'0') + ":" + String(today.getMinutes()).padStart(2,'0') + ":" + String(today.getSeconds()).padStart(2,'0');
			var myRunTime = String(date)+' '+String(time);			
			
			// Get Current KPI
			if(layout.myproperties.myKPI === null) {
				myKPIcurrent = 0;
			} else {
				myKPIcurrent = layout.myproperties.myKPI;
			}

			// Get Previous KPI
			//  - note if the variable is not available we do not compare
			//    with the previous KPI
			if(layout.myproperties.myVarKPI === null) {
				myVarKPI = '';
			} else {
				myVarKPI = layout.myproperties.myVarKPI;
				// now let's get its value
				myKPIprevious = getVariableValue(this, myVarKPI);
				myKPIchanged = !(myKPIcurrent == myKPIprevious);

				if(myKPIchanged === true) {
					setVariableValue(this, myVarKPI, myKPIcurrent);
				}
			}

			// Get Last Check Variable, if present we return the last time
			// this Extension returned an action
			if(layout.myproperties.myLastCheck === null) {
				myVarLastCheck = '';
			} else {
				myVarLastCheck = layout.myproperties.myLastCheck;
			}

			// Do we break the Limit?
			if(layout.myproperties.myLimit == null) {
				myLimit = false;
			} else {
				if(layout.myproperties.myLimit === '-1' ||
				   layout.myproperties.myLimit === '1') {
					myLimit = true;
				}
			}
			// Do we show prompt?
			if(layout.myproperties.myShowPrompt == null) {
				myShowPrompt = false;
			} else {
				if(layout.myproperties.myShowPrompt === true) {
					myShowPrompt = true;
				}
			}

            // Get Prompt Message
            if(layout.myproperties.myPromptMessage      === null) {
                myPromptMessage      = '';
            } else {
                myPromptMessage      = layout.myproperties.myPromptMessage;
            }

			// My Prompt Label!
			if(layout.myproperties.myButtonLabel == null) {
				myLabel = myPromptMessage;
			} else {
				myLabel  = layout.myproperties.myButtonLabel;
			}
			// Get IFrame content
			if(layout.myproperties.myContent === null) {
				myTarget = '';
			} else {
				myTarget = layout.myproperties.myContent;
				if(myTarget.length > 0) {
					myFlagShowIFrame = true;
				}
			}
            // Get Content Message
            if(layout.myproperties.myContentMessage     === null) {
                myContentMessage = '';
            } else {
                myContentMessage = layout.myproperties.myContentMessage;
                myFlagShowCustom = true;
            }
            // Get Header Message            
            if(layout.myproperties.myHeaderMessage      === null) {
                myHeaderMessage      = '';
            } else {
                myHeaderMessage      = layout.myproperties.myHeaderMessage;
            }

            // Get Working Fine Message
            if(layout.myproperties.myWorkingFineMessage === null) {
                myWorkingFineMessage = '';
            } else {
                myWorkingFineMessage = layout.myproperties.myWorkingFineMessage;
            }			

            // Get Modal Header
            if(layout.myproperties.myModalHeader === null) {
            	myModalHeader = '';
            } else {
            	myModalHeader = layout.myproperties.myModalHeader;
            }

            // Get Modal Footer
            if(layout.myproperties.myModalFooter == null) {
            	myModalFooter = '';
            } else {
            	myModalFooter = layout.myproperties.myModalFooter;
            }

            // Get Header-Footer Background
            if(layout.myproperties.myBGColour === null) {
            	myTopLowerBG = '';
            } else {
            	myTopLowerBG = layout.myproperties.myBGColour;
            }

            // Get Header-Footer Foreground            
            if(layout.myproperties.myFGColour === null) {
            	myTopLowerFG = '';
            } else {
            	myTopLowerFG = layout.myproperties.myFGColour;
            }

			// initializing additional variables
			myPopupStyle      = layout.myproperties.myPopupStyle;
			myRenderPanels    = layout.myproperties.myRenderPanels;
			myRederSeq        = layout.myproperties.myRederSeq;
			var myWidth       = layout.myproperties.myWidth;
			var myHeight      = layout.myproperties.myHeight;
			var myBodyHeight  = 0;
			var myHtml        = '';
			var myModalHeight = 0;

			if(myRenderPanels === "c") {
				myFlagShowIFrame = false;
			}

			if(layout.myproperties.myBodyHeight === null) { 
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
						myModalHeight = myBodyHeight + Math.sign(myModalHeader.length) * 31.25 + Math.sign(myModalFooter.length) * 17.25;
						myHeight      = myHeight - myModalHeight;
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
							myHeight      = myHeight - myBodyHeight;
							myModalHeight = myBodyHeight;
						} else {
							// for Modal's layout when myBodyHeight is present, the popup message Height is the expression
							//    we include the heights of the Header and Footer panels when they are present.
							myModalHeight = myBodyHeight + Math.sign(myModalHeader.length) * 31.25 + Math.sign(myModalFooter.length) * 17.25;
							myHeight      = myHeight - myModalHeight;
						}
					}
				}
			}

			// var myStyleSize   = "style='width:" + myWidth + "px; height:" + myHeight/mySplit + "px;'";
			var myStyleSize   = "style='width:" + myWidth + "px; height:" + myModalHeight + "px;'";
			var myStyleWidth  = "style='width:" + myWidth + "px;'";
			var myStyleColour = 'style="background-color:' + myTopLowerBG.color + '; color:' + myTopLowerFG.color + ';"';
			var myStyleFooter = 'style="background-color:' + myTopLowerBG.color + '; color:' + myTopLowerFG.color + '; width:' + (myWidth - 32) +'px;"';

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
					// myCustomHTML  = '<span class="close">&times;</span>';
					myCustomHTML  = '<span class="close" onclick="' + "document.getElementById('myPopup').classList.toggle('show');" + '">&times;</span>';	
					console.log(myCustomHTML);
					myCustomHTML += "<div " + myStyleSize + ">" + myContentMessage + "</div>";					
				} else {
					// modal style
    				myCustomHTML  = "<div id='id01' style='display: block;' width='" + myWidth + "' height='" + myHeight + "'>";
      				myCustomHTML += " <div class='popupmessage-modal-content popupmessage-animate-top popupmessage-card-4' " + myStyleSize + ">";

      				if(myModalHeader.length>0) {
      					myCustomHTML += '   <header class="popupmessage-container popupmessage-display-container" ' + myStyleColour + '>';
      					// myCustomHTML += '     ::before';
      					myCustomHTML += '     <span onclick="' + "document.getElementById('id01').style.display='none'; document.getElementById('myPopup').classList.toggle('show');" + '" class="popupmessage-button popupmessage-xlarge popupmessage-display-topright popupmessage-hover-red popupmessage-hover-opacity">&times;</span>';
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
				if(myPopupStyle = 'b') {
					myPrompt = "<div class='popup' onclick='myPopupFunction()' style='position: fixed'>" + myLabel;
			    } else {
			    	myPrompt = "<div class='popup' onclick='myPopupFunction(); document.getElementById('id01').style.display='block' style='position: fixed'>" + myLabel;
			    }
			} else {
				// otherwise, there is not onclick event and prompt label
				myPrompt  = "<iframe id='myIframe' srcdoc='<!doctype html><html><body>Hello World</body></html>' onload='myPopupFunction()'></iframe>'";
				myPrompt += "<div class='popup' style='position: fixed'>";
			}

			// Was the limit broken
			if(myLimit)
			{
				myHtml += myPrompt;
				if(myRederSeq === 'k') {
					myHtml += "<div id='myPopup' class='popuptext'><span>" + myIFrameHTML + myCustomHTML + "</span></div>";
				} else {
					myHtml += "<div id='myPopup' class='popuptext'><span>" + myCustomHTML + myIFrameHTML + "</span></div>";
				}
			} else {
				myHtml += myPrompt;
				myHtml +=      "<span class='popuptext' id='myPopup'><div style='border-style: groove' width='" + myWidth +"' height='" + myHeight + "'>" + myWorkingFineMessage + "</div></span>";
			}
		
			// Updating control variables

			if(myKPIchanged === true) {
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
			myKPIprevious  = undefined;
			myMessage      = undefined;
			myVarKPI       = undefined;
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

            myPopupStyle   = undefined;
            myRenderPanels = undefined;
            myRederSeq     = undefined;

			if ( this.selectionsEnabled ) {
				$element.find( '.selectable' ).on( 'qv-activate', function () {
					if ( this.hasAttribute( "data-value" ) ) {
						var value = parseInt( this.getAttribute( "data-value" ), 10 ), dim = 0;
						self.selectValues( dim, [value], true );
						$( this ).toggleClass( "selected" );
					}
				} );
			}
			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );

var myPopupFunction = function() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
};

