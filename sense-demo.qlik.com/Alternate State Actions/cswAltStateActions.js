define(["jquery", "qlik", "text!./style.css"], function ($, qlik, cssContent) {
	'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties: {
			qListObjectDef: {
				qShowAlternatives: true,
				qFrequencyMode: "V",
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 50
				}]
			}
		},
		definition: {
            
			type: "items",
			component: "accordion",
			items: {
                settings: {
					uses: "settings"
				},
				customProperties : {
                    component: "expandable-items",
                    label: "Custom Properties",
                    type : "items",
                    items : {
                        state : {
                            ref : "qListObjectDef.qStateName",
                            label : "State",
                            type : "string",
                            component : "dropdown",
                            defaultValue : "$",		
                            options: function() {
                                return qlik.currApp(this).getAppLayout().then(function (a){
                                    return a.layout.qStateNames.map(function (state){
                                          return {value : state, label : state}
                                    })
                                    /*
                                    return [{value : "$", label : "Default"}].concat(layout.qStateNames.map(function (state){
                                          return {value : state, label : state}
                                    })); */
                                });
                            }
                        },
                        Layout : {
                            type: "items",
                            label: "Layout Settings",
                            items: {
                                enterStyle : {
                                    type: "string",
                                    ref: "enterStyle",
                                    label: "Enter button style (CSS)",
                                    defaultValue: "color: #595959;padding: 0 4px;font-size: 13px;height: 28px;font-weight: bold;border-radius: 3px;border: solid 1px #cccccc;background-image: linear-gradient(to bottom, #ffffff, #e6e6e6);"
                                }, 
                                buttonLabel1 : {
                                    type: "string",
                                    ref: "labelCopyButton",
                                    label: "Button Label: Copy State",
                                    defaultValue: "Copy State"
                                },
                                buttonLabel2 : {
                                    type: "string",
                                    ref: "labelClearButton",
                                    label: "Button Label: Clear State",
                                    defaultValue: "Clear State"
                                }
                            }
                        }
                    }
                }
			}    
		},
		snapshot: {
			canTakeSnapshot: false
		},
		paint: function ($element, layout) {
		  
            $element.css('overflow', 'auto');
            //console.dir(layout);
            
            var self = this;
            var ownId = this.options.id;            
            var app = qlik.currApp(this);
            var myState = layout.qListObject.qStateName;
            var html = '';
		  	var currSel = app.getObject(null,'CurrentSelections');
            //currSel.then(function(object){
            //    console.log('Type: ' + object.layout.qInfo.qType);
            //    console.log('Id: ' + object.layout.qInfo.qId);
            //})
            
            if(myState === '$') {
                
                html += '<p style="color:red;">Please select an alternate state in the settings.</p>';
                $element.html(html);
                
            } else {
                
                if(layout.labelCopyButton.length>0) {
                    html += '<button style="' + layout.enterStyle + '" data-cmd="' + ownId + 'SelectField">';
                    html += layout.labelCopyButton + '</button>';
                    html += '&nbsp;'
                }
                if(layout.labelClearButton.length>0) {
                    html += '<button style="' + layout.enterStyle + '" data-cmd="' + ownId + 'ClearAllState">';
                    html += layout.labelClearButton + '</button>';
                }
                $element.html(html);


                $element.find('button').on('qv-activate', function() {
                    switch($(this).data('cmd')) {

                    case ownId + 'SelectField':
                        //clear selections in target State
                        app.clearAll(false,myState);    
                        //copy all selections from the main selection in a loop over the fields
                        currSel.then(function(object){
                            $.each(object.layout.qSelectionObject.qSelections, function(key, value){
                                console.log('Selection found in field ' + value.qField);
                                var myField = app.field(value.qField, myState);  
                                myField.clear();
                                var secretSauce = "["+value.qField+"]=Aggr(Only({<["+value.qField+"]=P($::["+value.qField+"])>} ["+value.qField+"]), ["+value.qField+"])";
                                myField.selectMatch("=" + secretSauce, true, true); 
                                myField.selectPossible();                      
                            });
                        });
                        break;

                    case ownId + 'ClearAllState':
                        app.clearAll(false,myState);    
                        break;
                    }
                });
            }
		}
	};
} );
