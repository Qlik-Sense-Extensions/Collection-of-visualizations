define([], function(){

return  {
              type: "items",
              items: {
                useSegments: {
                  ref: "useSegments",
                  type: "boolean",
                  defaultValue: !1,
                  translation: "properties.gauge.useSegments",
                  change: function(a) {
                    a.useSegments && 1 === a.segmentInfo.colors.length ? a.segmentInfo.colors = [{
                      color: a.progressColor
                    }] : a.progressColor = 3
                  }
                },
                progressColor: {
                  component: "color-picker",
                  translation: "properties.color",
                  ref: "progressColor",
                  type: "integer",
                  defaultValue: 3,
                  show: function(a) {
                    return !a.useSegments
                  }
                },
                valueMode: {
                  ref: "valueMode",
                  translation: "properties.value",
                  type: "string",
                  component: "dropdown",
                  options: [{
                    value: "absolute",
                    translation: "properties.gauge.absolute"
                  }, {
                    value: "relative",
                    translation: "properties.gauge.relative"
                  }],
                  show: function() {
                    return !1
                  },
                  defaultValue: "absolute"
                },
                maxSegments: {
                  ref: "maxSegments",
                  type: "number",
                  defaultValue: 6,
                  show: !1
                },
                segmentInfo: {
                  ref: "segments",
                  type: "items",
                  component: "color-scale-creator",
                  show: function(a) {
                    return a.useSegments
                  },
                  items: {
                    limits: {
                      ref: "segmentInfo.limits",
                      type: "array",
                      items: {
                        value: {
                          ref: "value",
                          type: "number",
                          expression: "optional",
                          invalid: function(a, b) {
                            return "number" == typeof a.value && (a.value < b.measureAxis.min || a.value > b.measureAxis.max)
                          },
                          defaultValue: 1
                        },
                        gradient: {
                          translation: "properties.gradient",
                          ref: "gradient",
                          type: "boolean",
                          show: !1
                        }
                      }
                    },
                    colors: {
                      items: {
                        color: {
                          ref: "color",
                          component: "color-picker",
                          translation: "properties.color",
                          type: "integer",
                          defaultValue: 3
                        }
                      },
                      type: "array",
                      ref: "segmentInfo.colors"
                    }
                  }
                }
              }
            }

})
