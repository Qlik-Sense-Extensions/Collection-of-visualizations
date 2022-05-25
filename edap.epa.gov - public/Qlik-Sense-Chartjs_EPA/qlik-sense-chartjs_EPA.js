/*global
            define,
            require,
            window,
            console,
            _
*/
/*jslint    devel:true,
            white: true
 */
define([
        'jquery',
        'underscore',
        './properties',
        './initialproperties',
        './lib/js/extensionUtils',
        'text!./lib/css/style.css',
        './lib/js/contents',
        './lib/js/Chart',
        './lib/js/chartjsUtils'
],
function ($, _, props, initProps, extensionUtils, cssContent, contents, Chart) {
    'use strict';
    extensionUtils.addStyleToHeader(cssContent);

    //Accessing requirejs semi-private API - This might break in future versions of require.
    //var base = requirejs.s.contexts._.config.baseUrl + requirejs.s.contexts._.config.paths.extensions
	//fix for June2019
	var base = requirejs.s.contexts._.config.paths.extensions
    //var lastUsedChart = -1;

    return {
        definition: props,
        initialProperties: initProps,
        support: {
		        snapshot: true,
		        export: true,
		        exportData: true
	      },
        //snapshot: { canTakeSnapshot: true },
        //
        // resize : function($el, layout) {
        //     this.paint($el,layout);
        // },

//        clearSelectedValues : function($element) {
//
//        },


        // Angular Template
        //template: '',
        // (Angular Template)

        // Angular Controller
        controller: ['$scope', function ($scope) {

        }],
        // (Angular Controller)


        // Paint Method
        paint: function ($element, layout) {

            var self = this;

    				var dim_count = layout.qHyperCube.qDimensionInfo.length;
    				var measure_count = layout.qHyperCube.qMeasureInfo.length;

    				if ((dim_count < chartjs.filter(function(d) {
    						return d.id === layout.chart
    					})[0].min_dims || dim_count > chartjs.filter(function(d) {
    						return d.id === layout.chart
    					})[0].max_dims) || measure_count < chartjs.filter(function(d) {
    						return d.id === layout.chart
    					})[0].measures) {
    					$element.html("This chart requires " + chartjs.filter(function(d) {
    						return d.id === layout.chart
    					})[0].min_dims + " dimensions and " + chartjs.filter(function(d) {
    						return d.id === layout.chart
    					})[0].measures + " measures.");
    				} else {




                      self.backendApi.cacheCube.enabled = false;


                      var qTotalData = [];
                      var columns = layout.qHyperCube.qSize.qcx;
                      var pageheight = Math.floor(10000 / columns);
                      // Maximum of 10000 cells at one time, so break it up into pages
                      var numberOfPages = Math.ceil(layout.qHyperCube.qSize.qcy / pageheight);
                      var ctr = 0;

                      // Loop through the pages and offset each page by the prescribed
                      // amount. Call getData() on each
                      Array.apply(null, Array(numberOfPages)).map(function(data, index) {
                        var page = [{
                          qTop: (pageheight * index) + index,
                          qLeft: 0,
                          qWidth: columns,
                          qHeight: pageheight
                        }];

                        return self.backendApi.getData(page).then(function(data2) {
                          // Push this page's matrix into the combined matrix
                          for (var k = 0; k < data2[0].qMatrix.length; k++) {
                            qTotalData.push(data2[0].qMatrix[k])
                          }
                          ctr++;
                          // If reached the last page, call viz
                          if (ctr == numberOfPages) {
                            // Set combined matrix as default
                            layout.qHyperCube.qDataPages[0].qMatrix = qTotalData;


              //if (layout.chart != lastUsedChart) {
    						// Determine URL based on chart selection
    						var src = chartjs.filter(function(d) {
    							return d.id === layout.chart
    						})[0].src;

    						var url = base + "/qlik-sense-chartjs_EPA/lib/js/" + src;

    						// Load in the appropriate script and viz
    						jQuery.getScript(url, function() {
    							visualize($element, layout, self, chartjsUtils);
    							//lastUsedChart = layout.chart;
    						});
    					//} else {
    					//	viz($element, layout, self);
    					//}
                          }
                        });
                    });

            }
        }
        // (Paint Method)
    };

});
