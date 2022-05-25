define( ["qlik", "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js"],
	function ( qlik, d3 ) {

		return {
			template: '<div qv-extension style="height: 100%; position: relative; overflow: auto;" class="ng-scope"><div class="rink" ng-style="{\'background-image\': \'url({{imgUrl}})\'}" style="background-repeat: no-repeat; background-size: contain;"></div> </div>',
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 4,
						qHeight: 2500
					}]
				}
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					dimensions: {
						uses: "dimensions",
						min: 1,
						max: 1
					},
					measures: {
						uses: "measures",
						min: 2,
						max: 3
					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function ($element, layout) {

				var self = this;

				var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
				var data = [];
				$.each(qMatrix, function(key, val) {
					var obj = {
						shotNumber: val[0].qText,
						xVal: val[1].qNum,
						yVal: val[2].qNum,
						color: val[3] ? val[3].qText : "black",
						state: val[0].qState,
						elemNumber: val[0].qElemNumber
					};
					data.push(obj);
				});

				var $rink = $element.find(".rink");
				$rink.empty();

				var width = $element.width(),
					height = $element.height();
				var x = d3.scale.linear()
							.domain([1, 30])
							.range([0, 600]);
				var y = d3.scale.linear()
							.domain([25, 1])
							.range([0, 307]);
				var svg = d3.select($rink.get(0)).append('svg')
							.attr("viewBox", "0 0 600 307")
							.attr("preserveAspectRatio", "xMinYMin meet");

				svg.selectAll(".shot-dots")
					.data(data)
						.attr("cx", function(d) { return x(d.xVal) })
						.attr("cy", function(d) { return y(d.yVal) })
						.attr("fill", function(d) { if(d.state ==="X"){return "#ccc"} else{return d.color} })
					.enter()
						.append("circle")
							.attr("class", "shot-dots")
							.attr("cx", function(d) { return x(d.xVal) + x(2)/2 - 2 })
							.attr("cy", function(d) { return y(d.yVal) + y(24)/2 - 2 })
							.attr("fill", function(d) { if(d.state ==="X"){return "#ccc"} else{ return d.color} })
							.attr("r", 4)
							.on("click", function(d) {
								self.backendApi.selectValues(0, [d.elemNumber], true);
							})
							.on("mouseover", function() {
								d3.select(this).transition().attr("r", 6);
							})
							.on("mouseout", function() {
								d3.select(this).transition().attr("r", 4);
							});
				svg.selectAll(".shot-dots")
					.data(data)
					.exit().remove();

				return qlik.Promise.resolve();
			},
			controller: ['$scope', '$element', function ( $scope, $element ) {
				$scope.imgUrl = require.s.contexts._.config.baseUrl + "../" + "extensions/hockey-rink-scatterplot/hockeyrink.jpg";
			}]
		};

	} );

