define(["angular","qvangular","qlik"],function(a,b,c){"use strict";b.service("wiVariableService",["$q",function(b){return{getVariableContent:function(a){var d=b.defer(),e=c.currApp();return e.variable.getContent(a).then(function(a){d.resolve(a)}).catch(function(a){d.reject(a)}),d.promise},getVariableContents:function(c,d){var e=b.defer(),f=[];return f[0]=this.getVariableContent(c),d&&(f[1]=this.getVariableContent(d)),b.all(f).then(function(a){e.resolve(a)}).catch(function(){a.noop()}).finally(function(){a.noop()}),e.promise},setVariableContent:function(a,d){var e=c.currApp(),f=b.defer();return e.variable.setContent(a,d).then(function(){f.resolve(!0)}).catch(function(){f.reject(!1)}),f.promise}}}])});