define([], function () {
    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions",
                min: 0,
                max: 0                
            },
            measures: {
                uses: "measures",
                min: 0,
                max: 0
            },
            sorting: {
                uses: "sorting",
                show: false
            },
            settings: {
                uses: "settings",
                items: {
                    Options: {
                        label: "Options",
                        type: "items",
                        items: {
                            Options : {
                                ref : "searchbool",
                                type : "boolean",
                                component : "switch",
                                label : "Avoid all Searches",
                                options: [{
                                    value: true,
                                    label: "On"
                                }, {
                                    value: false,
                                    label: "Off"
                                }],
                                defaultValue: false                                
                            }                                                
                        }
                    }                                                    
                }
            }
        }
    }
});