// JavaScript
define(["./d3.v5", "./fs-icon-array"], function (d3, fa) {
  let gauge = function (element, config) {
    //console.log("inside gauge",element,config)
    this.element = element;
    this.config = config;

    // this.kpi = kpi;
    const dTor = Math.PI / 180;
    let _element = this.element;
    let chartBackgroung = this.config.chartBackgroung;
    let maxVal = this.config.maxValue;
    let startAngle = this.config.startAngle;
    let endAngle = this.config.endAngle;
    let dialDesign = this.config.dialDesign;
    let majorTicks = dialDesign.majorTicks;
    let showTickSegments = dialDesign.showTickSegments;
    let tickTextColor = dialDesign.tickTextColor;
    let showTickTextasNumber = dialDesign.showNumber;
    let gWidth = dialDesign.dialWidth;
    let needleDesign = this.config.needleDesign;
    let arcColorFn = d3.interpolateHsl(d3.rgb("#e8e2ca"), d3.rgb("#3e6c0a"));
    let arcSegments = this.config.segments;

    let vizElm = document.getElementById(_element);
    let vizInfo = vizElm.getBoundingClientRect();
    let h = vizInfo.height;
    let w = vizInfo.width;

    let textHeight = 13 * 1.618;
    let textWidth = 4 * (13 / 1.618);

    let fullPath = endAngle - startAngle;

    let rAdjustment = function () {
      if (w > h) {
        let rAdj = w / h; // (w-h)/h;

        if (rAdj >= 2) {
          return h / 2 - 10;
        } else {
          return (w - h) / 2 - 10;
        }
      } else {
        return 0;
      }
      //return adj;
    };

    //console.log("fullPath",rAdjustment())
    let angleAdjustment = function () {
      if (endAngle > 90) {
        //var a = endAngle - 90;
        return endAngle - 90;
      } else {
        return (adj = 0);
      }
    };

    let ht = h;
    let radius = {
      "0-90": ht - textHeight - textWidth,
      "91-99": ht - textHeight - textWidth - (h / 2) * 0.15,
      "100-108": ht - textHeight - textWidth - (h / 2) * 0.3,
      "109-117": ht - textHeight - textWidth - (h / 2) * 0.45,
      "118-126": ht - textHeight - textWidth - (h / 2) * 0.6,
      "127-135": ht - textHeight - textWidth - (h / 2) * 0.8,
      "w<h": w / 2 - textHeight - textWidth,
    };
    // console.log("endAngle", endAngle)
    let iR = function () {
      if (w >= h) {
        if (endAngle <= 90) {
          //console.log("0")
          return radius["0-90"];
        } else if (endAngle <= 99) {
          //console.log("1")
          return radius["91-99"];
        } else if (endAngle <= 108) {
          // console.log("2")
          return radius["100-108"];
        } else if (endAngle <= 117) {
          // console.log("3")
          return radius["109-117"];
        } else if (endAngle <= 126) {
          // console.log("4")
          return radius["118-126"];
        } else if (endAngle <= 135) {
          // console.log("5")
          return radius["127-135"];
        } else {
          // console.log("0")
          return radius["0-90"];
        }
      } else {
        return radius["w<h"];
      }
    };

    //console.log('newStart Radius',iR())
    let r = iR(); //Math.min(h / 2 , w / 2)-textHeight/2-textWidth/2  + rAdjustment() - angleAdjustment() - gWidth;

    //console.log(r)

    let kpiAngle = startAngle + fullPath * 0.1;

    let needleInitialPos = startAngle + fullPath / 2;

    let startTextAngle = startAngle - 90;

    // Adjust the x and y transform if start angle is <90.
    // This will prevent gauge to stick to bottom
    let centerAdjustMent = (startAngle < 90 ? 90 : startAngle) - 90;

    let yPosStartAngle = function () {
      if (endAngle < 90) {
        return (
          h - (h / 2 + (r + gWidth) * Math.sin(centerAdjustMent * dTor)) - 10
        );
      } else if (endAngle < 105) {
        return (
          h - (h / 2 + (r + gWidth) * Math.sin(startTextAngle * dTor)) - 10
        );
      } else if (endAngle < 120) {
        return h - (h / 2 + (r + gWidth) * Math.sin(startTextAngle * dTor));
      } else {
        return 0;
      }
    };

    let xTransform = w / 2;
    let yTransform = h / 2 + yPosStartAngle(); //(h - yPosStartAngle()) - 10

    //console.log(yPosStartAngle)
    let translate = "translate(" + xTransform + "," + yTransform + ")";
    //generates a linear scale between min and max value
    //range : [min value on scale, max value on scale]
    //domain : [min data value , max data value]
    // Note: as we are drawing gauge chart range is 0 to 1 (100%)
    //       and domain is also 0 to 1 (100%) ; maxVal is set to 1
    let scale = d3.scaleLinear().range([0, maxVal]).domain([0, maxVal]);

    // returns an erray od tick value based scale domain
    let ticks = scale.ticks(majorTicks);

    // returns the array of tick value
    let tickData = d3.range(majorTicks).map(function () {
      return maxVal / majorTicks;
    });
    //console.log("gViz",tickData)
    // select an html dom element
    // append svg, main element where chart will be rendered
    // apply height and width
    // apply background color
    let gViz = d3
      .select("#" + _element)
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("style", "background:" + chartBackgroung);

    // creating path (d attribute value)
    // this will be evaluated when assigned as value for d attribuet for path element
    // for this to work you will have to bind data to path element
    let tickSegments = showTickSegments == true ? majorTicks : 1;
    let tickSegmentData = showTickSegments == true ? tickData : [1];

    let Arc = d3
      .arc()
      .innerRadius(r - gWidth / 2)
      .outerRadius(r + gWidth / 2)
      .startAngle(function (d, i) {
        return (startAngle + (fullPath / tickSegments) * i) * dTor;
      })
      .endAngle(function (d, i) {
        return (startAngle + (fullPath / tickSegments) * (i + 1)) * dTor;
      });

    // Arc to draw full circle for the gauge
    // this is just for the design purpose. to add background color
    let gVizRing;
    if (dialDesign.showDialFullRing === true) {
      gVizRing = gViz
        .append("circle")
        .attr("r", r)
        .attr("cx", xTransform)
        .attr("cy", yTransform)
        .style("fill", dialDesign.dialRingFillColor)
        .style("stroke", dialDesign.dialRingStrokeColor);
    }

    // Adding a group element to group all path elemnts
    // adding data bindings
    // enter() : creates a path element for each data value
    // add 'd' attibute and add arc path (mainArc)
    // transform : transalate moves the center to x and y pos
    let mainArc = gViz
      .append("g")
      .selectAll("path")
      .data(tickSegmentData)
      .enter()
      .append("path")
      .attr("d", Arc)
      .attr("fill", dialDesign.color)
      .attr("stroke", dialDesign.stroke)
      //    .attr('fill', function(d, i) {
      //        return arcColorFn(d * i);
      //    })
      .attr("transform", translate);

    //Draw arc segments if segment array length is >0;

    let sArc = d3
      .arc()
      .innerRadius(r - gWidth / 2)
      .outerRadius(r + gWidth / 2)
      .startAngle(function (d, i) {
        return (startAngle + (endAngle - startAngle) * (d.start / 100)) * dTor;
      })
      .endAngle(function (d, i) {
        return (startAngle + (endAngle - startAngle) * (d.end / 100)) * dTor;
      });

    gViz
      .append("g")
      .selectAll("path")
      .data(arcSegments)
      .enter()
      .append("path")
      .attr("d", sArc)
      .attr("fill", function (d, i) {
        return d.color;
      })
      .attr("transform", translate);

    //getting angle between 2 ticks for placing text value
    let tickSpan = (endAngle - startAngle) / majorTicks;

    //getting midpoint of the total gauge span to calculate anchor
    let midPoint = startTextAngle + tickSpan * (majorTicks / 2);

    //adding extra value to data as we have 10 paths
    //but ticks will be 11 as we have to inclue 0% also
    tickData.push(tickData[0]);

    // appending group element for the tick texts
    // adding data binding for the text
    // enter() : this will generate text element if it doesnt exists
    // text(val)  : text value to display on chart.
    // attr(x, val) : x position of the text
    // attr(y, val) : y position of the text
    // attr(text-anchor : [start|middle|end]) : text alignment
    let ticksText = gViz
      .append("g")
      .selectAll("text")
      .data(tickData)
      .enter()
      .append("text")
      .text(function (d, i) {
        if (showTickTextasNumber == true) {
          return Math.round(i * d);
        } else {
          return Math.round(((i * d) / maxVal) * 100) + "%";
        }
      })
      .style("fill", tickTextColor)
      .attr("x", function (d, i) {
        let textAngle = startTextAngle + tickSpan * i;
        return xTransform + (r + gWidth / 2 + 10) * Math.cos(textAngle * dTor);
      })
      .attr("y", function (d, i) {
        let textAngle = startTextAngle + tickSpan * i;
        return yTransform + (r + gWidth / 1.5) * Math.sin(textAngle * dTor);
      })
      .attr("text-anchor", function (d, i) {
        let textAngle = startTextAngle + tickSpan * i;

        //point position is in between +15 and -15 from center
        // then set anchor to middle else left or right
        if (textAngle > midPoint - 15 && textAngle < midPoint + 15) {
          return "middle";
        } else {
          return textAngle <= startTextAngle + tickSpan * (majorTicks / 2)
            ? "end"
            : "start";
        }
      });

    // Fill the arc with KPI
    let kpiArc = d3
      .arc()
      .innerRadius(r - gWidth / 2)
      .outerRadius(r + gWidth / 2)
      .startAngle(startAngle * dTor);

    let kpiArcPath = gViz
      .append("g")
      .append("path")
      .datum({ endAngle: startAngle * dTor })
      .attr("id", "arcKpiPath")
      .attr("d", kpiArc)
      .attr("fill", needleDesign.color)
      .attr("stroke", dialDesign.stroke)
      .attr("transform", translate);

    let centerKPI = gViz.append("g").attr("id", "d-center-kpi");
    let kpiText = centerKPI.append("text");

    let kpiLabel = centerKPI.append("text");

    let kpiIcon = centerKPI.append("text").attr("class", "fa");

    // Needle line path
    let line = [
      [-5, 0],
      [0, -1 * r],
      [5, 0],
      [0, 10],
      [-5, 0],
    ];
    let lineGenerator = d3.line();
    let pathString = lineGenerator(line);

    this.needle = gViz
      .append("g")
      .append("path")
      .attr("id", "needle")
      .attr("d", pathString)
      .attr("fill", needleDesign.color)
      .attr("stroke", needleDesign.stroke)
      .attr("transform", translate + "rotate(" + needleInitialPos + ")");

    this.setCercularKpi = function (kpi, dKpi, config) {
      let _config = config;
      //console.log('_config',config)
      let _kpi = kpi / maxVal > 1 ? 1 : kpi / maxVal;
      let _dKpi = dKpi;
      let _dKpiText = _config.baseFontSize * _config.centerKpi.fontSize;
      let kpiTextheight = _dKpiText / 1.618;
      let kpiTextWidth = _dKpi.kpiLabel.length * (_dKpiText / 1.618);
      let _yTransform =
        yTransform > h / 2
          ? yTransform - (yTransform - h / 2) / 1.5
          : yTransform;
      let angle;
      let angleMultiplier = _kpi > 0.5 ? 1 : -1;
      if (_kpi > 0.5) {
        angle = (endAngle * (_kpi - 0.5)) / 0.5;
      } else if (_kpi < 0.5) {
        angle = (startAngle * (0.5 - _kpi)) / 0.5;
      } else {
        angle = 0;
      }
      let kpiAngle = startAngle + fullPath * _kpi;
      if (needleDesign.showNeedle == true) {
        this.needle
          .transition()
          .duration(750)
          .attr("transform", translate + "rotate(" + angle + ")");
        this.needle.attr("style", "display:block");
      } else {
        kpiArcPath
          .transition()
          .duration(750)
          .attrTween("d", arcTween(angle * dTor));
        if (_config.centerKpi.show == true) {
          let icon = String.fromCharCode(
            parseInt(_config.centerKpi.labelIcon, 16)
          );
          let xAdjustmentForIcon =
            _config.centerKpi.labelIcon.length > 1 && _dKpi.kpiLabel.length > 1
              ? kpiTextheight / 1.5
              : 0;
          let iconAnchor =
            _config.centerKpi.labelIcon.length > 1 && _dKpi.kpiLabel > 1
              ? "right"
              : "middle";
          let labelAnchor =
            _config.centerKpi.labelIcon.length > 1 && _dKpi.kpiLabel > 1
              ? "left"
              : "middle";
          // console.log('_config.centerKpi.labelIcon.length',xAdjustmentForIcon)
          kpiText
            .text(_dKpi.kpi)
            .attr("x", xTransform)
            .attr("y", _yTransform + kpiTextheight / 2)
            .attr("text-anchor", "middle")
            .style("fill", _dKpi.kpiColor)
            .style("font-size", _config.centerKpi.fontSize + "em");

          //  console.log('"/u"+_config.centerKpi.labelIcon',"/u"+_config.centerKpi.labelIcon)
          //kpiLabel.text(_dKpi.kpiLabel)
          kpiLabel
            .text(_dKpi.kpiLabel)
            .attr("x", xTransform + xAdjustmentForIcon)
            .attr("y", _yTransform + kpiTextheight + kpiTextheight * 0.5)
            .attr("text-anchor", labelAnchor)
            .style("fill", tickTextColor)
            .style("font-size", _config.centerKpi.fontSize * 0.5 + "em");

          if (_config.centerKpi.labelIcon.length > 1) {
            kpiIcon
              .text(icon)
              .attr("x", xTransform - kpiTextWidth / 5)
              .attr("y", _yTransform + kpiTextheight + kpiTextheight * 0.5)
              .attr("text-anchor", iconAnchor)
              .style("fill", tickTextColor)
              .style("font-size", _config.centerKpi.fontSize * 0.5 + "em");
          }

          // kpiLabel.text(_dKpi.kpiLabel )
          // .attr('x',xTransform)
          // .attr('y',_yTransform + kpiTextheight +10)
          // .attr('text-anchor','middle')
          // .style('fill', tickTextColor)
          // .style('font-size',(_config.centerKpi.fontSize*0.5)+'em');
        }

        //hide needle
        this.needle.attr("style", "display:none");
      }

      //Ring dynamic design
      //console.log('_config.dialDesign.showDialFullRing',_config.dialDesign.showDialFullRing)
      if (_config.dialDesign.showDialFullRing === true) {
        // console.log(gVizRing)
        //  console.log('_config.dialDesign.dialRingFillColor',_config.dialDesign.dialRingFillColor)
        gVizRing
          .transition()
          .duration(500)
          .style("fill", _config.dialDesign.dialRingFillColor);
      }

      function arcTween(newAngle) {
        return function (d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle);

          return function (t) {
            d.endAngle = interpolate(t);

            return kpiArc(d);
          };
        };
      }
    };
  };

  return {
    gauge: gauge,
  };
});
