define(["../IdevioMap/common/Utils","../IdevioMap/common/ColorManager","../IdevioMap/common/LegendManager","../IdevioMap/common/LocationManager","../IdevioMap/common/Extension","../IdevioMap/common/MathUtils"],function(f,c,b,h,a,e){function d(n,l,k,j){var m=n.color.outline||"#aaaaaa";return idevio.map.IconFactory.pie({radius:j,values:l,outline:new c.Color(m).applyAlpha(n.color.alpha).toRgba(),colors:k})}function i(m,k,j,n){var l=m.color.outline||"#aaaaaa";return idevio.map.IconFactory.bar({width:m.chart.width*k.length,height:m.chart.height,values:k,maxValue:n,outline:new c.Color(l).applyAlpha(m.color.alpha).toRgba(),colors:j})}function g(l,k,j){a.call(this,"Chart Layer",l,k,j)}a.extend(g);g.prototype.ensureBackCompat=function(k){var j=k||{};f.setIfUndefined(this.layout,"label.slider",j,f.getValueFromLogScaleRevert(f.getValue(this.layout,"label.outres",10000),0,10000,0.1,160000));f.setIfUndefined(this.layout,"restrictDrillDownLevelSlider",j,f.parseListToInterval(this.layout.restrictDrillDownLevel,0,16));a.prototype.ensureBackCompat.call(this,j)};g.prototype.calcDataSourceIndex=function(){var j=this.layout.qHyperCube.qMeasureInfo;this.locationIdSource_=-1;this.coordinateSource_=-1;this.sizeSource_=-1;var k=-1;if(this.layout.location.source==="auto"){if(j.length===1){this.locationIdSource_=0;k=2}else{if(j[0]&&!isNaN(j[0].qMax)&&!isNaN(j[0].qMin)){this.coordinateSource_=2;k=4}else{if(j[0]&&isNaN(j[0].qMax)){this.locationIdSource_=2;k=3}else{if(this.layout.qHyperCube.qDimensionInfo[0]){this.locationIdSource_=0;k=2}}}}}else{if(this.layout.location.source==="coordinates"){this.coordinateSource_=2;k=4}else{if(this.layout.location.source==="measure"){this.locationIdSource_=2;k=3}else{if(this.layout.location.source==="dimension"){this.locationIdSource_=0;k=2}}}}if(this.coordinateSource_===-1&&this.locationIdSource_!==-1){this.dsType="LocationIds"}if(this.coordinateSource_!==-1&&this.locationIdSource_===-1){this.dsType="Coordinates"}this.measureStart=k;this.sizeSource_=j[this.measureStart-1]?this.measureStart-1:-1;this.colorSource_=this.measureStart-2;this.measuresAdded=j.length-(k-2)};g.prototype.prePaint=function(l){var j=this.layout.qHyperCube.qMeasureInfo;this.sizeData={};this.hasCoordinates=j.length>0&&j[0].qMax.substring===undefined&&j[0].qMin.substring===undefined;var m=this.map.map;var k=f.isGeoMakePoint(l,this.locationIdSource_);if(this.coordinateSource_!==-1&&this.locationIdSource_===-1){this.dsType="Coordinates";this.dataset=new idevio.map.MemoryDataset({crs:m.getBaseMap()==="emptymeters"?"emptymeters":null,name:this.id});this.layer.setDataset(this.dataset)}else{if(this.coordinateSource_===-1&&this.locationIdSource_!==-1){this.dsType="LocationIds";if(k){this.dataset=new idevio.map.MemoryDataset({crs:m.getBaseMap()==="emptymeters"?"emptymeters":null,name:this.id});this.layer.setDataset(this.dataset)}else{var n=["id","elemNumber","infoBubbleHtml","label","labelOffset"];this.dataset=h.createDataset(this.id,this.layout.location,this.map,n,function(){if(this.layer){this.layer.setDataset(this.dataset);this.setStyles(this.icons)}f.addInfoBubbleTool(this,m,this.layout,"hover_click")}.bind(this))}}}};g.prototype.paint=function(af){var r=this.layout.qHyperCube.qMeasureInfo;var D=[];var B=[];var u={};var F={};var an;if((!this.isLocationIds&&r.length<2)||(this.measuresAdded<=0)){return}if(this.isLocationIds){an=f.isGeoMakePoint(af,this.locationIdSource_)}for(var ah=0;ah<af.length;ah++){var O=af[ah].qMatrix;for(var ac=0;ac<O.length;ac++){var m=O[ac];var G=m[0];var E=m[1];if(G&&(G.qIsEmpty||(G.qElemNumber<0)||G.qIsNull||!G.qText)){continue}else{if(E&&(E.qIsEmpty||(E.qElemNumber<0)||E.qIsNull||!E.qText)){continue}}if((B.indexOf(E.qText)===-1)&&(E.qText!=="-")){B.push(E.qText)}var R;var X;if(!u[G.qElemNumber]){var Y=this.isLocationIds?1:2;if(!this.isLocationDataValid(m,Y)){continue}if(this.isLocationIds&&!an){X=h.getLocationIds(this.layout,m,this.locationIdSource_,this.remap,1)[0]}else{if(this.isLocationIds&&an){R=h.getQlikPoints(m,this.locationIdSource_,1)[0]}else{R=h.getCoordinates(m,this.coordinateSource_,1)[0]}}}var y=r[this.measureStart-2];var ai=y?y.qMin:0;var J=y?y.qMax:0;var L=isNaN(m[this.measureStart].qNum)?m[this.measureStart].qText:m[this.measureStart].qNum;var l=E.qText;var al=y;var P=ai;var q=J;var s=L;if(!this.layout.color.auto&&this.layout.color.mode==="byMeasure"){if(this.layout.qHyperCube.qDimensionInfo[1]&&this.layout.qHyperCube.qDimensionInfo[1].qAttrExprInfo[0]){al=this.layout.qHyperCube.qDimensionInfo[1].qAttrExprInfo[0];P=al?al.qMin:0;q=al?al.qMax:0;s=isNaN(E.qAttrExps.qValues[0].qNum)?E.qAttrExps.qValues[0].qText:E.qAttrExps.qValues[0].qNum}else{continue}}else{if(!this.layout.color.auto&&this.layout.color.mode==="byDimension"){if(this.layout.qHyperCube.qDimensionInfo[1]&&this.layout.qHyperCube.qDimensionInfo[1].qAttrDimInfo[0]&&E.qAttrDims.qValues[0].qText){l=E.qAttrDims.qValues[0].qText}else{continue}}}if(L==="-"){this.addWarning("chartmeasure","Invalid measure value",E,L);continue}else{if(s==="-"){this.addWarning("chartmeasure","Invalid color measure value",E,s);continue}else{var ae=c.getColorAndIndex(this.layout,m,(this.isByDimension||this.layout.color.auto)?l:s,P,q,2);var A;if(!u[G.qElemNumber]){u[G.qElemNumber]=[];A=this.isLocationIds?(an?R:X):R}else{A=u[G.qElemNumber][0].location}var K=[E.qText,L];u[G.qElemNumber].push({id:G.qText,location:A,infobubbledata:K,dimension1:G.qText,dimension2:E.qText,value:L||0,cvalue:s||L||0,colors:ae.color||"#FFFFFF",label:f.getLabelText(m,this.layout,2),labelOffset:(this.layout.chart.type==="bar")?this.layout.chart.height/2+1:this.layout.chart.radius});F[G.qElemNumber]=m;if(this.isByDimension||this.layout.color.auto){this.colorInfo_[String(E.qText)]=ae.color}else{this.colorInfo_[String(ae.index)]=true}}}}}if(af&&af.length>0&&af[0].qMatrix.length>0){var ag={};var x=r[this.measureStart-2].qMax;var H={};if((this.sizeSource_!==-1)&&this.sizeData){for(var o=0;o<this.sizeData.allDataPages.length;o++){for(var t in this.sizeData.allDataPages[o].qMatrix){if(!this.sizeData.allDataPages[o].qMatrix.hasOwnProperty(t)){continue}var T=this.sizeData.allDataPages[o].qMatrix[t];H[T[0].qElemNumber]=T[1].qNum}}}var ak=0;for(var C in u){if(!u.hasOwnProperty(C)){continue}if(ak>=this.layout.maxObjects){this.addWarning("requestTooMuchData","Only showing "+this.layout.maxObjects+" charts. Change layer settings to enable more charts.");this.logger.showErrors();break}ak++;var Z=u[C][0].label;var I=u[C][0].labelOffset;var p=f.getInfoBubbleHtml(F[C],r,this.layout,this,500,u[C],2);var Q=parseInt(C,10);var k=this.layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;if(this.isLocationIds&&!an){D.push([u[C][0].location,Q,p,Z,I])}else{var S={dimension:this.dimension,elemNumber:Q,id:u[C][0].id,infoBubbleHtml:p,label:Z,labelOffset:I};S[k]=u[C][0].dimension1;try{new idevio.map.PointFeature(this.dataset,{coordinate:u[C][0].location,attributes:S})}catch(ad){this.addWarning("chartLocationFeature","Error adding feature",undefined,u[C][0].location)}}var W=[];var aj=new Array(B.length);var w=new Array(B.length);if(typeof Array.prototype.fill!=="undefined"){aj.fill(0);w.fill(0)}else{for(var aa=0;aa<aj.length;aa++){aj[aa]=0;w[aa]=0}}for(var ab=0;ab<u[C].length;ab++){var M=u[C][ab];var am=B.indexOf(M.dimension2);aj[am]=M.value;W[am]=M.colors;w[am]=M.cvalue}if(this.layout.chart.type==="pie"&&this.layout.color.mode==="byMeasure"&&!this.layout.color.auto){var V=w[0];var z=w[0];for(ab=0;ab<w.length;ab++){if(w[ab]<V){V=w[ab]}if(w[ab]>z){z=w[ab]}}for(ab=0;ab<W.length;ab++){W[ab]=c.getColorAndIndex(this.layout,[],w[ab],V,z,2).color}}if(this.layout.chart.type==="pie"){var U=20;var v=(this.layout.chart.radius)?this.layout.chart.radius:10;var N=(this.layout.chart.maxRadius)?this.layout.chart.maxRadius:30;if((this.sizeSource_!==-1)&&this.sizeData){U=e.calcRadius(H[C],v,N,this.sizeData.qMin,this.sizeData.qMax,20)}else{U=e.calcRadius(H[C],v,N,0,0,20)}ag[C]=d(this.layout,aj,W,U)}else{ag[C]=i(this.layout,aj,W,x)}}if(this.isLocationIds&&!an){this.icons=ag;this.dataset.setData(D)}else{this.setStyles(ag)}}if(this.dsType!=="LocationIds"||an){setTimeout(function(){var j=(this.layout.includeInAutoZoom!==false&&this.dataset.getAll().length>0)?this.dataset.getAlternateBounds():null;this.map.doneWorkViewBounds(this.id,j);f.addInfoBubbleTool(this,this.map.map,this.layout,"hover_click")}.bind(this),0)}};g.prototype.setStyles=function(j){var k;switch(this.layout.chart.type){case"pie":k={type:"symbol",iconKey:"elemNumber",icons:j,icon:idevio.map.IconFactory.pie({radius:this.layout.chart.radius,values:[0],colors:["pink"]})};break;case"bar":k={type:"symbol",iconKey:"elemNumber",icons:j,icon:idevio.map.IconFactory.bar({width:this.layout.chart.width,height:this.layout.chart.height,values:[0],colors:["pink"]})};break;default:this.addWarning("chartGenIcon","Something went wrong when generating icons");break}var l={type:"text",textAttribute:"label",font:"8pt sans-serif",placement:"fixed",anchorX:"middle",anchorY:"top",haloColor:"lightgray",pointDistanceKey:"labelOffset"};if(this.layout.label){if(this.layout.label.outres){l.maxRes=this.layout.label.outres}if(this.layout.label.position){l.anchorY=this.layout.label.position}}this.layer.setStyles([k,l])};g.prototype.paintLegend=function(){var j=this.layout.qHyperCube.qMeasureInfo;var q=f.getValue(this.layout,"legend.showIcon",true);var p=f.getValue(this.layout,"legend.showIconTitle",true);var m=$("#legend-info-"+this.id).empty();var n=$("<div>").addClass("legend-data-info").appendTo(m);switch(this.layout.chart.type){case"pie":m.removeClass("legend-bar").addClass("legend-pie");break;case"bar":m.removeClass("legend-pie").addClass("legend-bar");break}if(p){var l=this.layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;var k=j[j.length-((this.sizeSource_===-1)?1:2)].qFallbackTitle;var o=k+" / "+l;$("<span>").addClass("data-info-title").html(o).appendTo(n)}if(this.isVisible()){b.createColorLegend(m,this.layout,j,this.colorSource_+1,this.colorInfo_)}b.dimLegend(this.id,!this.isVisible());b.fixSizeForIcon(this.id);b.fixHeightForLegend(this.id);b.fixWidthForLegend(this.id);$("<div>").addClass("legend-control").appendTo(m);if(!q){m.css("background-size","0");n.css("left","-30px")}return m};return g});