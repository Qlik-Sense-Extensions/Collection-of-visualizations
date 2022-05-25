define([], function() {

    var text = {
        type: "string",
        label: "Title text",
        ref: "amChart.titles.text",
        defaultValue: "Wombo Combo Chart"
    };

    var alpha = {
        type: "number",
        label: "Opacity",
        ref: "amChart.titles.alpha",
        component: "slider",
        min: 0,
        max: 1,
        step: 0.1,
        defaultValue: 1
    };

    var bold = {
        type: "boolean",
        label: "Bold",
        ref: "amChart.titles.bold",
        component: "switch",
        options: [{
            value: true,
            label: "On"
        }, {
            value: false,
            label: "Off"
        }],
        defaultValue: true
    };

    var color = {
        type: "string",
        label: "Color",
        ref: "amChart.titles.color"
    };

    var size = {
        type: "number",
        label: "Font Size",
        ref: "amChart.titles.size",
        defaultValue: 12
    };

    return {
        type: "items",
        label: "amChart.titles",
        items: {
            text: text,
            alpha: alpha,
            bold: bold,
            size: size
        }
    };
});
