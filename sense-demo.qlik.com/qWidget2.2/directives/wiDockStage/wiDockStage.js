define(["jquery","qvangular"],function(a,b){"use strict";b.directive("wiDockStage",["$timeout",function(b){function c(c,d,e){function f(a,b){a.css("height",b.height()+10).css("width",b.width()).css("left",b.offset().left).css("top",b.offset().top).stop(!0,!0).fadeIn(j)}function g(b){a(".qv-gridcell").each(function(){b?a(this).show():a(this).hide()});var e=d.closest(".qv-gridcell");e.show(),c.Main.showEditor?e.addClass("wui-gridcell-expand"):e.removeClass("wui-gridcell-expand")}var h=[".qv-gridlink-icon",".qv-gridcell-nav",".icon-zoom-in",".qv-object-nav",".qv-gridresize-point","#master-info"],i=a(".qvt-sheet"),j=0;c.$eval(d.attr("wiDockStage"))||d.hide(),c.$watch(function(){return{c:c.$eval(e.wiDockStage),w:i.width(),h:i.height()}},function(c,e){c!==e&&b(function(){c.c?(a.each(h,function(b,c){a(c).hide()}),f(d,i),g(!1)):(d.stop(!0,!0).fadeOut(j),a.each(h,function(b,c){a(c).show()}),g(!0))})},!0)}return{link:c,priority:100,restrict:"A"}}])});