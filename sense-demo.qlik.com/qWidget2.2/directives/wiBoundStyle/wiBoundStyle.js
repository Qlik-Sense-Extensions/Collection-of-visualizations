define(["jquery","qvangular"],function(a,b){"use strict";b.directive("wiBoundStyle",["$compile",function(a){return{restrict:"E",link:function(b,c){if(c.html()){var d=a('<style type="text/css" ng-bind-template="'+c.html()+'"></style>');c.replaceWith(d(b))}b.$on("$destroy",function(){c.remove(),c.off()})},priority:100}}])});