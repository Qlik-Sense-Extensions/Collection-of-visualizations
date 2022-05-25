define(
    [
        'jquery',
        "css!./QlikLegend.css"
    ],
    function($, cssContent) {
        'use strict';
        return {
            definition: {
                type: "items",
                component: "accordion",
                items: {

                    appearance: {
                        uses: "settings",
                        items: {
							
							//The legend starts 
							//The first one 
                            myTextBox1: {
                                type: "items",
                                label: "First Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox1",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: true,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox1",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox1",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox1",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The second one 
                            myTextBox2: {
                                type: "items",
                                label: "Second Legend",
                                items: {

                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox2",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: true,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox2",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox2",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox2",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The third one 
                            myTextBox3: {
                                type: "items",
                                label: "Third Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox3",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox3",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox3",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox3",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The fourth one 
                            myTextBox4: {
                                type: "items",
                                label: "Fourth Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox4",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox4",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox4",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox4",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            } , 
							//The legend ends 
							
							//Add more legend starts
							//The 5 
                            myTextBox5: {
                                type: "items",
                                label: "5th Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox5",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: true,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox5",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox5",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox5",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The 6
                            myTextBox6: {
                                type: "items",
                                label: "6th Legend",
                                items: {

                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox6",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: true,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox6",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox6",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox6",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The 7
                            myTextBox7: {
                                type: "items",
                                label: "7th Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox7",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox7",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox7",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox7",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The 8
                            myTextBox8: {
                                type: "items",
                                label: "8th Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox8",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox8",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox8",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox8",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            }  , 

							//The 9
                            myTextBox9: {
                                type: "items",
                                label: "9th Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox9",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: true,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox9",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox9",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox9",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The 10
                            myTextBox10: {
                                type: "items",
                                label: "10th Legend",
                                items: {

                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox10",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: true,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox10",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox10",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox10",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The 11 
                            myTextBox11: {
                                type: "items",
                                label: "11th Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox11",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox11",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox11",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox11",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The 12
                            myTextBox12: {
                                type: "items",
                                label: "12th Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox12",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox12",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox12",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox12",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            } , 

							//The 13
                            myTextBox13: {
                                type: "items",
                                label: "13th Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox13",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: true,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox13",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox13",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox13",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The 14
                            myTextBox14: {
                                type: "items",
                                label: "14th Legend",
                                items: {

                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox14",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: true,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox14",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox14",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox14",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The 15
                            myTextBox15: {
                                type: "items",
                                label: "15th Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox15",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox15",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox15",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox15",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            },
							
							//The 16
                            myTextBox16: {
                                type: "items",
                                label: "16th Legend",
                                items: {
                                    visibleBox: {
                                        label: "Is Visible?",
                                        ref: "myVisibleBox16",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    },
                                    textBox: {
                                        label: "Name",
                                        ref: "myTextBox16",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    colorBox: {
                                        label: "Color",
                                        ref: "myColorBox16",
                                        type: "string",
                                        expression: "optional"
                                    },
                                    typeBox: {
                                        label: "Line/Box",
                                        ref: "myTypeBox16",
                                        type: "boolean",
                                        component: "switch",
                                        defaultValue: false,
                                        options: [{
                                                value: true,
                                            },
                                            {
                                                value: false

                                            }
                                        ]
                                    }
                                }
                            }

							//Add more legend ends 

                        }
                    }
                }
            },
            support: {
                snapshot: true,
                export: true,
                exportData: true
            },

            paint: function($element, layout) {


                $element.empty();
                var legendSpecs = {
                    measureName: [layout.myTextBox1, layout.myTextBox2, layout.myTextBox3, layout.myTextBox4, layout.myTextBox5, layout.myTextBox6, layout.myTextBox7, layout.myTextBox8,  layout.myTextBox9, layout.myTextBox10, layout.myTextBox11, layout.myTextBox12,  layout.myTextBox13, layout.myTextBox14, layout.myTextBox15, layout.myTextBox16  ],
                    background_color: [layout.myColorBox1, layout.myColorBox2, layout.myColorBox3, layout.myColorBox4 , layout.myColorBox5, layout.myColorBox6, layout.myColorBox7, layout.myColorBox8, layout.myColorBox9, layout.myColorBox10, layout.myColorBox11, layout.myColorBox12 , layout.myColorBox13, layout.myColorBox14, layout.myColorBox15, layout.myColorBox16 ],
                    type: [layout.myTypeBox1, layout.myTypeBox2, layout.myTypeBox3, layout.myTypeBox4  , layout.myTypeBox5, layout.myTypeBox6, layout.myTypeBox7, layout.myTypeBox8 , layout.myTypeBox9, layout.myTypeBox10, layout.myTypeBox11, layout.myTypeBox12 ,layout.myTypeBox13, layout.myTypeBox14, layout.myTypeBox15, layout.myTypeBox16 ],
                    visible: [layout.myVisibleBox1, layout.myVisibleBox2, layout.myVisibleBox3, layout.myVisibleBox4 ,layout.myVisibleBox5, layout.myVisibleBox6, layout.myVisibleBox7, layout.myVisibleBox8 ,layout.myVisibleBox9, layout.myVisibleBox10, layout.myVisibleBox11, layout.myVisibleBox12 ,layout.myVisibleBox13, layout.myVisibleBox14, layout.myVisibleBox15, layout.myVisibleBox16 ]

                }
                //console.log(document.getElementById(layout.qInfo.qId), layout.qHyperCube ) ;
                var legend = '\
					<div class="legend" id="' + layout.qInfo.qId + '">';
                var columnWidth = ($element.width()/4 )< 140 ? 140  : ($element.width()/4) ;
                for (var i = 0; i < legendSpecs.measureName.length; i++) {
                    if (legendSpecs.visible[i]) {
                        let legendType = legendSpecs.type[i] ? 'box' : 'line';
                        legend += '<div class="column" style="font-size:12px' + ';width:' + columnWidth + 'px' + '"><div class="' + legendType + '" style="background-color:' + legendSpecs.background_color[i] + '"></div>' + '<b>' + legendSpecs.measureName[i] + '</b>' + '</div>';
                    }
                }

                legend += '</div>';

                $element.html(legend);

            }
        };
    }
);
