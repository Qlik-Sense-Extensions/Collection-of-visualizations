define( [
		"text!./wiWidgetEditor.PopupHelp.html"
	],
	function ( template ) {
		"use strict";

		return {
			scope:{},
			template: template,
			controller: ['$scope', function ( $scope ) {
				$scope.closeView = function () {
					$scope.destroyComponent();
				};

			}]
		};
	} );