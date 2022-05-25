define(["qvangular","angular","underscore","../../modules/utils/wiUtils","./jquery.sparkline.min"],function(a,b,c,d){"use strict";a.directive("wiMinichart",function(){return{restrict:"AE",replace:!0,scope:!1,template:"<div></div>",link:function(a,c,e){a.$watch(function(){return b.toJson([e.data,e.type,e.width,e.height,e.lineColor,e.fillColor,e.chartRangeMin,e.chartRangeMax,e.composite,e.enableTagOptions,e.tagOptionPrefix,e.tagValuesAttribute,e.disableHiddenCheck,e.defaultPixelsPerValue,e.spotColor,e.minSpotColor,e.maxSpotColor,e.spotRadius,e.valueSpots,e.highlightSpotColor,e.highlightLineColor,e.lineWidth,e.normalRangeMin,e.normalRangeMax,e.drawNormalOnTop,e.xvalues,e.chartRangeClip,e.chartRangeMinX,e.chartRangeMaxX,e.barColor,e.negBarColor,e.zeroColor,e.nullColor,e.barWidth,e.barSpacing,e.zeroAxis,e.colorMap,e.stackedBarColor,e.posBarColor,e.negBarColor,e.zeroBarColor,e.barWidth,e.barSpacing,e.colorMap,e.lineHeight,e.thresholdValue,e.thresholdColor,e.targetColor,e.targetWidth,e.performanceColor,e.performanceColor,e.sliceColors,e.offset,e.borderWidth,e.borderColor,e.raw,e.showOutliers,e.outlierIQR,e.boxLineColor,e.boxFillColor,e.whiskerColor,e.outlierLineColor,e.outlierFillColor,e.spotRadius,e.medianColor,e.target,e.targetColor,e.minValue,e.maxValue])},function(){f()});var f=function(){var a;e.data&&(a=e.data.split(",")),d.isBlank(e.type)&&(e.type="bar"),c.sparkline(a,{type:e.type,width:e.width,height:e.height,lineColor:e.lineColor,fillColor:e.fillColor,chartRangeMin:e.chartRangeMin,chartRangeMax:e.chartRangeMax,composite:e.composite,enableTagOptions:e.enableTagOptions,tagOptionPrefix:e.tagOptionPrefix,tagValuesAttribute:e.tagValuesAttribute,disableHiddenCheck:e.disableHiddenCheck,defaultPixelsPerValue:e.defaultPixelsPerValue,spotColor:e.spotColor,minSpotColor:e.minSpotColor,maxSpotColor:e.maxSpotColor,valueSpots:e.valueSpots,highlightSpotColor:e.highlightSpotColor,highlightLineColor:e.highlightLineColor,lineWidth:e.lineWidth,normalRangeMin:e.normalRangeMin,normalRangeMax:e.normalRangeMax,drawNormalOnTop:e.drawNormalOnTop,xvalues:e.xvalues,chartRangeClip:e.chartRangeClip,chartRangeMinX:e.chartRangeMinX,chartRangeMaxX:e.chartRangeMaxX,barColor:e.barColor,zeroColor:e.zeroColor,nullColor:e.nullColor,zeroAxis:e.zeroAxis,stackedBarColor:e.stackedBarColor,posBarColor:e.posBarColor,zeroBarColor:e.zeroBarColor,lineHeight:e.lineHeight,thresholdValue:e.thresholdValue,thresholdColor:e.thresholdColor,targetWidth:e.targetWidth,performanceColor:e.performanceColor,rangeColors:e.rangeColors,sliceColors:e.sliceColors,offset:e.offset,borderWidth:e.borderWidth,borderColor:e.borderColor,raw:e.raw,showOutliers:e.showOutliers,outlierIQR:e.outlierIQR,boxLineColor:e.boxLineColor,boxFillColor:e.boxFillColor,whiskerColor:e.whiskerColor,outlierLineColor:e.outlierLineColor,outlierFillColor:e.outlierFillColor,medianColor:e.medianColor,target:e.target,minValue:e.minValue,maxValue:e.maxValue,negBarColor:e.negBarColor,barWidth:e.barWidth,barSpacing:e.barSpacing,colorMap:e.colorMap,targetColor:e.targetColor,spotRadius:e.spotRadius});var b=c.find(":first-child");e.opacity&&b.css("opacity",e.opacity)}}}})});