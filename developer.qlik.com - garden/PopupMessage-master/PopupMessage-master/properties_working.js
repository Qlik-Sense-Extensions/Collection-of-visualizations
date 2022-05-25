define( [], function () {
	'use strict';

	// ****************************************************************************************
	// Custom components
	// ****************************************************************************************

	// Business Rule Objects properties
	var myContent = {
		ref: "myproperties.myContent",
		label: "KPI Content Object",
		type: "string",
		expression: "optional"
	};

	var myLimit = {
		ref: "myproperties.myLimit",
		label: "Limit Expression",
		type: "string",
		expression: "optional"
	};

	var myKPI = {
		ref: "myproperties.myKPI",
		label: "KPI Expression",
		type: "string",
		expression: "optional"
	};

	var myOldKPI = {
		ref: "myproperties.myVarKPI",
		label: "Previous KPI Variable",
		type: "string"
	};

	var myLastCheck = {
		ref: "myproperties.myLastCheck",
		label: "Last Check Variable",
		type: "string"
	};

	// Message Attributes properties
	var myWidth = {
		ref: "myproperties.myWidth",
		label: "Width",
		type: "integer",
		defaultValue: "350",
		min: "20",
		max: "1000"
	};
	var myHeight = {
		ref: "myproperties.myHeight",
		label: "Height",
		type: "integer",
		defaultValue: "350",
		min: "20",
		max: "1000"
	};

    var myShowPrompt = {
			type: "boolean",
			component: "switch",
			ref: "myproperties.myShowPrompt",
			label: "Show Prompt",
			defaultValue: true,
			options: [
				{
					value: true,
					label: "Show"
				}, {
					value: false,
					label: "Hide"
				}
			]
	};
	
	var myButtonLabel = {
		ref: "myproperties.myButtonLabel",
		label: "Prompt Label",
		type: "string",
		defaultValue: "Press Me"
	};

	var myContentMessage = {
		ref: "myproperties.myContentMessage",
		label: "Content Message",
		type: "string",
		expression: "optional"
	};

	// Extension Messages properties	
	
	var myHeaderMessage = {
		ref: "myproperties.myHeaderMessage",
		label: "Header Message",
		type: "string",
		expression: "optional",
		defaultValue: "Popup Message"
	};

	var myPromptMessage = {
		ref: "myproperties.myPromptMessage",
		label: "Prompt Message",
		type: "string",
		expression: "optional",
		defaultValue: "Click me!"
	};

	var myWorkingFineMessage = {
		ref: "myproperties.myWorkingFineMessage",
		label: "Working Fine Message",
		type: "string",
		expression: "optional",
		defaultValue: "Working Fine"
	};

	var myModalHeader = {
		ref: "myproperties.myModalHeader",
		label: "Modal Header",
		type: "string",
		expression: "optional"
	};

	var myModalFooter = {
		ref: "myproperties.myModalFooter",
		label: "Modal Footer",
		type: "string",
		expression: "optional"
	};

	var myRenderPanels = {
		type: "string",
		component: "buttongroup",
		ref: "myproperties.myRenderPanels",
		label: "Panels to Render",
		options: [{
			value: "k",
			label: "KPI",
			tooltip: "Select to render just the KPI Object"
		}, {
			value: "c",
			label: "Custom",
			tooltip: "Select to render just your Custom Message"
		}, {
			value: "b",
			label: "Both",
			tooltip: "Select to Rendering both Panels"
		}],
		defaultValue: "b"
	};

	var myRenderSeq = {
		type: "string",
		component: "buttongroup",
		ref: "myproperties.myRenderSeq",
		label: "Render Sequence",
		options: [{
			value: "k",
			label: "KPI",
			tooltip: "KPI Panel first"
		}, {
			value: "c",
			label: "Custom",
			tooltip: "Custom Message first"
		}],
		defaultValue: "c"
	};

	var myPopupStyle = {
    	type: "string",
    	component: "buttongroup",
    	label: "Popup Style",
    	ref: "myproperties.myPopupStyle",
    	options: [{
        	value: "b",
        	label: "Basic",
        	tooltip: "Select Basic Style"
    	}, {
        	value: "m",
        	label: "Modal",
        	tooltip: "Select Modal Style"
    	}],
    	defaultValue: "b"
	};

	var myHeaderFooterColor = {
    	label:"HDR-Footer Background",
    	component: "color-picker",
    	ref: "myproperties.myBGColour",
    	type: "object",
    	defaultValue: {
    		color: "009845",
    		index: "-1"
    	}
    };

	var myHdrFooterForeground = {
    	label:"HDR-Footer Foreground",
    	component: "color-picker",
    	ref: "myproperties.myFGColour",
    	type: "object",
    	defaultValue: {
    		color: "ffffff",
    		index: "-1"
    	}
    };

    var myBodyHeight = {
    	label:"Message Body Height",
    	ref: "myproperties.myBodyHeight",
    	type: "integer",
    	defaultValue: "0",
    	min: "0",
    	max: "1000"
    };

	// ****************************************************************************************
    // Sub-Section just for application objects
	// ****************************************************************************************
	var myBusinessRuleSection = {
		//type: "items", //<== not necessary to define "items"
		// uses: "settings",
		component: "expandable-items",
		label: "Application Objects",
		items: {
			header1: {
				type: "items",
				label: "Business Rule Objects",
				items: {
					myContent: myContent,
					myLimit: myLimit,
					myKPI: myKPI,
					myOldKPI: myOldKPI,
					myLastCheck: myLastCheck
				}
			}
		}
	};

	var myCustomMessageSection = {
		component: "expandable-items",
		label: "Custom Message",
		items: {
			header1: {
				type: "items",
				label: "Custom Message",
				items: {
					myContentMessage: myContentMessage,
					myModalHeader: myModalHeader,
					myModalFooter: myModalFooter,
					myHdrFooterForeground: myHdrFooterForeground,
					myHeaderFooterColor: myHeaderFooterColor									
				}
			}
		}
	};

	var myAttributesSection = {
		//type: "items", //<== not necessary to define "items"
		// uses: "settings",
		component: "expandable-items",
		label: "Message Attributes",
		items: {
			header1: {
				type: "items",
				label: "Message Attributes",
				items: {
					myPopupStyle: myPopupStyle,
					myRenderPanels: myRenderPanels,
					myRenderSeq: myRenderSeq,
					myShowPrompt: myShowPrompt,
					myButtonLabel: myButtonLabel,
					myWidth: myWidth,
					myHeight: myHeight,
					myBodyHeight: myBodyHeight
				}
			}
		}
	};
	
	var myMessagesSection = {
		component: "expandable-items",
		label: "Extension Messages",
		items: {
			header1: {
				type: "items",
				label: "Extension Messages",
				items: {
					myHeaderMessage: myHeaderMessage,
					// myCustomMessageSection: myCustomMessageSection,
					myPromptMessage: myPromptMessage,
					myWorkingFineMessage: myWorkingFineMessage
				}
			}
		}
	};

/*	
	var header2_item2 = {
		ref: "myproperties.section2.item2",
		label: "Section 2 / Item 2",
		type: "string",
		expression: "optional"
	};
*/
	// ****************************************************************************************
	// Sections definitions
	// ****************************************************************************************
	// Modify the Appearance Panel ( defined by `uses: "settings"`)
	var appearanceSection = {
		uses: "settings",
		// component: "expandable-items",
	    component: "accordion",
		label: "Rendering Properties",
		items: {
			// Here the magic happens
			myNewHeader: {
				// component: "accordion",
				type: "items",
				label: "Message Settings",
				items: {
					myBusinessRuleSection: myBusinessRuleSection,
					myCustomMessageSection: myCustomMessageSection,
					myAttributesSection: myAttributesSection,
					myMessagesSection: myMessagesSection
					//myContent: myContent,
					//myLimit: myLimit,
					//myKPI: myKPI,
					//myWidth: myWidth,
					//myHeight: myHeight,
					//myShowPrompt: myShowPrompt,
					//myButtonLabel: myButtonLabel
					}
			}
		}
	};

/*
	var myCustomSection = {
		//type: "items", //<== not necessary to define "items"
		component: "expandable-items",
		label: "My Accordion Section",
		items: {
			header1: {
				type: "items",
				label: "Header 1",
				items: {
					header1_item1: header1_item1,
					header1_item2: header1_item2
				}
			},
			header2: {
				type: "items",
				label: "Header 2",
				items: {
					header2_item1: header2_item1,
					header2_item2: header2_item2
				}
			}
		}
	};
*/
	// ****************************************************************************************
	// Property Panel Definition
	// ****************************************************************************************

	// Return overall definition of the property accordion
	return {
		type: "items",
		component: "accordion",
		items: {
			appearance: appearanceSection
			// myBusinessRuleSection: myBusinessRuleSection
//			customSection: myCustomSection
		}
	};

} );
