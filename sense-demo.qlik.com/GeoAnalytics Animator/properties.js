define([],function(){return{type:"items",component:"accordion",items:{dimensions:{uses:"dimensions",translation:"Dimension",min:1,max:1},options:{type:"items",label:"Animator Options",items:{intervalTime:{ref:"animator.intervalTime",label:"Time Between Steps (milliseconds. 1000 = 1 second)",type:"integer",defaultValue:4000,min:50,max:100000},steps:{ref:"animator.steps",label:"* Total Steps (0 shows all steps)",type:"integer",defaultValue:0,min:0,show:function(a){if(a.animator&&a.animator.aggr){return false}else{return true}}},aggregate:{ref:"animator.aggr",label:"* Aggregate",type:"boolean",defaultValue:false,show:function(a){if(a.animator&&a.animator.steps===0){return true}else{return false}}},loop:{ref:"animator.loop",label:"Loop",type:"boolean",defaultValue:true},showLabel:{ref:"animator.showLabel",label:"Show Dimension Label",type:"boolean",defaultValue:true},showDimensionValue:{ref:"animator.showDimValue",label:"Show Dimension Value",type:"boolean",defaultValue:true},note0:{component:"text",label:"* The 'Total Steps' option and the 'Aggregate' option are mutually exclusive."},note1:{component:"text",label:"'Total Steps' must be 0 for 'Aggregate' to work."},note2:{component:"text",label:"'Aggregate' must be unchecked for 'Total Steps' to work."}}},settings:{uses:"settings"}}}});