/*global define*/
define([
        'jquery',
        'qvangular'
    ],
    function ($, qvangular) {

        'use strict';
        qvangular.directive('ngColorPicker', function () {
            var defaultColors = [
                '#404040',
                '#bababa',
                '#2c7bb6',
                '#abd9e9',
                '#1a9641',
                '#a6d96a',
                '#ffffbf',
                '#fdae61',
                '#d7191c'
            ];
            return {
                scope: {
                    selected: '=',
                    customizedColors: '=colors'
                },
                restrict: 'AE',
                template: '<ul><li ng-repeat="color in colors" ng-class="{selected: (color===selected)}" ng-click="pick(color)" style="background-color:{{color}};"></li></ul>',
                link: function (scope, element, attr) {
                    scope.colors = scope.customizedColors || defaultColors;
                    scope.selected = scope.$parent.$parent.iconColor = scope.selected || scope.colors[0];

                    scope.pick = function (color) {
                        scope.selected = scope.$parent.$parent.iconColor = color;
                    };

                }
            };
        });
    });