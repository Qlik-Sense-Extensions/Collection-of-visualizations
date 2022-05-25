define( [
		"text!./Main.html"
	],
	function ( template ) {
		"use strict";

		return {
			template: template,
			controller: ['$scope', function ( $scope ) {

				$scope.closeView = function () {
					$scope.destroyComponent();
				};
			}]
		};
	} );