define([], function () {
	"use strict";
  
  var defaultUse= !![]; // true = palette, faalse = custom
  var defaultRev= ![]; // false = no reverse
  var defaultGradientCalc="absolute";
  var defaultGradientRange="full";
  var defaultPalette="qlik10";
  var defaultCustomColors="#4477aa,#7db8da,#b6d7ea,#46c646,#f93f17,#ffcf02,#b0afae,#7b7a78,#545352"; // copied from example (TODO match q10?)
  var q10=['#332288', '#6699cc', '#88ccee', '#44aa99', '#117733', '#999933', '#ddcc77', '#661100', '#cc6677', '#aa4466', '#882255', '#aa4499'];
  var q100=['#99c867', '#e43cd0', '#e2402a', '#66a8db', '#3f1a20', '#e5aa87', '#3c6b59', '#e9b02e', '#7864dd', '#65e93c', '#5ce4ba', '#d0e0da', '#d796dd', '#64487b', '#986717', '#408c1d', '#dd325f', '#533d1c', '#2a3c54', '#db7127', 
  '#72e3e2', '#d47555', '#7d7f81', '#3a8855', '#5be66e', '#a6e332', '#e39e51', '#4f1c42', '#273c1c', '#aa972e', '#bdeca5', '#63ec9b', '#aaa484', '#9884df', '#e590b8', '#44b62b', '#ad5792', '#c65dea', '#e670ca', '#29312d', 
  '#6a2c1e', '#d7b1aa', '#b1e7c3', '#cdc134', '#9ee764', '#65464a', '#3c7481', '#3a4e96', '#6493e1', '#db5656', '#bbabe4', '#d0607d', '#759f79', '#9d6b5e', '#8574ae', '#ad8fac', '#4b77de', '#647e17', '#b9c379', '#b972d9', 
  '#7ec07d', '#916436', '#2d274f', '#dce680', '#759748', '#dae65a', '#459c49', '#b7934a', '#9ead3f', '#969a5c', '#b9976a', '#46531a', '#c0f084', '#76c146', '#2ca02c'];//, '#d62728', '#9467bd', '#8c564b', '#e377c2', '#1f77b4'];
  //'#7f7f7f', '#17becf', '#aec7e8', '#ff7f0e', '#ffbb78', '#ff9896', '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5', '#393b79', '#5254a3', '#6b6ecf', '#637939', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39', '#843c39']; 

	return function () {
    
	}(), {
		properties: {
			type: "items",
      component: "accordion",
      items: {
        dimensions: {
          uses: "dimensions",
          min: 1,
          max: 2
        },
        measures: {
            uses: "measures",
            min: 1,
            max: 1
        },
        sorting: {
            uses: "sorting"
        },
        addons: { 
          uses: "addons", 
          items: { 
            dataHandling: { 
                uses: "dataHandling" 
            }
          }
        } , 
        chartConfigs: {
          component: "expandable-items",
          label: "Chart Settings",
          items: {
            charPresentation: {
              type: "items",
              label: "Presentation",
              items: {
                charType: {
                  type: "string",
                  label: "Type",
                  component: "buttongroup",
                  ref: "props.chartType",
                  options: [{
                    value: "g",
                    label: "Grouped",
                    tooltip: "Select for grouped"
                  }, {
                    value: "s",
                    label: "Stacked",
                    tooltip: "Select for stacked"
                  }],
                  defaultValue: "g"
                },
                chartOrientation: {
                  ref: "props.chartOrientation",
                  type: "string",
                  label: "Orientation",
                  component: "buttongroup",
                  options: [{
                    value: "v",
                    label: "Vertical",
                    tooltip: "Select for vertical"
                  }, {
                    value: "h",
                    label: "Horizontal",
                    tooltip: "Select for vertical"
                  }],
                  defaultValue: "v"
                },
              }
            },
            ColorsAndLegend: {
              label: "Colors",
              type: "items",
              grouped: true,
              items: {
                usePalette: {
                  ref:"color.type",
                  type: 'integer',
                  label:"Colors",
                  component:"dropdown",
                  defaultValue: 1, //true
                  options:[
                    {
                      value: 1, //true
                      label:"Single Color"
                    },
                    {
                      value: 2, // false
                      label:"By List"
                    },
                    // {
                    //   value: 3, // false
                    //   label:"By Pallete"
                    // }
                  ]
                },
                
                // paletteItems: {
                //   ref:"color.colorPalette",
                //   component:"item-selection-list", 
                //   defaultValue: defaultPalette, 
                //   horizontal: 0x0,
                //   items:[{
                //     icon:"",
                //     label:"Qlik\x20Sense",
                //     component:"color-scale",
                //     reverse: function(m) {
                //       return typeof(m.colors) !== 'undefined' ? m.colors.reverse : false;
                //     },
                //     value:"qlik10",
                //     type:"sequential",
                //     colors:q10
                //   },
                //   {
                //     icon:"",
                //     label:"Qlik Sense 100",
                //     component:"color-scale",
                //     reverse: function(m){ // basically called on every mouse event
                //       return typeof(m.colors) !== 'undefined' ? m.colors.reverse : false;
                //     },
                //     value:"qlik100",
                //     type:"sequential",
                //     colors:q100
                //   }],
                //   show: function(m) {
                //     return typeof(m.color) != 'undefined' && m.color.type == 3 ? true : false;    //==!![] is implied?
                //   }
                // },
                customPalette: {
                  ref:"color.list",
                  label: "Comma separated list of HEX colors",
                  type:"string",
                  expression:"optional",
                  defaultValue:defaultCustomColors, 
                  show: function(m) {
                    return typeof(m.color)!='undefined' && m.color.type == 2 ? true : false;
                  }
                },
                ColorPicker: {
                  label:"Color",
                  component: "color-picker",
                  ref: "color.picker",
                  type: "object",
                  show: function(m) {
                    if(typeof(m.color) === 'undefined' || typeof(m.color.type) === 'undefined' || m.color.type == 1)
                      return true;
                    
                    return false;
                  }
                },
                reverseColors: {
                  type: "boolean",  // a checkbox by default.
                  ref: "colors.reverse",
                  label: "Reverse Colors",
                  defaultValue: defaultRev,
                  show: function(m) {
                    return typeof(m.color) != 'undefined' && m.color.type == 'p' ? true : false;    //==!![] is implied?
                  }
                }
              }
            },
          }
        },
        appearance: {
          uses: "settings"
        }
      },
      support: {
          snapshot: true,
          export: true,
          exportData: true
      },
		},
	}
});