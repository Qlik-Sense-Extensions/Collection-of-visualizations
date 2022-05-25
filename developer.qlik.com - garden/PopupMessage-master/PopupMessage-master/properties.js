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
		expression: "optional",
		defaultValue: ''
	};

	var myLimit = {
		ref: "myproperties.myLimit",
		label: "Limit Expression",
		type: "string",
		expression: "optional",
		defaultValue: ''
	};

	var myKPIcurrent = {
		ref: "myproperties.myKPIcurrent",
		label: "KPI Expression",
		type: "string",
		expression: "optional",
		defaultValue: ''
	};

	var myOldKPIvar = {
		ref: "myproperties.myOldKPIvar",
		label: "Previous KPI Variable",
		type: "string",
		defaultValue: ''
	};

	var myLastCheck = {
		ref: "myproperties.myLastCheck",
		label: "Last Check Variable",
		type: "string",
		defaultValue: ''
	};

	var myOldKPIvalue = {
		ref: "myproperties.myOldKPIvalue",
		label: "Previous KPI Value",
		type: "string",
		show: true
	};

	// Custom Message section

	var myContentMessage = {
		ref: "myproperties.myContentMessage",
		label: "Content Message",
		type: "string",
		expression: "optional",
		defaultValue: ''
	};	

	var myModalHeader = {
		ref: "myproperties.myModalHeader",
		label: "Modal Header",
		type: "string",
		expression: "optional",
		defaultValue: ''
	};

	var myModalFooter = {
		ref: "myproperties.myModalFooter",
		label: "Modal Footer",
		type: "string",
		expression: "optional",
		defaultValue: ''
	};

	var myHdrFooterForeground = {
    	label:"HDR-Footer Foreground",
    	component: "color-picker",
    	ref: "myproperties.myFGColour",
    	type: "object",
    	defaultValue: {
    		color: "#ffffff",
    		index: -1
    	}
    };

	var myHeaderFooterColor = {
    	label:"HDR-Footer Background",
    	component: "color-picker",
    	ref: "myproperties.myBGColour",
    	type: "object",
    	defaultValue: {
    		index: -1,
    		color: "#009845"
    	}
    };

	// Message Attributes section
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

    var myBodyHeight = {
    	label:"Message Body Height",
    	ref: "myproperties.myBodyHeight",
    	type: "integer",
    	defaultValue: "50",
    	min: "50",
    	max: "1000"
    };

    // Messages Section
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

	// Sections
	var myBusinessRuleSection = {
		// component: "expandable-items",
		component: "items",

		type: "items",
		label: "Business Rule Objects",
		items: {
			myContent: myContent,
			myLimit: myLimit,
			myKPIcurrent: myKPIcurrent,
			myOldKPIvar: myOldKPIvar,
			myLastCheck: myLastCheck,
			myOldKPIvalue: myOldKPIvalue
		}

	};	

	var myCustomMessageSection = {
		// component: "expandable-items",
		component: "items",

		type: "items",  
		label: "Custom Message",  
		items: {
			myContentMessage: myContentMessage,
			myModalHeader: myModalHeader,
			myModalFooter: myModalFooter,
			myHdrFooterForeground: myHdrFooterForeground,
			myHeaderFooterColor: myHeaderFooterColor									
		}

	};

	var myAttributesSection = {
		//component: "expandable-items",
		component: "items",

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

	};

	var myMessagesSection = {
	    //component: "expandable-items",
	    component: "items",

		type: "items", 
		label: "Extension Messages",
		items: {
			myHeaderMessage: myHeaderMessage,
			myPromptMessage: myPromptMessage,
			myWorkingFineMessage: myWorkingFineMessage
		}

	};

	// Return overall definition of the property accordion
	return {
		type: "items",
		component: "accordion",
		items: {
			myBusinessRuleSection: myBusinessRuleSection,
			myCustomMessageSection: myCustomMessageSection,
			myAttributesSection: myAttributesSection,
			myMessagesSection: myMessagesSection
		}
	};
} );