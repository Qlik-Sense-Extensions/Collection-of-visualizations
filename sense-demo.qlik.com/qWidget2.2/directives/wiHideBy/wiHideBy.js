define(["jquery","underscore","angular","qvangular","./../../modules/utils/wiUtils"],function(a,b,c,d){"use strict";d.directive("wiHideBy",["$timeout",function(){return{scope:{target:"@",maxWidth:"@",maxHeight:"@"},priority:0,link:function(b,c){var d=a(b.target),e=b.$watch(function(){return{h:d.height(),w:d.width()}},function(a){var d=b.maxHeight?a.h<b.maxHeight:!1,e=b.maxWidth?a.w<parseInt(b.maxWidth):!1;c.toggle(!(d||e))},!0);b.$on("destroy",function(){e()})}}}])});