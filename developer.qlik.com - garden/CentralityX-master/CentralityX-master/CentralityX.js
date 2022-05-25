requirejs.config({
    paths: {
      d3: "../extensions/CentralityX/js/d3.v4.min",
	  lasso: "../extensions/CentralityX/js/d3.lasso.min"
    }
});
define( [
	"jquery", "./properties", "./js/jsnetworkx", "text!./css/style.css", "d3", "lasso"],
function ($,props,jsnx,cssContent,d3,d3l) {
	'use strict';
		
	return {
		initialProperties: {
				version: 1.0,
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 10,
						qHeight: 1000
					}]
				}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		definition: props,
		paint: function($element, layout) {
			/*
			Author: Anthony Garbin, Qliktech AU
			Author Credits: Developing Extension, Extension Properties and Customisation Options. 
							Re-Factoring D3 Lasso Library from D3 V.3 to D3 V.4, 
							Integration with JSNetworkX
							Integration between D3 Lasso and QSE
							UI Design
							Testing
			3rd Party Credits: 
							JR Ladd: D3 Force Directed Layout Example https://bl.ocks.org/jrladd/c76799aa63efd7176bd9006f403e854d
							JSNetworkX: Centrality Library ported from NetworkX
							AxisGroup: QSE Lasso Example https://github.com/axisgroup/QSExt-Lasso-Tutorial
							S. Kokenes: D3 Lasso Libary Module https://github.com/skokenes/D3-Lasso-Plugin
			*/

			var self = this;
		
			$element.empty();
			
			//var app = qlik.currApp(this);
			if (!$("style[id='ext']").length > 0) {
				if (!$("link[id='ext']").length > 0) {
					$('<style id="ext">').html(cssContent).appendTo('head');				
				}
			};
			
			// Get the data
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			var qDimensionInfo = layout.qHyperCube.qDimensionInfo;
			var dim_info = qDimensionInfo.map(function(d){
				return {
					"dimension": d.mapping
				}
			})
			var qMeasureInfo = layout.qHyperCube.qMeasureInfo
			var measure_info = qMeasureInfo.map(function(d){
				return {
					"measure": d.mapping,
					"max": d.qMax,
					"min": d.qMin
				}
			})
			
			// Get the extension container properties
			var height = $element.height(), // height
				width = $element.width(),   // width
				id = "container_" + layout.qInfo.qId, //Element ID
				chartID = "chart_" + layout.qInfo.qId, //Chart ID
				menuGroup = "menuGroup_" + layout.qInfo.qId,
				menuRadio = "menuRadio_" + layout.qInfo.qId,
				radioGrp = "radioGrp_" + layout.qInfo.qId,
				actionGrp = "actionGrp_" + layout.qInfo.qId,
				btnRefresh = "btnRefresh_" + layout.qInfo.qId,
				selector = "selector_" + layout.qInfo.qId,
				action = "action_" + layout.qInfo.qId;

			if(document.getElementById(id)) {
				$("#" + id).empty();
			}else {
				// If the element doesn't exist, create it
				var $Item = $('<div />')
				var html = '<div style="position:absolute;z-index:2"><div id="' + chartID + '" width="' + width + '" height="' + height + '"></div></div>'
				html += '<table id="'+menuGroup+'" style="position:absolute;z-index:3;"><tr><td id="'+menuRadio+'"><div id="'+actionGrp+'" class="radio-group"></div></td></tr></table>'
				$Item.html(html);
				$element.append($Item.attr("id",id).width(width).height(height));
			}
			
			//Setup pointers to required dimensions
			var node_a = 0//dim_info.findIndex(x => x.dimension=="q_node_a") //Node A ID (unique)
		    var node_b = 1//dim_info.findIndex(x => x.dimension=="q_node_b") //Node B ID (unique)
			var edge_weight = measure_info.findIndex(x => x.measure=="q_edge_weight") //Edge weight (line thickness)
			if (edge_weight >= 0){
				var edge_weight_min = measure_info[edge_weight].min //Edge Weight (Min Line thickness)
				var edge_weight_max = measure_info[edge_weight].max //Edge Weight (Max Line thickness)
			}else{
				var edge_weight_min = 1;
				var edge_weight_max = 1;
			}
			var edge_color = measure_info.findIndex(x => x.measure=="q_edge_color"); //Edge Color or Colormix
		
			//Setup default options
			var oNodeColor = layout.props.q_defaultnodecolor || '#999999';
			var oNodeInitMin = layout.props.q_init_node_min > 0 ? layout.props.q_init_node_min : 8;
			var oNodeInitMax = layout.props.q_init_node_max > 0 ? layout.props.q_init_node_max : 18;
			var oEdgeColor = layout.props.q_defaultedgecolor || '#999999';
			var oForceStrength = !layout.props.q_force_strength == 0 ? layout.props.q_force_strength : -300;
			var oForceDistMax = !layout.props.q_force_distanceMax== 0 ? layout.props.q_force_distanceMax : 500;
			var oAlphaDecay = layout.props.q_alphadecay || 0.05;
			var oLabelSize = layout.props.q_defaultlabelsize || 10;
			var oLabelColor = layout.props.q_defaultlabelcolor || '#333333';
			var oLabelFont = layout.props.q_defaultlabelfont || "Arial";
			var oLabelThreshold = layout.props.q_defaultlabelthreshold || 0;
			var oMaxLineWidth = layout.props.q_maxlinewidth || 10;
			var oMinLineWidth = layout.props.q_minlinewidth || 2;
			var curTransK = 0; //current zoom scale level

			//Setup Menu Options
			var oDegree = layout.props.q_showdegree || false;
			var oBetweenness = layout.props.q_showbetweenness || false;
			var oEigenvector =  layout.props.q_showeigenvector || false;
			var oMenuX = layout.props.q_menu_x || "center";
			var oMenuY = function(){ return layout.props.q_menu_y == "top" ? 0 : height};
			var oNodeWarning = layout.props.q_node_warn;
			var oCentralityRadio = [];
		
			if (oDegree || oBetweenness || oEigenvector){
				oCentralityRadio = ["None"];
				oDegree ? oCentralityRadio.push('Degree') : '';
				oBetweenness ? oCentralityRadio.push('Betweenness') : '';
				oEigenvector ? oCentralityRadio.push('Eigenvector') : '';
			};
			
			
			

			function scaleWidth(value) { 
				return ( value - edge_weight_min ) * ( oMaxLineWidth - oMinLineWidth ) / ( edge_weight_max - edge_weight_min ) + oMinLineWidth;
			}
			
			var edges = [];

			for (let x of qMatrix){
				var e_w = scaleWidth(edge_weight >= 0 ? x[edge_weight+2].qNum : 2);//Add 2 as there are 2 dimensions objects before the measures, else default to edge weight of 1.
				var w = e_w == 0 ? 2 : e_w; 
				var c = edge_color >= 0 ? x[edge_color+2].qText : oEdgeColor;
				edges.push([x[node_a].qText,x[node_b].qText,{"weight":w,"color":c}])
			};
			
			var G = new jsnx.Graph();
			
			G.addEdgesFrom(edges); //Nodes auto created from edge table
			
			var gDegree = oDegree ? jsnx.degree(G) : ''; //Calcualtes number of neighbor nodes for each node
			var nodeCount = G.adj.size
			var gBetweenness = oBetweenness ? jsnx.betweennessCentrality(G) : ''; //Calculate betweenness score for each node
			
			if (nodeCount > 7 && oEigenvector){	
				var gEigenvector = jsnx.eigenvectorCentrality(G); //Calculate eigenvector score for each node
			}else{
				oEigenvector = false;
			};
			
			//var gCloseness = jsnx.allPairsShortestPathLength(G); not supported yet!
			
			menuSetup();
		    
			function menuSetup(){
				$('#'+menuRadio+' div').empty();
				if (oMenuY() == 0){var h = 0}else{var h = oMenuY() - $('#'+menuRadio).height()-10};
				$('#'+menuGroup).css({'top':h})
				$('#'+menuRadio).attr('align',oMenuX)
				
				if (oNodeWarning > 0 && nodeCount > oNodeWarning){ //Setup manual refresh for data load, avoid timeout on large datasets
					$('#'+menuRadio+' div').append('<button type="button" id="'+btnRefresh+'" class="btn btn-xs btn-default">Many Nodes: Load?</button>')
					$('#'+btnRefresh).on("click",function(){
						preStaging();
					})
				}else{
					try{
					preStaging();
					}catch(e){
						console.log(e);
					}
				};
			}
			

			function preStaging(){//Create data array of nodes with names and colors
				var gNodes = []; //used to store individual node attributes e.g. name and color
				var node_dict = {};
				for (let x of qMatrix){
					//check for existing node_a in array
					buildNodeObj(node_b);//Check and build on Node A
					buildNodeObj(node_a);//Check and build on Node B
					function buildNodeObj(n){
						if (node_dict[x[n].qText] === undefined){ //add if not exist
							//Bugfix save qElemNumber for both A and B to ensure lasso functionality works correctly
							var nodeObj= {
								nodeID: x[n].qText,
								degree: oDegree ? gDegree._stringValues[x[n].qText] : 1,
								betweenness: oBetweenness ? gBetweenness._stringValues[x[n].qText]+0.1 : 1,
								eigenvector: oEigenvector ? gEigenvector._stringValues[x[n].qText]+0.1 : 1
							};
							
							//Node Name
							if (x[n].qAttrExps.qValues[0].hasOwnProperty('qText')) { 
								nodeObj.name = x[n].qAttrExps.qValues[0].qText; //Set node name if exist
							}else{
								nodeObj.name = x[n].qText;//default name is id
							};

							//Node Description
							if (x[n].qAttrExps.qValues[1].hasOwnProperty('qText')) { 
								nodeObj.desc = x[n].qAttrExps.qValues[1].qText; //Set node name if exist
							}else{
								nodeObj.desc = '';//default description is blank
							};

							//Node Color
							if (x[n].qAttrExps.qValues[2].hasOwnProperty('qText')) { 	
								nodeObj.color = x[n].qAttrExps.qValues[2].qText; //Set to node color if exist
							}else{
								nodeObj.color = oNodeColor; //default color
							};

							//Node qElemNumber Assignement
							n == 0 ? nodeObj.nodeqElemNumber0 = x[n].qElemNumber : nodeObj.nodeqElemNumber1 = x[n].qElemNumber
							
							gNodes.push(nodeObj); //add new node
							node_dict[x[n].qText] = oDegree ? gDegree._stringValues[x[n].qText] : 1; //save to dictionary
						}else{ //Node already exists
							//Node qElemNumber Assignment #2, used when Node already exists, need to assign qElemNumber for second occurance
							//On render the code will favour nodes on sideA rather than sideB
							var gNIndex = gNodes.findIndex(y => y.nodeID == x[n].qText); 
							if (n == 0){
								gNodes[gNIndex].nodeqElemNumber0 = x[n].qElemNumber; //Overwrite with SideA
								x[n].qAttrExps.qValues[0].hasOwnProperty('qText') ? gNodes[gNIndex].name = x[n].qAttrExps.qValues[0].qText : gNodes[gNIndex].name = x[n].qText;
								x[n].qAttrExps.qValues[1].hasOwnProperty('qText') ? gNodes[gNIndex].desc = x[n].qAttrExps.qValues[1].qText : gNodes[gNIndex].desc = '';
								x[n].qAttrExps.qValues[2].hasOwnProperty('qText') ? gNodes[gNIndex].color = x[n].qAttrExps.qValues[2].qText : gNodes[gNIndex].color = oNodeColor;
							};
						}
						
						//#1 Special function to handle Exclusive and Non-Exclusive Sets
						//Exclusive Set is a set of nodes where node '1' is either in NodeA or NodeB but not both.
						//Non-Exclusive Set is a set of nodes where node '1' is either in NodeA or NodeB or both.

						
					};
				};
			
				//Create object array suitable for D3 processing - edges
				var gEdges = []
				for (let x of edges){ //edges is array
					var o = {
						source: x[0],
						target: x[1],
						weight: x[2].weight,
						color: x[2].color
					};
					gEdges.push(o)
				};
				
				

				var graph = {
					links: gEdges,
					nodes: gNodes
				};
				
				//The Main NetworkX and D3 Code
				var svg = d3.select("#" + chartID).append("svg")
            		.attr("width",width)
            		.attr("height",height);
			
				var color = d3.scaleOrdinal(d3.schemeCategory20);
				
				var simulation = d3.forceSimulation().alphaDecay(oAlphaDecay)
					.force("link", d3.forceLink().id(function(d) { return d.nodeID; })) //forceLink()) //Or to use names rather than indices: .id(function(d) { return d.id; }))
					.force("charge", d3.forceManyBody().strength([oForceStrength]).distanceMax([oForceDistMax]))
					.force("center", d3.forceCenter(width / 2, height / 2));
				
				svg.selectAll("*").remove();
				var container = svg.append('g')

				// Call zoom for svg container.
				svg.call(d3.zoom().on('zoom', zoomed));

				// Create a rectangle in the background for lassoing
				var bg = container.append('rect')
					.attr('class','lassoable')
					.attr('x',0)
					.attr('y',0)
					.attr('width',width)
					.attr('height',height)
					.attr('opacity',0.0);

				// Toggle for ego networks on click (below).
				var toggle = 0;				
		
				// Make object of all neighboring nodes.
				var linkedByIndex = {};
					graph.links.forEach(function(d) {
					linkedByIndex[d.source + ',' + d.target] = 1;
					linkedByIndex[d.target + ',' + d.source] = 1;
				});

				// A function to test if two nodes are neighboring.
				function neighboring(a, b) {
					return a.nodeID == b.nodeID ? true : linkedByIndex[a.nodeID + ',' + b.nodeID];
				}

				var nodeSize = nodeSizing(null);
					forceSim(nodeSize,null);
				
				var link = container.append("g")
					.attr("class", "links")
					.selectAll("line")
					.data(graph.links, function(d) { return d.source + ", " + d.target;})
					.enter().append("line")
					.attr('class', 'link')
					.style('stroke-width', function(d) { return d.weight;})
					.style('stroke-linejoin',"bevel")
					.style('opacity',0.4)
					.style('stroke', function(d) { return d.color;});
					

				var node = container.append('g')
					.attr("class", "nodes")
					.selectAll('g')
					.data(graph.nodes)
					.enter().append('g')
				
				var circles = node.append("circle")
					// Calculate degree centrality within JavaScript
					// Use degree centrality from NetworkX in json.
					.attr('r', function(d, i) { return nodeSize(d.degree); })
					.attr('class', 'lassoable')
					.attr("fill", function(d) { return d.color;})// Color by measure or dimension.
					.on('click', function(d, i) {// On click, toggle ego networks for the selected node.
						toggleNodeSelect(d,i);
					})
					.call(d3.drag()
						.on("start", dragstarted)
						.on("drag", dragged)
						.on("end", dragended));
				
				if(oLabelThreshold > -1){ //-1 = never show label
					var labels = node.append("text")
						.text(function(d) { return d.name;})
						.attr("dy",".35em")
						.attr("text-anchor", "middle")
						.style("font-size", oLabelSize)
						.style("font-family", oLabelFont)
						.style("fill", oLabelColor)
						.style("opacity", function(){
							return oLabelThreshold==0 ? 1 : 0 // 0 = always show >0 = show on zoom in scale value
						})
						.on("click", function(d,i){
							toggleNodeSelect(d,i);
						})
						.call(d3.drag()
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended));

				};
				
				function toggleNodeSelect(d,i){//create common function, works if selecting on node or label
					if (toggle == 0) {
						// Ternary operator restyles links and nodes if they are adjacent.
						d3.selectAll('line').style('stroke-opacity', function (l) {
							return l.target == d || l.source == d ? 1 : 0.1;
						});
						d3.selectAll('line').style('stroke-width',function(d) { return d.weight;});
						d3.selectAll('circle').style('opacity', function (n) {
							return neighboring(d, n) ? 1 : 0.1;
						});
						toggle = 1;
					}
					else {
						// Restore nodes and links to normal opacity.
						d3.selectAll('line').style('stroke-opacity', '0.6').style('stroke-width',function(d) { return d.weight;});
						d3.selectAll('circle').style('opacity', '1');
						toggle = 0;
					}

				}

				node.append("title") //Add Description to Tooltip
					.text(function(d) { return d.desc; })						

				simulation
					.nodes(graph.nodes)
					.on("tick", ticked);

				simulation.force("link")
					.links(graph.links);

				function ticked() {
					link
						.attr("x1", function(d) { return d.source.x; })
						.attr("y1", function(d) { return d.source.y; })
						.attr("x2", function(d) { return d.target.x; })
						.attr("y2", function(d) { return d.target.y; });

					node
						.attr("transform", function(d) {
							return "translate(" + d.x + "," + d.y + ")";
						})
				}
				
				function nodeSizing(cent){//Dynamically assign node size (radius)
					//Setup variable minimum node sizing, otherwize small graphs can loop small and sparse!
					var nodeCountCutoff = 1000
					var rangeCalc = oNodeInitMax - oNodeInitMax*(nodeCount / nodeCountCutoff)
					var rMin = rangeCalc < oNodeInitMin ? oNodeInitMin : rangeCalc

					var centralitySize = d3.scaleLinear()
						.domain([d3.min(graph.nodes, function(d) { return d[cent] || 10; }), d3.max(graph.nodes, function(d) { return d[cent] || 10; })])
						.range([rMin,30]);
					return centralitySize;
				}

				function forceSim(ns,cent){// Recalculate collision detection based on selected centrality.
					simulation.force("collide", d3.forceCollide().radius( function (d) { return ns(d[cent] || 10); }));
				}

				//Menu customisations dependent on extension property options
				$('#'+menuRadio+' .btn-opt').remove();
				oCentralityRadio.length > 0 ? $('#'+menuRadio).append('<div id="'+radioGrp+'" class="radio-group"></div>') : ''
				for (var i=0;i<oCentralityRadio.length;i++){//Build menu items based on options
					$('#'+radioGrp).append('<input type="radio" class="btn-opt" name="'+selector+'" id="' + oCentralityRadio[i] + '">');
					$('#'+radioGrp).append('<label class="btn-opt" for="' + oCentralityRadio[i] + '">' + oCentralityRadio[i] + '</label>');
				};

				$("input:radio[name="+selector+"]:first").attr('checked', true);//Make first option appear selected
				$('#'+radioGrp+' input[type=radio]').on("click", function(){//Button control logic
					var cent = $(this).attr("id").toLowerCase();
					var nodeSize = nodeSizing(cent)
					d3.selectAll('circle')
						.attr('r', function(d) { return nodeSize(d[cent]); } );//Resize nodes
					forceSim(nodeSize,cent);//Recalculate simulation
					simulation.restart();
				});

				
				$('#'+actionGrp).append('<input type="radio" class="btn-opt" name="'+action+'" id="Pan">');
				$('#'+actionGrp).append('<label class="btn-opt" for="Pan">Pan</label>');
				$('#'+actionGrp).append('<input type="radio" class="btn-opt" name="'+action+'" id="Lasso">');
				$('#'+actionGrp).append('<label class="btn-opt" for="Lasso">Lasso</label>');
				$("input:radio[name="+action+"]:first").attr('checked', true);//Make first option appear selected

				$('#'+actionGrp+' input[type=radio]').on("click", function(){ //Button control logic
					$(this).attr('id') == "Pan" ? svg.call(d3.zoom().on('zoom', zoomed)) : enableLasso();
				});
					
				//Menu Customisation End
			
				function dragstarted(d) {
					if (!d3.event.active) simulation.alphaTarget(0.3).restart();
					d.fx = d.x;
					d.fy = d.y;
				}

				function dragged(d) {
				d.fx = d3.event.x;
				d.fy = d3.event.y;
				}

				function dragended(d) {
				if (!d3.event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
				}

				// Zooming function translates the size of the svg container.
				function zoomed() {
					container.attr("transform", "translate(" + d3.event.transform.x + ", " + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
					curTransK = d3.event.transform.k; //Set current zoom scale level
					//Check for scale threshold and apply if required
					curTransK >= oLabelThreshold ? d3.selectAll('text').style('opacity', 1) : d3.selectAll('text').style("opacity", 0)
				}
			
				function enableLasso(){
					try{

					var lasso2 = d3l.d3lasso(svg._groups)
							.closePathDistance(75) // max distance for the lasso loop to be closed
							.closePathSelect(true) // can items be selected by closing the path?
							.hoverSelect(false) // can items by selected by hovering over them?
							.area(svg.selectAll('.lassoable')) // a lasso can be drawn on the bg rectangle and any of the circles on top of it
							.items(circles) // the circles will be evaluated for lassoing
							.scale(d3.zoomTransform(svg.node())) //the current pan zoom transform state
							.on("start",lasso_start) // lasso start function
							.on("draw",lasso_draw) // lasso draw function
							.on("end",lasso_end); // lasso end function
					}catch(e){
						console.log(e);
					}
					svg.call(d3.zoom().on('zoom', null));
					svg.call(lasso2);

					function lasso_start() {
						lasso2.items()
						.classed("not-possible",true); // style as not possible
					}
					
					function lasso_draw() {
						
						// Style the possible dots
						var selected = container.selectAll('circle').filter(function(d) {return d.possible===true});
						if (selected._groups[0].length > 0) { 
							selected.classed("not-possible", false);
							selected.classed("possible", true);
						}; 
			
						// Style the not possible dot
						var selected = container.selectAll('circle').filter(function(d) {return d.possible===false});
						if (selected._groups[0].length > 0) { 
							selected.classed("not-possible", true);
							selected.classed("possible", false);
						};
						
					}
					
					function lasso_end() {
						
						// Get all the lasso items that were "selected" by the user
						var selectedItems = lasso2.items()
							.filter(function(d) { return d.selected;});
						
						// Retrieve the dimension element numbers for the selected items
						var elemNosA = [];
						var elemNosB = [];
						
						selectedItems.nodes()
							.forEach(function(d) {
								d.__data__.hasOwnProperty('nodeqElemNumber0') ? elemNosA.push(d.__data__.nodeqElemNumber0) : elemNosB.push(d.__data__.nodeqElemNumber1)
							});
						
						// Filter these dimension values
						self.backendApi.selectValues(0,elemNosA,false); //return NodeA selections
						self.backendApi.selectValues(1,elemNosB,true); //return NodeB selections
				
					}	
				}//End of Lasso

			};//end of preStaging
		} //End Paint
	};//End of Return
});//End of Define
