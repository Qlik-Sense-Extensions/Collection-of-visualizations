/**
 Copyright (c) 2014 BrightPoint Consulting, Inc.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */

function radialProgress(parent, width, height, colors, animationTime, showdecimals, showpercentage) {
	
	var colors = colors;
	//console.log(colors);
	
	if(showpercentage) {
		var percentageSymbol = "%";
	}
	else {
		var percentageSymbol ="";
	}
	//console.log(percentageSymbol);
	
    var _data=null,
        _duration= animationTime,
        _selection,
        _margin = {top:0, right:0, bottom:0, left:0},
        __width = width,//300,
        __height = height,//300,
        _diameter = 150,
        _label="",
		_extraLabel="",
        _fontSize=10;


    var _mouseClick;

    var _value= 0,
        _minValue = 0,
        _maxValue = 100;

    var  _currentArc= 0, _currentArc2= 0, _currentArc3= 0, _currentValue=0;

    var _arc = d3.svg.arc()
        .startAngle(0 * (Math.PI/180)); //just radians

    var _arc2 = d3.svg.arc()
        .startAngle(0 * (Math.PI/180))
        .endAngle(0); //just radians

    var _arc3 = d3.svg.arc()
        .startAngle(0 * (Math.PI/180))
        .endAngle(0); //just radians

    _selection=d3.select(parent);


    function component() {

        _selection.each(function (data) {

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            var enter = svg.enter().append("svg").attr("class","radial-svg").append("g");

            measure();

            svg.attr("width", __width)
                .attr("height", __height);


            var background = enter.append("g").attr("class","component")
                .attr("cursor","pointer")
                .on("click",onMouseClick);


            _arc.endAngle(360 * (Math.PI/180))

            background.append("rect")
                .attr("class","background")
                .attr("width", _width)
                .attr("height", _height);

            background.append("path")
                .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
                .attr("d", _arc);

                
            var g = svg.select("g")
                .attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");	

            svg.append("text")
                .attr("class", "dimensionlabel")
                .attr("y",_width/2  + (_fontSize / 1.5))
                .attr("x",_width/2 )
                .text(__height > 100 ? _label : '')
                .style("font-size", function() {
                    return _fontSize / 4 < 10 ? 10 + "px" : _fontSize / 4 +"px"
                })
                .style('text-anchor', 'middle');
				
            svg.append("text")
                .attr("class", "seconddimensionlabel")
                .attr("y",_width/4.2 + (_fontSize / 1.5))
                .attr("x",_width/2 )
                .text(__height > 100 ? _extraLabel : '')
                .style("font-size", function() {
                    return _fontSize / 4 < 10 ? 10 + "px" : _fontSize / 4 +"px"
                })
                .style('text-anchor', 'middle')
				.style('font-weight', 'bold');				

            _arc.endAngle(_currentArc);
            enter.append("g").attr("class", "arcs");
            var path = svg.select(".arcs").selectAll(".arc").data(data);
			
            path.enter().append("path")
                .attr("class","arc")
				.attr("fill", colors[0])
                .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
                .attr("d", _arc);

            //Another path in case we exceed 100%
            var path2 = svg.select(".arcs").selectAll(".arc2").data(data);
            path2.enter().append("path")
                .attr("class","arc2")
				.attr("fill", colors[1])
                .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
                .attr("d", _arc2);

			//Another path in case we exceed 200%
            var path3 = svg.select(".arcs").selectAll(".arc3").data(data);
            path3.enter().append("path")
                .attr("class","arc3")
				.attr("fill", colors[2])
                .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
                .attr("d", _arc3);	

            enter.append("g").attr("class", "labels");
            var label = svg.select(".labels").selectAll(".label").data(data);
            label.enter().append("text")
                .attr("class","label")
                .attr("y",_width/2+_fontSize/3)
                .attr("x",_width/2)
                .attr("cursor","pointer")
                .attr("width",_width)
                // .attr("x",(3*_fontSize/2))
                .text(function (d) {return (_value-_minValue)/(_maxValue-_minValue)*100 + percentageSymbol })
                .style("font-size",_fontSize+"px")
                .on("click",onMouseClick);

				
            path.exit().transition().duration(500).attr("x",1000).remove();

			

            layout(svg);

            function layout(svg) {

                var ratio=(_value-_minValue)/(_maxValue-_minValue);
                var endAngle=Math.min(360*ratio,360);
                endAngle=endAngle * Math.PI/180;

                path.datum(endAngle);
                path.transition().duration(_duration)
                    .attrTween("d", arcTween);

                if (ratio > 1) {
                    path2.datum(Math.min(360*(ratio-1),360) * Math.PI/180);
                    path2.transition().delay(_duration).duration(_duration)
                        .attrTween("d", arcTween2);
                }
				if (ratio > 2) {
					//console.log("over 200%");
					path2.datum(Math.min(360*(ratio-1),360) * Math.PI/180);
                    path2.transition().delay(_duration).duration(_duration)
                        .attrTween("d", arcTween2);
					path3.datum(Math.min(360*(ratio-2),360) * Math.PI/180);
					path3.transition().delay(_duration).duration(_duration)
						.attrTween("d", arcTween3);
				}
                
                label.datum((ratio*100)); //Math.round
                label.transition().duration(_duration)
                    .tween("text",labelTween);
				//console.log(labelTween("54.32"));
            }

        });

        function onMouseClick(d) {
            if (typeof _mouseClick == "function") {
                _mouseClick.call();
            }
        }
    }

    function labelTween(a) {
        var i = d3.interpolate(_currentValue, a);
        _currentValue = i(0);

        return function(t) {
            _currentValue = i(t);
			if(showdecimals) {
				this.textContent = Math.round(i(t)*100)/100 + percentageSymbol; //Show decimals, up to 2
			}
			else {
				this.textContent = Math.round(i(t)) + percentageSymbol; //Don't show decimals
			}
			
        }
    }

    function arcTween(a) {
        var i = d3.interpolate(_currentArc, a);

        return function(t) {
            _currentArc=i(t);
            return _arc.endAngle(i(t))();
        };
    }

    function arcTween2(a) {
        var i = d3.interpolate(_currentArc2, a);

        return function(t) {
            return _arc2.endAngle(i(t))();
        };
    }

    function arcTween3(a) {
        var i = d3.interpolate(_currentArc3, a);

        return function(t) {
            return _arc3.endAngle(i(t))();
        };
    }    


    function measure() {
        _width=_diameter - _margin.right - _margin.left - _margin.top - _margin.bottom;
        _height=_width;
        _fontSize=_width*.2;
        _arc.outerRadius(_width/2);
        _arc.innerRadius(_width/2 * .85);
        _arc2.outerRadius(_width/2 * .85);
        _arc2.innerRadius(_width/2 * .85 - (_width/2 * .15));
        _arc3.outerRadius(_width/2 * .7);
        _arc3.innerRadius(_width/2 * .7 - (_width/2 * .15));		
    }


    component.render = function() {
        measure();
        component();
        return component;
    }

    component.value = function (_) {
        if (!arguments.length) return _value;
        _value = [_];
        _selection.datum([_value]);
        return component;
    }


    component.margin = function(_) {
        if (!arguments.length) return _margin;
        _margin = _;
        return component;
    };

    component.diameter = function(_) {
        if (!arguments.length) return _diameter
        _diameter =  _;
        return component;
    };

    component.minValue = function(_) {
        if (!arguments.length) return _minValue;
        _minValue = _;
        return component;
    };

    component.maxValue = function(_) {
        if (!arguments.length) return _maxValue;
        _maxValue = _;
        return component;
    };

    component.label = function(_) {
        if (!arguments.length) return _label;
        _label = _;
        return component;
    };
	
    component.extraLabel = function(_) {
        if (!arguments.length) return _extraLabel;
        _extraLabel = _;
        return component;
    };	

    component._duration = function(_) {
        if (!arguments.length) return _duration;
        _duration = _;
        return component;
    };

    component.onClick = function (_) {
        if (!arguments.length) return _mouseClick;
        _mouseClick=_;
        return component;
    }

    return component;

}
