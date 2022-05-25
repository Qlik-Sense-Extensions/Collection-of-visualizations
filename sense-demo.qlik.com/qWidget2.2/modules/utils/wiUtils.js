define(["jquery","underscore"],function(a,b){"use strict";String.prototype.replaceWith=function(a,b){var c=new RegExp(a,"g");return this.replace(c,b)},String.prototype.indexOfNth=function(a,b){for(var c=0,d=null;b>c&&-1!==d;)d=this.indexOf(a,d+1),c++;return d},Date.prototype.yyyymmdd=function(){var a=this.getFullYear().toString(),b=(this.getMonth()+1).toString(),c=this.getDate().toString();return a+(b[1]?b:"0"+b[0])+(c[1]?c:"0"+c[0])};var c={isBlank:function(b){return!b||""===a.trim(b)},hasAngularBindings:function(a){var b=!1,c=/\{{[^}]*}}/gim;return b=(a.match(c)||[]).length>0},noScript:function(a){var b=document.createElement("div");b.innerHTML=a;for(var c=b.getElementsByTagName("script"),d=c.length;d--;)c[d].parentNode.removeChild(c[d]);return a=b.innerHTML},fnFromString:function(a){return b.isEmpty(a)?a:a.substr(0,a.indexOf("(")>-1?a.indexOf("("):void 0)},extractParams:function(a){var c=a.match(/\((.*?)\)/g);if("object"==typeof c&&null!==c){var d=c[0];return b.isEmpty(d)||(d=d.trim(),d=d.substr(1,d.length-2)),d}return null},addStyleToHeader:function(b,c){var d="qwidget_"+b,e=a("#"+d);0===e.length&&(e=a(document.createElement("style")),e.attr("type","text/css"),e.attr("id",d),a("head").append(e)),e.text(c)},addStyleLinkToHeader:function(b,c){a(document).ready(function(){var d="wiStyleLinked_"+b;if(0===a("#"+d).length){var e=a(document.createElement("link"));e.attr("rel","stylesheet"),e.attr("href",c),e.attr("id",d),a("head").append(e)}})},encode:function(a){return encodeURIComponent(a).replace(/'/g,"%27")},encodeForEngine:function(a){a=c.noScript(a);var b=c.encode(a);return c.isBlank(b)?b:"'"+b+"'"},decode:function(a){return decodeURIComponent(a)},decodeFromEngine:function(a){return void 0!==a&&a.length>0&&(a=c.decode(a),void 0!==a&&("'"===a.charAt(0)&&(a=a.substr(1)),"'"===a.charAt(a.length-1)&&(a=a.substr(0,a.length-1)))),a},sanitizedFileName:function(a){return a.replace(/[^a-z0-9_\-]/gi,"_")},prepForEngine:function(a){return c.isBlank(a)||("'"!==a.charAt(0)&&(a="'"+a),"'"!==a.charAt(a.length-1)&&(a+="'")),a},stringFromEngine:function(a){return void 0!==a&&a.length>0&&(a=unescape(a),void 0!==a&&("'"==a.charAt(0)&&(a=a.substr(1)),"'"==a.charAt(a.length-1)&&(a=a.substr(0,a.length-1)))),a},removeStyles:function(){a("style[qwidget-type='normal']").remove()},resizeEditors:function(b){var c=500,d=140,e=a(b).height()-d,f=parseInt(e/5*3),g=e-f;a("#qWidget_WidgetEditor_HtmlEditor .ace-editor").animate({"min-height":f+"px"},c),a("#qWidget_WidgetEditor_LessEditor .ace-editor").animate({"min-height":g+"px"},c)}};return c});