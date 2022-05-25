"use strict";define(["qlik","jquery","css!./lib/css/styles.css","./properties","./initialProperties","text!./advanced-analytics-toolbox.ng.html","./lib/js/ui/ui_control","./lib/js/analysis/analysis","./lib/js/util/utils"],function(e,s,n,i,t,o,r,a,p){s("<style>").html(n).appendTo("head");var l=function(e,s,n){var i=e.layout.visualization,t=a.analysisTypes.filter(function(s){return s.id===e.layout.props.analysisTypeId});return require(["./extensions/"+i+"/lib/js/analysis/"+t[0].file],function(s){s.createCube(n,e)}),null},u=function(e){var s=e.layout.props.dimensions.length,n=e.layout.props.measures.length,i=a.analysisTypes.filter(function(s){return s.id===e.layout.props.analysisTypeId}),t="undefined"==typeof e.customMinMeas||"undefined"==typeof e.customMinMeas[e.layout.props.analysisTypeId]?i[0].minMeas:e.customMinMeas[e.layout.props.analysisTypeId];if(i[0].minDims>s||t>n)return!0;for(var o=0;o<s;o++)if("undefined"==typeof e.layout.props.dimensions[o].expression.qStringExpression&&""===e.layout.props.dimensions[o].expression)return!0;for(var r=0;r<n;r++)if("undefined"==typeof e.layout.props.measures[r].expression.qStringExpression&&""===e.layout.props.measures[r].expression)return!0;return!1},c=function(e,s,n,i,t,o){var r=e.layout.props;return r.analysisCategoryId===-1||r.analysisTypeId===-1?i(e,s,n):u(e)?t(e,s,n):o(e,s,n),null};return{initialProperties:t,definition:i,support:{snapshot:!0,"export":!1,exportData:!0},template:o,controller:["$scope","$compile",function(s,n){var i=e.currApp(void 0);s.extId=s.layout.qInfo.qId,s.patchApplied=!1,s.chart=[],p.setLocaleInfo(s,i),s.compile=n,s.$watch("layout.props",function(e){c(s,n,i,function(e,n,i){s.screen=0},function(e,n,i){s.screen=1},function(e,s,n){l(e,s,n)})},!0)}],paint:function(s,n){var i=this,t=e.currApp(this);this.$scope.self=this;var o=e.navigation.getMode();"analysis"===o?this.$scope.incomplete=!0:this.$scope.incomplete=!1,c(this.$scope,this.$scope.compile,t,function(e,s,n){i.$scope.screen=0,r.createHtmlElements(e,s,n)},function(e,s,n){i.$scope.screen=1,r.createHtmlElements(e,s,n)},function(){}),this.$scope.patchApplied&&c(this.$scope,this.$compile,t,function(){},function(){},function(s,n,i){var t=s.layout.visualization,o=a.analysisTypes.filter(function(e){return e.id===s.layout.props.analysisTypeId});require(["./extensions/"+t+"/lib/js/analysis/"+o[0].file],function(n){n.drawChart(s,i).then(function(){return e.Promise.resolve()})})})}}});
//# sourceMappingURL=lib/maps/advanced-analytics-toolbox.js.map
