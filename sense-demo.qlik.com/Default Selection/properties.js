define(['jquery','underscore','qlik','ng!$q'], function ($, _, qlik, $q) {
    var getFieldList = function () {
        var defer = $q.defer();
        qlik.currApp().getList( 'FieldList', function (items) {
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
                    field: {
                        type: "string",
                        component: "dropdown",
                        label: "Field Name",
                        ref: "field",
                        options: function () {
                            return getFieldList().then(function (items) {
                                return items;
                            });
                        },
                        defaultValue: ''
                    },
                    fieldvalue: {
                        ref: "fieldvalue",
                        label: "Field Value",
                        type: "string",
                        expression: "optional",
                        defaultValue: ''
                    }
                    ,
                    numericflag: {
                        type: "boolean",
                        component: "switch",
                        label: "Numeric",
                        ref: "numericFlag",
                        options: [{
                            value: true,
                            label: "Numeric"
                        }, {
                            value: false,
                            label: "String"
                        }],
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