define( [
		"text!./wiWidgetEditor.PopupVariables.html"
	],
	function ( template ) {
		"use strict";

		return {
			scope:{},
			template: template,
			controller: ['$scope', function ( $scope ) {

				$scope.categories = [
					{name: "General Information"},
					{name: "Custom Properties - Misc"},
					//{name: "Custom Properties - Colors"},
					{name: "Data Information"},
					{name: "Meta Information"}
				];
				$scope.selected = $scope.categories[0];
				$scope.closeView = function () {
					$scope.destroyComponent();
				};
				$scope.selectedCategoryFilter = function ( data ) {
					return  data.cat === $scope.$$childTail.selected.name;
				};

			}]
		};
	} );