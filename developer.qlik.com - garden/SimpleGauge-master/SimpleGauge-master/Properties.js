define(['qlik','./js/util'], function (qlik, utils) {
    var vFontFamily = [{
                        value: "Heebo, sans-serif",
                        label: "Heebo"
                    },{
                        value: "QlikView Sans, sans-serif",
                        label: "QlikView Sans"
                    },{
                        value: "Arial",
                        label: "Arial"
                    }, {
                        value: "Calibri",
                        label: "Calibri"
                    }, {
                        value: "Comic Sans MS",
                        label: "Comic Sans MS"
                    }, {
                        value: "erasdust",
                        label: "Eraser"
                    }, {
                        value: "Lucida Handwriting",
                        label: "Lucida Handwriting"
                    }, {
                        value: "OpenSans",
                        label: "OpenSans"
                    },{
                        value: "sans-serif",
                        label: "MS Sans Serif"
                    }, {
                        value: "Tahoma",
                        label: "Tahoma"
                    }, {
                        value: "Verdana",
                        label: "Verdana"
                    }, {
                        value: "Brush Script MT",
                        label: "Brush Script MT"
                    }, {
                        value: "Playfair Display, serif",
                        label: "Playfair Display"
                    }, {
                        value: "unset",
                        label: "Unset"
                    }];
    var vFontSizes = [{
                        value: "SimpleGauge-font-xxs",
                        label: "XXS"
                    }, {
                        value: "SimpleGauge-font-xs",
                        label: "XS"
                    }, {
                        value: "SimpleGauge-font-s",
                        label: "S"
                    },{
                        value: "SimpleGauge-font-m",
                        label: "M"
                    }, {
                        value: "SimpleGauge-font-ml",
                        label: "ML"
                    }, {
                        value: "SimpleGauge-font-l",
                        label: "L"
                    },{
                        value: "SimpleGauge-font-xl",
                        label: "XL"
                    }, {
                        value: "SimpleGauge-font-xxl",
                        label: "XXL"
                    }, {
                        value: "SimpleGauge-font-xxxl",
                        label: "XXXL"
                    }, {
                        value: "SimpleGauge-font-xxxxl",
                        label: "XXXXL"
                    }];
    var vNavBool = [{
                        value: "none",
                        label: "none"
                    }, {
                        value: "sheet",
                        label: "to a sheet"
                    }, {
                        value: "url",
                        label: "to a url"
                    }];
    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions",
                min: 0,
                max: 0,
                show: false
            },
            measures: {
                uses: "measures",
                min: 1,
                max: 5,
                items: {
                    //label zone
                    measColorLabelBool: {
                        ref : "qDef.meascolorlabelbool",
                        type : "boolean",
                        component : "switch",
                        label : "Define label color",
                        options: [{
                            value: false,
                            label: "Single"
                        }, {
                            value: true,
                            label: "Custom"
                        }],
                        defaultValue: false
                    },
                    measLabelCustom: {
                        type: "string",
                        ref: "qDef.meascolorlabelcustom",
                        label: "Label color expression",
                        defaultValue: '#7b7a78',
                        expression : "optional",
                        show : function(data) {
                            return data.qDef.meascolorlabelbool;
                        }
                    },
                    measLabelSingle: {
                        ref: "qDef.meascolorlabelsingle",
                        label: "Label single color",
                        type: "object",  
                        component: "color-picker",  
                        defaultValue: {  
                            color: "#7b7a78"  
                        },
                        show : function(data) {
                            return !data.qDef.meascolorlabelbool;
                        }
                    },
                    //measure zone
                    measColorMeasureBool: {
                        ref : "qDef.meascolormeasurebool",
                        type : "boolean",
                        component : "switch",
                        label : "Define measure color",
                        options: [{
                            value: false,
                            label: "Single"
                        }, {
                            value: true,
                            label: "Custom"
                        }],
                        defaultValue: false
                    },
                    measMeasureCustom: {
                        type: "string",
                        ref: "qDef.meascolormeasurecustom",
                        label: "Measure color expression",
                        defaultValue : '#cccccc',
                        expression : "optional",
                        show : function(data) {
                            return data.qDef.meascolormeasurebool;
                        }
                    },
                    measMeasureSingle: {
                        ref: "qDef.meascolormeasuresingle",
                        label: "Measure single color",
                        type: "object",  
                        component: "color-picker",  
                        defaultValue: {  
                            color: '#cccccc'  
                        },
                        show : function(data) {
                            return !data.qDef.meascolormeasurebool;
                        }
                    },
                    //background zone
                    measColorBackBool: {
                        ref : "qDef.meascolorbackbool",
                        type : "boolean",
                        component : "switch",
                        label : "Define background color",
                        options: [{
                            value: false,
                            label: "Single"
                        }, {
                            value: true,
                            label: "Custom"
                        }],
                        defaultValue: false,
                        show: function show(mea, handler) {
                            return handler.getMeasures()[0] === mea;                            
                        }
                    },
                    measBackCustom: {
                        type: "string",
                        ref: "qDef.meascolorbackcustom",
                        label: "Background color expression",
                        defaultValue: "#4CAF50",
                        expression : "optional",
                        show : function(mea,handler) {
                            return handler.getMeasures()[0] === mea && mea.qDef.meascolorbackbool;
                        }
                        /*show : function(mea,handler) {
                            return handler.getMeasures()[0].meascolorbackbool == true && handler.getMeasures()[0] === mea;
                        }*/
                    },
                    measBackSingle: {
                        ref: "qDef.meascolorbacksingle",
                        label: "Background single color",
                        type: "object",  
                        component: "color-picker",  
                        defaultValue: {  
                            color: "#4CAF50"  
                        },
                        show : function(mea,handler) {
                            return handler.getMeasures()[0] === mea && !mea.qDef.meascolorbackbool;                            
                        }
                        /*show : function(mea,handler) {
                            return handler.getMeasures()[0].meascolorbackbool == false && handler.getMeasures()[0] === mea;
                        }*/
                    },
                    measSize: {
                        ref: "qDef.meassize",
                        type: "string",
                        component: "dropdown",
                        label: "Font size",
                        options: vFontSizes,
                        defaultValue: "SimpleGauge-font-m"
                    },
                    measAlign: {
                        ref: "qDef.measalign",
                        type: "string",
                        component: "buttongroup",
                        options: [ {
                            value: 'left',
                            label: "left"
                        }, {
                            value: 'center',
                            label: "center"
                        }, {
                            value: "right",
                            label: "right"
                        }],
                        defaultValue: "center"                           
                    },
                    measFont: {
                        ref: "qDef.measfont",
                        type: "string",
                        component: "dropdown",
                        label: "Font Family",
                        options: vFontFamily,
                        defaultValue: "sans-serif"                        
                    }                    
                }
            },
            sorting: {
                uses: "sorting",
                show: false
            },
            settings: {
                uses: "settings",
                items: {
                    gaugeGroup: {
                        label: "Gauge settings",
                        type: "items",
                        items: {
                            gaugeType: {
                                ref: "gaugetype",
                                type: "string",
                                component: "buttongroup",
                                options: [ {
                                    value: 'line',
                                    label: "Line"
                                }, {
                                    value: 'circle',
                                    label: "Circle"
                                }],
                                defaultValue: "line"
                            },
                            showMeasTitle: {
                                ref : "showmeastitle",
                                type : "boolean",
                                component : "switch",
                                label : "Show Measure Title",
                                options: [{
                                    value: true,
                                    label: "On"
                                }, {
                                    value: false,
                                    label: "Off"
                                }],
                                defaultValue: true
                            },
                            minValue: {
                                type: "number",
                                ref: "minValue",
                                label: "minValue",
                                expression : "optional",
                                defaultValue: 0
                            },
                            maxValue: {
                                type: "number",
                                ref: "maxValue",
                                label: "maxValue",
                                expression : "optional",
                                defaultValue: 1
                            },                                                                        
                            animeSecs: {
                                type: "number",
                                ref: "animeSecs",
                                label: "Anime secs",
                                defaultValue: 1.4
                            },
                            borderBool: {
                                ref : "borderbool",
                                type : "boolean",
                                component : "switch",
                                label : "Set a border",
                                options: [{
                                    value: true,
                                    label: "On"
                                }, {
                                    value: false,
                                    label: "Off"
                                }],
                                defaultValue: false
                            },
                            borderColor: {
                                ref: "bordercolor",
                                label: "Border color",
                                type: "object",  
                                component: "color-picker",  
                                defaultValue: {  
                                    color: "#f2f2f2"  
                                },
                                show : function(data) {
                                    return  data.borderbool;
                                }
                            },
                            borderWidth: {
                                type: "number",
                                component: "slider",
                                label: "Border width",
                                ref: "borderwidth",
                                min: 1,
                                max: 5,
                                step: 1,
                                defaultValue: 1,
                                show : function(data) {
                                    return  data.borderbool;
                                }                               
                            },
                            backgroundBool: {
                                ref : "backgroundbool",
                                type : "boolean",
                                component : "switch",
                                label : "Background transparent",
                                options: [{
                                    value: true,
                                    label: "On"
                                }, {
                                    value: false,
                                    label: "Off"
                                }],
                                defaultValue: true
                            },
                            backgroundColorBox: {
                                ref: "backgroundcolorbox",
                                label: "Background color",
                                type: "object",  
                                component: "color-picker",  
                                defaultValue: {  
                                    color: "#ffffff"  
                                },
                                show : function(data) {
                                    return  data.backgroundbool == false;
                                }  
                            },
                            paragraphBool: {
                                ref : "extrapbool",
                                type : "boolean",
                                component : "switch",
                                label : "Extra paragraph",
                                options: [{
                                    value: true,
                                    label: "On"
                                }, {
                                    value: false,
                                    label: "Off"
                                }],
                                defaultValue: false
                            },
                            extraParagraph: {
                                ref : "extraptext",
                                label : "Extra paragraph", 
                                expression : "optional",
                                type : "string",
                                defaultValue : '',
                                show : function(data) {
                                    return  data.extrapbool;
                                }                                
                            },
                            extraParagraphSize: {                                
                                ref: "extrapsize",
                                type: "string",
                                component: "dropdown",
                                label: "Font size",
                                options: vFontSizes,
                                defaultValue: "SimpleGauge-font-m",
                                show : function(data) {
                                    return  data.extrapbool;
                                }
                            },
                            extraParagraphColor: {
                                ref: "extrapcolor",
                                label: "Text color",
                                type: "object",  
                                component: "color-picker",  
                                defaultValue: {  
                                    color: "#545352"  
                                },
                                show : function(data) {
                                    return  data.extrapbool;
                                }
                            },
                            extraParagraphFont: {
                                ref: "extrapfont",
                                type: "string",
                                component: "dropdown",
                                label: "Font Family",
                                options: vFontFamily,
                                defaultValue: "Playfair Display, serif",
                                show : function(data) {
                                    return data.extrapbool;
                                }
                            },                            
                            extraTextBool: {
                                ref : "extratbool",
                                type : "boolean",
                                component : "switch",
                                label : "Extra info in main KPI",
                                options: [{
                                    value: true,
                                    label: "On"
                                }, {
                                    value: false,
                                    label: "Off"
                                }],
                                defaultValue: false
                            },
                            extraText: {
                                ref : "extrattext",
                                label : "Extra text", 
                                expression : "optional",
                                type : "string",
                                defaultValue : '',
                                show : function(data) {
                                    return  data.extratbool;
                                }                                
                            }
                        }
                    },
                    gaugeNavigation: {
                        component: "items",
                        label: "Navigation",
                        items: {
                            GaugeNavigationBool: {
                                ref: "gaugenavbool",
                                type: "string",
                                component: "dropdown",
                                label: "Navigation",
                                options: vNavBool,
                                defaultValue: "none"
                            },
                            GaugeNavigationSheet: {
                                type: "string",
                                component: "dropdown",
                                label: "Select Sheet",
                                ref: "gaugesheetid",
                                options: utils.getPPList({listType: 'sheet', sortBy: 'title'}),
                                show : function(data) {
                                    return data.gaugenavbool == 'sheet';
                                }
                            },
                            GaugeNavigationUrl: {
                                type: "string",
                                ref: "gaugenavurl",
                                label: "Url",
                                defaultValue : "",
                                expression : "optional",
                                show : function(data) {
                                    return data.gaugenavbool == 'url';
                                }
                            }
                        }
                    },
                    about: {
                        component: "items",
                        label: "About",
                        items: {
                            header: {
                                label: "Simple Gauge Visualization",
                                style: "header",
                                component: "text"
                            },
                            paragraph1: {
                                label: "Simple Gauge visualization is a highly customizable dynamic gauge.",
                                component: "text"
                            },
                            paragraph2: {
                                label: "Simple Gauge visualization is an extension created by Ivan Felipe, offered under MIT License.",
                                component: "text"
                            }
                        }
                    } 
                }
            }
        }
    }
});