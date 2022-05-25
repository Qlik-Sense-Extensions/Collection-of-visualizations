define(['jquery','underscore','qlik','ng!$q'], function ($, _, qlik, $q) {
    var getFieldList = function () {
        var defer = $q.defer();
        var app = qlik.currApp(this);
        app.getList( 'FieldList', function (items) {
            defer.resolve( items.qFieldList.qItems.map( function (item) {
                return {
                    value: item.qName,
                    label: item.qName
                }
            }));
        });
        return defer.promise;
    };

    var settingsDefinition = {
        uses: 'settings',
        type: "items",
        items: {
            fieldSelection: {
                label: 'Field Selection',
                type: 'items',
                items: {                
                    list: {
                        type: "string",
                        component: "dropdown",
                        label: "Field",
                        ref: "field",
                        options: function () {
                            return getFieldList().then(function (items) {
                                return items;
                            });
                        },
                        defaultValue: ''
                    },
                    isNumeric: {
                        type: "boolean",
                        component: "checkbox",
                        label: "Numeric?",
                        ref: "isNumeric",
                        defaultValue: false
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