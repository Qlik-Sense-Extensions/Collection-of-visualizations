define([], function () {
    'use strict';
    return {
        initialProperties: {
            refLineList: [],
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 5,
                    qHeight: 2000
                }]
            },
            selectionMode: "CONFIRM"
        }
    }
});