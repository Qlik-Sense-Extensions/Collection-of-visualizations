/*!

* sense-export - Just a simple button to export data in your Qlik Sense application without displaying them in a table first.
* --
* @version v1.2.3
* @link https://github.com/stefanwalther/sense-export
* @author Stefan Walther
* @license MIT
*/

/* global define */
define(["qvangular","angular","text!./eui-button.ng.html"],function(qvangular,angular,ngTemplate){"use strict";var component={restrict:"E",replace:!0,template:ngTemplate,scope:{label:"=",theme:"=",icon:"=",fullWidth:"=",align:"=",click:"&"},controller:["$scope","$attrs",function($scope){$scope.onClick=function(){$scope.click&&$scope.click()}}]};return qvangular.directive("euiButton",function(){return component}),component});