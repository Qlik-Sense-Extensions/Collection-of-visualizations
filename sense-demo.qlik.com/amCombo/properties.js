define([
    './amGraph',
    './amChart'
], function(amGraph, amChart) {

    var dimensions = {
        uses: "dimensions",
        min: 1,
        max: 1
    };

    var measures = {
        uses: "measures",
        min: 1,
        items: amGraph
    };

    var sorting = {
        uses: "sorting"
    };

    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: dimensions,
            measures: measures,
            sorting: sorting,
            amChart: amChart
        }
    };
});


