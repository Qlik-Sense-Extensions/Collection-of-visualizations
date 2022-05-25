define([], function () {
  "use strict";

  var dimensions = { uses: "dimensions" };
  var sorting = { uses: "sorting" };
  var appearancePanel = { uses: "settings" };
  return {
    type: "items",
    component: "accordion",
    items: {
      dimensions: {
        type: "array",
        ref: "lists",
        label: "Dimensions",
        allowAdd: true,
        allowRemove: true,
        addTranslation: "Add Field",
        itemTitleRef: function (data) {
          return data.fieldLabel
            ? data.fieldLabel
            : data.qListObjectDef.qDef.qFieldDefs[0];
        },
        items: {
          fieldName: {
            component: "string",
//            expression: "optional",
            ref: "qListObjectDef.qDef.qFieldDefs.0",
            defaultValue: "",
            label: "Field",
          },
          fieldType: {
            type: "string",
            component: "dropdown",
            ref: "fieldType",
            label: "Field Type",
            defaultValue: "LIST",
            options: [
              {
                value: "LIST",
                label: "List",
              },
              {
                value: "DROPDOWN",
                label: "Dropdown",
              },
            ],
          },
          showFieldLabel: {
            type: "boolean",
            component: "switch",
            ref: "showFieldLabel",
            label: "Show field label",
            defaultValue: false,
            options: [
              {
                value: false,
                label: "No",
              },
              {
                value: true,
                label: "Yes",
              },
            ],
          },
          fieldLabel: {
            type: "string",
            expression: "optional",
            ref: "fieldLabel",
            label: "Label",
            show: function (data) {
              return data.showFieldLabel;
            },
          },
          labelPosition: {
            type: "string",
            component: "dropdown",
            ref: "fieldLabelPos",
            label: "Label position",
            defaultValue: "Up",
            options: [
              {
                value: "UP",
                label: "Up",
              },
              {
                value: "LEFT",
                label: "Left",
              },
            ],
            show: function (data) {
              return data.showFieldLabel && data.fieldType != "DROPDOWN";
            },
          },
          sortDefault: {
            type: "boolean",
            ref: "sortDefault",
            label: "Sort Order",
            component: "switch",
            defaultValue: true,
            options: [
              {
                value: true,
                label: "Automatic",
              },
              {
                value: false,
                label: "Custom",
              },
            ],
          },
          sortByLoadOrder: {
            type: "number",
            component: "dropdown",
            label: "Sort by load order",
            ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByLoadOrder",
            defaultValue: 0,
            options: [
              { value: 1, label: "Ascending" },
              { value: 0, label: "No" },
              { value: -1, label: "Descending" },
            ],
            show: function (data) {
              return !data.sortDefault;
            },
          },
          sortByNumeric: {
            type: "number",
            component: "dropdown",
            label: "Sort by numeric",
            ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByNumeric",
            defaultValue: 0,
            options: [
              { value: 1, label: "Ascending" },
              { value: 0, label: "No" },
              { value: -1, label: "Descending" },
            ],
            show: function (data) {
              return !data.sortDefault;
            },
          },
          sortByAscii: {
            type: "number",
            component: "dropdown",
            label: "Sort by alphabetical",
            ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByAscii",
            defaultValue: 0,
            options: [
              { value: 1, label: "Ascending" },
              { value: 0, label: "No" },
              { value: -1, label: "Descending" },
            ],
            show: function (data) {
              return !data.sortDefault;
            },
          },
          initialDataFetchWidth: {
            type: "number",
            ref: "qListObjectDef.qInitialDataFetch.0.qWidth",
            label: "qWidth",
            show: false,
            defaultValue: 10,
          },
          dataSizeSwitch: {
            type: "boolean",
            ref: "dataSizeSwitch",
            label: "Data Size",
            component: "switch",
            defaultValue: false,
            options: [
              {
                value: false,
                label: "Default",
              },
              {
                value: true,
                label: "Custom",
              },
            ],
          },
          initialDataFetchHeight: {
            type: "number",
            ref: "qListObjectDef.qInitialDataFetch.0.qHeight",
            label: "Data size limit",
            show: (data) => {
              return data.dataSizeSwitch;
            },
            defaultValue: 100,
          },
        },
      },
      settings: {
        uses: "settings",
        items: {
          // Labels settings
          labelsFontSettings: {
            type: "items",
            label: "Labels font settings",
            items: {
              fontSize: {
                type: "string",
                component: "dropdown",
                ref: "settings.labels.fontSize",
                label: "Font size",
                options: [
                  { value: "small", label: "Small" },
                  { value: "medium", label: "Medium" },
                  { value: "large", label: "Large" },
                ],
              },
              fontStyle: {
                type: "number",
                component: "dropdown",
                ref: "settings.labels.fontWeight",
                label: "Font weigth",
                options: [
                  { value: 400, label: "Normal" },
                  { value: 600, label: "Bold" },
                ],
              },
            },
          },
          valuesFontSettings: {
            type: "items",
            label: "Values font settings",
            items: {
              fontSize: {
                type: "string",
                component: "dropdown",
                ref: "settings.values.fontSize",
                label: "Font size",
                options: [
                  { value: "small", label: "Small" },
                  { value: "medium", label: "Medium" },
                  { value: "large", label: "Large" },
                ],
              },
              fontStyle: {
                type: "number",
                component: "dropdown",
                ref: "settings.values.fontWeight",
                label: "Font weigth",
                options: [
                  { value: 400, label: "Normal" },
                  { value: 600, label: "Bold" },
                ],
              },
            },
          },
        },
      },
    },
  };
});
