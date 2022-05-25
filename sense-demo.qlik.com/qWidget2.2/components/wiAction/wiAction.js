define(["underscore","jquery","qvangular","angular","./../../modules/utils/wiUtils","qlik","./wiActionService","client.utils/routing","client.utils/state","client.models/sheet"],function(a,b,c,d,e,f,g,h,i,j){"use strict";function k(a){j.getList().then(function(b){b.getLayout().then(function(b){a.sheets=b})})}c.directive("wiAction",["$compile","$timeout","$parse","wiActionService",function(a,b,c,d){return{restrict:"A",scope:!1,link:function(a,c,g){function h(b,c,e){switch(b){case console:break;case"gotoSheet":case"bookmark.apply":case"bookmark.create":case"bookmark.remove":case"variable.create":case"variable.setContent":d.e(c);break;case"field.clear":case"field.clearOther":case"field.selectAll":case"field.select":case"field.selectAlternative":case"field.selectExcluded":case"field.selectMatch":case"field.selectPossible":case"field.toggleSelect":d.e(c);break;case"clearAll":e.clearAll();break;case"back":e.back();break;case"forward":e.forward();break;case"lockAll":e.lockAll();break;case"unlockAll":e.unlockAll();break;case"selectValues":a.$eval(c);break;case"nextSheet":d.nextSheet(a);break;case"prevSheet":d.prevSheet(a)}}k(a),a.selectValues=function(c,d,e){b(function(){a.$parent.backendApi.selectValues(c,[d],e)},0,!1)};var i=g.wiAction,j=i.split(";"),l=f.currApp();c.on("qv-activate",function(){for(var a=0;a<j.length;a++){var b=j[a];if(void 0!==b){b=b.trim();var c=e.fnFromString(b);h(c,b,l)}}}),a.$on("$destroy",function(){c.unbind("qv-activate")})}}}])});