/*!

* sense-export - Just a simple button to export data in your Qlik Sense application without displaying them in a table first.
* --
* @version v1.2.3
* @link https://github.com/stefanwalther/sense-export
* @author Stefan Walther
* @license MIT
*/

/*global define*/
define(["jquery","qvangular","text!./eui-simple-table.ng.html","text!./eui-simple-table.css"],function($,qvangular,ngTemplate,cssContent){"use strict";!function(cssContent,id){id&&"string"==typeof id?$("#"+id).length||$("<style>").attr("id",id).html(cssContent).appendTo("head"):$("<style>").html(cssContent).appendTo("head")}(cssContent,"eui-simple-table"),qvangular.directive("euiSimpleTable",[function(){return{restrict:"EA",scope:{hyperCube:"="},template:ngTemplate,link:function($scope){}}}])});