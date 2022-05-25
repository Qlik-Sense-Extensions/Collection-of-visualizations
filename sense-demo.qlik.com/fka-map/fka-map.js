define( ["qlik", "https://unpkg.com/leaflet@1.0.0/dist/leaflet.js", "https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.6/d3.min.js", "css!./main.css", "css!https://unpkg.com/leaflet@1.0.0/dist/leaflet.css"],
	function ( qlik, L, d3 ) {

		return {
			template: "<div qv-extension class='ng-scope fka-map'></div>",
			initialProperties: {
				layer1cube: {
					qHyperCubeDef: {
						qDimensions: [],
						qMeasures: [],
						qInitialDataFetch: [{
							qWidth: 3,
							qHeight: 3333
						}],
						qSuppressZero: true,
						qSuppressMissing: true
					}
				},
				layer2cube: {
					qHyperCubeDef: {
						qDimensions: [],
						qMeasures: [],
						qInitialDataFetch: [{
							qWidth: 4,
							qHeight: 2500
						}],
						qSuppressZero: true,
						qSuppressMissing: true
					}
				},
				layer3cube: {
					qHyperCubeDef: {
						qDimensions: [],
						qMeasures: [],
						qInitialDataFetch: [{
							qWidth: 2,
							qHeight: 5000
						}],
						qSuppressZero: true,
						qSuppressMissing: true
					}
				}
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					layer1: {
						label: "Points",
						type: "items",
						items: {
							dimension: {
								label: "Dimension",
								type: "string",
								expression: "always",
								expressionType: "dimension",
								ref: "layer1.dimension"
							}, 
							lat: {
								label: "Lat",
								type: "string",
								expression: "always",
								expressionType: "measure",
								ref: "layer1.lat"
							},
							long: {
								label: "Long",
								type: "string",
								expression: "always",
								expressionType: "measure",
								ref: "layer1.long"
							}
						}
					},
					layer2: {
						label: "Radius",
						type: "items",
						items: {
							dimension: {
								label: "Dimension",
								type: "string",
								expression: "always",
								expressionType: "dimension",
								ref: "layer2.dimension"
							},
							lat: {
								label: "Lat",
								type: "string",
								expression: "always",
								expressionType: "measure",
								ref: "layer2.lat"
							},
							long: {
								label: "Long",
								type: "string",
								expression: "always",
								expressionType: "measure",
								ref: "layer2.long"
							},
							aggr: {
								label: "Aggregate",
								type: "string",
								expression: "always",
								expressionType: "measure",
								ref: "layer2.aggr"
							},
							legendTitle: {
								label: "Legend title",
								type: "string",
								expression: "sometimes",
								ref: "layer2.legendTitle"
							},
						}
					},
					layer3: {
						label: "Polygons",
						type: "items",
						items: {
							dimension: {
								label: "Dimension",
								type: "string",
								expression: "always",
								expressionType: "dimension",
								ref: "layer3.dimension"
							},
							measure: {
								label: "measure",
								type: "string",
								expression: "always",
								expressionType: "measure",
								ref: "layer3.measure"
							},
							legendTitle: {
								label: "Legend title",
								type: "string",
								expression: "sometimes",
								ref: "layer3.legendTitle"
							}
						}
					},
					sorting: {
						uses: "sorting"
					},
					settings: {
						uses: "settings",
						items: {
							map: {
								label: "Map Settings",
								type: "items",
								items: {
									centerLat: {
										label: "Center Lat",
										type: "number",
										ref: "map.centerLat",
										defaultValue: 0
									},
									centerLong: {
										label: "Center Long",
										type: "number",
										ref: "map.centerLong",
										defaultValue: 0
									},
									zoom: {
										label: "Zoom",
										type: "number",
										ref: "map.zoom",
										defaultValue: 5
									}
								}
							}
						}
					}
				}
			},
			// support: {
			// 	snapshot: true,
			// 	export: true,
			// 	exportData: false
			// },
			paint: function (element, layout) {
				var _extension = this;

				//clear old layers
				
				_extension.$scope.layerGroup3.clearLayers();
				_extension.$scope.layerGroup2.clearLayers();
				_extension.$scope.layerGroup1.clearLayers();

				if(layout.layer1cube.qHyperCube.qDataPages[0].qMatrix.length > 0) {
					layout.layer1cube.qHyperCube.qDataPages[0].qMatrix.forEach(function(row) {
						if(row[1] == undefined || row[2] == undefined) {return}
						if (row[1].qNum === "Nan" || row[2].qNum === "NaN") {return}
						var circleMarker = L.circleMarker([row[1].qNum, row[2].qNum], {radius: 2, color: '#000', opacity: 0.2}).addTo(_extension.$scope.layerGroup1);
						circleMarker.on("click", function() {
							_extension.$scope.app.field("ZIP").selectMatch(row[0].qText);
						});
					});

				}

				$(".layer2legend").remove();
				if(layout.layer2cube.qHyperCube.qDataPages[0].qMatrix.length > 0) {
					if(layout.layer2cube.qHyperCube.qDataPages[0].qMatrix[0][1].qNum !== "NaN") {
						$(element).append("<div class='layer2legend'><div class='legendtitle'>" + layout.layer2.legendTitle + "</div><ul></ul></div>");
						$(".layer2legend").click(function(e) {
							$(this).toggleClass("collapsed");
						});
					}

					layout.layer2cube.qHyperCube.qDataPages[0].qMatrix.forEach(function(row) {
						if(row[1] == undefined || row[2] == undefined) {return}
						if (row[1].qNum === "Nan" || row[2].qNum === "NaN") {return}
						var radius = Number(row[0].qText) * 1609.34;
						var inner = (Number(row[0].qText)-10) * 1609.34;
						L.circle([row[1].qNum, row[2].qNum], {radius: radius, color: '#666', weight: 1.3, fillOpacity: 0}).addTo(_extension.$scope.layerGroup2);
						L.circle([row[1].qNum, row[2].qNum], {radius: inner, color: '#666' , weight: 1.3, fillOpacity: 0}).addTo(_extension.$scope.layerGroup2);

						if(row[3] != undefined) {
							var legendItem = "<li><div class='symbol'>" + row[0].qText + " mi</div>: <div class='legendlabel'>" + row[3].qText + "</div></li>";
							$(".layer2legend ul").append(legendItem);
						}
					});
				}

				$(".layer3legend").remove();
				if (layout.layer3cube.qHyperCube.qDataPages[0].qMatrix.length > 0) {

					var color = d3.scaleOrdinal(d3.schemeCategory10);
					var scale = d3.scaleOrdinal()
						.domain(layout.layer3cube.qHyperCube.qDataPages[0].qMatrix.map(function(row){return row[1].qText}))
						.range(color.range());

					$(element).append("<div class='layer3legend'><div class='legendtitle'>" + layout.layer3.legendTitle + "</div><ul></ul></div>");
					$(".layer3legend").click(function(e) {
						$(this).toggleClass("collapsed");
					});
					var uniqMeasures = _.uniq(layout.layer3cube.qHyperCube.qDataPages[0].qMatrix.map(function(row){return row[1].qText}));
					uniqMeasures.forEach(function(measure) {
						var fillColor = color(scale(measure));
						var legendItem = "<li><div class='color-box' style='background-color:" + fillColor + "'></div><div class='legendlabel'>" + measure + "</div></li>";
						$(".layer3legend ul").append(legendItem);
					});

					layout.layer3cube.qHyperCube.qDataPages[0].qMatrix.forEach(function(row) {
						var arr = JSON.parse(row[0].qText)[0];
						var reversed = arr.map(function(arr) {
							return arr.map(function(arr) {
								return [arr[1], arr[0]];
							});
						});
						var fillColor = color(scale(row[1].qText));
						var polygon = L.polygon(reversed, {color: "#fff", opacity: 0.2, weight: 1, fillColor: fillColor, fillOpacity: 0.4});
						// polygon.on("click", function() {
						// 	_extension.$scope.app.field(layout.layer3cube.qHyperCube.qDimensionInfo[0].qFallbackTitle).select([row[0].qElemNumber], true, false);
						// });
						polygon.addTo(_extension.$scope.layerGroup3);
					});
				}


				// return qlik.Promise.resolve();
			},
			controller: ['$scope', '$element', function ( $scope, $element ) {
				// Instantiate map
				var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>' });
				$scope.map = L.map($element.find(".fka-map")[0], {
					renderer: L.canvas(), 
					scrollWheelZoom: false, 
					center: [$scope.layout.map.centerLat, $scope.layout.map.centerLong], //[40.7127837, -74.0059413]
					zoom: $scope.layout.map.zoom,
					// minZoom: minZoom,
					// maxZoom: maxZoom,
					// maxBounds: maxBounds
				});
				$scope.map.addLayer(layer);

				//Initialize layer groups
				$scope.layerGroup3 = L.layerGroup().addTo($scope.map);
				$scope.layerGroup2 = L.layerGroup().addTo($scope.map);
				$scope.layerGroup1 = L.layerGroup().addTo($scope.map);

				$scope.app = qlik.currApp($scope);

				//Set layer1cube
				$scope.$watchCollection("layout.layer1", function(layer) {
					$scope.backendApi.applyPatches([
						{
							"qPath": "/layer1cube/qHyperCubeDef/qDimensions",
							"qOp": "replace",
							"qValue": JSON.stringify([{qDef: {qFieldDefs: [layer.dimension]}}])
						},
						{
							"qPath": "/layer1cube/qHyperCubeDef/qMeasures",
							"qOp": "replace",
							"qValue": JSON.stringify([{qDef: {qDef: layer.lat}}, {qDef: {qDef: layer.long}}])
						}
					], false);
				});

				//Set layer2cube
				$scope.$watchCollection("layout.layer2", function(layer) {
					$scope.backendApi.applyPatches([
						{
							"qPath": "/layer2cube/qHyperCubeDef/qDimensions",
							"qOp": "replace",
							"qValue": JSON.stringify([{qDef: {qFieldDefs: [layer.dimension]}}])
						},
						{
							"qPath": "/layer2cube/qHyperCubeDef/qMeasures",
							"qOp": "replace",
							"qValue": JSON.stringify([{qDef: {qDef: layer.lat}}, {qDef: {qDef: layer.long}}, {qDef: {qDef: layer.aggr}}])
						}
					], false);
				});

				//Set layer3cube
				$scope.$watchCollection("layout.layer3", function(layer) {
					$scope.backendApi.applyPatches([
						{
							"qPath": "/layer3cube/qHyperCubeDef/qDimensions",
							"qOp": "replace",
							"qValue": JSON.stringify([{qDef: {qFieldDefs: [layer.dimension]}, qNullSuppression: true}])
						},
						{
							"qPath": "/layer3cube/qHyperCubeDef/qMeasures",
							"qOp": "replace",
							"qValue": JSON.stringify([{qDef: {qDef: layer.measure}}])
						}
					], false);
				});

				//watch for map settings changes and update map
				$scope.$watchCollection("layout.map", function(map) {
					$scope.map.panTo([map.centerLat, map.centerLong]);
					$scope.map.setZoom(map.zoom);
				});

				//delete, for testing
				$scope.$watchCollection("layout.layer1cube.qHyperCube", function(cube) {
					console.log(cube);
				});

			}]
		};

	} );

