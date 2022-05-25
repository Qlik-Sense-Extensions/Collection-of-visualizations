define([], function() {

    var fontSize = {
        type: "number",
        label: "Font Size",
        ref: "amChart.categoryAxis.fontSize",
        defaultValue: 12
    };
    var Title = {
        type: "string",
        label: "Title",
        ref: "amChart.categoryAxis.Title",
        defaultValue: "Category Label"
    };

    var labelRotation = {
        type: "number",
        component: "slider",
        label: "Rotate Category Labels",
        ref: "amChart.categoryAxis.labelRotation",
        min: 0,
        max: 90,
        step: 1,
        defaultValue: 0
    };

    return {
        type: "items",
        label: "amChart.categoryAxis",
        items: {
            fontSize: fontSize,
            Title: Title,
            labelRotation: labelRotation,
        }
    };

});
