define(["angular","qvangular"],function(a,b){"use strict";b.service("uiPositionService",["$document","$window",function(b,c){function d(a,b){return a.currentStyle?a.currentStyle[b]:c.getComputedStyle?c.getComputedStyle(a)[b]:a.style[b]}function e(a){return"static"===(d(a,"position")||"static")}var f=function(a){for(var c=b[0],d=a.offsetParent||c;d&&d!==c&&e(d);)d=d.offsetParent;return d||c};return{position:function(c){var d=this.offset(c),e={top:0,left:0},g=f(c[0]);g!=b[0]&&(e=this.offset(a.element(g)),e.top+=g.clientTop-g.scrollTop,e.left+=g.clientLeft-g.scrollLeft);var h=c[0].getBoundingClientRect();return{width:h.width||c.prop("offsetWidth"),height:h.height||c.prop("offsetHeight"),top:d.top-e.top,left:d.left-e.left}},offset:function(a){var d=a[0].getBoundingClientRect();return{width:d.width||a.prop("offsetWidth"),height:d.height||a.prop("offsetHeight"),top:d.top+(c.pageYOffset||b[0].documentElement.scrollTop),left:d.left+(c.pageXOffset||b[0].documentElement.scrollLeft)}},positionElements:function(a,b,c,d){var e,f,g,h,i=c.split("-"),j=i[0],k=i[1]||"center";e=d?this.offset(a):this.position(a),f=b.prop("offsetWidth"),g=b.prop("offsetHeight");var l={center:function(){return e.left+e.width/2-f/2},left:function(){return e.left},right:function(){return e.left+e.width}},m={center:function(){return e.top+e.height/2-g/2},top:function(){return e.top},bottom:function(){return e.top+e.height}};switch(j){case"right":h={top:m[k](),left:l[j]()};break;case"left":h={top:m[k](),left:e.left-f};break;case"bottom":h={top:m[j](),left:l[k]()};break;default:h={top:e.top-g,left:l[k]()}}return h}}}])});