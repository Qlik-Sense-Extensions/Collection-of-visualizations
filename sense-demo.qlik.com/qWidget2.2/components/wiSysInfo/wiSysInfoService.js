define(["underscore","angular","qvangular","qlik"],function(a,b,c,d){"use strict";c.service("wiSysInfoService",["$q",function(){function c(a){void 0===a.apps&&(a.apps=[]),d.getAppList(function(b){a.apps.length=0,a.apps=b})}function e(b,c){void 0===b.sheets&&(b.sheets=[]),c.getAppObjectList(function(c){b.sheets.length=0,a.each(c.qAppObjectList.qItems,function(a){b.sheets.push(a)}),b.sheets=a.sortBy(b.sheets,function(a){return a.qData.rank})})}function f(b,c){void 0===b.fields&&(b.fields=[]),c.getList("FieldList",function(c){b.fields.length=0,a.each(c.qFieldList.qItems,function(a){b.fields.push(a)})})}function g(b,c){void 0===b.measures&&(b.measures=[]),c.getList("MeasureList",function(c){b.measures.length=0,a.each(c.qMeasureList.qItems,function(a){b.measures.push(a)})})}function h(b,c){void 0===b.dimensions&&(b.dimensions=[]),c.getList("DimensionList",function(c){b.dimensions.length=0,a.each(c.qDimensionList.qItems,function(a){b.dimensions.push(a)})})}function i(b,c){void 0===b.extensions&&(b.extensions=[]),c.getList("ExtensionList",function(c){b.extensions.length=0,c.qExtensionList&&a.each(c.qExtensionList.qItems,function(a){b.extensions.push(a)})})}function j(b,c){void 0===b.bookmarks&&(b.bookmarks=[]),c.getList("BookmarkList",function(c){b.bookmarks.length=0,c.qBookmarkList&&a.each(c.qBookmarkList.qItems,function(a){b.bookmarks.push(a)})})}function k(a,b){void 0===a.currentselections&&(a.currentselections=[]),b.getList("CurrentSelections",function(b){a.currentselections.length=0,a.currentselections=b.qSelectionObject})}function l(c,d,e){var f="visualizations";e&&(f="visualizationDetails"),void 0===c[f]&&(c[f]=[]),d.getAppObjectList(function(g){c[f].length=0,a.each(g.qAppObjectList.qItems,function(g){a.each(g.qData.cells,function(a){var h=a.name;d.getObject(h).then(function(a){var d={};d.footnote=b.copy(a.footnote),d.metadata=b.copy(a.metadata),d.showTitles=b.copy(a.showTitles),d.qInfo=b.copy(a.qInfo),d.subtitle=b.copy(a.subtitle),d.title=b.copy(a.title),d.version=b.copy(a.version),d.visualization=b.copy(a.visualization),d.visualizationType=b.copy(a.visualizationType),d.qExtendsId=b.copy(a.qExtendsId),d.usedOnSheet={},d.usedOnSheet.title=b.copy(g.qData.title),d.usedOnSheet.qInfo=b.copy(g.qInfo),d.usedOnSheet.qMeta=b.copy(g.qMeta),a.qInfo?d.visualizationTypeIcon=m(a.qInfo.qType):a.layout&&(d.visualizationTypeIcon=m("extension")),e&&(d.obj=b.copy(a)),c[f].push(d)})})})})}function m(a){switch(a){case"bar-chart-vertical":return"icon-bar-chart-vertical";case"line-chart":return"icon-line-chart";case"table":return"icon-table";case"pivottable":return"icon-table";case"components":return"icon-components";case"pie-chart":return"icon-pie-chart";case"filterpane":return"icon-filterpane";case"list":return"icon-list";case"gauge-chart":return"icon-gauge-chart";case"scatter-chart":return"icon-scatter-chart";case"text-image":return"icon-text-image";case"text":return"icon-titletext";case"map":return"icon-map";case"combo-chart":return"icon-combo-chart";case"extension":return"icon-extension";default:return"icon-extension"}}function n(b,c){void 0===b.masterobjects&&(b.masterobjects=[]),c.getAppObjectList("masterobject",function(c){b.masterobjects.length=0,a.each(c.qAppObjectList.qItems,function(a){b.masterobjects.push(a)})})}return{loadData:function(a,b){for(var m=d.currApp(),o=0;o<b.length;o++){var p=b[o];switch(p.toLowerCase()){case"apps":c(a);break;case"sheets":e(a,m);break;case"fields":f(a,m);break;case"masterobjects":n(a,m);break;case"measures":g(a,m);break;case"dimensions":h(a,m);break;case"extensions":i(a,m);break;case"bookmarks":j(a,m);break;case"currentselections":k(a,m);break;case"visualizations":l(a,m,!1);break;case"visualizationdetails":l(a,m,!0);break;case"masterobjects":n(a,m)}}}}}])});