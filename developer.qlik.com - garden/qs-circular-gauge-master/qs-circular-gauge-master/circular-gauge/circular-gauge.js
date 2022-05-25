define([
  "qlik",
  "./circular-gauge-d3-0.1",
  "./gauge-props",
  "./fs-icon-array",
  "./color-picker",
], function (qlik, g, props, fa, c) {
  "use strict";
  let gauge = {};
  let prevSize = {};
  let palette = [
    "#b0afae",
    "#7b7a78",
    "#545352",
    "#4477aa",
    "#7db8da",
    "#b6d7ea",
    "#46c646",
    "#f93f17",
    "#ffcf02",
    "#276e27",
    "#ffffff",
    "#000000",
  ];

  // Font Awesome CDN
  if (!$("link[id='FA']").length > 0) {
    $(
      '<link id="FA" rel="stylesheet" type="text/css" href="https://use.fontawesome.com/releases/v5.13.0/css/all.css">'
    ).appendTo("head"); // Font Awesome CDN
  }
  return {
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [
          {
            qWidth: 2,
            qHeight: 50,
          },
        ],
      },
    },
    definition: props,
    support: {
      snapshot: true,
      export: true,
      exportData: true,
    },
    paint: function ($element, layout) {
      //needed for export

      let resize = 0;
      //console.log(layout)
      let props = layout.props;
      let kpi1 = props.kpi1;
      let kpi2 = {
        kpiLabel: props.kpi2Label,
        kpiLabelIcon: "",
        kpi: props.kpi2,
        kpiColor: props.kpi2Color,
      };
      let id = layout.qInfo.qId;
      let element = "qlik-" + id;
      let baseFontSizePx = $(".qv-object").css("font-size");

      let baseFontSize = baseFontSizePx.substring(0, 2);
      //console.log(baseFontSize)
      $element.css("background-color", props.background);
      //console.log(g)
      // let segments = props.segments.map(function(s) {
      // 			     s.color = s.color.color;
      // 				 return s;
      // 			});
      //let headerText = $("[tid=" + id + "] header>h1>div.qv-object-title-text").text();

      let config = {
        baseFontSize: parseInt(baseFontSize),
        maxValue: props.maxKpi1,
        startAngle: -1 * (props.dialSize ? props.dialSize : 90),
        endAngle: props.dialSize ? props.dialSize : 90,
        segments: props.segments, //[{start:60,end:70,color:'red'}],
        chartBackgroung: props.background,
        centerKpi: {
          show: props.showCenterKpi,
          fontSize: props.kpi2FontSize,
          labelIcon: props.kpi2Icon,
        },
        dialDesign: {
          dialWidth: props.dialwidth,
          showDialFullRing: props.showDialFullRing,
          dialRingFillColor: props.dialRingFillColor
            ? props.dialRingFillColor
            : 0,
          dialRingStrokeColor: props.dialRingStrokeColor
            ? props.dialRingStrokeColor
            : 0,
          majorTicks: props.numberOfTicks,
          showTickSegments: props.showTickSegments,
          showNumber: props.showNumber,
          tickTextColor: props.tickTextColor,
          color: props.dialColor,
          stroke: props.dialStroke,
          strokeWidth: "10",
        },

        needleDesign: {
          showNeedle: props.showNeedle,
          color: props.needleColor,
          stroke: props.needleBorderColor,
          strokeWidth: "10",
        },
      };
      //var gauge = new gauge('QV01',config);
      let vSvg = $("#" + element + ">svg");
      let editMode = $(".qv-mode-edit");

      //console.log(prevSize);
      let currentSize =
        $("[tid=" + id + "]").height() + "-" + $("[tid=" + id + "]").width();
      //console.log(id, currentSize, prevSize)
      //
      if (
        !vSvg.length ||
        editMode.length ||
        currentSize != prevSize["q" + id]
      ) {
        prevSize["q" + id] = currentSize;

        $element.html('<div id="' + element + '"></div>');

        $("#" + element).css("width", $element.width() + "px");
        $("#" + element).css("height", $element.height() + "px");

        gauge["q" + id] = new g.gauge(element, config);

        $element.append(
          '<div id="fa-' +
            id +
            '-container" style="display:none;justify-content:center;align-items:center;overflow:scroll;flex-flow:row;position:fixed;top:0px;left:0px;height:100vh;width:100%;background:rgba(256,256,256,0);z-index:126"></div>'
        );
        $("#fa-" + id + "-container").append(
          '<div id="fa-' +
            id +
            '" style="overflow:scroll;flex-flow:row;height:500px;width:600px;padding:20px;margin:20px;background:#ccc;z-index:126;border:1px solid lightgray; border-radius:20px"></div>'
        );

        for (let key in fa.fontAwesome) {
          // check if the property/key is defined in the object itself, not in parent
          $("#fa-" + id).append(
            '<i title="Click me to copy to clipboard!" data-key = "' +
              fa.fontAwesome[key][0] +
              '" class="fa ' +
              key +
              '" style="cursor:pointer;padding:5px;margin:5px;border:solid 1px gray"></i>'
          );
        }
        $("#fa-" + id).append(
          '<input type="text" value="Icons" class="myInput" >'
        );
        $("#fa-" + id + "-container").on("click", "i", getICPicker);

        $element.append(
          '<div id="color-' +
            id +
            '-container" style="display:none;justify-content:center;align-items:center;overflow:scroll;flex-flow:row;position:fixed;top:0px;left:0px;height:100vh;width:100%;background:rgba(256,256,256,0);z-index:126"></div>'
        );
        $("#color-" + id + "-container").append(
          '<div id="color-' +
            id +
            '" style="display:flex;flex-wrap:wrap;overflow:scroll;height:500px;width:600px;padding:20px;margin:20px;background:#ccc;z-index:126border:1px solid lightgray; border-radius:20px"></div>'
        );
        for (let j = 0; j < c.colors.length; j++) {
          // check if the property/key is defined in the object itself, not in parent
          $("#color-" + id).append(
            '<div class="colorPicker" title="Click me to copy to clipboard!" data-key = "' +
              c.colors[j] +
              '"  style="display:flex;background:' +
              c.colors[j] +
              ';cursor:pointer;padding:5px;margin:5px;border:solid 1px gray;width:90px;height:30px"></div>'
          );
        }
        $("#color-" + id).append(
          '<input type="text" value="color" class="myInput" style="width:550px;height:20px" >'
        );

        $("#color-" + id + "-container").on(
          "click",
          "div.colorPicker",
          getColorPicker
        );
      }

      gauge["q" + id].setCercularKpi(kpi1, kpi2, config);

      var alignment = {
        c: "center",
        l: "flex-start",
        r: "flex-end",
      };
      //console.log('HEADER UPDATED');
      $("[tid=" + id + "] .qv-inner-object").css("padding", "0px");
      $("[tid=" + id + "] .qv-object-header").css("padding", "0px");
      $("[tid=" + id + "] header>h1").css("padding", "5px");
      $("[tid=" + id + "] header>h1").css("display", "flex");
      $("[tid=" + id + "] footer").css("display", "flex");

      $("[tid=" + id + "] header>h1").css(
        "justify-content",
        alignment[props.headerFooterAlignment]
      );
      $("[tid=" + id + "] header>h1>div").css("color", props.headerColor);
      $("[tid=" + id + "] header>").css("background", props.headerBgColor);

      let footerText = $("[tid=" + id + "] footer").text();
      $("[tid=" + id + "] footer").html("<span>" + footerText + "</span>");
      $("[tid=" + id + "] footer").css(
        "justify-content",
        alignment[props.headerFooterAlignment]
      );
      $("[tid=" + id + "] footer").css("color", props.footerColor);
      $("[tid=" + id + "] .qv-footer-wrapper").css(
        "background",
        props.footerBgColor
      );
      function getICPicker(elm) {
        let dataKey = $(this).attr("data-key");
        var textArea = $("#fa-" + id + " input").val(dataKey);

        $("#fa-" + id + " input").focus();
        $("#fa-" + id + " input").select();
        document.execCommand("copy");
        ///console.log('Icon unicode has been copied: ', dataKey);
        $("#fa-" + id + "-container").css("display", "none");
        //$('#color-'+id+'-container').css("display",'none');
        //$(".copied").text("Copied to clipboard").show().fadeOut(1200);
      }
      function getColorPicker(elm) {
        let dataKey = $(this).attr("data-key");
        var textArea = $("#color-" + id + " input").val(dataKey);

        $("#color-" + id + " input").focus();
        $("#color-" + id + " input").select();
        document.execCommand("copy");
        //console.log('Icon unicode has been copied: ', dataKey);
        $("#color-" + id + "-container").css("display", "none");

        //$(".copied").text("Copied to clipboard").show().fadeOut(1200);
      }
      return qlik.Promise.resolve();
    },
  };
});
