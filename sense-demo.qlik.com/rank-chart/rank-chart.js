define( ["text!./rank-chart.ng.html", "css!./rank-chart.css"],
	function ( template ) {
		"use strict";
		return {
			template: template,
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 2,
						qHeight: 50
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
						min: 1,
						max: 1
					},
					sorting: {
						uses: "sorting"
					}
				}
			},
			snapshot: {
				canTakeSnapshot: true
			},
			controller: ["$scope", "$element", function ( $scope, $element ) {
				$scope.getPercent = function ( val ) {
					return Math.round( (val * 100 / $scope.layout.qHyperCube.qMeasureInfo[0].qMax) * 100 ) / 100;
				};
				$scope.sel = function ( $event ) {
					if ( $event.currentTarget.hasAttribute( "data-row" ) ) {
						var row = parseInt( $event.currentTarget.getAttribute( "data-row" ), 10 ), dim = 0,
							cell = $scope.$parent.layout.qHyperCube.qDataPages[0].qMatrix[row][0];
						cell.qState = (cell.qState === "S" ? "O" : "S");
						$scope.selectValues( dim, [cell.qElemNumber], true );
						$element.find( $event.currentTarget ).addClass( "selected" );
					}
				};
			}]
		};

	} );
