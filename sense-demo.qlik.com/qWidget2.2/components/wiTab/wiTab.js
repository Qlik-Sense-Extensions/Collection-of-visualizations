define(["jquery","qvangular","qlik","objects.extension/base-controller","angular","./../../modules/utils/wiUtils"],function(a,b,c,d,e,f){"use strict";var g=d.extend({init:function(a){var b=this,d=b.tabs=a.tabs=[];b.select=function(a){e.forEach(d,function(b){b.active&&b!==a&&(b.active=!1,b.onDeselect())}),a.active=!0,c.resize(),a.onSelect()},b.addTab=function(a){d.push(a),1===d.length?a.active=!0:a.active&&b.select(a)},b.removeTab=function(a){var c=d.indexOf(a);if(a.active&&d.length>1){var e=c==d.length-1?c-1:c+1;b.select(d[e])}d.splice(c,1)}}});b.directive("wiTab",function(){return{restrict:"E",transclude:!0,scope:{},compile:function(b,c,d){return function(c){f.addStyleLinkToHeader("wiBootstrap","/extensions/qwidget/components/wiBootstrap/css/wiBootstrap.css"),d(c.$parent,function(c){var d=a(document.createElement("div"));d.addClass("wi-bs"),d.append(c),b.append(d)})}}}}),b.directive("tabset",function(){return{restrict:"EA",transclude:!0,replace:!0,scope:{type:"@",orientation:"@"},controller:["$scope",g],templateUrl:"/extensions/qWidget/components/wiTab/template/tabset.html",link:function(a,b,c){a.vertical=e.isDefined(c.vertical)?a.$parent.$eval(c.vertical):!1,a.justified=e.isDefined(c.justified)?a.$parent.$eval(c.justified):!0,a.orientation=e.isDefined(c.orientation)?a.$parent.$eval(c.orientation):"top",a.textOrientation=e.isDefined(c.textOrientation)?a.$parent.$eval(c.textOrientation):"horizontal"}}}),b.directive("tab",["$parse",function(a){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"/extensions/qWidget/components/wiTab/template/tab.html",transclude:!0,scope:{active:"=?",heading:"@",wiAction:"=",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(b,c,d){return function(b,c,f,g){b.$watch("active",function(a){a&&g.select(b)}),b.disabled=!1,f.disabled&&b.$parent.$watch(a(f.disabled),function(a){b.disabled=!!a}),b.select=function(){b.disabled||(e.isDefined(f.wiAction)&&a(f.wiAction)(),b.active=!0)},g.addTab(b),b.$on("$destroy",function(){g.removeTab(b)}),b.$transcludeFn=d}}}}]),b.directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(a,b){a.$watch("headingElement",function(a){a&&(b.html(""),b.append(a))})}}}]),b.directive("tabContentTransclude",function(){function a(a){return a.tagName&&(a.hasAttribute("tab-heading")||a.hasAttribute("data-tab-heading")||"tab-heading"===a.tagName.toLowerCase()||"data-tab-heading"===a.tagName.toLowerCase())}return{restrict:"A",require:"^tabset",link:function(b,c,d){var f=b.$eval(d.tabContentTransclude);f.$transcludeFn(f.$parent,function(b){e.forEach(b,function(b){a(b)?f.headingElement=b:c.append(b)})}),b.style=function(){return"height:100%;"}}}})});