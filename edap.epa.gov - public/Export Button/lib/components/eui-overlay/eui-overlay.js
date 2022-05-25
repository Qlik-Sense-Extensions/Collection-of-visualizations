/*!

* sense-export - Just a simple button to export data in your Qlik Sense application without displaying them in a table first.
* --
* @version v1.2.3
* @link https://github.com/stefanwalther/sense-export
* @author Stefan Walther
* @license MIT
*/

/*global define*/
define(["jquery","angular","qvangular","text!./eui-overlay.css"],function($,angular,qvangular,cssContent){"use strict";!function(cssContent,id){id&&"string"==typeof id?$("#"+id).length||$("<style>").attr("id",id).html(cssContent).appendTo("head"):$("<style>").html(cssContent).appendTo("head")}(cssContent,"eui-overlay"),qvangular.directive("euiOverlay",function(){return{restrict:"A",replace:!1,scope:{overlayEnabled:"=",overlayTitle:"@",overlayText:"@"},link:function($scope,$element,$attrs){if($scope.enabled=!!angular.isDefined($attrs.overlayEnabled)&&$scope.$parent.$eval($attrs.overlayEnabled),!0===$scope.enabled){var $overLay=$(document.createElement("div"));$overLay.addClass("eui-overlay-container");var $content=$(document.createElement("div"));$content.addClass("content");var $title=$(document.createElement("div"));$title.addClass("title"),$title.html($scope.overlayTitle),$content.append($title);var $text=$(document.createElement("div"));$text.addClass("text"),$text.html($scope.overlayText),$content.append($text),$overLay.append($content),$element.parent().replaceWith($overLay)}}}})});