/*globals define*/
define(
    [
    "jquery", 
    "css!./scripts/style.css", 
    "./scripts/themes", 
    "./scripts/d3.min", 
    "./scripts/radialProgress"
    ], 
    function($, cssContent, chart_theme) {
    'use strict';
    $("<style>").html(cssContent).appendTo("head");
    return {
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 3,
                    qHeight: 200
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 0,
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
                settings: {
                    uses: "settings",
                    items: {
                        ThemeDropDown: {
                            type: "string",
                            component: "dropdown",
                            label: "Theme",
                            ref: "theme",
                            options: chart_theme,
                            defaultValue: ["#64b5f6", "#1976d2", "#ef6c00", "#ffd54f", "#455a64", "#96a6a6", "#dd2c00", "#00838f", "#00bfa5", "#ffa000"]
                        },
                        extras: {
                            type: "items",
                            label: "Extra Settings",
                            items: {
                                scrollaftermax: {
                                    type: "integer",
                                    label: "Animation time (ms)",
                                    ref: "animationtime",
                                    defaultValue: 1000
                                },
								singlekpilabel: {
									type: "string",
									label: "Single KPI Label",
									ref: "singlekpilabel",
									defaultValue: ""
								},
								showdecimals: {
									type: "boolean",
									label: "Show decimal values",
									ref: "showdecimals",
									defaultValue: false
								},
								showpercentage: {
									type: "boolean",
									label: "Show percent (%) symbol",
									ref: "showpercentage",
									defaultValue: true
								}
                            }
                        }
                    }
                }
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },
        paint: function($element, layout) {

            $element.empty();
			
			var id = "container_" + layout.qInfo.qId;
			var width = $element.width();
			var height = $element.height();
			if(document.getElementById(id)) {
				$("#" + id).empty();
			}
			else {
				$element.append($('<div />').attr("id", id).attr("class", "viz").width(width).height(height));
			}

            var IS_SPARK_LAYOUT = this.options.layoutMode === 1;
            var HAS_DIMENSION = layout.qHyperCube.qDimensionInfo.length > 0;
			var HAS_TWO_DIMENSION = layout.qHyperCube.qDimensionInfo.length > 1;

            var data = layout.qHyperCube.qDataPages[0].qMatrix;
            var label = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;

            var colors = [layout.theme[0], layout.theme[1], layout.theme[2]];
            var animationTime = layout.animationtime;
			var showdecimals = layout.showdecimals;
			var showpercentage = layout.showpercentage;


            var rows, columns;
            if (height > width) {
                columns = Math.ceil(Math.sqrt(data.length));
                rows = Math.ceil(data.length / columns);
            } else {
                columns = Math.ceil(Math.sqrt(1.5 * data.length) / 1.5);
                rows = Math.ceil(data.length / columns);
            };

            var area = d3.select($("#" + id).get(0))
                .selectAll('.area')
                .data(data)
                .enter()
                .append('div')
                .attr('class', 'circular-kpi-tile')
                .attr('id', function(d, i) {
                    return id + '_circular-kpi-tile-' + i;
                })
				.attr('selected', 'no')
                .style('width', '20%')
                .style('height', '180px');
                // .style('width', Math.ceil(width / columns, 10) - 5 + 'px')
                // .style('height', Math.ceil(height / rows, 10) - 5 + 'px');
			
            data.forEach(function(d, i) {
				if(HAS_TWO_DIMENSION) {
					var value = d[2].qNum;
					//For a multidim chart - calculate the color to use so we loop over the # of colors in the theme.
					var colorIter = Math.round(d[1].qElemNumber/(layout.theme.length-2) % 1 * (layout.theme.length-2));
					colors = [layout.theme[colorIter], layout.theme[colorIter+1], layout.theme[colorIter+2]];
				}
				else {
					var value = HAS_DIMENSION ? d[1].qNum : d[0].qNum;
                }
				if(layout.singlekpilabel.length>0) {var label = HAS_DIMENSION ? d[0].qText : layout.singlekpilabel};
				if(layout.singlekpilabel.length==0) {var label = HAS_DIMENSION ? d[0].qText : label};
				
				var extraLabel = HAS_TWO_DIMENSION ? d[1].qText : "";

                var element = document.getElementById(id + '_circular-kpi-tile-' + i);
				
                var width = element.offsetWidth - 5, height = element.offsetHeight - 5;
				
                var select = function() {
					$('#' + id + '_circular-kpi-tile-' + i).attr('selected', '1');
					toggleOpacity();
                    return HAS_DIMENSION ? this.selectValues(0, [d[0].qElemNumber], true) : false;
                }.bind(this);
                
                if (width < height) {
                    height = width;
                } else {
                    width = height;
                };

                radialProgress(element, width, height, colors, animationTime, showdecimals, showpercentage)
                    .diameter(width)
                    .label(label)
					.extraLabel(extraLabel)
                    .onClick(select)
                    .value(value * 100)
                    .render();
					
            }.bind(this));
            
            function toggleOpacity() {
				$("#" +id).find("[selected=no]")
					.css({ opacity: 0.5 });
				$("#" +id).find("[selected=selected]")
					.css({ opacity: 1 });	
            };


        }
    };
});