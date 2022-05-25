var ready = false;

define(["jquery", "qlik"], function($, qlik) {
    return function($element, layout) {
		var app = qlik.currApp();
		
		var sdoh = app.field('SDOH').getData();
		
		var millisecondsToWait = 1000;
		
		sdoh.OnData.bind( function(){
			setTimeout(function() {
			sdohs = getSlices(sdoh);
			
			var element = $("article.qv-object-PieMenu div.qv-object-content div.ng-scope");

			element.empty();
			element.append(
				'<svg xmlns="http://www.w3.org/2000/svg" id="menu" style="transform-origin: 50% 50% 0px;  transform: matrix3d(0.00136114, 0.999999, 0, 0, -0.999999, 0.00136114, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); touch-action: none;" viewBox="-2 -2 504 504">'+
					'<g id="itemsContainer">'+
						'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="item" id="item-food" role="link" transform="matrix(1 0 0 1 0 0)" xmlns:NS1="http://www.w3.org/1999/xlink" NS1:target="_parent" tabindex="0" data-svg-origin="250 250">'+
						'<path class="sector'+(sdohs.contains('food')?' active':'')+'" id="food" fill="none" stroke="#111" stroke-width="1" d="M 250 250 l 250 0 A 250 250 0 0 0 327.254 12.2359 Z" /></a>'+
						'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="item" id="item-car" role="link" transform="matrix(0.30901 -0.95105 0.95105 0.30901 -65.0184 410.51)" xmlns:NS2="http://www.w3.org/1999/xlink" NS2:target="_parent" tabindex="0" data-svg-origin="250 250">'+
						'<path class="sector'+(sdohs.contains('healthcare')?' active':'')+'" id="healthcare" fill="none" stroke="#111" stroke-width="1" d="M 250 250 l 250 0 A 250 250 0 0 0 327.254 12.2359 Z" /></a>'+
						'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="item" id="item-house" role="link" transform="matrix(-0.80901 -0.58778 0.58778 -0.80901 305.308 599.201)" xmlns:NS3="http://www.w3.org/1999/xlink" NS3:target="_parent" tabindex="0" data-svg-origin="250 250">'+
						'<path class="sector'+(sdohs.contains('housing')?' active':'')+'" id="housing" fill="none" stroke="#111" stroke-width="1" d="M 250 250 l 250 0 A 250 250 0 0 0 327.254 12.2359 Z" /></a>'+
						'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="item" id="item-money" role="link" transform="matrix(-0.80901 0.58778 -0.58778 -0.80901 599.201 305.308)" xmlns:NS4="http://www.w3.org/1999/xlink" NS4:target="_parent" tabindex="0" data-svg-origin="250 250">'+
						'<path class="sector'+(sdohs.contains('finance')?' active':'')+'" id="finance" fill="none" stroke="#111" stroke-width="1" d="M 250 250 l 250 0 A 250 250 0 0 0 327.254 12.2359 Z" /></a>'+
						'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="item" id="item-crime" role="link" transform="matrix(0.30901 0.95105 -0.95105 0.30901 410.51 -65.0184)" xmlns:NS5="http://www.w3.org/1999/xlink" NS5:target="_parent" tabindex="0" data-svg-origin="250 250">'+
						'<path class="sector'+(sdohs.contains('crime')?' active':'')+'" id="crime" fill="none" stroke="#111" stroke-width="1" d="M 250 250 l 250 0 A 250 250 0 0 0 327.254 12.2359 Z" /></a>'+
					'</g>'+
				'</svg>'
				);

				$(".item").click({p0: sdoh, p1: app},onClick);
				ready = true;
			}, millisecondsToWait);
		});
		
		
    };
});

function onClick(event){
	if(!ready)
		return;
	var mySector = $(this).children(".sector");
	mySector.toggleClass("active");	
	var sectorID = mySector.attr("id");

	var selected = getSlices(event.data.p0);
	var count = selected.length;
	var index = selected.indexOf(sectorID);
	if(index > -1){
		selected.splice(index,1);
		count--;
	}else{
		selected.push(sectorID);
		count++;
	}	
	
	var sel = _.map(
		_.filter(event.data.p0.rows,
			function(cur){
				if(selected.contains(cur.qText)){
					event.data.p1.variable.setNumValue('v'+cur.qText,100/(count <= 0 || count >= 5 ? 5 : count));
					return true;
				}
				if(count == 0 || count > 5)
					event.data.p1.variable.setNumValue('v'+cur.qText,20);
				else
					event.data.p1.variable.setNumValue('v'+cur.qText,0);
				
				return false;
			}
		),
		function(cur){
			return cur.qElemNumber;
		}
	);

	event.data.p0.select(sel, false, true);
};

function getSlices(sdoh){
	var dim = _.map(
		_.filter(sdoh.rows,
			function(cur){
				return cur.qState!=='X';
			}
		),
		function(cur){
			return cur.qText;
		}
	);
	
	return dim;
}
