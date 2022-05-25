define(['qlik', "jquery", "css!./style.css"], function(qlik, $, cssContent) {
    'use strict';
    $("<style>").html(cssContent).appendTo("head");
    return {
        initialProperties: {
            qListObjectDef: {
                "qStateName": "$",
                "qShowAlternatives": true,
                "qInitialDataFetch": [{
                    "qTop": 0,
                    "qLeft": 0,
                    "qHeight": 50,
                    "qWidth": 1
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimension: {
                    type: "items",
                    label: "Dimensions",
                    ref: "qListObjectDef",
                    min: 1,
                    max: 1,
                    items: {
                        label: {
                            type: "string",
                            ref: "qListObjectDef.qDef.qFieldLabels.0",
                            label: "Label",
                            show: true
                        },
                        libraryId: {
                            type: "string",
                            component: "library-item",
                            libraryItemType: "dimension",
                            ref: "qListObjectDef.qLibraryId",
                            label: "Dimension",
                            show: function(data) {
                                return data.qListObjectDef && data.qListObjectDef.qLibraryId;
                            }
                        },
                        field: {
                            type: "string",
                            expression: "always",
                            expressionType: "dimension",
                            ref: "qListObjectDef.qDef.qFieldDefs.0",
                            label: "Field",
                            show: function(data) {
                                return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
                            }
                        },
                        frequency: {
                            type: "string",
                            component: "dropdown",
                            label: "Frequency mode",
                            ref: "qListObjectDef.qFrequencyMode",
                            options: [{
                                value: "N",
                                label: "No frequency"
                            }, {
                                value: "V",
                                label: "Absolute value"
                            }, {
                                value: "P",
                                label: "Percent"
                            }, {
                                value: "R",
                                label: "Relative"
                            }],
                            defaultValue: "V"
                        }
                    }
                },
                settings: {
                    uses: "settings"
                }
            }
        },
        snapshot: {
            canTakeSnapshot: false
        },
        paint: function($element, layout) {
            var self = this,
                html = "",
                list = [];



            //  console.log(self.backendApi.getDimensionInfos()[0]);
            var app = qlik.currApp();



            //  console.log(layout);
          /*  this.backendApi.getProperties().then(function(reply) {

                reply.qListObjectDef.qDef.qSortCriterias[0].qSortByState = 0;
                self.backendApi.setProperties(reply);
            });*/
            this.backendApi.eachDataRow(function(rownum, row) {
                html = '<span class=" data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText + '</span>' +html;
                // if (row[0].qFrequency) {
                //     html += '<span>' + row[0].qFrequency + '</span>';
                // }
              
            });
            //  html += "</ul>";
            $element.html(html);
            if (this.selectionsEnabled) {
                $element.find('.data').on('click', function() {
                    //console.log($(this));
                    if (this.hasAttribute("data-value") && !$(this).hasClass('stateS')) {
                        var value = parseInt(this.getAttribute("data-value"), 10),
                            dim = 0;
                        self.backendApi.selectValues(dim, [value], false);
                        $(this).toggleClass("serverSelected");
                    }
                });
            }
        }
    };
});
