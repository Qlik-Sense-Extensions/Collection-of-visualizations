define([], function() {

    var enabled = {
        type: "boolean",
        component: "switch",
        label: "Enable legends",
        ref: "amChart.legend.enabled",
        options: [{
            value: true,
            label: "On"
        },
        {
            value: false,
            label: "Off"
        }],
        defaultValue: true
    };
    var position = {
        type: "string",
        component: "dropdown",
        label: "Legend position",
        ref: "amChart.legend.position",
        options: [{
            value: "top",
            label: "Top"
        }, {
            value: "bottom",
            label: "Bottom"
        },
        {
            value: "left",
            label: "Left"
        },
        {
            value: "right",
            label: "Right"
        }],
        defaultValue: "top",
    };

    return {
        type: "items",
        label: "amChart.legend",
        items: {
            enabled: enabled,
            position: position
        }
    };

});
