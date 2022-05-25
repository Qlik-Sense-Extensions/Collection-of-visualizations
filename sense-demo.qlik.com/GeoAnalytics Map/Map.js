define(["../IdevioMap/common/Utils","../IdevioMap/common/LegendManager","../IdevioMap/common/MapUtils","../IdevioMap/common/Logger","qlik"],function(e,f,a,c,b){function d(g){this.qid=g;this.viewBounds=null;this.toggleLasso=false;this.layersReady={};this.layersLeft=0;this.savedSelectionBounds={}}d.prototype.paintLayer=function(g,i){this.properties=i;if(i.qInfo.qType==="masterobject"){if(e.maps[i.mapId]){if(!i.realMapId){i.realMapId=i.mapId}i.mapId=-1}else{e.maps[i.realMapId]=this}}if(this.map){return}if(g.children().length===0){var j=$("<div>",{id:"idevio-mapdiv-"+i.mapId}).addClass("ideviomap");e.addSpinner(j);g.append(j)}if(!e.loaded){if(e.loading===undefined){g.find(".loadInfo > .progress").show();g.find(".loadInfo > h3").html("Loading");e.loadScript(i.server,this,g,i)}else{var m=this;var k=0;var h=10;var l=setInterval(function(){if(e.loaded){if(!m.map){m.initMap(g,i)}clearInterval(l)}else{k+=h;if(k>5000){clearInterval(l)}}},h)}return}else{this.initMap(g,i);g.find(".loadInfo > .progress").hide()}setTimeout(this.map.repaint.bind(this.map),0)};d.prototype.initMap=function(o,n){var m=this;var p=n.mapOptions;var k=e.mapApi[this.qid];this.layerListVisible=false;this.logger=new c(this,o,n);if(e.getLoadedMaps().indexOf(p.baseMap)===-1){window.alert("Could not load base map '"+p.baseMap+"' from "+n.server);p.baseMap="empty"}if(n.logLevel&&n.logLevel.length>1){n.logLevel=2}if(!n.zoomResolutionLimit||(n.zoomResolutionLimit&&(n.zoomResolutionLimit.range[0]==null||n.zoomResolutionLimit.range[1]==null))){var g=e.mapApi[this.qid];if(g){g.getProperties().then(function(r){var q=e.getValueFromLogScaleRevert(r.zoomInResolutionLimit||1.2,0,10000,0.1,160000);var i=e.getValueFromLogScaleRevert(r.zoomOutResolutionLimit||80000,0,10000,0.1,160000);r.zoomResolutionLimit={range:[q,i]};g.setProperties(r)})}}this.logLevel=(n.logLevel==="undefined")?2:n.logLevel;if(p.debug.logLevel&&String(p.debug.logLevel).length===1){p.debug.logLevel=e.LOGLEVEL[p.debug.logLevel]}if(!this.isAutoZoomEnabled()){p=$.extend(true,{},p);p.center=n.viewCenter||null;p.resolution=n.viewResolution||null}p.maxLevel=20;p.div="idevio-mapdiv-"+n.mapId;p.listeners=[["viewchanged",function(i){m.viewChangedEvent.call(m,i)}],["idle",function(){m.idleEvent.call(m,k,n)}],["move",function(i){if(e.mapApi[m.qid].isSnapshot&&$("body").hasClass("qv-story-play")){i.stop()}}]];if(["osm","mobile","buffered"].indexOf(p.baseMap)!==-1){p.baseMap="default"}if(!n.hasOwnProperty("zoomInResolutionLimit")){n.zoomInResolutionLimit="1.2"}if(!n.hasOwnProperty("zoomOutResolutionLimit")){n.zoomOutResolutionLimit="80000"}this.map=new idevio.map.WebMap(p);if(this.map.setMaxLevel&&this.map.setMinLevel){this.map.setMaxLevel(e.getClosestMaxZoomLevel(n.zoomInResolutionLimit,this.map));this.map.setMinLevel(e.getClosestMinZoomLevel(n.zoomOutResolutionLimit,this.map))}if(n.mapOptions.baseMap==="default"){a.addArcGISLayer(this.map,"Satellite Layer","World_Imagery",-39,["Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS,","USDA, USGS, AeroGRID, IGN, and the GIS User Community"])}this.tools={scaleBar:new idevio.map.ScaleBar(n.useImperialUnitsScaleBar?"imperial":"metric"),panTool:new idevio.map.PanTool(),zoomTool:new idevio.map.ZoomTool(),boxSelectTool:new idevio.map.BoxSelectTool(null,function(i){m.select.call(m,i)},n.selectType,this)};if(n.showScaleBar){if(this.tools.scaleBar._canvas){this.tools.scaleBar._canvas.onclick=function(){this.tools.scaleBar._useImperial=!this.tools.scaleBar._useImperial;if(this.tools.scaleBar._map){this.tools.scaleBar._lastRes=-1;this.tools.scaleBar._show()}var i=e.mapApi[this.qid];i.getProperties().then(function(q){q.useImperialUnitsScaleBar=this.tools.scaleBar._useImperial;i.setProperties(q)}.bind(this))}.bind(this)}this.tools.scaleBar.connectTo(this.map)}if(n.zoomToolEnabled){this.tools.zoomTool.connectTo(this.map)}if(n.panToolEnabled){this.tools.panTool.connectTo(this.map)}this.tools.boxSelectTool.connectTo(this.map);this.LayerListEnabled=n.showLayerList;e.maps[n.mapId]=this;if(typeof qunit==="undefined"){this.logger.toggleList(n)}if(n.debug){this.tools.debugLayer=new idevio.map.WebMapInfoLayer(this.map,{x:40,y:5,color:"red",font:"12px monospace",meta:{},name:"Debug Info",drawOrder:9999});this.tools.debugLayer.setVisible(n.mapOptions.debug.infoLayer)}this.showZoomButtons(n);this.showGridSelectionButton(o);this.map.getLayer("Background Labels").setDrawOrder(0);if(!n.showLabels){this.map.getLayer("Background Labels").setVisible(false)}for(var h=0;h<this.map.getLayerCount();h++){var l=this.map.getLayer(h);var j=e.getValue(n,"layers."+l.getName()+".visible",null);if(j!==null){l.setVisible(j)}}this.showLayerList();if(n.selectVisibleGrid){this.fetchSpatialIndexFields()}this.repaintExtensions()};d.prototype.repaintExtensions=function(){Object.keys(e.layers).forEach(function(h){var g=e.layers[h];if(g&&String(g.layout.mapid)===String(this.properties.mapId)){g.repaint(true)}}.bind(this))};d.prototype.storeViewBounds=function(){var g=e.mapApi[this.qid];g.getProperties().then(function(h){e.setValue(h,"viewCenter",this.map.getCenter());e.setValue(h,"viewResolution",this.map.getResolution());g.setProperties(h)}.bind(this))};d.prototype.restoreViewBounds=function(g){if(!this.map){return}if(g&&this.savedSelectionBounds&&this.savedSelectionBounds.min){this.map.viewGeoBounds(this.savedSelectionBounds)}else{if(g===false&&this.properties.viewCenter){this.map.moveTo(this.properties.viewCenter,this.properties.viewResolution)}}};d.prototype.reloadMapSettings=function(g){var h=this.map.getGeoBounds();this.initMap($(this.map.getDiv()),g);this.map.viewGeoBounds(h);this.showLayerList()};d.prototype.setBaseMap=function(g){if(g==="default"){a.addArcGISLayer(this.map,"Satellite Layer","World_Imagery",-39,["Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS,","USDA, USGS, AeroGRID, IGN, and the GIS User Community"])}else{var h=this.map.getLayer("Satellite Layer");if(h){h.remove()}}this.map.setBaseMap(g);this.showLayerList()};d.prototype.select=function(g){if($(".qv-mode-edit").length===1||($(".qv-snapshot-enabled").length!==0)||e.mapApi[this.qid].isSnapshot||(this.properties.selectType==="none")){return}a.selectFeatures(g,this)};d.prototype.showLayerList=function(){var p=function(i){this.setLayerVisible(i.target.value,i.target.checked,i.target.id)}.bind(this);var n=function(){var i=$("#layerListTable-"+this.qid);if(this.layerListVisible){this.layerListVisible=false;i.hide()}else{this.layerListVisible=true;i.show()}}.bind(this);var l=$(this.map.getDiv());if(this.LayerListEnabled){var h=l.find(".layerListButton");if(h.length<1){h=$("<button>").html("☰").addClass("layerListButton");h.click(n);l.append(h)}}else{l.find(".layerListButton").remove()}if($("#layerListTable-"+this.qid).length>0){$("#layerListTable-"+this.qid).remove()}var o=$("<table>").addClass("layerList").attr("id","layerListTable-"+this.qid).appendTo(l);if(!this.layerListVisible){o.hide()}var k=$("<tr>");k.append($("<th>").addClass("idevio-icon").html("†"));k.append($("<th>").html("Layer"));o.append(k);var j=[];for(var m=0;m<this.map.getLayerCount();m++){j.push(this.map.getLayer(m))}var g=j.slice().sort(function(r,i){var q=r.getDrawOrder()-i.getDrawOrder();if(q!==0){return q}var t=r.getName().toLowerCase();var s=i.getName().toLowerCase();if(t<s){return -1}else{if(t>s){return 1}}var v=e.getValue(r.getMeta(),"qvlayer.id","");var u=e.getValue(i.getMeta(),"qvlayer.id","");if(v<u){return -1}else{if(v>u){return 1}}return 0});g.forEach(function(q){var i=$("<tr>");var s=$("<td>").append($("<input />",{type:"checkbox",checked:q.isVisible(),value:q.getName()}).attr("id",j.indexOf(q)).change(p));var r=$("<td>").html(q.getName());i.append(s);i.append(r);o.append(i)})};d.prototype.setLayerVisible=function(j,g,i){var k=this.map.getLayer(Number(i));var l=k.getMeta().qvlayer;if(l){l.setVisible(g)}else{var h=e.mapApi[this.qid];if(!h.isSnapshot){h.getProperties().then(function(m){e.setValue(m,"layers."+j+".visible",g);h.setProperties(m)})}k.setVisible(g);this.visibleLayerChanged()}};d.prototype.showZoomButtons=function(g){var i=$(this.map.getDiv());if(g.showZoomButtons){var h=this.map;$("<div>").addClass("zoomButton qirby-button-nr idevio-icon").html("Y").css("top","30%").appendTo(i).click(function(){h.zoomInOneLevel()});$("<div>").addClass("zoomButton qirby-button-nr idevio-icon").html("Z").css("top","60%").appendTo(i).click(function(){h.zoomOutOneLevel()})}else{i.find(".zoomButton").remove()}};d.prototype.showGridSelectionButton=function(g){this.selectVisibleButtonToggled=true;this.$gridSelectionButton=a.createGridSelectionButton(this);this.$gridSelectionButton.toggle(Boolean(this.properties.selectVisibleGrid));a.updateGridSelectionButtonText(this,this.selectVisibleButtonToggled);g.append(this.$gridSelectionButton)};d.prototype.startWork=function(j,h){if(!j||this.layersReady[j]===false){return}if(this.editMode&&e.layers[j].layout.includeInAutoZoom&&(this.layersReady[j]===undefined||this.layersReady[j]===true)){this.layersReady[j]=false;this.layersLeft=1;this.logger.clearErrorsForLayer(j);return}if(this.layersLeft<=0){this.layersLeft=0;this.logger.clear();var g=Object.keys(e.layers);var i=g.filter(function(k){var l=e.layers[k];if(l.softPatchCleared){return false}return l.layout.includeInAutoZoom!==false&&!h&&!l.isStatic&&l.layout.mapid==this.properties.mapId&&l.isVisible()},this);Object.keys(this.layersReady).forEach(function(k){this.layersReady[k]=true},this);i.forEach(function(k){this.layersReady[k]=false},this);this.layersLeft=i.length;this.viewBounds=null}};d.prototype.doneWorkViewBounds=function(h,g){if(!h||this.layersReady[h]){return}this.layersReady[h]=true;this.layersLeft-=1;this.viewBounds=a.mergeBounds(this.viewBounds,g,this.map);if(this.layersLeft<=0){this.layersLeft=0;this.map.repaint();this.showLayerList();this.logger.showErrors();if(this.viewBounds&&this.isAutoZoomEnabled()){if(this.shouldAnimate){this.map.viewGeoBounds(this.viewBounds,false)}else{this.map.viewGeoBounds(this.viewBounds,true);this.shouldAnimate=true}this.savedSelectionBounds=this.viewBounds;this.viewBounds=null}}};d.prototype.viewChangedEvent=function(){this.viewChanged=true;setTimeout(function(){for(var h in e.layers){if(e.layers.hasOwnProperty(h)){var g=e.layers[h];var i=g.layout.visualization==="ideviogeodatalayer";if(i){continue}if(g.isVisible()&&g.layer.getDataset().getAll().length===0){g.paintExtension(g.layout,true,true)}}}}.bind(this),0)};d.prototype.idleEvent=function(h,j){if(!this.viewChanged){return}if(this.selectVisibleButtonToggled&&this.properties.selectVisibleGrid){this.selectVisibleGrid()}f.autoDimAllLegends();var g=j.mapId;for(var i in e.testlayers){if(e.testlayers[i].mapid===g){e.testlayers[i].runTest()}}this.viewChanged=false};d.prototype.fetchSpatialIndexFields=function(g,i){var h=g||b.currApp();h.variable.getContent("_IdevioSIndexFields",function(j){var k=(j&&j.qContent)?j.qContent.qString:null;if(!this.spatialIndexFields||!this.content||(this.content!==k)){this.content=k;this.spatialIndexFields=a.parseSpatialIndexList(k)}if(i){i()}}.bind(this))};d.prototype.selectVisibleGrid=function(){var g=b.currApp();this.fetchSpatialIndexFields(g,function(){var h=a.getVisibleGridIndices(this.spatialIndexFields,this.map.getGeoBounds());var i=g.field(h.id);Object.keys(this.spatialIndexFields).forEach(function(k){if(k!==h.id){g.field(k).clear()}});var j=i.selectValues(h.indices,false,false);j.then(function(){return i.lock()}).then(function(){return i.select([0],false,false)}).then(function(){return i.unlock()})}.bind(this))};d.prototype.visibleLayerChanged=function(){this.showLayerList()};d.prototype.isAutoZoomEnabled=function(){return this.properties.zoomToSelection!==false&&!this.properties.selectVisibleGrid};return d});