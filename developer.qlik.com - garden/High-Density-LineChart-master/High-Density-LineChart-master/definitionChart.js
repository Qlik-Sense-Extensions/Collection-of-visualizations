define([], function () {
    'use strict';

    return {
        
        qInitialDataFetch: {
            qWidth: 20,
			qHeight: 500
        },
        
        type: "line",

            dimensions: {
                min: 1,
                max: 2
            },

            measures: {
                min: 1,
                max: 20
            },


            presentation: {
                modeOptions: [/*{
                    value: "lines",
                    label: "Lines"
                },*/ 
                {
                    value: "lines+markers",
                    label: "Lines"
                }, {
                    value: "markers",
                    label: "Data points"
                },{
                    value: "lines+markers+text",
                    label: "Lines+Text"
                }, {
                    value: "markers+text",
                    label: "Data points+Text"
                }],
                modeDefaultValue: "lines+markers",

                showLineProps: true,
                showMarkerPops: false

            
            },
            color: {
                colorMode: 
                [{
                    value: "primary",
                    translation: "properties.colorMode.primary"
                }, {
                    value: "byDimension",
                    translation: "properties.colorMode.byDimension"
                }, {
                    value: "byExpression",
                    translation: "properties.colorMode.byExpression"
                }]
            }



            
             }
});