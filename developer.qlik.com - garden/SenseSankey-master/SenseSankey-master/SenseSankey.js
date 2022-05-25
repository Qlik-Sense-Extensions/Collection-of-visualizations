requirejs.config({
  shim : {
    "extensions/SenseSankey/sankeymore" : {
      deps : ["extensions/SenseSankey/d3.min"],
	  exports: 'd3.sankey'
    }
  }
});

define(
	[
	"jquery", 
	"css!./style.css",
	"extensions/SenseSankey/md5.min",
	"extensions/SenseSankey/sankeymore"	
	],
		
	function($, cssContent, md5) {
		'use strict';

		return {
			initialProperties: {
				version: 2.2,
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 5,
						qHeight: 2000
					}]
				},
				selectionMode: "QUICK"
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					dimensions: {
						uses: "dimensions",
						min: 2,
						max: 4				},
					measures: {
						uses: "measures",
						min: 1,
						max: 1
					},
					//sorting: {
					//	uses: "sorting"
					//},
					settings: {
						uses: "settings",
						type: "items",
						items : {
								SankeyGroup:{
								label : "Sankey Settings v2.2",
								type:"items",
								items : {
								flowMax:{
									type: "integer",
									label: "Flow max (10 to 2000)",
									ref: "flowMax (max is 2000)",
									defaultValue: 500,
									min : 10,
									max : 2000
									},
								
								flowColor:{
									type: "string",
									component: "color-picker",
									expression: "optional",
									label: "Color Flow",
									ref: "flowColorCustom",
									dualOutput: true,
									defaultValue: "#999999"
									},
									
								Separateur:{
									ref: "displaySeparateur",
									type: "string",
									component: "dropdown",
									label: "Pop-up Separator",
									options:
									[
										{
										value:" - ",
										label:"-"
										},
										{
										value:" <-> ",
										label:"<->"
										},
										{
										value: " → ",
										label: " → "
										},
									],
									defaultValue: " - "
								},
								Format:{
									ref: "displayFormat",
									type: "string",
									component: "dropdown",
									label: "Pop-up Format",
									options: 
									[ 
										{
										value: "Number2",
										label: "1000.12"
										},
										{
										value: "Number1",
										label: "1000.1"
										},
										{
										value: "Number",
										label: "1000"
										},
									],
										defaultValue: "Number"
										},
								currencySymbol:{
									type: "string",
									label: "Currency Symbol",
									ref: "currencySymbol",
									defaultValue: "€"
									},
										
								Palette:{
									ref:"displayPalette",
									type:"string",
									component: "dropdown",
									label : "Palette",
									options:
									[
										{
										value: "D3-20",
										label: "Ordinal Palette 20 colors"
										},
										{
										value: "D3-20c",
										label: "Blue-Grey Palette 20 colors"
										},
										{
										value: "D3-20b",
										label: "Blue-Purple Palette 20 colors"
										},
										{
										value: "20",
										label: "Palette 20 colors"
										},
										{
										value: "20a",
										label: "Other Palette 20 colors"
										},
									],
										defaultValue: "D3-20"
										},
									colorPersistence:{
										ref: "colorPersistence",
										component: "switch",
										type: "boolean",
										translation: "Persistence",
										defaultValue: false,
										trueOption: {
										  value: true,
										  translation: "properties.on"
										},
										falseOption: {
										  value: false,
										  translation: "properties.off"
										},
										show: true
									}
								}
							}
							
						}
					}
				}
			},
			snapshot: {
				canTakeSnapshot: true
			},

			paint: function ( $element, layout ) {
				
			// Fonction format pop-up		
			function formatMoney(n, c, d, t, m, l){
				var c = isNaN(c = Math.abs(c)) ? 2 : c, 
					d = d == undefined ? "." : d, 
					t = t == undefined ? "," : t, 
					s = n < 0 ? "-" : "", 
					i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
					j = (j = i.length) > 3 ? j % 3 : 0;
				   return l + ' \n ' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "")+ m;
			};
			
			function formatNumber(displayFormat, value, context,currencySymbol){
				if (displayFormat === "Number"){
					return formatMoney(value, 0, '.', ' ',currencySymbol, context);
				}
				if (displayFormat === "Number1"){
					return formatMoney(value, 1, '.', ' ',currencySymbol,context);
				}
				if (displayFormat === "Number2"){
					return formatMoney(value, 2, '.', ' ',currencySymbol,context);
				}
			}		
			 
			 
			// Persistent color function
			var hashScale = d3.scale.linear().domain([1, 4294967295]).range([ 0, 19.9999 ]);
			
			
			function hashL(str) {
			  var hashL = 5381,
				  i    = str.length
			  while(i)
				hashL = (hashL * 33) ^ str.charCodeAt(--i) 
				//hash = md5(str)
			  return hashL >>> 0;
			}
			
			function getColorForNode(strValue) {
				if (colorPersistence===true) {
					return colours[parseInt(Math.floor(hashScale(hashL(md5(strValue)))))];
				} else 
				{
					return colours[Math.floor(Math.random() * (19))];
				}
				}
					
			  var _this = this;
			  var maxHeight         = layout.flowMax;
			  var displayFormat     = layout.displayFormat;
			  var currencySymbol	= " " + layout.currencySymbol;
			  var displaySeparateur = layout.displaySeparateur;
			  var displayPalette    = layout.displayPalette;
			  var colorPersistence  = layout.colorPersistence;
			  var offset = $element.offset();
			  
			 if (displayPalette === "D3-20") {
				var colours = ['#1f77b4','#aec7e8','#ff7f0e','#ffbb78','#2ca02c','#98df8a','#d62728','#ff9896','#9467bd','#c5b0d5','#8c564b',
								'#c49c94','#e377c2','#f7b6d2','#7f7f7f','#c7c7c7','#bcbd22','#dbdb8d','#17becf','#9edae5' ];
			}
			else if (displayPalette === "D3-20b") {
				var colours = ['#393b79','#5254a3','#6b6ecf','#9c9ede','#637939','#8ca252','#b5cf6b','#cedb9c','#8c6d31','#bd9e39',
				'#e7ba52','#e7cb94','#843c39','#ad494a','#d6616b','#e7969c','#7b4173','#a55194','#ce6dbd','#de9ed6'];
			}
			else if (displayPalette === "D3-20c") {
				var colours = ['#3182bd','#6baed6',	'#9ecae1','#c6dbef','#e6550d','#fd8d3c','#fdae6b','#fdd0a2','#31a354',
					'#74c476','#a1d99b','#c7e9c0','#756bb1','#9e9ac8','#bcbddc','#dadaeb','#636363','#969696','#bdbdbd','#d9d9d9' ];
			}
			else if (displayPalette === "20") {
				var colours = [ '#1abc9c','#7f8c8d','#2ecc71','#bdc3c7','#3498db','#c0392b','#9b59b6','#d35400','#34495e','#f39c12',
					'#16a085','#95a5a6','#27ae60','#ecf0f1','#2980b9','#e74c3c','#8e44ad','#e67e22','#2c3e50','#f1c40f' ];
			}
			else if (displayPalette === "20a") {
				var colours = [ '#023FA5','#7D87B9','#BEC1D4','#D6BCC0','#BB7784','#FFFFFF','#4A6FE3','#8595E1','#B5BBE3','#E6AFB9',
				'#E07B91','#D33F6A','#11C638','#8DD593','#C6DEC7','#EAD3C6','#F0B98D','#EF9708','#0FCFC0','#9CDED6'];
			}
			
			var flowColor = layout.flowColorCustom.color;
			  
			var qData = layout.qHyperCube.qDataPages[0];
			// create a new array that contains the dimension labels
			var qDim  = layout.qHyperCube.qDimensionInfo.map(function(d) {
				return d.qFallbackTitle;
			});
			  
			  
			var divName = layout.qInfo.qId;
			var qMatrix = qData.qMatrix.sort();
			var source = qMatrix.map(function(d) {
				  
			var path = ""; 
			var sep = ""; 
			for (var i = 0; i < d.length - 1; i++) {
				path += sep + (d[i].qText.replace('|', ' ')) + '|' + (d[i].qElemNumber); 
				sep = "§";
			}
					
			return {
				  //"Path":d[0].qText,
				  "Path": path,
				  "Frequency": d[d.length - 1].qNum
				}
			   });
			  var id = "sk_"+ layout.qInfo.qId;
					  
			  if (document.getElementById(id)) {
				 $("#" + id).empty();
			   }
			   else {
				$element.append($('<div />').attr("id", id));        
			   }
			  $("#" + id).width($element.width()).height($element.height());
			  var sLinks = [];
			  var endArr = [];
			  var catArray = [];
			
			  //********Creates Duplicate IDs*************
			  //		$element.attr("id",id)
			  //******************************************
			  //var td = _this.Data;
			  var sNodes = [];
			  var jNodes = [];
			  var rev = 0; //permet de pivoter les dimensions
			  
			 
			  source=source.slice(0,maxHeight);
			  //source foreach
			source.forEach(function(d) {
			  //var row = d;
			  var path = d.Path;
			  var val = parseFloat(d.Frequency);
			  if(val > 0) {
				var tArr = path.split("§",4);  
				//tArr.sort();
				if (rev == "1") {
					tArr.reverse();
				} 	 	
				if (tArr.length > 1) {
					$.each(tArr, function(i) {
						
					if(tArr.length === (i + 1)){
						tArr[i] = this.toString().trim() + "~end";
					}else{
						tArr[i] = this.toString().trim() + "~" + i;	
					}
				});
				$.each(tArr, function(i) {
					if ($.inArray(this.toString().trim(), sNodes) === -1) {
						sNodes.push(this.toString().trim());
					}
				});
				}
				}
				});

			   sNodes.forEach(function(d) {
						jNodes.push({
							name: d.toString()
						})
				});
		  
			  //source foreach
			source.forEach(function(d) {
			  //var row = d;
			  var path = d.Path
			  var val = parseFloat(d.Frequency);
			  if(val > 0) {
			  var tArr = path.split("§");  
		  
			  if (rev == "1") {
				tArr.reverse();
			  } 	 	
			  if (tArr.length > 1) {
				$.each(tArr, function(i) {
						
						if(tArr.length === (i + 1)){
							tArr[i] = this.toString().trim() + "~end";
						}else{
							tArr[i] = this.toString().trim() + "~" + i;	
						}
					});
				
				$.each(tArr, function(i) {
						var tFlag = "no";
						if ((i + 1) != tArr.length) {
							////console.info(this.toString().trim() + " to " + tArr[i + 1]);
							var cS = $.inArray(this.toString().trim(), sNodes);
							var cT = $.inArray(tArr[i + 1].toString().trim(), sNodes);

							//////console.info(cT + " " + cS);
							$.each(sLinks, function(i, v) {
								if ((v.source === cS) && (v.target === cT)) {
									////console.info(this);
									tFlag = "yes";
									v.value = v.value + val;

								}
							});
							if (tFlag == "no") {
								sLinks.push({
									"source" : cS,
									"target" : cT,
									"value" : val
								});
							}

						}
					});
				}
			}
			});
		
		  
		  var margin = {
			  top : 1,
			  right : 1,
			  bottom : 0,
			  left : 1
			}, width = $element.width(), height = $element.height();
			
			var svg = d3.select("#sk_" + divName).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		  
			var sankey = senseSankey().nodeWidth(15).nodePadding(10).size([width -10 , height-10]);
			var path = sankey.link();
		 
		

			sankey.nodes(jNodes).links(sLinks).layout(32);
			
			var link = svg.append("g").selectAll(".link").data(sLinks).enter().append("path").attr("class", "link").attr("d", path).style("stroke-width",function(d) {
			  return Math.max(1, d.dy);
			}).sort(function(a, b) {
			  return b.dy - a.dy;
			});
			
			//Color of Flow 
			link.style('stroke', flowColor);


			$('.ttip').remove(); //We make sure there isn't any other tooltip div in the doom

			// Create tooltip div 
			var  tooltip = d3.select("body")
					.append("div")
					.attr("class","ttip")
					.attr("id","ttip")
					.style("position", "absolute")
					.style("z-index", "10")
					.style("visibility", "hidden");	
			
			//Link tooltip
			link.on("mouseover", function(d){
					var start = d.source.name.split('|')[0];
					var end = d.target.name.split('|')[0];
					var targetValue = formatNumber(displayFormat,d.value,'',currencySymbol);
					
					tooltip.html("<b>"+start+"</b>"+displaySeparateur+"<b>"+end+"</b><br/>"+targetValue);			
					return tooltip.style("visibility", "visible");})
				.on("mousemove", function(d){
					var start = d.source.name.split('|')[0];
					var end = d.target.name.split('|')[0];
					var targetValue = formatNumber(displayFormat,d.value,'',currencySymbol);
					tooltip.html("<b>"+start+"</b>"+displaySeparateur+"<b>"+end+"</b><br/>"+targetValue);
					return tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
				})
				.on("mouseout", function(){
					return tooltip.style("visibility", "hidden");
				});
			
			var node = svg
			.append("g").selectAll(".node").data(jNodes).enter().append("g").attr("class", "node").attr("transform", function(d) {
			  return "translate(" + d.x + "," + d.y + ")";
			})
			
			node.on("click",function(d, i) {
				//on passe a la fonction l'identifiant qElement precedemment stocké dans le nom et le nom de la dimension sous forme d'un tableau
				
				_this.backendApi.selectValues(
					parseInt(d.name.split('~')[1].replace('end', qDim.length - 1)),
					[ parseInt(d.name.split('~')[0].split('|')[1]) ],
					true
				);
			})
			
			link.on("click",function(d,i){
				_this.backendApi.selectValues(
					parseInt(d.target.name.split('~')[1].replace('end', qDim.length - 1)), //DAP: As we already selected a link, it make sense to select the source and target dimensions and filter the data
					[ parseInt(d.target.name.split('~')[0].split('|')[1]) ],
					true
				);
				_this.backendApi.selectValues(
					parseInt(d.source.name.split('~')[1].replace('end', qDim.length - 1)),
					[ parseInt(d.source.name.split('~')[0].split('|')[1]) ],
					true
				);	
				$('.ttip').remove(); //remove tooltip object on click.
			});		
			
						
			//dessin du noeud
			node.append("text").attr("class", "nodeTitle").attr("x", -6).attr("y", function(d) {
				  return d.dy / 2;
			}).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null).text(function(d) {
			  var str = d.name.substring(0, d.name.indexOf("~")).split('|')[0];
			  //console.log(str);
			  return str 
			}).filter(function(d) {
			  return d.x < width / 2;
			}).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start");
			
			// AVEC POPUP sur le carré de couleur
			node.append("rect").attr("height", function(d) {
			  return d.dy;
			}).attr("width", sankey.nodeWidth()).style("fill", function(d) {
			   return d.color = getColorForNode(d.name);
			 
			}).style("stroke", function(d) {
			  return d3.rgb(d.color).darker(2);
			});
			
			//Node tooltip
			node.on("mouseover", function(d){
				var level = d.name.substr(d.name.indexOf("~")+1,1);
				var edgeMargin= 0; //Last nodes might not have enough space for the tooltip, so we add a negative margin to push the tooltip on the left
				// test si on est à la fin du flux ou pas
				if (level === "e" ){
					level = qDim.length -1;
					edgeMargin=-80;
				}
				var entete = qDim[level] + ' : ' + d.name.split('|')[0];
				var value=formatNumber(displayFormat,d.value,'',currencySymbol);
					
				tooltip.html("<b>"+entete+"</b><br/>"+value);			
				return tooltip.style("visibility", "visible").style("top",(d3.event.pageY+10)+"px").style("left",(d3.event.pageX+10+edgeMargin)+"px");
			})
			.on("mousemove", function(d){
				var edgeMargin= 0;
				var level = d.name.substr(d.name.indexOf("~")+1,1);
				// test si on est à la fin du flux ou pas
				if (level === "e" ){
					level = qDim.length -1;
					edgeMargin=-80;
				}
				
				var entete = qDim[level] + ' : ' + d.name.split('|')[0];		
				var value=formatNumber(displayFormat,d.value,'',currencySymbol);
					
		
				tooltip.html("<b>"+entete+"</b><br/>"+value);
				return tooltip.style("top",(d3.event.pageY+10)+"px").style("left",(d3.event.pageX+10+edgeMargin)+"px");
			})
			.on("mouseout", function(){
				return tooltip.style("visibility", "hidden");
			});
				
			/*
			 function dragmove(d) {
			  d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
			  sankey.relayout();
			  link.attr("d", path);
			}
			*/
			}        
		};
} );
