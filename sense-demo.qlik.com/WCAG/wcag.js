define( ["qlik",
		 "./Properties"		 
		 ],
	
	function (qlik,properties) {
		'use strict';	
		var	app = qlik.currApp(this);		
		var arrayValidCharts =  ["table", "pivot-table"];
		return {
			initialProperties : {
				version: 1.0,
				qHyperCubeDef : {
					qDimensions : [],
					qMeasures : [],
					qInitialDataFetch : [{
						qWidth : 0,
						qHeight : 0
					}]
				},			
			},
			definition: properties,
			support: {
				export: false,
				exportData: false,
				snapshot: false
			},										
			
			paint: function ( $element,layout ) {				
													
				var vSearches = layout.searchbool;
				//Replace all H1,H2,... elements
				/*if(vSearches){
					var H1s = document.querySelectorAll("h1");
			        for (var i = 0; i < H1s.length ; i++) {
			        	H1s[i].outerHTML = H1s[i].outerHTML.replace(/h1/g, 'strong');
			        }
			        $(".lui-icon.lui-icon--search").remove();
				}else{					
			        $("i.lui-icon.lui-icon--search").remove();
			    }*/    
			    $(".lui-icon.lui-icon--search").remove();
			    $("i.lui-icon.lui-icon--search").remove();
			    var IMGs = document.querySelectorAll("img");
		        for (var imi = 0; imi < IMGs.length ; imi++) {
		        	IMGs[imi].remove();		        	
		        }
		        $('.qv-object-title').css('color', 'black');
		        $('.qv-object-title-text').css('color', 'black');
		        $('.qv-object-subtitle').css('color', 'black');
		        $('.primary-label').css('color', 'black');
		        $('.secondary-label').css('color', 'black');
		        $('.sheet-title-text').css('color', 'black');
		        $('.empty-text').css('color', 'black');
		        $('a').css('color', 'black');

		        var vFadeBut = document.getElementsByClassName('lui-fade-button');
		        for (var ifbi = 0; ifbi < vFadeBut.length ; ifbi++) {
		        	vFadeBut[ifbi].removeAttribute('aria-labelledby');	
		        }
		       
		       	//it worked
		       	/*
		        var Buts = document.getElementsByClassName('qv-subtoolbar-button');
		        for (var ibi = 0; ibi < Buts.length ; ibi++) {
		        	var vButTit = Buts[ibi].getAttribute('title');		        	
		        	var vTag = Buts[ibi].tagName;
		        	if(vTag == 'BUTTON'){
		        		Buts[ibi].append( "<i>" + vButTit + "</i>" )
		        	}		        	        	
		        }*/
		        var Buts = document.querySelectorAll("button");
		        for (var ibi = 0; ibi < Buts.length ; ibi++) {
		        	Buts[ibi].remove();		        	
		        }

		        

			    var H4s = document.querySelectorAll("h4");
		        for (var ii = 0; ii < H4s.length ; ii++) {
		        	H4s[ii].outerHTML = H4s[ii].outerHTML.replace(/h4/g, 'strong');		        	
		        }		        

		        // add a title to all visible inputs
		        var inputs = document.querySelectorAll("input");
		        for (var ins = 0; ins < inputs.length ; ins++) {
		        	inputs[ins].setAttribute('title', inputs[ins].placeholder);	        	
		        }

		        var vInput = document.querySelectorAll("input");
		        for (var ini = 0; ini < vInput.length ; ini++) {
		        	vInput[ini].remove();		        	
		        }

		        var vLabel = document.querySelectorAll("label");
		        for (var ili = 0; ili < vLabel.length ; ili++) {
		        	vLabel[ili].remove();		        	
		        }

		        var SELs = document.querySelectorAll("select");
		        for (var isi = 0; isi < SELs.length ; isi++) {
		        	SELs[isi].remove();		        	
		        }

		        var TEXTs = document.querySelectorAll("textarea");
		        for (var iti = 0; iti < TEXTs.length ; iti++) {
		        	TEXTs[iti].remove();		        	
		        }

		        var THs = document.querySelectorAll("th");
		        for (var ithi = 0; ithi < THs.length ; ithi++) {
		        	//if(THs[ithi].title == '&nbsp;'){
		        	if(THs[ithi].children[0].children[0].tagName == 'SPAN' && THs[ithi].title.length <= 1){
		        		//console.log(THs[ithi].title,THs[ithi].children[0].children[0],THs[ithi].children[0].children[0].tagName)
		        		var vSpan = THs[ithi].children[0].children[0];
		        		vSpan.outerHTML = 'Categories';
		        		//console.log(vSpan,THs[ithi].title,THs[ithi].title.length)
		        	}
		        	//THs[ithi].remove();		        	
		        }

		        //remove global search as it contains a none visible input
		        var vGlobalSearch = document.getElementsByClassName('lui-icon--selection-search');
		        vGlobalSearch[0].remove();

		        /*var vLuiButtons = document.getElementsByClassName('lui-button');
		        console.log(vLuiButtons.length)
		        for (var ilbi = 0; ilbi < vLuiButtons.length ; ilbi++) {
		        	vLuiButtons[ilbi].remove();		        	
		        }*/
		        //vLuiButtons[0].remove();

		        var vList = document.getElementsByClassName('list');
		        vList[0].remove();

		        //document.getElementById("viewport").setAttribute("content","initial-scale=1; maximum-scale=1.0; user-scalable=1;");
				var viewport = $('head meta[name="viewport"]'); 
		        viewport.attr('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes');
		        
		        //remove column search in tables as it contains a none visible input
		        
		        $(".qv-st-header-cell").removeClass('qv-st-header-cell-search');	
			}
		}
	});
