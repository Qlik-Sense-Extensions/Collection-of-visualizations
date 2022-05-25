define([],function(){return{validateInt:function(value,defaultVal){var i=parseInt(value,10);return !isNaN(i)?i:defaultVal},validateFloat:function(value,defaultVal){var i=parseFloat(value,10);return !isNaN(i)?i:defaultVal},formatNumberNice:function(value){if(!value){return""}value=parseFloat(value.toString().replace(",","."));if(value<1000000){return parseFloat(value.toPrecision(6))}var result="";if(value>1000000){var count=0;var temp=value.toFixed();temp=temp.toString();for(var i=0;i<temp.length;i++){if(i<=5){result+=temp.charAt(i)}else{if(i===6){result+="e";count++}else{count++}}}result+=count.toString()}return result},formatNumberForDisplay:function(value){if(value===0){return""+0}if(!Math.log10){Math.log10=function(value){return Math.round((Math.log(value)/Math.LN10)*10000000000)/10000000000}}var degree;if(value<1&&value>-1){degree=(Math.floor((Math.log10(Math.abs(value))-1)/3))}else{degree=(Math.floor(Math.log10(Math.abs(value))/3))}if(degree<-9||degree>8){return value}var incPrefixes=["k","M","G","T","P","E","Z","Y"];var decPrefixes=["m","\u03BC","n","p","f","a","z","y"];var prefix="";var result;if(degree!==0&&degree!==-1){var ds=degree/Math.abs(degree);if(ds===1){if(degree-1<incPrefixes.length){prefix=incPrefixes[degree-1]}else{prefix="";degree=incPrefixes.length}}else{if(ds===-1){if(-degree-2<decPrefixes.length){prefix=decPrefixes[-degree-2]}else{prefix="";degree=-decPrefixes.length}}}var scaled;if(value<1&&value>-1){scaled=value*Math.pow(1000,-(degree+1));result=""+parseFloat(scaled.toFixed(2))+prefix}else{scaled=value*Math.pow(1000,-(degree));result=""+parseFloat(scaled.toFixed(2))+prefix}}else{result=""+parseFloat(parseFloat(value).toFixed(2))}return result},formatNumbersInString:function(str,indexList,auto){indexList=indexList||[];for(var i=0;i<indexList.length;i++){indexList[i]=parseInt(indexList[i],10)}var numberRegex=/-?\d+(?:\s{1}\d+)*(?:[.,]\d+)?/g;var _this=this;var currentIndex=0;function replacer(match){currentIndex++;var parsedMatch=parseFloat(match.replace(",",".").replace(" ","").replace("\u00A0",""));return(auto||indexList.indexOf(currentIndex)!==-1)?_this.formatNumberForDisplay(parsedMatch):match}return str.replace(numberRegex,replacer)},hypot:function(a,b){return Math.sqrt(Math.pow(a,2)+Math.pow(b,2))},pointInPolygon:function(x,y,polygon){var inPolygon=false;for(var i=0,j=polygon.length-1;i<polygon.length;j=i++){if(((polygon[i][1]>y)!==(polygon[j][1]>y))&&(x<(polygon[j][0]-polygon[i][0])*(y-polygon[i][1])/(polygon[j][1]-polygon[i][1])+polygon[i][0])){inPolygon=!inPolygon}}return inPolygon},linesIntersect:function(a,b,c,d){var cmp=[c[0]-a[0],c[1]-a[1]];var r=[b[0]-a[0],b[1]-a[1]];var s=[d[0]-c[0],d[1]-c[1]];var cmpxr=cmp[0]*r[1]-cmp[1]*r[0];var cmpxs=cmp[0]*s[1]-cmp[1]*s[0];var rxs=r[0]*s[1]-r[1]*s[0];if(cmpxr===0){return((c[0]-a[0]<0)!==(c[0]-b[0]<0))||((c[1]-a[1]<0)!==(c[1]-b[1]<0))}else{if(rxs===0){return false}}var rxsr=1/rxs;var t=cmpxs*rxsr;var u=cmpxr*rxsr;return(t>=0)&&(t<=1)&&(u>=0)&&(u<=1)},pointToLineDistance:function(x1,y1,x2,y2,x,y){var A=x-x1;var B=y-y1;var C=x2-x1;var D=y2-y1;var dot=A*C+B*D;var lenSq=C*C+D*D;var param=-1;if(lenSq!==0){param=dot/lenSq}var xx;var yy;if(param<0){xx=x1;yy=y1}else{if(param>1){xx=x2;yy=y2}else{xx=x1+param*C;yy=y1+param*D}}var dx=x-xx;var dy=y-yy;return Math.sqrt(dx*dx+dy*dy)},lineCircleIntersect:function(x1,y1,x2,y2,x,y,r){return(this.pointToLineDistance(x1,y1,x2,y2,x,y)<r)},makeLineArc:function(p1,p2,curviness,islatlong){var x1=p1[0];var y1=p1[1];var x2=p2[0];var y2=p2[1];if(islatlong){if(y2-y1>180){y1+=360;if(!curviness||curviness<2){return[[x1,y1],p2]}}else{if(y1-y2>180){y2+=360;p2[1]=y2;if(!curviness||curviness<2){return[p1,[x2,y2]]}}}}if(!curviness||curviness<2){return[p1,p2]}var q=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));if(q<0.00001){return[p1,p2]}var curvf=4-curviness/28.6;var r=curvf*q;var x3=(x1+x2)/2;var y3=(y1+y2)/2;var x0=x3+Math.sqrt(r*r-(q*q/4))*(y1-y2)/q;var y0=y3+Math.sqrt(r*r-(q*q/4))*(x2-x1)/q;var a1=Math.atan2(y1-y0,x1-x0);var a2=Math.atan2(y2-y0,x2-x0);var da=a2-a1;if(da>Math.PI){da-=2*Math.PI}if(da<-Math.PI){da+=2*Math.PI}var n=1+Math.abs(Math.round(da/0.09));var step=da/n;var coords=[[x1,y1]];for(var i=1;i<n;i++){var a=a1+step*i;var x=x0+r*Math.cos(a);var y=y0+r*Math.sin(a);coords.push([x,y])}coords.push([x2,y2]);return coords},eval:function(exp,def,varNamesRegex){var reg=/(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:]+)/ig;var exceptions=/<<|>>|>>>/;var valid=true;exp=exp.replace(reg,function(matchStr){if(varNamesRegex&&varNamesRegex.test(matchStr)||exceptions.test(matchStr)){return matchStr}else{if(Math.hasOwnProperty(matchStr)){return"Math."+matchStr}else{valid=false}}});if(!valid){return false}try{return eval((def||"")+exp)}catch(e){return false}},degToRad:function(value){return value*(Math.PI/180)},radToDeg:function(value){return value*(180/Math.PI)},calcRadius:function(val,minRadius,maxRadius,minSize,maxSize,fallbackRadius){if(minRadius>maxRadius||minRadius<0||maxRadius<0){return fallbackRadius}if(minSize===maxSize){return(maxRadius+minRadius)/2}var radius;var range=maxSize-minSize;range=isNaN(range)?0:range;val=isNaN(val)?0:val;if(val<=minSize){radius=minRadius}else{if(val>=maxSize){radius=maxRadius}else{radius=(range<=0)?Math.floor((minRadius+maxRadius)/2):Math.floor((val-minSize)/range*(maxRadius-minRadius)+minRadius)}}return radius}}});