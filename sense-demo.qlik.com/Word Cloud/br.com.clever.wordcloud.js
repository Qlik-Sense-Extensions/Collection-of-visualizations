﻿/*
Copyright (c) 2015, Clever Anjos (clever@clever.com.br)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
/*global define , window, Qv, jQuery, d3, $, document  */
var self;
var mElement;
define([
    "qlik", 
    "jquery", 
    "./d3.min", 
    "./d3.layout.cloud", 
    "./br.com.clever.wordcloud.support", 
    "css!./styles.css"
], function (qlik, $, d3) {
    'use strict';
	var Paint = true;
    return {
        initialProperties : {
            version : 1.0,
            qHyperCubeDef : {
                qDimensions : [],
                qMeasures : [],
                qInitialDataFetch : [{
                    qWidth : 2,
                    qHeight : 100
                }]
            }
        },
        //property panel
        definition : {
            type : "items",
            component : "accordion",
            items : {
                dimensions : {
                    uses : "dimensions",
                    min : 1,
                    max : 1
                },
                measures : {
                    uses : "measures",
                    min : 1,
                    max : 1
                },
                sorting : {
                    uses : "sorting"
                },
                addons : {
                    uses : "addons",
                    items : {
                        Orientations : {
                            ref : "Orientations",
                            label : "Orientations",
                            type : "number",
                            defaultValue : 2,
                            min : 2,
                            max : 10
                        },
                        RadStart : {
                            ref : "RadStart",
                            label : "Start Angle",
                            type : "number",
                            defaultValue : -90,
                            min : -90,
                            max : 90
                        },
                        RadEnd : {
                            ref : "RadEnd",
                            label : "End Angle",
                            type : "number",
                            defaultValue : 90,
                            min : -90,
                            max : 90
                        },
                        MaxSize : {
                            ref : "MaxSize",
                            label : "Font Max Size",
                            type : "integer",
                            defaultValue : 100,
                            min : 10,
                            max : 200
                        },
                        MinSize : {
                            ref : "MinSize",
                            label : "Font Min Size",
                            type : "integer",
                            defaultValue : 20,
                            min : 10,
                            max : 200
                        },
                        Scale : {
                            type : "string",
                            component : "dropdown",
                            label : "Scale",
                            ref : "Scale",
                            options : [{
                                value : "log",
                                label : "Log"
                            }, {
                                value : "linear",
                                label : "Linear"
                            }],
                            defaultValue : "linear"
                        },
                        ScaleColor : {
                            type : "string",
                            component : "dropdown",
                            label : "Scale Color",
                            ref : "ScaleColor",
                            options : [{
                                value : "category10",
                                label : "category10"
                            }, {
                                value : "category20",
                                label : "category20"
                            }, {
                                value : "category20b",
                                label : "category20b"
                            }, {
                                value : "category20c",
                                label : "category20c"
                            }],
                            defaultValue : "category20"
                        },
                        customRange: {
                            type: "boolean",
                            component: "switch",
                            label: "Enable Custom Range",
                            ref: "customRange",
                            options: [{
                                value: true,
                                label: "On"
                            }, {
                                value: false,
                                label: "Off"
                            }],
                            defaultValue: false
                        },
                        customRangeFrom: {
                            type: "string",
                            expression: "none",
                            label: "From",
                            defaultValue: "#4477AA",
                            ref: "colorFrom",
                            show : function(data) {
                                if (data.customRange) {
                                    return true;
                                }
                            }
                        },
                        customRangeTo: {
                            type: "string",
                            expression: "none",
                            label: "To",
                            defaultValue: "#4477AA",
                            ref: "colorTo",
                            show : function(data) {
                                if (data.customRange) {
                                    return true;
                                }
                            }
                        },
                    }
                },
                settings : {
                    uses : "settings"
                }
            }
        },
        snapshot : {
            canTakeSnapshot : true
        },
        paint : function ($element, layout) {
					var id = "wordcloud_" + layout.qInfo.qId;
					self = this;
					mElement = $element;
					
					$('<div />').attr("id", id)
						.width($element.width())
						.height($element.height())
						.appendTo($($element).empty());

					var words = layout.qHyperCube.qDataPages[0].qMatrix.map(function (row) {
						// Map() method creates a new array with the results of calling a function on every element in this array
							return {
								text : row[0].qText,
								elemNumber: row[0].qElemNumber,
								value : row[1].qText
							};
						});
					var cloud = d3.wordcloud.id(id).width($element.width()).height($element.height());
					cloud.go(words, layout, Paint);
					
					Paint = false;
					
        }
    };
});