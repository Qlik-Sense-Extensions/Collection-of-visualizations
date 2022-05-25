/*global define */
define(["jquery",
    //mashup and extension interface
"qlik"], function($, qlik) {
        var paintOnce = 0;
        var chnageCount = 0;
        var changedItems = [];
        return {
            initialProperties: {
                version: 1.0,
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [{
                        qWidth: 100,
                        qHeight: 100
                    }]
                },
                chartType: "BarChart"
            },
            definition: {
                type: "items",
                component: "accordion",
                items: {
                    dimensions: {
                        uses: "dimensions",
                        min: 0,
                        max: 0
                    },
                    measures: {
                        uses: "measures",
                        min: 1,
                        max: 1
                    },
                    mysettings: {
                        type: "items",
                        label: "Display Options",

                        items: {
                            selectavariablea: {
                                type: "string",
                                label: "Qlik Sense Varible Name",
                                ref: "qSelectedVarible",
                                defaultValue: ""
                            },
                            defineplaceholder: {
                                type: "string",
                                label: "Enter Place Holder Text For Input Box",
                                ref: "qPlaceHolder",
                                defaultValue: ""
                            },
                            definelabel: {
                                type: "string",
                                label: "Enter Label Text",
                                ref: "qLabel",
                                expression: "optional",
                                defaultValue: "Label"
                            },
                            defineAlign: {
                                type: "string",
                                label: "Text Alignment",
                                ref: "qAlign",
                                expression: "optional",
                                defaultValue: "left"
                            },
                            defineDate: {
                                type: "boolean",
                                label: "Add Datepicker?",
                                ref: "qDatePicker",
                                defaultValue: 0
                            }
                        }
                    }
                }
            },
            paint: function($element, layout) {
                var myInputElemId = layout.qInfo.qId;
                if( $("#" + myInputElemId).length ) {
                    $("#" + myInputElemId).off(); 
                    $element.html(null);
                    var app = null,
                        varNameFromInfo = null,
                        theVarName = null,
                        valueNow = null,
                        lastValue = null,
                        revertVar = null,
                        currElem = null;
                }
                var app = qlik.currApp(),
                    varNameFromInfo = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
                    theVarName = varNameFromInfo.replace(/^\=/, ''),
                    breaker = "";
                    var suffix = " - Qlik Sense",
                    valueNow = layout.qHyperCube.qDataPages[0].qMatrix[0][0].qText,
                    lastValue = "no value",
                    revertVar = "<i class=\"fa fa-undo revert-var\" id='" + myInputElemId + "-undo'></i>";
                    var suffix = " - Qlik Sense";
                    var makeBreak = document.title.indexOf(suffix, document.title.length - suffix.length) !== -1;
                    if(makeBreak) {breaker="<br/>";}
                $element.html('<label class="qsense-input-label" for="' + myInputElemId + '" id="label-' + myInputElemId + '">' + layout.qLabel + '</label>' + breaker + '<input class="qs-input q-input-var"id="' + myInputElemId + '" type="text" placeholder="' + layout.qPlaceHolder + '" style="text-align:' + layout.qAlign + '" value="' + valueNow + '">');

                if (!layout.qDatePicker) {
                   $("#" + myInputElemId + "").on('focus', function() {
                    inputBox = this;
                    app.variable.getContent(theVarName, function(reply) {
                        var currElem = document.getElementById(myInputElemId); //Redfeine reference to input box
                        var wasQlikVar = reply.qContent.qString;
                        currElem.value = wasQlikVar;
                        inputBox.select();
                        inputBox = null;
                        currElem = null; //Remove reference to input box
                    });
                   }); 
                }
                
                $("#" + myInputElemId).on('blur', function() {
                    if (!$('#' + myInputElemId + '').hasClass('hasDatepicker')) { //Do not use for datepicker
                    var currElem = document.getElementById(myInputElemId); //Redfeine reference to input box
                    var newValue = currElem.value;
                    if (newValue == "" || typeof (newValue) === 'undefined') {
                        // app.variable.getContent(theVarName, function(reply) {
                        //     var wasQlikVar = reply.qContent.qString;
                        //     currElem.value = wasQlikVar;
                        // });
                    } else {
                            $('.qvobject').addClass('charts-not-current');
                            setTimeout(function(){
                                app.variable.setContent(theVarName, newValue);
                            },100)
                            
                        }
                        currElem = null;  //Remove reference to input box
                    }

                });

                if (layout.qDatePicker) { //add datepicker if option is enabled
                        $('#' + myInputElemId + '').datepicker({
                            onSelect: function () {
                                var currElem = document.getElementById(myInputElemId); //Redfeine reference to input box
                                $('.qvobject').addClass('charts-not-current');
                                var newValue = currElem.value;
                                app.variable.setContent(theVarName, newValue);
                                currElem = null; //Remove reference to input box
                            }
                        });
                    
                }
            currElem = null; //Remove reference to input box
            }

        };

    });
