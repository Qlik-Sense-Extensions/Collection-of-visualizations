define(["jquery", "qlik"], function($, qlik) {
    return function($element, layout) {
		var app = qlik.currApp();
		var mode = app.field('MODE').getData();
		
		function onClick(){
			$(".mode .sector").removeClass("active");
			var mySector = $(this).children(".sector");
			mySector.addClass("active");	
			var sectorID = mySector.attr("id");
			var param = [(mode.rows[0].qText === sectorID ? 0 : 1)]
			mode.select(param, false, true)
		};
		
		var element = $("article.qv-object-PieModeMenu div.qv-object-content div.ng-scope");
		
		element.empty();
		element.append(
		'<svg xmlns="http://www.w3.org/2000/svg" id="modemenu" style="transform-origin: 50% 50% 0px; -ms-user-select: none; touch-action: none;" viewBox="-2 -2 454 102">'+
			'<g id="modesContainer">'+
				'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="mode" id="mode-ind" role="link" xmlns:NS2="http://www.w3.org/1999/xlink" NS2:target="_parent" tabindex="0" data-svg-origin="250 250">'+
				'<rect class="sector active" id="Individual" x="0" y="0" width="200" height="116" rx="15" /><image href="../Extensions/PieModeMenu/ind_mode.png" x="-50%" y="-50%" /></a>'+
				'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:title="" class="mode" id="mode-org" role="link" xmlns:NS2="http://www.w3.org/1999/xlink" NS2:target="_parent" tabindex="0" data-svg-origin="250 250">'+
				'<rect class="sector" id="Organization" x="250" y="0" width="200" height="116" rx="15" /><image href="../Extensions/PieModeMenu/org_mode.png" x="-50%" y="-50%" /></a>'+
			'</g>'+
		'</svg>'
		);
		
		$(".mode").click(onClick);
    };
});