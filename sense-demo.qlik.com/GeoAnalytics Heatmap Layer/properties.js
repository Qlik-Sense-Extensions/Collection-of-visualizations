define(["../IdevioMap/common/SenseProperties","../IdevioMap/common/Utils","../IdevioMap/common/ColorManager"],function(c,d,a){var b=[{value:"auto",label:"Auto"},{value:"coordinates",label:"Latitude, Longitude"},{value:"dimension",label:"Dimension"},{value:"measure",label:"Measure"}];return{type:"items",component:"accordion",items:{dimensions:{uses:"dimensions",translation:"ID",min:1,max:1},measures:{uses:"measures",translation:"Location, Weight",min:0,max:3},layersettings:c.getLayerProperties("idevioheatmaplayer"),locationsettings:c.getLocationProperties(true,b),settings:{uses:"settings",items:{general:c.getLegendProperties({hasIcon:true,hasIconTitle:true,hasColors:true}),heatmap:{type:"items",label:"Heatmap",items:{alpha:{ref:"color.alpha",label:"Transparency",type:"number",min:0,max:1,step:0.05,defaultValue:1,component:"slider",resolveFunctions:{get:function(f,e){return 1-f(e.type)},set:function(g,e,f){e(f.type,1-g)}},change:function(e){d.layers[e.qInfo.qId].layer.setAlpha(e.color.alpha)}},radius:{ref:"radius",label:function(e){return"Radius ("+e.radiusUnit+") 0 - "+((e.radiusUnit==="meters")?"10000000":"250")},type:"number",defaultValue:20,change:function(e){if((e.radiusUnit==="pixels")&&(e.radius>250)){e.radius=20}else{if((e.radiusUnit==="meters")&&(e.radius>10000000)){e.radius=10000000}}if(d.layers[e.qInfo.qId]){d.layers[e.qInfo.qId].layer.setRadius(e.radius)}},invalid:function(e){if((e.radiusUnit==="pixels")&&(e.radius>250)){e.radius=20;return true}else{if((e.radiusUnit==="meters")&&(e.radius>10000000)){e.radius=10000000;return true}else{return e.radius<0}}}},radiusUnit:{ref:"radiusUnit",label:"Radius Unit",type:"string",defaultValue:"pixels",component:"dropdown",options:[{value:"pixels"},{value:"meters"}],change:function(e){if((e.radiusUnit==="pixels")&&(e.radius>250)){e.radius=20}else{if((e.radiusUnit==="meters")&&(e.radius>10000000)){e.radius=10000000}}if(d.layers[e.qInfo.qId]){d.layers[e.qInfo.qId].layer.setRadius(e.radius);d.layers[e.qInfo.qId].layer.setRadiusUnit(e.radiusUnit)}},invalid:function(e){if((e.radiusUnit==="pixels")&&(e.radius>250)){e.radius=20;return true}else{if((e.radiusUnit==="meters")&&(e.radius>10000000)){e.radius=10000000;return true}}}},autoScale:{ref:"autoScale",label:"Scale",type:"boolean",defaultValue:true,component:"switch",options:[{value:false,label:"Custom"},{value:true,label:"Auto"}],change:function(f){var e=d.layers[f.qInfo.qId];if(e){e=e.layer;e.setAutoScale(f.autoScale);if(f.autoScale){e.setCommonWeight(1)}else{e.setCommonWeight(f.commonWeight)}}}},weights:{type:"items",show:function(e){return !e.autoScale},items:{commonWeight:{ref:"commonWeight",label:"Weight Factor",type:"number",defaultValue:1,show:function(e){return !e.normalizeWeights},change:function(e){if(d.layers[e.qInfo.qId]){d.layers[e.qInfo.qId].layer.setCommonWeight(e.commonWeight)}}}}},color:{type:"items",items:{auto:{type:"boolean",label:"Color Mode",component:"switch",ref:"color.auto",options:[{value:true,label:"Auto"},{value:false,label:"Custom"}],defaultValue:true,change:function(g){var f=d.layers[g.qInfo.qId];if(!f){return}var e=f.getColorsAndDistFromProperties(g);if(f.layer&&f.layer.setColors){f.layer.setColors(e.colors)}if(f.layer&&f.layer.setColorDistribution&&e.distribution){f.layer.setColorDistribution(e.distribution)}}},colors:{ref:"color.colors",type:"array",component:"textarea",label:"Colors",rows:1,defaultValue:[],show:function(e){return e.color&&!e.color.auto},change:function(g){var f=d.layers[g.qInfo.qId];if(!f){return}try{f.layer.setColors(f.getColorsAndDistFromProperties(g).colors)}catch(h){f.addError("HeatmapLayer","Invalid color array")}},resolveFunctions:{get:function(g,e){var f=g(e.type);return f?f.join(", "):""},set:function(g,e,f){e(f.type,a.splitStringIntoColors(g))}},invalid:function(f){if(!f.color.colors||!f.color.colors.length){return false}for(var e=0;e<f.color.colors.length;e++){if(!a.isValidColor(f.color.colors[e])){return true}}return false}},distribution:{ref:"color.distribution",type:"array",component:"textarea",label:"Color Distribution",rows:1,show:function(e){return e.color&&!e.color.auto},change:function(g){var f=d.layers[g.qInfo.qId];if(!f){return}try{f.layer.setColorDistribution(f.getColorsAndDistFromProperties(g).distribution)}catch(h){f.addError("HeatmapLayer","Invalid color distribution")}},resolveFunctions:{get:function(g,e){var f=g(e.type);return f?f.join(", "):""},set:function(g,e,f){e(f.type,!g?[]:g.split(",").map(Number))}},invalid:function(e){var f=e.color.distribution;return f&&f.length&&e.color.colors&&(f.length!==e.color.colors.length||f[0]!==0||f[f.length-1]!==1)}}}}}}}}}}});