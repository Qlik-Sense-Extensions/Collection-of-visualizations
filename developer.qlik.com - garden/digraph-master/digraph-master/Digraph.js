/*globals define*/
define( ["qlik", "jquery", "./viz", "./full_render" ], function ( qlik, $, Viz, renderObj) { // renderObj -> {Module, render}
	//'use strict';
	
	//append the syle sheet to the head
	//$("<style>").html(cssContent).appendTo("head");

	
	return {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 50
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 2
				},
				measures: {
					uses: "measures",
					min: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings",
					items: {
						settingPanel: {
							type: "items",
							label: "GraphViz Settings",
							items: {
								setting1: {
									type: "string",
									label: "Render Engine",
									component: "dropdown",
									ref: "myproperties.setting1",
									defaultValue: "dot",
									options: [ 
										{value: "dot", label: "dot"},
										{value: "circo", label: "circo"},
										{value: "fdp", label: "fdp"},
										{value: "neato", label: "neato"},
										{value: "osage", label: "osage"},
										{value: "twopi", label: "twopi"}								
									]
								}									
							}
						}
					}
				}
			}
		},
		snapshot: {
			canTakeSnapshot: false
		},
		paint: function ( $element, layout ) {					
			var renderEngine = layout.myproperties.setting1; // custom variables which hold the custom properties			
			var	hypercube = layout.qHyperCube;
			var	rowcount = hypercube.qDataPages[0].qMatrix.length;
			var app = qlik.currApp();	// handler for selections										

			var graph = 'digraph {'; // dot notation start
			
			// create edges in DOT notation:   from_dimension -> to_dimension [label="measurement"]; 
			for (var i = 0; i < rowcount; i++) {
				// get the row of the hypercube
				var edge = "\"" + hypercube.qDataPages[0].qMatrix[i][0].qText + "\" -> \"" + hypercube.qDataPages[0].qMatrix[i][1].qText + "\"" + " \[label=\" " + hypercube.qDataPages[0].qMatrix[i][2].qText + "\"];";
				// console.log(edge);		
				graph += edge;	// add edge to graph						
			}

			graph += "}"; // dot notation end								


			// ################### idea: extended DOT syntax via additional measurements to modify edges/nodes?     ##################################
			// test data in DOT notation, colored edges			
			// var testGraph = "digraph G { a -> b; a -> c; c -> d; d -> a [label=\"edge\", color=red, style=dotted]; } ";	
			// processes graph with subgraphs
			// var testGraph = "digraph G { subgraph cluster_0 {style=filled;color=lightgrey;node [style=filled,color=white]; a0 -> a1 -> a2 -> a3;label = \"process #1\";} subgraph cluster_1 {node [style=filled];b0 -> b1 -> b2 -> b3;label = \"process #2\";color=blue} start -> a0;start -> b0;a1 -> b3;b2 -> a3;a3 -> a0;a3 -> end;b3 -> end;start [shape=Mdiamond];end [shape=Msquare];}";
			//
			// graph = testGraph;
			//
			// #######################################################################################################################################

			
	
			// create Viz object
			var viz = new Viz(renderObj);
		  
			// graph layout, look&feel
			// see: https://github.com/mdaines/viz.js/wiki/API  and  https://www.graphviz.org/ 
			var renderOptions = {
				engine : renderEngine, // "circo", "dot", "fdp", "neato", "osage", "twopi"
				format : "svg" // "svg", "dot", "xdot", "plain", "plain-ext", "ps", "ps2", "json", "json0"
			};

			/*
			dot - "hierarchical" or layered drawings of directed graphs. This is the default tool to use if edges have directionality.
			neato - "spring model'' layouts.  This is the default tool to use if the graph is not too large (about 100 nodes) and you don't know anything else about it. Neato attempts to minimize a global energy function, which is equivalent to statistical multi-dimensional scaling.
			fdp - "spring model'' layouts similar to those of neato, but does this by reducing forces rather than working with energy.
			osage - ?
			twopi - radial layouts, after Graham Wills 97. Nodes are placed on concentric circles depending their distance from a given root node.
			circo - circular layout, after Six and Tollis 99, Kauffman and Wiese 02. This is suitable for certain diagrams of multiple cyclic structures, such as certain telecommunications networks
			*/

			// create SVG output
			viz.renderSVGElement(graph, renderOptions)
			//viz.renderImageElement(graph)
			.then(function(element) {			  	
				// paint resulting svg into html				
				$element.html(element);	

				// wrap svg in bounding div to create scrollbars, if neccessary
				$("svg").wrap("<div id='SVGcontainer' style='overflow:auto;overflow:scroll;height:100%;width:100%'></div>");	
			})
			.catch(error => {
			  // Create a new Viz instance (@see Caveats page for more info)
			  viz = new Viz();
		  
			  // Possibly display the error
			  console.error(error);
			});
					

			// wait for DOM
			$( document ).ready(function() {	
				
				// enable selections by clicking on an edge: 2 fields get selected
				$(".edge").bind("click",function(){ 										
					var edgeName = $(this).children('title').text();				
					// console.log(edgeName);
					var nodeFrom = edgeName.substring(0, edgeName.indexOf('-'));
					var nodeTo = edgeName.substring(edgeName.indexOf('>')+1);							
					// select edge in Qlik Sense, i.e. both FROM and TO at the same time		
					app.field( hypercube.qDimensionInfo[0].qGroupFieldDefs[0] ).selectMatch(nodeFrom, true );	
					app.field( hypercube.qDimensionInfo[1].qGroupFieldDefs[0] ).selectMatch(nodeTo, true );									
				});

				// enable selections by clicking on a node: 1 field gets selected
				$(".node").bind("click",function(){ 						
					var nodeName = $(this).children('title').text();					
					// console.log(nodeName);	
					// select a single node in Qlik Sense -> what if node is available in both fields FROM and TO? Which field to select? Probably FROM?
					app.field( hypercube.qDimensionInfo[0].qGroupFieldDefs[0] ).selectMatch(nodeName, true );	
				});
							
			});	
	
			return qlik.Promise.resolve();
		}
	};
} );
