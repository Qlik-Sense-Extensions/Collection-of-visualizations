// Properties

define( [ 
	'qlik',
	'jquery',
	'ng!$q'
],
function ( qlik, $, $q) {
    'use strict';
    var app = qlik.currApp(this);
    
    function getMasterObjectList () {
		var defer = $q.defer();
		
        app.getAppObjectList( 'masterobject', function ( data ) {
                var masterobject = [];
                    var sortedData = _.sortBy( data.qAppObjectList.qItems, function ( item ) {
                        return item.qData.rank;
                });

                _.each( sortedData, function ( item ) {
                masterobject.push({ value: item.qInfo.qId, label: item.qMeta.title });
                });
                //console.log(masterobject, "master object")
                return defer.resolve( masterobject );
            });
		return defer.promise;
    };
    		
	/* var dimensions = {
        uses : "dimensions",
        min : 1,
        max : 1,
        items: {
            dimImg: {
                type: "string",
                label: "Profile Image expression",
                ref: "qAttributeExpressions.0.qExpression",
                component: "expression",
            }
        }
	}, */
    /* var measures = {   
        uses : "measures",
        min : 2,
        max : 12,
        items: {
            measureColour: {
                type: "string",
                label: "Colour",
                ref: "qAttributeExpressions.0.qExpression",
                component: "expression",
            }
        } 
    }, */

    var item = {
        label: {
            type: "string",
            ref: "props.label",
            label: "Label",
            expression: "optional"
        },
        expression: {
            type: "string",
            ref: "props.expression",
            label: "Process Expression",
            expression: "optional"
        },
        avatarExpression: {
            type: "string",
            ref: "props.avatar.location",
            label: "Process/Steps Avatar Location",
            expression: "optional"
        },
        dropdown:{
            type : "string",
            component : "dropdown",
            label : "Master Items",
            ref : "props.masteritem",
            options: function () {
                return getMasterObjectList();
            },
            defaultValue : "Select A Master Item"
        },
        chartExportOption: {
            type: "boolean",
            component: "switch",
            label: "Enable export?",
            ref: "props.export",
            options: [{
                value: true,
                label: "Enabled"
            }, {
                value: false,
                label: "Disabled"
            }],
            defaultValue: false
        }
    },
    itemSection =  {
        type: "array",
        ref: "listItems",
        label: "Process Items",
        itemTitleRef: "props.label",
        allowAdd: true,
        allowRemove: true,
        allowMove: true,
        addTranslation: "Add Process Step",
        items: item
    },
    imageCheckBox = {
        ref: "props.show",
        label: "Show Step/Process Avatar",
        type: "boolean",
        component: "switch",
        options: [{
            value: true,
            label: "Show"
        }, {
            value: false,
            label: "Hide"
        }],
        default: false
    },
    navigationButton = {
        ref: "props.navigation",
        label: "Show Navigation Buttons?",
        type: "boolean",
        component: "switch",
        options: [{
            value: true,
            label: "Show"
        }, {
            value: false,
            label: "Hide"
        }],
        default: false
    },
    showMasterItem = {
        ref: "props.MasterItem",
        label: "Show Master Items",
        type: "boolean",
        component: "switch",
        options: [{
            value: true,
            label: "Show"
        }, {
            value: false,
            label: "Hide"
        }],
        default: true
    },
    exSettings = {
        type: "items",
        label: "Avatar & Master Items", 
        items: {
            showAvatar: imageCheckBox,
            showNav: navigationButton,
            showMI: showMasterItem
        }
    },
    processSteps = {
        component: "expandable-items",
        label: "Manage Process Steps", 
        items: {
            exSettings: exSettings,
            list: itemSection
        },        
    },
    setting = {
        uses : "settings"
    };
    
    return {
        type: "items",
        component: "accordion",
        items: {
            //dimensions: dimensions,
            //measures: measures,
            process: processSteps,
            settings: setting
            //sorting: sorting,
            //appearance: appearancePanel
			//addons: addons
        }
    };
} );