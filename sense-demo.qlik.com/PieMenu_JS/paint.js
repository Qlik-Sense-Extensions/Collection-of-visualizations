var ready = false;
var state = {rows:[
{qText: "crime", qElemNumber: 4, qState: "S", qFrequency: "1"}
,{qText: "finance", qElemNumber: 3, qState: "S", qFrequency: "1"}
,{qText: "food", qElemNumber: 0, qState: "S",  qFrequency: "1"}
,{qText: "healthcare", qElemNumber: 1, qState: "S", qFrequency: "1"}
,{qText: "housing", qElemNumber: 2, qState: "S", }
]}
var loaded = false;
var sdoh

define(["jquery", "qlik"], function($, qlik) {
    return function($element, layout) {
		var app = qlik.currApp();
		sdoh= app.field('SDOH').getData()
		
		
		sdoh.OnData.bind( function(){
			if (loaded==false){
					for (var i in sdoh.rows){
						var cur = sdoh.rows[i]
						for (var i2 in state.rows){
							cur2=state.rows[i2]
							if (cur2.qText==cur.qText && cur.qState=='X')
								state.rows[i2].qState='X' 
						}
					}
					loaded = true;
					paint(app)
			}
		});
		
		paint(app)
    };
});
function paint(app){
			sdohs = getSlices(state);
			
			var element = $("article.qv-object-PieMenu_JS div.qv-object-content div.ng-scope");
			element.empty();
			element.append(
				'<svg xmlns="http://www.w3.org/2000/svg" id="menu" style="transform-origin: 50% 50% 0px; touch-action: none;" viewBox="-5 -5 510 510">'+
					'<g id="itemsContainer">'+
						'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="item" id="item-healthcare" role="link" xmlns:NS1="http://www.w3.org/1999/xlink" NS1:target="_parent" tabindex="0" data-svg-origin="250 250">'+
							'<path class="sector'+(sdohs.includes('healthcare')?' active':'')+'" id="healthcare" fill="none" stroke="#111" stroke-width="5" d="M 250 250 L 396.9463130731183 47.74575140626314 A 250 250 0 0 0 103.05368692688174 47.74575140626314 Z" />'+
							'<rect id="healthcareplus0" width="160" height="60" x="170" y="70" />'+
							'<rect id="healthcareplus1" width="60" height="160" x="220" y="20" />'+
						'</a>'+
						'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="item" id="item-finance" role="link" xmlns:NS1="http://www.w3.org/1999/xlink" NS1:target="_parent" tabindex="0" data-svg-origin="250 250">'+
							'<path class="sector'+(sdohs.includes('finance')?' active':'')+'" id="finance" fill="none" stroke="#111" stroke-width="5" d="M 250 250 L 103.05368692688174 47.74575140626314 A 250 250 0 0 0 12.235870926211618 327.2542485937369 Z" />'+
							'<path id="financeess" fill="#000" stroke="#111" stroke-width="1" d="M 154 178 l 0 -28 l -8 -8 l -80 0 l -8 8 l 0 56 l 8 8 l 76 0 l 0 24 l -72 0 l 0 -12 l -12 0 l 0 28 l 8 8 l 80 0 l 8 -8 l 0 -56 l -8 -8 l -76 0 l 0 -24 l 72 0 l 0 12 Z" />'+
							'<rect id="financebar0" width="16" height="160" x="82" y="122" />'+
							'<rect id="financebar1" width="16" height="160" x="112" y="122" />'+
						'</a>'+
						'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="item" id="item-food" role="link" xmlns:NS1="http://www.w3.org/1999/xlink" NS1:target="_parent" tabindex="0" data-svg-origin="250 250">'+
							'<path class="sector'+(sdohs.includes('food')?' active':'')+'" id="food" fill="none" stroke="#111" stroke-width="5" d="M 250 250 L 12.235870926211618 327.2542485937369 A 250 250 0 0 0 249.99999999999994 500 Z" />'+
							'<path id="foodfork" fill="#000" stroke="#111" stroke-width="1" d="M 150 294 l 0 40  l 12 0 l 0 -32 l 8 8 l 0 32 l -12 8 l 0 96 l -8 8 l -8 0 l -8 -8 l 0 -96 l -12 -8 l 0 -32 l 8 -8 l 0 32 l 12 0 l 0 -32 Z" />'+
							'<path id="foodknife" fill="#000" stroke="#111" stroke-width="1" d="M 188 294 l 16 0 l 16 16 l 0 64 l -8 8 l 0 64 l -8 8 l -12 0 l -8 -8 Z " />'+
						'</a>'+
						'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="item" id="item-crime" role="link" xmlns:NS1="http://www.w3.org/1999/xlink" NS1:target="_parent" tabindex="0" data-svg-origin="250 250">'+
							'<path class="sector'+(sdohs.includes('crime')?' active':'')+'" id="crime" fill="none" stroke="#111" stroke-width="5" d="M 250 250 L 249.99999999999994 500 A 250 250 0 0 0 487.76412907378835 327.2542485937369 Z" />'+
							'<circle id="crimelink0" fill="none" stroke="#111" stroke-width="12" cx="298" cy="308" r="12" />'+
							'<circle id="crimelink1" fill="none" stroke="#111" stroke-width="12" cx="322" cy="304" r="12" />'+
							'<circle id="crimelink2" fill="none" stroke="#111" stroke-width="12" cx="344" cy="310" r="12" />'+
							'<circle id="crimelink3" fill="none" stroke="#111" stroke-width="12" cx="362" cy="332" r="12" />'+
							'<circle id="crimelink4" fill="none" stroke="#111" stroke-width="12" cx="368" cy="356" r="12" />'+
							'<path id="crimebracelet0" fill="#000" stroke="#111" stroke-width="1" d="M 302 400 l 16 0 l 16 -16 l 0 -32 l -16 -16 l -8 0 l 0 -16 l -24 0 l 0 16 l -8 0 l -16 16 l 0 32 l 16 16 l 16 0 l 0 -16 l -8 0 l -8 -8 l 0 -16 l 8 -8 l 24 0 l 8 8 l 0 16 l -8 8 l -8 0 Z" />'+
							'<path id="crimebracelet1" fill="#000" stroke="#111" stroke-width="1" d="M 374 446 l 16 0 l 16 -16 l 0 -32 l -16 -16 l -8 0 l 0 -16 l -24 0 l 0 16 l -8 0 l -16 16 l 0 32 l 16 16 l 16 0 l 0 -16 l -8 0 l -8 -8 l 0 -16 l 8 -8 l 24 0 l 8 8 l 0 16 l -8 8 l -8 0 Z" />'+
						'</a>'+
						'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="item" id="item-housing" role="link" xmlns:NS1="http://www.w3.org/1999/xlink" NS1:target="_parent" tabindex="0" data-svg-origin="250 250">'+
							'<path class="sector'+(sdohs.includes('housing')?' active':'')+'" id="housing" fill="none" stroke="#111" stroke-width="5" d="M 250 250 L 487.76412907378835 327.2542485937369 A 250 250 0 0 0 396.9463130731185 47.74575140626331 Z" />'+
							'<path id="housingroof" fill="#000" stroke="#111" stroke-width="1" d="M 320 194 l 76 -76 l 8 0 l 76 76 l 0 8 l -8 0 l -68 -68 l -8 0 l -68 68 l -8 0 Z " />'+
							'<path id="housinghouse" fill="#000" stroke="#111" stroke-width="1" d="M 338 260 l 0 -60 l 60 -60 l 4 0 l 60 60 l 0 60 l -44 0 l 0 -48 l -40 0 l 0 48 Z" />'+
							'<rect id="housingdoorknob" width="12" height="12" x="400" y="232" />'+
						'</a>'+
					'</g>'+
				'</svg>'
				);

				$(".item").click({p0: state, p1: app},onClick);
				ready = true;
}

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
				if(selected.includes(cur.qText)){
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
	)
	if (sel.length==0){
		state = {rows:[
			{qText: "crime", qElemNumber: 4, qState: "S", qFrequency: "1"}
			,{qText: "finance", qElemNumber: 3, qState: "S", qFrequency: "1"}
			,{qText: "food", qElemNumber: 0, qState: "S",  qFrequency: "1"}
			,{qText: "healthcare", qElemNumber: 1, qState: "S", qFrequency: "1"}
			,{qText: "housing", qElemNumber: 2, qState: "S", }
			]}
	
	} else {
		for (var i in state.rows){
			var cur = state.rows[i]
			if (sel.includes(cur.qElemNumber))
				state.rows[i].qState = 'S'	
			else 
				state.rows[i].qState = 'X'

		}
	}
	sdoh.select(sel, false, true);
	
	paint(event.data.p1);
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
