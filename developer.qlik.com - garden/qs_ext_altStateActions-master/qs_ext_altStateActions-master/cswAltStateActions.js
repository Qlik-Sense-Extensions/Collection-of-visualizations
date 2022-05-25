define(["jquery", "qlik"], function ($, qlik) {
    'use strict';
    //$("<style>").html(cssContent).appendTo("head");

    function copyStates(app, fromState, toState) {
        app.clearAll(false, toState);  // clear selections in target State
        app.getObject(null, 'CurrentSelections').then(function (ret) {
            // get all selections
            var allSel = ret.layout.selectionsInStates;
            var fromStateSel;
            // find the selections that belong to the toState 
            allSel.forEach(function (sel) {
                if (sel.stateName == fromState) fromStateSel = sel.qSelectionObject.qSelections;
            });

            //console.log(fromStateSel);
            fromStateSel.forEach(function (fieldDesc, i) {
                console.log('Selection found in field ', fieldDesc);
                var fieldName = fieldDesc.name;
                var fieldObj = app.field(fieldName, toState);
                fieldObj.clear();
                var secretSauce = "[" + fieldName + "]=Aggr(Only({<[" + fieldName + "]=P([" + fromState + "]::[" + fieldName + "])>} [" + fieldName + "]), [" + fieldName + "])";
                fieldObj.selectMatch("=" + secretSauce, true, true);
                fieldObj.selectPossible();
            });

        });
        return true;
    }

    return {

        initialProperties: {},
        definition: {

            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings"
                },
                customProperties: {
                    component: "expandable-items",
                    label: "Custom Properties",
                    type: "items",
                    items: {
                        Layout: {
                            type: "items",
                            label: "Extension Settings",
                            items: [
                                /*{
                                    ref: "mystate",
                                    label: "Alternate State",
                                    type: "string",
                                    component: "dropdown",
                                    //defaultValue : "$",		
                                    options: function () {
                                        var retArr = [];
                                        return qlik.currApp().getAppLayout().then(function (a) {
                                            return a.layout.qStateNames.map(function (state) {
                                                return { value: state, label: state }
                                            })
                                        });
                                    }
                                },*/
                                {
                                    type: "string",
                                    ref: "enterStyle",
                                    label: "Enter button style (CSS)",
                                    defaultValue: "margin:2px;display:block;width:200px;"
                                }, {
                                    type: "string",
                                    ref: "labelCopyButton1",
                                    label: "Button Label: Copy Into Alt. State",
                                    defaultValue: "Copy Main \u25B6 Alt. State",
                                    expression: "optional"
                                }, {
                                    type: "string",
                                    ref: "labelCopyButton2",
                                    label: "Button Label: Copy From Alt. State",
                                    defaultValue: "Copy Main \u25C0 Alt. State",
                                    expression: "optional"
                                }, {
                                    type: "string",
                                    ref: "labelClearButton1",
                                    label: "Button Label: Clear Main State",
                                    defaultValue: "Clear Main State",
                                    expression: "optional"
                                }, {
                                    type: "string",
                                    ref: "labelClearButton2",
                                    label: "Button Label: Clear Alt State",
                                    defaultValue: "Clear Alt. State",
                                    expression: "optional"
                                }
                            ]
                        }
                    }
                }
            }
        },

        support: {
            snapshot: false,
            export: false,
            exportData: false
        },

        paint: function ($element, layout) {

            $element.css('overflow', 'auto');
            //console.dir(layout);

            var self = this;
            var ownId = this.options.id;
            var app = qlik.currApp(this);
            console.log('layout', layout);
            var html = '';

            if (layout.qStateName == '' || layout.qStateName == '$') {

                html += '<p style="color:red;">Please select an alternate state in the settings.</p>';
                $element.html(html);

            } else {
                if (layout.labelCopyButton1.length > 0) {
                    html += '<button class="lui-button" style="' + layout.enterStyle + '" id="' + ownId + 'Copy1">';
                    html += layout.labelCopyButton1 + '</button>';
                }
                if (layout.labelCopyButton2.length > 0) {
                    html += '<button class="lui-button" style="' + layout.enterStyle + '" id="' + ownId + 'Copy2">';
                    html += layout.labelCopyButton2 + '</button>';
                }
                if (layout.labelClearButton1.length > 0) {
                    html += '<button class="lui-button" style="' + layout.enterStyle + '" id="' + ownId + 'Clear1">';
                    html += layout.labelClearButton1 + '</button>';
                }
                if (layout.labelClearButton2.length > 0) {
                    html += '<button class="lui-button" style="' + layout.enterStyle + '" id="' + ownId + 'Clear2">';
                    html += layout.labelClearButton2 + '</button>';
                }
                $element.html(html);

                $element.find("#" + ownId + 'Copy1').on("click", function () {
                    copyStates(app, "$", layout.qStateName);
                });

                $element.find("#" + ownId + 'Copy2').on("click", function () {
                    copyStates(app, layout.qStateName, "$");
                });

                $element.find("#" + ownId + 'Clear1').on("click", function () {
                    app.clearAll(false, "$");
                });

                $element.find("#" + ownId + 'Clear2').on("click", function () {
                    app.clearAll(false, layout.qStateName);
                });
            }
        }
    };
});
