"use strict";define(["./ui_element","../../../../../../resources/assets/external/leonardo-ui/leonardo-ui.min.js"],function(e,n){return{registerEvents:function(i,s){var o=null;i.isDimensionListOpened=[],i.openDimensionList=function(t,p){if(i.isDimensionListOpened[p])i.isDimensionListOpened[p]=!1;else{i.isDimensionListOpened[p]=!0;var r=t.currentTarget;o=n.popover({content:e.listDimensionElement.replace("<dimensionId>",""+p),closeOnEscape:!0,dock:"right",alignTo:r,onClose:function(){i.$apply(function(e){e.isDimensionListOpened[p]=!1,e.dimSearchString=""})}}),s($("div.lui-popover"))(i)}},i.selectDimension=function(e,n){for(var s=e;s>=0;s--)"undefined"==typeof i.layout.props.dimensions[s]&&(e=s);/\s/.test(n)&&(n="["+n+"]"),i.backendApi.applyPatches([{qPath:"/props/dimensions/"+e,qOp:"add",qValue:JSON.stringify({label:n,expression:n})}],!1),o.close()},i.removeDimension=function(e){i.backendApi.applyPatches([{qPath:"/props/dimensions/"+e,qOp:"remove"}],!1)}}}});
//# sourceMappingURL=../../maps/ui/ui_dimension.js.map
