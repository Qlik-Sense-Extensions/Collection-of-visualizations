define([], function() {
    'use strict';

    var dimensions = {
        type: "items",
        label: "Dimensions",
        ref: "qListObjectDef",
        items: {
            showLabel: {
                ref: "qListObjectDef.qDef.qFieldShowLabel",
                translation: "Show Label",
                type: "boolean",
                component: "switch",
                defaultValue: false,
                options: [{
                    value: true,
                    label: "On"
                }, {
                    value: false,
                    label: "Off"
                }],
                show: true
            },
            label: {
                type: "string",
                ref: "qListObjectDef.qDef.qFieldLabels.0",
                label: "Label",
                show: function (e) {
                    return e.qListObjectDef.qDef.qFieldShowLabel
                }
            },
            labelPos: {
                ref: "qListObjectDef.qDef.qFieldLabelPos",
                expression: "optional",
                translation: "Label Position",
                type: "string",
                defaultValue: "text-align:left",
                component: "dropdown",
                options: [{
                    value: "text-align:left !important;",
                    label: "left"
                }, {
                    value: "text-align:center !important;",
                    label: "center"
                }, {
                    value: "text-align:right !important;",
                    label: "right"
                }],
                show: function (e) {
                    return e.qListObjectDef.qDef.qFieldShowLabel
                }
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
            qSortByState: {
                type: "numeric",
                component: "dropdown",
                label: "Sort by State",
                ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByState",
                options: [{
                    value: 1,
                    label: "Ascending"
                }, {
                    value: 0,
                    label: "No"
                }, {
                    value: -1,
                    label: "Descending"
                }],
                defaultValue: 0,

            },
            qSortByNumeric: {
                type: "numeric",
                component: "dropdown",
                label: "Sort by Numeric",
                ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByNumeric",
                options: [{
                    value: 1,
                    label: "Ascending"
                }, {
                    value: 0,
                    label: "No"
                }, {
                    value: -1,
                    label: "Descending"
                }],
                defaultValue: 0,

            },
            qSortByLoadOrder: {
                type: "numeric",
                component: "dropdown",
                label: "Sort by Load Order",
                ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByLoadOrder",
                options: [{
                    value: 1,
                    label: "Ascending"
                }, {
                    value: 0,
                    label: "No"
                }, {
                    value: -1,
                    label: "Descending"
                }],
                defaultValue: 0,

            },
            qSortByFrequency: {
                type: "numeric",
                component: "dropdown",
                label: "Sort by Frequence",
                ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByFrequency",
                options: [{
                    value: -1,
                    label: "Ascending"
                }, {
                    value: 0,
                    label: "No"
                }, {
                    value: 1,
                    label: "Descending"
                }],
                defaultValue: 0,

            },
            qSortByAscii: {
                type: "numeric",
                component: "dropdown",
                label: "Sort by Alphabetical",
                ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByAscii",
                options: [{
                    value: 1,
                    label: "Ascending"
                }, {
                    value: 0,
                    label: "No"
                }, {
                    value: -1,
                    label: "Descending"
                }],
                defaultValue: 0,
            }
        }
    };

    var appearancePanel = {
        uses: "settings",
        items: {
            settings: {
                type: "items",
                label: "Settings",
                items: {
                    FixedWidth: {
                        ref: "vars.FixedWidth",
                        expression: "optional",
                        translation: "Custom CSS for cell inline-style",
                        type: "string",
                        defaultValue: ""
                    },
                    CustomRow: {
                        ref: "vars.CustomRow",
                        expression: "optional",
                        translation: "Custom CSS for row inline-style",
                        type: "string",
                        defaultValue: ""
                    },
                    fieldSize: {
                        ref: "vars.FieldSize",
                        expression: "optional",
                        translation: "Cell Size:",
                        type: "string",
                        defaultValue: "li-medium",
                        component: "dropdown",
                        options: [{
                            value: "li-mini",
                            label: "Extra Small"
                        }, {
                            value: "li-small",
                            label: "Small"
                        }, {
                            value: "li-medium",
                            label: "Medium"
                        }, {
                            value: "li-large",
                            label: "Large"
                        }]
                    },
                    LabelAlign: {
                        ref: "vars.LabelAlign",
                        expression: "optional",
                        translation: "Cell Value Align",
                        type: "string",
                        defaultValue: "text-align:center;",
                        component: "dropdown",
                        options: [{
                            value: "text-align:left;",
                            label: "left"
                        }, {
                            value: "text-align:center;",
                            label: "center"
                        }, {
                            value: "text-align:right;",
                            label: "right"
                        }]
                    }
                }
            }
        }
    };

    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: dimensions,
            appearance: appearancePanel
        }
    };
});
