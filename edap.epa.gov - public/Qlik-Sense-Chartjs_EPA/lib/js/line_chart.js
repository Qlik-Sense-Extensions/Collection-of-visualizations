var visualize = function($element, layout, _this, chartjsUtils) {
  var id  = layout.qInfo.qId + "_chartjs_bar";
  if(window.layout) {
    window.layout[id] = layout;
  } else {
    window.layout = {};
    window.layout[id] = layout;
  }

  var width_height = chartjsUtils.calculateMargin($element, layout);
  var width = width_height[0], height = width_height[1];

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');
  // create a new array that contains the dimension labels
  var qDim  = layout.qHyperCube.qDimensionInfo.map(function(d) {
    return d.qFallbackTitle;
  });
  var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
  // JV Update v.1:  create a new object array with user defined color and sort parameters for dimension
  var qDimColorUser = layout.qHyperCube.qDimensionInfo.map(function(d){
    var m = typeof d.myColorSelection !== "undefined" ? d.myColorSelection : {};
    return {
      auto: typeof m.auto !== "undefined" ? m.auto : true,
      choice: typeof m.choice !== "undefined" ? m.choice : "random",
      colorPersistence: typeof m.colorPersistence !== "undefined" ? m.colorPersistence : false,
      displayPalette: typeof m.displayPalette !== "undefined" ? m.displayPalette : "D3-20c",
      single: typeof m.single !== "undefined" ? m.single : "#4477aa"
    }
  });  
  // Get the number of measures
  var num_of_measures = layout.qHyperCube.qMeasureInfo.length;

  var palette = [];
  var layout_color = 0;
  var custompalette = {};
  if (!qDimColorUser[0].auto) {
    // JV Update v0.4: Use the backendApi to iterate through AVAILABLE rows
    _this.backendApi.eachDataRow(function(rownum, row) {
      lastrow = rownum;
      var path    = ""; 
      var sep     = ""; 
      var nbDimension = qDim.length;
      var nbMesures   = qMatrix[0].length - nbDimension;
      var nbTotal   = nbMesures + nbDimension;
      
      var labels = [];
      var colors = [];
      var flowColors = [];
      var sortVals = [];
      var sortDirs = [];
      
      // only bother if the size of the measure is greater than zero
      if (row[nbDimension].qNum > 0){ 
        for (var i = 0; i < nbDimension ; i++) {
          
          var label = row[i].qText;
          
          labels = labels.concat(label);
          path += sep + (label.replace('|', ' ')) + '|' + (row[i].qElemNumber);     
                    
          // JV UPDATE v0.1: This now does the work of coloring the nodes
          // I removed the function "getColorForNode"
          if (qDimColorUser[i].auto==true || qDimColorUser[i].choice == "random"){
            //strValue = row[i].qText;
            if (qDimColorUser[i].displayPalette === "D3-20") {
              var colours = ['#1f77b4','#aec7e8','#ff7f0e','#ffbb78','#2ca02c','#98df8a','#d62728','#ff9896','#9467bd','#c5b0d5','#8c564b',
                      '#c49c94','#e377c2','#f7b6d2','#7f7f7f','#c7c7c7','#bcbd22','#dbdb8d','#17becf','#9edae5' ];
            }
            else if (qDimColorUser[i].displayPalette === "D3-20b") {
              var colours = ['#393b79','#5254a3','#6b6ecf','#9c9ede','#637939','#8ca252','#b5cf6b','#cedb9c','#8c6d31','#bd9e39',
              '#e7ba52','#e7cb94','#843c39','#ad494a','#d6616b','#e7969c','#7b4173','#a55194','#ce6dbd','#de9ed6'];
            }
            else if (qDimColorUser[i].displayPalette === "D3-20c") {
              var colours = ['#3182bd','#6baed6', '#9ecae1','#c6dbef','#e6550d','#fd8d3c','#fdae6b','#fdd0a2','#31a354',
                '#74c476','#a1d99b','#c7e9c0','#756bb1','#9e9ac8','#bcbddc','#dadaeb','#636363','#969696','#bdbdbd','#d9d9d9' ];
            }
            else if (qDimColorUser[i].displayPalette === "20") {
              var colours = [ '#1abc9c','#7f8c8d','#2ecc71','#bdc3c7','#3498db','#c0392b','#9b59b6','#d35400','#34495e','#f39c12',
                '#16a085','#95a5a6','#27ae60','#ecf0f1','#2980b9','#e74c3c','#8e44ad','#e67e22','#2c3e50','#f1c40f' ];
            }
            else if (qDimColorUser[i].displayPalette === "20a") {
              var colours = [ '#023FA5','#7D87B9','#BEC1D4','#D6BCC0','#BB7784','#FFFFFF','#4A6FE3','#8595E1','#B5BBE3','#E6AFB9',
              '#E07B91','#D33F6A','#11C638','#8DD593','#C6DEC7','#EAD3C6','#F0B98D','#EF9708','#0FCFC0','#9CDED6'];
            }     
            if (qDimColorUser[i].auto==true || !qDimColorUser[i].colorPersistence){
              colors = colors.concat(colours[Math.floor(Math.random() * (19))]);
            } else {
              colors = colors.concat(colours[parseInt(Math.floor(hashScale(hashL(md5(path)))))]);
            }             
          } else if (qDimColorUser[i].choice == "single"){
            colors = colors.concat(typeof qDimColorUser[i].single === "object" ? qDimColorUser[i].single.color : qDimColorUser[i].single);
          } else if (qDimColorUser[i].choice == "expression" && typeof row[i].qAttrExps.qValues !== "undefined" && row[i].qAttrExps.qValues.length >= 0){
            if (typeof row[i].qAttrExps.qValues[0].qText === "string") {
              colors = colors.concat(row[i].qAttrExps.qValues[0].qText);
            } else if  (typeof row[i].qAttrExps.qValues[0].qNum === "number") {
              var colHex = row[i].qAttrExps.qValues[0].qNum.toString(16);
              // for some reason the alpha comes first, so let's remove those values
              colHex = "#" + colHex.substr(2, 6); // + colHex.substr(0, 2);
              colors = colors.concat(colHex);
            } 
          } else {
            colors = colors.concat("#888888"); //may happen if expression fails
          }
        }
      }
      custompalette = colors[0];


    });
  } else {
    if (layout.colors == "auto") {
      palette = chartjsUtils.defineColorPalette(layout.color_selection);
    } else {
      palette = layout.custom_colors.split("-");
    }
  }

  // Color for main line
  var color = "rgba(" + palette[layout_color] + "," + layout.opacity + ")";

  // Color for sub-lines
  var line_color = [];

  if (layout.line_color_switch == "auto") {
    // When color selection is auto
    line_color[0] = "rgba(" + chartjsUtils.defineColorPalette("palette")[7] + ",1.0)";
  } else {
    // When color selection is custom and single
    if (layout.line_color_selection == "single") {
        line_color[0] = "rgba(" + chartjsUtils.defineColorPalette("palette")[layout.line_color_picker] + ",1.0)";
    } else {
      if ( layout.line_color_selection_for_measure == 'custom') {
        // Custom colors
        line_color = layout.line_custom_color.split("-");
      } else {
        // 12 colors or 100 colors
        line_color = chartjsUtils.defineColorPalette(layout.line_color_selection_for_measure);
      }
    }
  }

  var background_color = "";
  var background_custom_palette = [];

  if (!qDimColorUser[0].auto) {
    background_color = custompalette;
    color = custompalette;
  } else {
    if (layout.colors == "auto" && layout.background_color_switch) {
      background_color = "rgba(" + palette[layout.background_color] + "," + layout.opacity + ")";
    } else if (layout.colors == "auto") {
      background_color = "rgba(" + palette[layout.color] + "," + layout.opacity + ")";
    } else if (layout.colors == "custom" && layout.background_color_switch) {
      background_custom_palette = layout.custom_background_color.split("-");
      background_color = "rgba(" + background_custom_palette[0] + "," + layout.opacity + ")";
    } else if (layout.colors == "custom") {
      background_color = "rgba(" + palette[layout_color] + "," + layout.opacity + ")";
    } else {}

  }


(layout.background_color_switch) ?  "rgba(" + palette[layout.background_color] + "," + layout.opacity + ")" : "rgba(" + palette[layout.color] + "," + layout.opacity + ")"

  var data = layout.qHyperCube.qDataPages[0].qMatrix;

  if (layout.cumulative) {
    data = chartjsUtils.addCumulativeValues(data);
  }

  // Create datasets
  var datasets = [{
      type: 'line',
      label: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
      fill: layout.background_color_switch,
      data: data.map(function(d) { return { label: d[0].qText, x: d[0].qNum, y: d[1].qNum } }),
      orig_data: data.map(function(d) { return { label: d[0].qText, x: d[0].qNum, y: d[1].qNum } }),
      backgroundColor: background_color,
      borderColor: color,
      pointBackgroundColor: color,
      borderWidth: 1,
      pointRadius: layout.point_radius_size
  }];

  // Where there more than 1 measures,
  if (num_of_measures >= 2) {

    for ( var i=2; i<=num_of_measures;i++) {
      // Applying color to line
      var borderColor = '';
      if ( layout.line_color_switch == "auto" || layout.line_color_selection == "single" ) {
        borderColor = line_color[0];
      } else {
        borderColor = "rgba(" + line_color[i-2] + ",1)";
      }

      datasets.push({
          type: 'line',
          label: layout.qHyperCube.qMeasureInfo[i-1].qFallbackTitle,
          data: data.map(function(d) {
              return { label: d[0].qText, x: d[0].qNum, y: d[i].qNum }
          }),
          orig_data: data.map(function(d) {
              return { label: d[0].qText, x: d[0].qNum, y: d[i].qNum }
          }),
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor: borderColor,
          pointBackgroundColor: 'rgba(0,0,0,0)',
          borderWidth: layout.line_width,
          pointRadius: 0
      })
    }
  }


  var ctx = document.getElementById(id);

  var myLineChart = new Chart(ctx, {
      data: {
          labels: data.map(function(d) { return d[0].qText; }),
          datasets: datasets
      },
      options: {
        title:{
            display: layout.title_switch,
            text: layout.title
        },
        legend: {
          display: (layout.legend_position == "hide") ? false : true,
          position: layout.legend_position,
          onClick: function(evt, legendItem) {
            //do nothing
          }
        },
        scales: {
          xAxes: [{
            type: layout.xscale_mode,
            position: "bottom",
            scaleLabel: {
              display: layout.datalabel_switch,
              labelString: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: layout.datalabel_switch,
              labelString: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
            },
            ticks: {
              beginAtZero: layout.begin_at_zero_switch,
              callback: function(value, index, values) {
                return chartjsUtils.formatMeasure(value, layout, 0);
              }
            }
          }]
        },
        tooltips: {
            mode: 'label',
            callbacks: {
                label: function(tooltipItems, data) {
                    
                  if ((layout.hidezero && tooltipItems.yLabel > 0) || !layout.hidezero) {
                    if (layout.tooltippct) {
                      return data.datasets[tooltipItems.datasetIndex].label +': ' + chartjsUtils.formatMeasure(tooltipItems.yLabel, layout, 0) + ' (' + (100*tooltipItems.yLabel/tooltipItems.yTotal).toFixed(1) + '%)';
                    } else {
                      return data.datasets[tooltipItems.datasetIndex].label +': ' + chartjsUtils.formatMeasure(tooltipItems.yLabel, layout, 0);
                    }
                    
                  }
                }
            }
        },
        responsive: true,
        events: ["mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"],
        onClick: function(evt) {
          var activePoints = this.getElementsAtEvent(evt);
          if(activePoints.length > 0) {
            chartjsUtils.makeSelectionsOnDataPoints(data[activePoints[0]._index][0].qElemNumber, _this);
          }
        }
      }
      // options: {
      //     scales: {
      //         yAxes: [{
      //             ticks: {
      //                 beginAtZero:true
      //             }
      //         }]
      //     }
      // }
  });
}
