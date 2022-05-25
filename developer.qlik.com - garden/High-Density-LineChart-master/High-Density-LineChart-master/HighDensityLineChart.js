define(["qlik", "./definition", "./HighDensityChartBase", "./lib/plotly-2.8.3.min", "text!./style.css",
"./definitionChart"
],


	function (qlik, definition, highDensityChartBase, Plotly, cssContent, definitionChart) {

		$("<style>").html(cssContent).appendTo("head");

		return {
			initialProperties: {
				refLineList: [],
				shapes: [],
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: definitionChart.qInitialDataFetch.qWidth,
						qHeight: definitionChart.qInitialDataFetch.qHeight
					}]
				},
				selectionMode: "CONFIRM"
			},
			//template: template,	
			definition: definition,

			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			controller: ['$scope', function ($scope) {

				$scope.selectedElements = new Map();

			}],

			paint: function ($element, layout) {

				
				var self = this;
				var id = layout.qInfo.qId;

				
				if (document.getElementById('T_' + id) == null) {
                    //let html = '<div id=' + 'T_' + id + ' style="width:100%;height:100%;"></div>';

                    let html = '<div id=' + 'T_' + id + ' style="width:100%;height:100%;">'
						+ '<div class="render-highdensity" id=' + 'Render_' + id + '><div class="center"><b>Loading...</b></div>';
						
					html += '</div></div><div class="hd-limited-msg"></div>';
					
                    $element.html(html);
                } else {
                    $('#' + 'Render_' + id).show();

                }

                var TESTER = document.getElementById('T_' + id);


				highDensityChartBase.createPlot($element, layout, self, TESTER, definitionChart.type).then(function() {

					//needed for export
					$('#' + 'Render_' + id).hide();

					if (self.backendApi.getRowCount() > layout.maxRecord) { 
						$('.hd-limited-msg').html( "* Currently showing a limited data set. See Add-Ons > Max Records" );
					} else {
						$('.hd-limited-msg').html('');
					}


					return qlik.Promise.resolve();
				});


				
			},

			resize: function($element, layout) {

				//paint($element, layout);
				//return;
				
				var id = layout.qInfo.qId;
				var TESTER = document.getElementById('T_' + id);
				
				if (TESTER.data != null) {
					Plotly.Plots.resize(TESTER);
				}
			}
			
		};

	});
