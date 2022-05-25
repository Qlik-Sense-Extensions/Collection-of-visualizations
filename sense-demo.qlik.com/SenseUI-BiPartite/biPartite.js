"use strict";
// !function(){
var bP={};
let b, c1, c2, c3, height, buffMargin, minHeight, colors=[], labelLength, me={vars: null}, bpdata;
bP.init = (vars, app) => {
	me = {
		vars: vars
	}
	colors = me.vars.colors
	labelLength = me.vars.labelCharLength
	b=me.vars.chart.b; // Width of the colored rect 
	c1=me.vars.chart.bb; // Label [part1, part2]
	c2=me.vars.chart.c2; // Value (-50,100)
	c3=me.vars.chart.c3; // percent
	height = me.vars.chart.height;
	buffMargin=1; 
	minHeight=14;
	bpdata = {};
}

bP.partData = (data,p) => {
	// console.log(data)
	// var sData= {keys:[],data:[]};
	var sData={};
	var sData2 = data.sort(function sortFunction(a, b) { return ( a[2]>b[2]? -1 : a[2]<b[2] ? 1 : 0)});
	sData2.filter(function(value){
		return value[2]>0;
	})
	var sData3 = sData2.sort(function sortFunction(a, b) { return ( a[2]>b[2]? -1 : a[2]<b[2] ? 1 : 0)});

	// for (var i=0; i<data.length; i++) {
	// 	sData.keys.push([data[0],data[1]])
	// }

	sData.keys=[
		d3.set(sData2.map(function(d){ return d[0];	})).values(),
		d3.set(sData2.map(function(d){ return d[1]; })).values()
	];

	sData.data = [	
		sData.keys[0].map( function(d){ return sData.keys[1].map( function(v){ return 0; }); }),
		sData.keys[1].map( function(d){ return sData.keys[0].map( function(v){ return 0; }); }) 
	];

	data.forEach(function(d){ 
		sData.data[0][sData.keys[0].indexOf(d[0])][sData.keys[1].indexOf(d[1])]=d[p];
		sData.data[1][sData.keys[1].indexOf(d[1])][sData.keys[0].indexOf(d[0])]=d[p]; 
	});
	// console.log(sData)
	return sData;
}

function visualize(data){
	var vis ={};
	function calculatePosition(a, s, e, b, m){
		var total=d3.sum(a);
		var sum=0, neededHeight=0, leftoverHeight= e-s-2*b*a.length;
		var ret =[];
		
		a.forEach(
			function(d){ 
				var v={};
				v.percent = (total == 0 ? 0 : d/total); 
				v.value=d;
				v.height=Math.max(v.percent*(e-s-2*b*a.length), m);
				(v.height==m ? leftoverHeight-=m : neededHeight+=v.height );
				ret.push(v);
			}
		);
		
		var scaleFact=leftoverHeight/Math.max(neededHeight,1), sum=0;
		
		ret.forEach(
			function(d){ 
				d.percent = scaleFact*d.percent; 
				d.height=(d.height==m? m : d.height*scaleFact);
				d.middle=sum+b+d.height/2;
				d.y=s + d.middle - d.percent*(e-s-2*b*a.length)/2;
				d.h= d.percent*(e-s-2*b*a.length);
				d.percent = (total == 0 ? 0 : d.value/total);
				sum+=2*b+d.height;
			}
		);
		return ret;
	}

	vis.mainBars = [ 
		calculatePosition( data.data[0].map(function(d){ return d3.sum(d);}), 0, height, buffMargin, minHeight),
		calculatePosition( data.data[1].map(function(d){ return d3.sum(d);}), 0, height, buffMargin, minHeight)
	];
	
	vis.subBars = [[],[]];
	vis.mainBars.forEach(function(pos,p){
		pos.forEach(function(bar, i){	
			calculatePosition(data.data[p][i], bar.y, bar.y+bar.h, 0, 0).forEach(function(sBar,j){ 
				sBar.key1=(p==0 ? i : j); 
				sBar.key2=(p==0 ? j : i); 
				vis.subBars[p].push(sBar); 
			});
		});
	});
	vis.subBars.forEach(function(sBar){
		sBar.sort(function(a,b){ 
			return (a.key1 < b.key1 ? -1 : a.key1 > b.key1 ? 
					1 : a.key2 < b.key2 ? -1 : a.key2 > b.key2 ? 1: 0 )});
	});
	
	vis.edges = vis.subBars[0].map(function(p,i){
		return {
			key1: p.key1,
			key2: p.key2,
			y1:p.y,
			y2:vis.subBars[1][i].y,
			h1:p.h,
			h2:vis.subBars[1][i].h
		};
	});
	vis.keys=data.keys;
	bpdata=vis;
	return vis;
}

function arcTween(a) {
	var i = d3.interpolate(this._current, a);
	this._current = i(0);
	return function(t) {
		return edgePolygon(i(t));
	};
}

function drawPart(data, id, p, callback){
	d3.select("#"+id).append("g").attr("class","part"+p)
		.attr("transform","translate("+( p*(me.vars.chart.bb+me.vars.chart.b))+",0)");
	d3.select("#"+id).select(".part"+p).append("g").attr("class","subbars");
	d3.select("#"+id).select(".part"+p).append("g").attr("class","mainbars");
	
	var mainbar = d3.select("#"+id).select(".part"+p).select(".mainbars")
		.selectAll(".mainbar").data(data.mainBars[p])
		.enter().append("g").attr("class","mainbar");

	mainbar.append("rect").attr("class","mainrect")
		.attr("x", 0).attr("y",function(d){ return d.middle-d.height/2; })
		.attr("width",b)
		.attr("height",function(d){ return d.height; })
		.style("shape-rendering","auto")
		.style("fill-opacity",0).style("stroke-width","0.5")
		.style("stroke","black").style("stroke-opacity",0);

	mainbar.append("text").attr("class","barlabel")
		.attr("x", me.vars.chart.c1[p]).attr("y",function(d){ return d.middle+5;})
		.text(function(d,i){ 
			var display = data.keys[p][i];
			if (data.keys[p][i].length>labelLength) {
				display = data.keys[p][i].substr(0, labelLength)
				display += '...'
			}
			return display;
		})
		.attr("text-anchor","start" );
	
	if (me.vars.chart.display.value) {
		mainbar.append("text").attr("class","barvalue")
			.attr("x", me.vars.chart.c2[p]).attr("y",function(d){ return d.middle+5;})
			.text(function(d,i){ 
				// Round Numbers
				var display = d.value.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
				if (me.vars.roundMeasureNum) {
					display = Math.round(d.value);
					if (d.value > 1000 && d.value<1000000) {
						display = Math.round(d.value/1000) + 'K'
					} else if (d.value > 1000000) {
						display = Math.round(d.value/1000000) + 'M'
					}
				}
				return  display;
			})
			.attr("text-anchor","end");
	}
		
	if (me.vars.chart.display.percent) {
		mainbar.append("text").attr("class","barpercent")
			.attr("x", me.vars.chart.c3[p]).attr("y",function(d){ return d.middle+5;})
			.text(function(d,i){ return "("+Math.round(100*d.percent)+"%)" ;})
			.attr("text-anchor","end").style("fill","grey");
	}

	d3.select("#"+id).select(".part"+p).select(".subbars")
		.selectAll(".subbar").data(data.subBars[p]).enter()
		.append("rect").attr("class","subbar")
		.attr("x", 0).attr("y",function(d){ return d.y})
		.attr("width",b)
		.attr("height",function(d){ return d.h})
		.style("fill",function(d){
			return colors[d.key1];
		});

	callback(true);
}

function drawEdges(data, id){
	d3.select("#"+id).append("g").attr("class","edges").attr("transform","translate("+ b+",0)");

	d3.select("#"+id).select(".edges").selectAll(".edge")
		.data(data.edges).enter().append("polygon").attr("class","edge")
		.attr("points", edgePolygon).style("fill",function(d){ return colors[d.key1]; })
		.style("opacity",0.5).each(function(d) { this._current = d; });	
}	

function drawHeader(header, id){
	[0,1].forEach(function(d){
		var h = d3.select("#"+id).select(".part"+d).append("g").attr("class","header");
		
		h.append("text").text(header[d][0]).attr("x", (me.vars.chart.c1[d]))
			.attr("y", -5).style("fill","grey");

		if (me.vars.chart.display.percent) {
			h.append("text").text(header[d][1]).attr("x", (me.vars.chart.c3[d]-36))
				.attr("y", -5).style("fill","grey");
		}
		
		h.append("line").attr("x1",me.vars.chart.c1[d]).attr("y1", -2)
			.attr("x2",me.vars.chart.c3[d]).attr("y2", -2).style("stroke","black")
			.style("stroke-width","1").style("shape-rendering","crispEdges");
	});
}

function edgePolygon(d){
	return [0, d.y1, me.vars.chart.bb, d.y2, me.vars.chart.bb, d.y2+d.h2, 0, d.y1+d.h1].join(" ");
}	

function transitionPart(data, id, p){
	var mainbar = d3.select("#"+id).select(".part"+p).select(".mainbars")
		.selectAll(".mainbar").data(data.mainBars[p]);
	
	mainbar.select(".mainrect").transition().duration(500)
		.attr("y",function(d){ return d.middle-d.height/2;})
		.attr("height",function(d){ return d.height;});
		
	mainbar.select(".barlabel").transition().duration(500)
		.attr("y",function(d){ return d.middle+5;});
		
	mainbar.select(".barvalue").transition().duration(500)
		.attr("y",function(d){ return d.middle+5;})
		// .text(function(d,i){ return d.value ;});
		.text(function(d,i){ 
			// Round Numbers
			// var display = d.value.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
			var display = Math.round(d.value);
			if (d.value > 1000 && d.value<1000000) {
				display = Math.round(d.value/1000) + 'K'
			} else if (d.value > 1000000) {
				display = Math.round(d.value/1000000) + 'M'
			}
			return display;
		})
		
	mainbar.select(".barpercent").transition().duration(500)
		.attr("y",function(d){ return d.middle+5;})
		.text(function(d,i){ return "( "+Math.round(100*d.percent)+"%)" ;});
		
	d3.select("#"+id).select(".part"+p).select(".subbars")
		.selectAll(".subbar").data(data.subBars[p])
		.transition().duration(500)
		.attr("y",function(d){ return d.y}).attr("height",function(d){ return d.h});

}

function transitionEdges(data, id){
	d3.select("#"+id).append("g").attr("class","edges")
		.attr("transform","translate("+ b+",0)");

	d3.select("#"+id).select(".edges").selectAll(".edge").data(data.edges)
		.transition().duration(500)
		.attrTween("points", arcTween)
		.style("opacity",function(d){ return (d.h1 ==0 || d.h2 == 0 ? 0 : 0.5);});	
}

function transition(data, id){
	transitionPart(data, id, 0);
	transitionPart(data, id, 1);
	transitionEdges(data, id);
}

bP.draw = function(data, svg){
	data.forEach(function(biP,s){
		// console.log(biP)
		// console.log($(biP).length)
		// if(!me.vars.isCreated){
			svg.append("g")
				.attr("id", biP.id)
				.attr("transform","translate("+ (550*s)+",0)");
		// }
			
		var visData = visualize(biP.data);
		drawPart(visData, biP.id, 0, function(){
			drawPart(visData, biP.id, 1, function(){
				drawEdges(visData, biP.id);
				drawHeader(biP.header, biP.id);

				[0,1].forEach(function(p){	
					if (data[0].data.data[p].length>1) {		
						d3.select("#"+biP.id)
							.select(".part"+p)
							.select(".mainbars")
							.selectAll(".mainbar")
							.on("mouseover",function(d, i){ return bP.selectSegment(data, p, i); })
							.on("mouseout",function(d, i){ return bP.deSelectSegment(data, p, i); })
							// .on("click",function(d, i){ return bP.selectSegmentQ(data, p, i); })
					}
				});
			}); 
		});
	});
}

bP.redraw = function(data, svg){
	// console.log(1)
}

bP.selectSegmentQ = function(data, p, element){
	// app.vars.keySelected[p] = key;
	var type = (p==0) ? 'Origin' : 'Destination'; 
	var value = $(element).find('text').first().text();
	vars.this.backendApi.selectValues(0, [d.qElemNumber], false);
	bP.selectSegment(data, p, element);
};


bP.selectSegment = function(data, m, s){
	data.forEach(function(k){
		var newdata =  {keys:[], data:[]};	
			
		newdata.keys = k.data.keys.map( function(d){ return d;});
		
		newdata.data[m] = k.data.data[m].map( function(d){ return d;});
		
		newdata.data[1-m] = k.data.data[1-m]
			.map( function(v){ return v.map(function(d, i){ return (s==i ? d : 0);}); });
		
		transition(visualize(newdata), k.id);
			
		var selectedBar = d3.select("#"+k.id).select(".part"+m).select(".mainbars")
			.selectAll(".mainbar").filter(function(d,i){ return (i==s);});
		
		selectedBar.select(".mainrect").style("stroke-opacity",1);			
	});
}	

bP.deSelectSegment = function(data, m, s){
	data.forEach(function(k){
		transition(visualize(k.data), k.id);
		
		var selectedBar = d3.select("#"+k.id).select(".part"+m).select(".mainbars")
			.selectAll(".mainbar").filter(function(d,i){ return (i==s);});
		
		selectedBar.select(".mainrect").style("stroke-opacity",0);			
	});		
}

this.bP = bP;
// }();
