define( [	"jquery",
			"qvangular"
						
		],
	function ( $,qvangular ) {

		'use strict';

    qvangular.directive ('ngX', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngX, function(value) {
                element.attr('x', value);
            });
        }});  		

    qvangular.directive ('ngY', function() {
            return function(scope, element, attrs) {
                scope.$watch(attrs.ngY, function(value) {
                    element.attr('y', value);
                });
            }});

    qvangular.directive ('ngX1', function() {
            return function(scope, element, attrs) {
                scope.$watch(attrs.ngX1, function(value) {
                    element.attr('x1', value);
                });
            }});

    qvangular.directive ('ngY1', function() {
            return function(scope, element, attrs) {
                scope.$watch(attrs.ngY1, function(value) {
                    element.attr('y1', value);
                });
            }});

    qvangular.directive ('ngX2', function() {
            return function(scope, element, attrs) {
                scope.$watch(attrs.ngX2, function(value) {
                    element.attr('x2', value);
                });
            }});

    qvangular.directive ('ngY2', function() {
            return function(scope, element, attrs) {
                scope.$watch(attrs.ngY2, function(value) {
                    element.attr('y2', value);
                })
                
            }});
	})