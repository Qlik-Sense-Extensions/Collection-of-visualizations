define(["qlik"], function(qlik) {
  return {
    type: "items",
    label: "Source image",
    items: {
      imgSourceType: {
        ref: "gauge.props.imgSourceType",
        type: "string",
        component: "buttongroup",
        label: "Location of image folder",
        options: [{
          value: "online",
          label: "Online Image",
        }, {
          value: "local",
          label: "use local image",
        }],
        defaultValue: "local"
      },
      imgOnlineSource: {
        ref: "gauge.props.imgOnlineSource",
        label: "Full URL to online image",
        type: "string",
        expression: "optional",
        defaultValue: "",
        show: function(data) {
          return data.gauge.props.imgSourceType == "online";
        }
      },
      media: {
        ref: "gauge.props.imgLocalSource",
        label: "Image",
        type: "string",
        component: "media",
        layoutRef:"gauge.props.imgLocalSource"
      },
      // image: {
      //   ref: "gauge.props.imgLocalSource",
      //   label: "Image",
      //   type: "string",
      //   component: "dropdown",
      //   show: function(data) {
      //     return true;
      //   },
      //   options: function() { /*Erik Wetterberg imgChart extention*/
      //     return qlik.currApp().getList("MediaList").then(function(e) {
      //       return e.getLayout().then(function() {
      //         return e.layout.qMediaList.qItems.map(function(e) {
      //           return {
      //             value: e.qUrlDef,
      //             label: e.qUrlDef
      //           }
      //         })
      //       })
      //     })
      //   }
      //
      // }
      // imgLocalSource: {
      //   ref: "gauge.props.imgLocalSource",
      //   label: "Place your images here: >Qlik >Sense >Extensions >Gauge>images",
      //   type: "string",
      //   expression: "optional",
      //   defaultValue: "bottle.png",
      //   show: function(data) {
      //     return data.gauge.props.imgSourceType == "local";
      //   }
      // }
    }
  };
})
