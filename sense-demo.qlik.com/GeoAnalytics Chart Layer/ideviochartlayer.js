define(["./ChartLayer","../IdevioMap/common/Utils","./properties","css!./style.css"],function(a,c,b){return{initialProperties:{qHyperCubeDef:{qDimensions:[],qMeasures:[],qInitialDataFetch:[{qWidth:6,qHeight:c.MAX_OBJECTS}]},title:"Chart Layer",showTitles:false,legendValues:{min:1,max:10,maxradius:1,minradius:10,title:""}},snapshot:{canTakeSnapshot:true},selections:{swipe:false,dataArea:{captureInput:false}},definition:b,paint:function(d,e){if(!this.chartLayer){this.chartLayer=new a(this,e,d)}this.chartLayer.paintExtension(e,false,false)}}});