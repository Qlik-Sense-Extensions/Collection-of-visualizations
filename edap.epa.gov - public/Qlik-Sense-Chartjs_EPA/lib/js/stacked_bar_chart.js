var visualize = function($element, layout, _this, chartjsUtils) {
  var id  = layout.qInfo.qId + "_chartjs_stacked_bar";
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

  var palette = [];
  var custompalette = {};
  if (!qDimColorUser[1].auto) {


	// JV Update v0.4: Use the backendApi to iterate through AVAILABLE rows
	_this.backendApi.eachDataRow(function(rownum, row) {
		lastrow = rownum;
		var path 		= ""; 
		var sep 		= ""; 
		var nbDimension = qDim.length;
		var nbMesures 	= qMatrix[0].length - nbDimension;
		var nbTotal 	= nbMesures + nbDimension;
		
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
						var colours = ['#3182bd','#6baed6',	'#9ecae1','#c6dbef','#e6550d','#fd8d3c','#fdae6b','#fdd0a2','#31a354',
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
		custompalette[row[1].qText]	= colors[1];


	});
  } else {
	  if (layout.colors == "auto") {
	    palette = chartjsUtils.defineColorPalette(layout.color_selection);
	  } else {
	    palette = layout.custom_colors.split("-");
	  }
  }


  var result_set = chartjsUtils.flattenData(qMatrix);
  var flatten_data = result_set[0];
  var dim2_unique_values = result_set[1];
  var dim2_unique_elem_nums = result_set[2];

  // Sort by Alphabetic order
  if (layout.sort) {
    dim2_unique_values.sort()
  }

  //Group by dimension1
  var data_grouped_by_dim1 = _.groupBy(flatten_data, 'dim1')

  //Create a container for formatted_data_array
  var formatted_data_array = [];
  formatted_data_array["dim1"] = [];
  formatted_data_array["dim1_elem"] = [];

  // Initialize arrays for dimension values
   formatted_data_array = chartjsUtils.initializeArrayWithZero(_.size(data_grouped_by_dim1), dim2_unique_values, formatted_data_array);

  // Store hypercube data to formatted_data_array
  formatted_data_array = chartjsUtils.storeHypercubeDataToArray(data_grouped_by_dim1, formatted_data_array);

  // Culculate cumulative sum when cumulative switch is on
  if (layout.cumulative) {
    formatted_data_array = chartjsUtils.addCumulativeValuesOnTwoDimensions(dim2_unique_values, formatted_data_array);
  }

  var dim1_totals = Array.apply(null,{length: formatted_data_array[dim2_unique_values[0]].length}).map(function() { return 0; });
  if (layout.normalized) {
    for (var i=0; i<dim2_unique_values.length; i++ ) {
      for (var j=0; j<dim1_totals.length; j++) {
        dim1_totals[j] += formatted_data_array[dim2_unique_values[i]][j];
      }
    }
  }

  // Create datasets for Chart.js rendering
  var datasets = [];
  for(var i=0; i<dim2_unique_values.length; i++ ) {
    var subdata = [];
    var color_id = i;
    if (!qDimColorUser[1].auto) {
	    subdata.backgroundColor = custompalette[dim2_unique_values[i]];
    } else {
	    	if (layout.colors == "auto" && layout.color_selection == "twelve") {
	      color_id = i % 12
	    } else if (layout.colors == "auto" && layout.color_selection == "one-handred") {
	      color_id = i % 100
	    } else if (layout.colors == "custom") {
	      color_id = i % palette.length
	    }	    
    	subdata.backgroundColor = "rgba(" + palette[color_id] + "," + layout.opacity + ")";
	}
    subdata.label = dim2_unique_values[i];
    subdata.data = formatted_data_array[dim2_unique_values[i]];
    subdata.orig_data = subdata.data;
    if (layout.normalized) {
      subdata.data = formatted_data_array[dim2_unique_values[i]].map(function(ele, idx) { return ele/dim1_totals[idx]; })
    }
    datasets.push(subdata);
  }
  datasets = datasets.reverse();
  var chart_data = {
      labels: formatted_data_array["dim1"],
      datasets: datasets
  };

  var ctx = document.getElementById(id);
  if (ctx) {
	  
	  var myStackedBar = new Chart(ctx, {
		  type: 'bar',
		  data: chart_data,
		  options: {
			  title:{
				  display: layout.title_switch,
				  text: layout.title
			  },
			  legend: {
				display: (layout.legend_position == "hide") ? false : true,
				position: layout.legend_position,
				onClick: function(evt, legendItem) {
				  var values = [];
				  var dim = 1;
				  if(dim2_unique_elem_nums[legendItem.text]<0) {
					//do nothing
				  } else {
					values.push(dim2_unique_elem_nums[legendItem.text]);
					_this.selectValues(dim, values, true);
				  }
				}
			  },
			  tooltips: {
				  mode: 'label'
			  },
			  responsive: true,
			  scales: {
				  xAxes: [{
					  stacked: true,
					  scaleLabel: {
						display: layout.datalabel_switch,
						labelString: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle
					  }
				  }],
				  yAxes: [{
					  stacked: true,
					  scaleLabel: {
						display: layout.datalabel_switch,
						labelString: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
					  },
					  ticks: {
						beginAtZero: layout.begin_at_zero_switch,
						callback: function(value, index, values) {
						  if (layout.normalized) {
							return chartjsUtils.formatMeasure(value, layout, 0, true);
						  }
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
			  events: ["mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"],
			  onClick: function(evt) {
				var activePoints = this.getElementsAtEvent(evt);
				if(activePoints.length > 0) {
					if(layout.selectdim2) {
				  		chartjsUtils.makeSelectionsOnDataPoints(dim2_unique_elem_nums[activePoints[0]._view.datasetLabel], _this);
					} else {
				 		chartjsUtils.makeSelectionsOnDataPoints(formatted_data_array["dim1_elem"][activePoints[0]._index], _this);
					}
				}
			  }
		  }
	  });
  }
}
