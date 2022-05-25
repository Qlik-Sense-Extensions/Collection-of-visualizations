define([], function(){
diveInto = function(object, string) {
  var d = object;
  var elements = string.split('.');
  elements.forEach(function(el) {
    d = d[el];
  });
  return d;
}

 getColor = function(o) //retrouve une couleur a partir d'un objet de layout généré par colorChooser dabs colorOptions.js
  {
    palette = ["#b0afae", "#7b7a78", "#545352", "#4477aa", "#7db8da", "#b6d7ea", "#46c646", "#f93f17", "#ffcf02", "#276e27", "#ffffff", "#000000"];
    if (o.colorType == "rgb") {
      return "rgb(" + o.rgb.red + "," + o.rgb.green + "," + o.rgb.blue + ")";

    } else if ((o.colorType == "expression")) {
      return o.colorExpression;
    } else {
      return palette[o.colorPicker];
    }
  };

var colorComponent = function(rf, lbl, shw) {
  if (shw == undefined) {
    shw = true
  };
  return {
    ref: rf,
    label: lbl,
    component: "slider",
    min: 0,
    max: 255,
    step: 1,
    default: 125,
    show: shw
  }
};

var rgbChooser = function(rf, lbl, shw) {
  if (shw == undefined) {
    shw = true
  };
  return {
    type: "items",
    label: lbl,
    items: {
      r: colorComponent(rf + ".red", "Red"),
      g: colorComponent(rf + ".green", "Green"),
      b: colorComponent(rf + ".blue", "Blue")
    },
    show: shw
  }
};

var colorPicker = function(rf, lbl, shw) {
  if (shw == undefined) {
    shw = true
  };
  return {
    type: "string",
    component: "color-picker",
    ref: rf,
    label: lbl,
    defaultValue: 1,
    show: shw
  }
};

var colorExpression = function(rf, lbl, shw) {
  if (shw == undefined) {
    shw = true
  };
  return {
    type: "string",
    ref: rf,
    expression: "always",
    label: lbl,
    defaultValue: "blue",
    show: shw
  }
};




var colorChooser = function(rf, lbl, shw) {
  return {
    type: "items",
    label: lbl,
    items: {
      colorType: {
        type: "string",
        component: "dropdown",
        label: "Color definition",
        ref: rf + ".colorType",
        options: [{
          value: 'colorPicker',
          label: 'ColorPicker'
        }, {
          value: 'rgb',
          expression: 'RGB color'
        }, {
          value: 'expression',
          label: 'Expression'
        }],
        defaultValue: "colorPicker"

      },
      rgb: rgbChooser(rf + ".rgb", "RGB", function(data) {
        //console.log(data[rf].colorType);
        var d = diveInto(data, rf);
        if (d == undefined || d.colorType == "rgb") {
          //  data[rf].color="rgb("+ data[rf].rgb.red+ "," +data[rf].rgb.green +","+ data[rf].rgb.blue +")";
          return true;
        }
        return false;
      }),
      colorPick: colorPicker(rf + '.colorPicker', "Pick color", function(data) {
        var d = diveInto(data, rf);
        if (d != undefined && d.colorType == "colorPicker") {
          //  data[rf].color=palette[data[rf].colorPicker];
          return true;
        }
        return false;
      }),
      colorExpr: colorExpression(rf + '.colorExpression', "Color", function(data) {
        var d = diveInto(data, rf);
        if (d.colorType == "expression") {
          //  data[rf].color=data[rf].colorExpression;
          return true;
        }
        return false;
      }),


    }

  }
};






return {
  type: "items",
  label: "Fill Color",
  show: function(data) {
    return data.gauge.props.presentation == "colorFill"
  },
  items: {
    chooser: colorChooser("gauge.props.fillColor", "Background Color", true)

    /*
              fillType: {
                  type: "string",
                  component: "buttongroup",
                  label: "Filling mode",
                  ref: "colorOptions.fillingMode",
                  options: [{
                      value: "plain",
                      label: "Plain fill",
                  }, {
                      value: "scale",
                      label: "Scale",
                  }],
                  defaultValue: 1
              },
              colorType:{
                type:"string",
                component:"dropdown",
                label:"Color definition",
                ref: "colorOptions.colorChooser",
                options:[{
                  value:'colorPicker',
                  label:'ColorPicker'
                },{
                  value:'rgb',
                  expression:'RGB'
                },{
                  value:'expression',
                  label:'Expression'
                }
              ]
            },
              fillColor: {
                  type: "string",
                  component: "color-picker",
                  ref: "colorOptions.fillColor",
                  label: "Background Color",
                  defaultValue: 1,
                  show: function(data){return true}
              },
							imgLocalSource : {
								ref: "imgLocalSource",
								label: "Place your images here: >Qlik >Sense >Extensions >Gauge>images",
								type: "string",
								expression: "optional",
								defaultValue: "bottle.png",
								show: function(data) {return data.imgSourceType=="local";}
              }*/
  }
}; })
