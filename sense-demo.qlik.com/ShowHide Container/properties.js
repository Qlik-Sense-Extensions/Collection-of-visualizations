define(['./getMasterItems'], function (getMasterItems) {

    var settingsDefinition = {
        uses: 'settings',
        items: {
            defaultVis: {
                label: 'Default Visualization',
                type: 'items',
                items: {                
                    list: {
                        type: "string",
                        component: "dropdown",
                        label: "Master Object",
                        ref: "defaultMasterObject",
                        options: function () {
                            return getMasterItems().then(function (items) {
                                return items;
                            });
                        }
                    }
                }

            },
            conditionalVis: {
                type: 'array',
                ref: 'conditionalVis',
                label: 'Conditional Visualizations',
                itemTitleRef: function(data){return data.conditionalMasterObject.split('|')[0]},
                allowAdd: true,
                allowRemove: true,
                addTranslation: 'Add Conditional Visualization',
                items: {
                    conditionalMasterObject: {
                        type: "string",
                        component: "dropdown",
                        label: "Master Object",
                        ref: "conditionalMasterObject",
                        options: function () {
                            return getMasterItems().then(function (items) {
                                return items;
                            });
                        }
                    },
                    condition: {
                        ref: 'condition',
                        label: 'Show Condition for Chart',
                        type: 'integer',
                        defaultValue: '0',
                        expression: 'optional'
                    }
                }
            }
        }
    };

    return {
        type: "items",
        component: "accordion",
        items: {
            settings: settingsDefinition
        }
    }

});