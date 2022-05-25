define( [
		"text!./wiWidgetEditor.PopupIcons.html",
		"../../../lib/assets/colorpicker/colorpicker-directive"
	],
	function ( template ) {
		"use strict";

		return {
			template: template,
			controller: ['$scope', function ( $scope ) {
				$scope.iconColor = "#404040";
				$scope.closeView = function () {
					$scope.destroyComponent();
				};
				$scope.insert = function ( key ) {
					var color = $scope.iconColor || '';
					var colorStyle = ((!_.isEmpty( color )) ? ' style="color:' + color + '"' : '');
					var iconString = '<span class="fa fa-' + key + ' ' + $scope.iconSize + '"' + colorStyle + '></span>';
					//scope.WidgetEditor.popupTarget = 'html';
					$scope.insertString( iconString, false );
					$('#wipopup').empty();
				}
			}]
		};
	} );