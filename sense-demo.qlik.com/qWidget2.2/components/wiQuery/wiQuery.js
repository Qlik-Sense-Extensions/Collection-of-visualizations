define(["jquery","qvangular","./wiQueryService"],function(a,b){"use strict";b.directive("wiQuery",["$compile","$timeout","wiQueryService",function(a,b,c){return{restrict:"E",replace:!0,scope:{},priority:0,controller:["$scope",function(){}],link:function(b,d,e){var f,g=b.$watch(e.lists,function(a,b){void 0!==a&&a!==b&&h()}),h=function(){f&&f.$destroy(),f=b.$new();var a=f.$eval(e.expressions),d=f.$eval(e.hypercubes),g=f.$eval(e.lists);c.getGenericObject(f,a,d,g).then(function(){i()}).catch(function(a){}).finally(function(){})},i=function(){a(d.contents())(f)};h(),b.$on("$destroy",function(){d.remove(),g()})}}}])});