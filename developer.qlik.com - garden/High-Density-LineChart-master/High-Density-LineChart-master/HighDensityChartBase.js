define(["qlik", "./lib/plotly-2.8.3.min", "./locale/plotly-locale-it"   //20201201 cvh 3: including italy locations
], function (qlik, Plotly, localeIt) {
    'use strict';
   
    return {



        createPlot: async function ($element, layout, _self, TESTER, chartType) {

            try {

                var lastrow = {};
                lastrow.row = 0;
                var id = layout.qInfo.qId;
               

                var app = qlik.currApp(_self);

                var qTheme = await this.getTheme(app);
                var colcount = layout.qHyperCube.qDimensionInfo.length + layout.qHyperCube.qMeasureInfo.length;

                this.addtoArray(_self, lastrow);
                await this.getMoreData(_self, lastrow, layout, colcount);

               
                await this.createPlotlyPlot($element, layout, _self, qTheme, TESTER, chartType);

               

            }
            catch (err) {
                console.info(err);
            }

        },

        createPlotlyPlot: function ($element, layout, _self, qTheme, TESTER, chartType) {

            return new Promise(resolve => {
               
                var id = layout.qInfo.qId,
                   
                    hypercube = layout.qHyperCube,
                    
                    rowcount = hypercube.qDataPages[0].qMatrix.length,
                    colcount = hypercube.qDimensionInfo.length + hypercube.qMeasureInfo.length,
                    dimcount = hypercube.qDimensionInfo.length,
                    meacount = hypercube.qMeasureInfo.length,

                    dimTitle = hypercube.qDimensionInfo[0].qFallbackTitle;
    
                var X = [],
                    Y = [];

               
                var tooltipData = [];

                let tracesMap;
                if (chartType=="scatter") {
                    tracesMap = getAndFillTracesMapScatter(qTheme);
                } else {
                    tracesMap = getAndFillTracesMapLineChart(qTheme);
                }
                    

               
                //20201201 cvh 2: end

                //20201201 cvh 4: adding custom tooltip
                //------ Below code works from Sep 2020 onwards (not for Feb 2020, don't know realeases bwtween Feb and Sep 2020)
                /*var tooltipLables = "";
                hypercube.qDimensionInfo[0].qAttrExprInfo.forEach(function (callback, key) {
                        
                    //TooltipLables
                    tooltipLables += '<br><b>' + callback.qFallbackTitle + ':</b> %{customdata['+ key + ']}';
                    
                });

                //------- Below code works for Feb 2020
                var tooltipLables = "";
                var tooltipLabelsArray = [];
                var i = 0;
                */

                var tooltipLablesTop = "";
                var tooltipLablesBottom = "";

                if (!layout.tooltip.auto) {

                    hypercube.qDimensionInfo[0].qAttrExprInfo.forEach(function (tooltip, index) {

                        //TooltipLables
                        if ((tooltip.id == "customTooltipTitle" || tooltip.id == "customTooltipDescription") && tooltip.qFallbackTitle != null) {
                            tooltipLablesTop += '<br>%{customdata[' + index + ']}';

                        } else if (tooltip.id == "customTooltipExpression"){
                            tooltipLablesBottom += '<br>' + tooltip.qFallbackTitle + ': %{customdata[' + index + ']}'
                        }

                        //tooltipLables += ' %{customdata['+ key + ']}';

                    });
                }




                //convert layout into array in order to check how many lables we have
                /*tooltipLabelsArray = Object.keys(layout);

                tooltipLabelsArray.forEach(function (callback, key) {
                    if(callback.includes('tooltip')) {
                        if(layout[callback].label.length > 0) {
                            tooltipLables += '<br><b>' + layout[callback].label + ':</b> %{customdata['+ i + ']}';
                            i++;
                        }
                    }
                });*/

                //20201201 cvh 4: end


                const graph_layout = this.getPlotlyLayout(layout, qTheme, chartType);


                //range: [minValxAxis, maxValxAxis]
                if (!layout.xAxisSettings.fixedDynamicInterval) {
                    graph_layout.xaxis.range = [ layout.xAxisSettings.minInterval, layout.xAxisSettings.maxInterval];
                }

                if (!layout.yAxisSettings.fixedDynamicInterval) {
                    graph_layout.yaxis.range = [ layout.yAxisSettings.minInterval, layout.yAxisSettings.maxInterval];
                }
                

                 //20201201 cvh 2: add dynamic x axis (min and max)
                /* var minValxAxis;
                 var maxValxAxis;
                 if (!layout.xAxisSettings.fixedDynamicInterval) {
                     minValxAxis = layout.xAxisSettings.minInterval;
                     maxValxAxis = layout.xAxisSettings.maxInterval;
                 }*/

                // set xaxis rangeslider
                if(layout.xAxisSettings.showRangeslider) {
                    graph_layout.xaxis.rangeslider = {
                            
                    bgcolor: '#f1f2f3',
                    thickness: 0.075
                    //range: [minValxAxis, maxValxAxis]
                    }
                    if (!layout.xAxisSettings.fixedDynamicInterval) {
                        graph_layout.xaxis.rangeslider.range = [ layout.xAxisSettings.minInterval, layout.xAxisSettings.maxInterval]
                    }
                }


                var datas = [];



                var i = 0;
                var color;
                var colorscale;

                 // line chart color by Dimension with 2 dimensions
                var dimColorArray;
                if (chartType === 'line' && (layout.color.mode == "byDimension" || layout.color.mode == "byExpression")) {
                    var dimColorSet = new Set();
                    tracesMap.forEach(function (coords, key) {
                        if (coords[5] != null) {
                            dimColorSet.add(coords[5]);
                        }
                    });

                    dimColorArray = Array.from(dimColorSet);
                }

                // create data traces
                tracesMap.forEach(function (coords, key) {

                    /******  Set Color for each trace **********/

                    if (layout.color.auto) {
                        if (chartType === 'line') {
                            var scales = getDimensionColorScale(tracesMap.size - 1);
                            color = scales[i % scales.length].trim();
                        } else {
                            color = qTheme.properties.dataColors.primaryColor;
                        }
                    }
                    else if (layout.color.mode === "primary") {
                        if ( layout.color.paletteColor.color != null) {
                            color = layout.color.paletteColor.color;
                        } else {
                            color = qTheme.properties.dataColors.primaryColor;
                        }
                        
                    } else if (layout.color.mode === "byDimension") {

                      

                        // line chart color by Dimension with 2 dimensions
                        if (dimColorArray != null && dimcount == 2) {
                          
                            //var scales = getDimensionColorScale(dimColorArray.length - 1);
                            var scales;
                            if (layout.prop.colorPaletteDim !== null && layout.prop.colorPaletteDim !== '') {
                                scales = layout.prop.colorPaletteDim.split(",");
                            } else {
                                scales = getDimensionColorScale(tracesMap.size - 1);
                            }


                            // if dimension expression can't be calculated
                            if (scales !== undefined) {
                                color = scales[dimColorArray.indexOf(coords[5]) % scales.length].trim();
                            } else {
                                color = qTheme.properties.dataColors.nullColor;
                            }

                        } else {
                            var scales;//getDimensionColorScale(tracesMap.size - 1);
                            if (layout.prop.colorPaletteDim !== undefined && layout.prop.colorPaletteDim !== null && layout.prop.colorPaletteDim !== '') {
                                scales = layout.prop.colorPaletteDim.split(",");
                            } else {
                                scales = getDimensionColorScale(tracesMap.size - 1);
                            }

                            color = scales[i % scales.length].trim();
                        }
                        
                       


                    } else if (layout.color.mode === "byMeasure") {

                        color = coords[4];

                        var scales = getMeasureColorScale(color.length);

                        var colorscale = [];
                        scales.forEach(function (colorHex, index) {

                            colorscale.push([index / (scales.length - 1), colorHex]);
                        });

                    } else if (layout.color.mode === "byExpression" && layout.color.expressionIsColor) {
                        if (dimColorArray != null ) {
                            color = coords[5];
                            //key = coords[5];
                        } else {
                            color = key;
                        }
                        

                    } else if (layout.color.mode === "byExpression" && !layout.color.expressionIsColor) {
                        try {
                            let colorIndex;
                            let colorsLength;
                        
                            if (dimColorArray != null ) {
                                colorIndex = dimColorArray.indexOf(coords[5]);
                                colorsLength = dimColorArray.length - 1;
                                key = coords[5];
                            } else {
                                colorIndex = i;
                                colorsLength = tracesMap.size - 1;
                            }

                            var scales;//getDimensionColorScale(tracesMap.size - 1);
                            if (layout.prop.colorPaletteExpr !== undefined && layout.prop.colorPaletteExpr !== null && layout.prop.colorPaletteExpr !== '') {
                                scales = layout.prop.colorPaletteExpr.split(",");
                            } else {
                                scales = getDimensionColorScale(colorsLength);
                            }
                        
                            color = scales[colorIndex % scales.length].trim();
                        } catch (e) {
                            color = qTheme.properties.dataColors.nullColor;
                        }
                    
                    }


                    const data = {
                        type: "scattergl",

                        //mode: 'markers',
                       // mode: 'lines+markers',
                        //mode: 'lines',
                        mode: layout.pres.mode,
                        name: key,

                        showlegend: colorscale == null,
                        connectgaps: layout.pres.line.connectgaps,

                        marker: {
                            color: color,
                            /***********/
                            // Relevant for color by Measure
                            colorscale: colorscale,
                            showscale: layout.legend.showLegend && colorscale != null,

                            reversescale: layout.color.reverseScheme,
                            colorbar: {
                                thickness: 10,

                                len: 0.90,
                                tickformat: layout.coloring.numberFormat,
                                outlinewidth: 0
                                //autotick: false,
                                //nticks: 2 
                                /*autotick: false,
                                tick0: 0,
                                dtick: 0.1*/
                            },
                            /************/

                            size: (chartType==="scatter" || layout.pres.line.showDataPoints ? layout.pres.marker.size : 0),
                            opacity: (chartType==="scatter" || layout.pres.line.showDataPoints ? layout.pres.marker.opacity : 0),
                            symbol: layout.pres.marker.type,
                            //20201201 cvh 1: commented due to border outside marker
                            line: {
                                width:  (chartType==="scatter" || layout.pres.line.showDataPoints ? layout.pres.marker.lineWidth : 0),
                                color: layout.pres.marker.lineColor.color,
                                
                            }
                            //20201201 cvh 1: end
                        },
                        line: {
                            dash: layout.pres.line.lineStyle,
                            width: layout.pres.line.width,
                            //color: layout.pres.line.lineColor.color,
                            shape: layout.pres.line.shape
                           

                        },
                        opacity: layout.pres.line.opacity,
                        selected: {
                            marker: {
                                size: Math.max(layout.pres.marker.size, 6),
                                opacity: 1,//(layout.pres.marker.size + 2),
                                line: {
                                    width: layout.pres.marker.lineWidth + 3,
                                }
                             
                            }
                        },
                        unselected: {
                            marker: {
                                opacity: 0.3
                                
                            }
                        },

                        x: coords[0],
                        y: coords[1],
                        text: coords[2],
                        // numero di array = numero di punti x y
                        //all'interno di ogni array tante voci quanti sono i tooltip
                        //customdata: [['tooltip 1', 'tooltip 2'], ['tooltip 10']], //20201201 cvh 4: adding custom tooltip
                        customdata: coords[6],
                        qElementNumber: coords[3],
                        textposition: "top center",
                        textfont: {
                            color: qTheme.getStyle('object', 'axis.label.value', 'color'),
                            size: qTheme.getStyle('object', 'axis.label.value', 'fontSize')
                        },

                        hoverlabel: {
                            bgcolor: "#535353",
                            align: "left",
                            bordercolor: "#535353",
                            font: {
                                color: "#ffffff"
                            }
                        },

                        hoverinfo: 'name+x+y+text',

                        hovertemplate:
                            tooltipLablesTop +
                            (!layout.tooltip.auto && layout.tooltip.hideBasic ? '' :
                               
                                getTooltipSuffix()
                                //'<br>' + meaX + ': %{x}' +
                                //'<br>' + meaY + ': %{y}'
                                ) //+

                            + tooltipLablesBottom +
                            '<extra></extra>'									//20201201 cvh 4: adding custom tooltip
                    }

                    datas.push(data);
                    i++;

                });


                let noOfTraces = tracesMap.size;

                tracesMap.clear();

               

                function getTooltipSuffix() {
                    let tooltipSuffix;
                    if (chartType === "line") { 
                        tooltipSuffix = '<br><b>' + '' + '%{text}</b>' +
                            '<br>' + ((meacount > 1) ? '%{fullData.name}' : hypercube.qMeasureInfo[0].qFallbackTitle) + ': %{y}';
                    } else if (chartType === "scatter") {
                        tooltipSuffix = '<br><b>' + dimTitle + ': %{text}</b>' +
                            '<br>' + hypercube.qMeasureInfo[0].qFallbackTitle + ': %{x}' +
                            '<br>' + hypercube.qMeasureInfo[1].qFallbackTitle + ': %{y}';
                            //coords[5];
                        
                    }
                     return tooltipSuffix;
                
                }


                datas = datas.concat(this.createPlotlyLines(layout, qTheme));


             

                graph_layout.shapes = this.createPlotlyShapes(layout);


                let modeBarButtons = [["pan2d", "select2d", "lasso2d", "zoom2d", "resetScale2d"]];

                

                //20201201 cvh 3: including locations
                //Defualt language
                var lang = "en-US";
                //Browser language
                var userLang = (navigator.language || navigator.userLanguage).substring(0, 2);

                if (userLang != "en") {
                    //Getting browser language. You need to include your language plotly js (e.g. plotly-locale-it.js)
                    lang = userLang;
                }

                var config = {
                    responsive: true,
                    scrollZoom: true,
                    displaylogo: false,
                    modeBarButtons: modeBarButtons,
                    displayModeBar: true,
                    locale: lang
                };
                //20201201 cvh 3: end


                var keysForSelection = Object.keys(datas);

              
               // $('#' + 'Render_' + id).hide();

                // Clean up if the chart already exists
                if (TESTER.data == null) {
                    
                    Plotly.react(TESTER, datas, graph_layout, config).then(function() {
                       // $('#' + 'Render_' + id).hide();
                        resolve();
                    });

                } else {
                    // remove all unneeded listeners because of selection performance
                    TESTER.removeAllListeners("plotly_click");
                    TESTER.removeAllListeners("plotly_selected");
                    //TESTER.removeAllListeners("plotly_legendclick");
                    _self.$scope.selectedElements.clear();

                    Plotly.react(TESTER, datas, graph_layout, config).then(function() {
                     
                        resolve();
                    });
                    
                   
                    // resize is required for the div zoom in the QS client
                    //Plotly.Plots.resize(TESTER);

                }


                /*TESTER.on('plotly_legendclick', function(data) {

                    if (chartType === "line" && dimcount > 1) {
                        eventData.data[eventData.curveNumber]
                       // _self.selectValues(dimIndex, select, true);
                    }
                    var s = eventData;
                });*/

                
                TESTER.on('plotly_click', function (eventData) {

                    /*if (qlik.navigation.getMode() === qlik.navigation.EDIT) {
                        return;
                    }*/

                    // on select reduce the opacity of all traces
                    var update = {
                        opacity: 0.3
                    };
                    Plotly.restyle(TESTER, update, keysForSelection);

                    select(eventData, "click");

                });
                // select with rectangle and lasso
                TESTER.on('plotly_selected', function (eventData) {

                   /* if (qlik.navigation.getMode() === qlik.navigation.EDIT) {
                        return;
                    }*/

                    select(eventData);

                });


                // select on click
                function select(data, type) {

                    var select = [];

                    //var selectPoints =  data.points;

                    var dimIndex = 0;
                    if (type === "click" && chartType === "line" && dimcount > 1 && noOfTraces > 1) {
                        dimIndex = 1;
                    }


                    data.points.forEach(function (pt) {

                        if (pt.data.qElementNumber != null) {
                            var elements = pt.data.qElementNumber;
                            
                            var qElem = elements[pt.pointIndex][dimIndex];
                            if (!select.includes(qElem)) {
                                select.push(qElem);
                            }
                           

                            // Mark selected points 
                            if (type === "click") {

                                // remove created selection trace if point was allreay selected (select/un-select)
                                if (_self.$scope.selectedElements.has(qElem)) {
                                    var traceIndex = _self.$scope.selectedElements.get(qElem);
                                    Plotly.deleteTraces(TESTER, traceIndex);
                                    _self.$scope.selectedElements.delete(qElem);

                                } else {
                                    
                                    // add new trace for every selected point
                                    var cloneMarker = JSON.parse(JSON.stringify(pt.data.marker));
                                    cloneMarker.line.width = cloneMarker.line.width + 1;
                                    cloneMarker.size = cloneMarker.size + 3;
                                    var selX =  [pt.x];
                                    var selY = [pt.y];

                                    // select line if more than one trace exits
                                    if (chartType === "line"  && dimcount > 1 && noOfTraces > 1) {
                                        selX =  pt.data.x;
                                        selY = pt.data.y;
                                    }

                                    var update = {

                                        x: selX,
                                        y: selY,
                                        type: 'scattergl',
                                        mode: 'lines+markers',
                                        name: 'marker_selected',
                                        showlegend: false,
                                        marker: cloneMarker,
                                        qElementNumber: [qElem]

                                    };

                                    if (!layout.color.auto && layout.color.mode === "byMeasure") {
                                        update.marker.color = update.marker.color[pt.pointIndex];
                                    }
                                   
                                    Plotly.addTraces(TESTER, update);
                                    _self.$scope.selectedElements.set(qElem, TESTER.data.length - 1);

                                }
                            }
                        }
                    });

                    if (select.length > 0) {
                        // Qlik Sense selection action
                       

                        //if (chartType === "line" && type === "click" && noOfTraces > 1) {
                            
                          //  app.field("Typ").selectValues([{qText: select[0]}], true, true);
                           // app.field(Type).selectMatch(selectionString);
                            //_self.selectValues(1, select, true);
                        //} else {
                            _self.selectValues(dimIndex, select, true);
                       // }
                    }
                }

                

                function getFormattedCellValue(cell, axis) {
                    
                    if(cell.qIsNull) {
                        return null;
                    }
                    // Date conversion X
                    if (axis.type == 'date' && cell.qNum != 'NaN') {
                        // Qlik Date Date(0) = 30.12.1899 > Java Script data Date(0) = 01.01.1970
                        
                        // UTC date
                        var qlikDateMillis = (cell.qNum - (25569)) * 24 * 60 * 60 * 1000;

                        // 2021-08-07 FIX: Time conversion with milliseconds did not work 
                    
                        // UTC Date needs to be transformed in local time
                        qlikDateMillis = qlikDateMillis + new Date(qlikDateMillis).getTimezoneOffset() * 60 * 1000;

                        return qlikDateMillis;

                    } else {
                        if (cell.qNum != 'NaN') {
                            return cell.qNum;
                        } else {
                            return cell.qText;
                        }
                    }
                }

                // Create a plotly tarce for each color
                function getTraceKey(row) {
                    let key;
                    if (layout.color.auto) {
                        //key = qTheme.properties.dataColors.primaryColor;
                        key = hypercube.qDimensionInfo[0].qFallbackTitle;


                    } else {
                        if (layout.color.mode === "primary") {
                            //key = layout.color.paletteColor.color;
                            key = hypercube.qDimensionInfo[0].qFallbackTitle;
                        } else if (layout.color.mode === "byDimension") {
                            key = row[dimcount-1].qAttrDims.qValues[0].qText;
                        } else if (layout.color.mode === "byMeasure") {
                            key = dimTitle;
                        } else if (layout.color.mode === "byExpression") {
                            if (row[dimcount].qAttrExps != null) {
                                key = row[dimcount].qAttrExps.qValues[0].qText;
                            }
                        } else {
                            key = 'x';
                        }

                    }

                    return key;
                }

                function getValueColorbyMeasure(row) {
                    if (!layout.color.auto && layout.color.mode === "byMeasure") {

                        const isColorExp = (expr) => expr.id === "colorByAlternative";
                        var index = hypercube.qDimensionInfo[dimcount-1].qAttrExprInfo.findIndex(isColorExp);

                        

                        const palettes = qTheme.properties.scales.filter(scale =>
                            scale.propertyValue == layout.color.measureScheme);
                        
                        // determine if the color scale is gradient or class. 
                        // initially no palette is selected
                        var paletteType = getMeasurePaletteType();    
                       

                        if (paletteType === "gradient") {
                            return row[dimcount-1].qAttrExps.qValues[index].qNum;

                        } else {

                            let qMin = hypercube.qDimensionInfo[dimcount-1].qAttrExprInfo[index].qMin;
                            let qMax = hypercube.qDimensionInfo[dimcount-1].qAttrExprInfo[index].qMax;

                            let classSize = getMeasureColorScale(rowcount).length;
                            let classLength = ((qMax - qMin) / classSize);
                            let classLengthPlus1 = ((qMax - qMin) / (classSize + 1));

                            
                            let classValue = Math.floor(((row[dimcount-1].qAttrExps.qValues[index].qNum) / (classLengthPlus1)));
                           
                            if (!isNaN(classValue)) {
                                if (classValue === classSize + 1) {
                                    classValue = classSize;
                                }

                                //console.info(classValue);

                                return classValue * classLength;

                            } else {
                                return 'NULL';
                            }
                        }
                            /*let classes = [];
                            for (let i = 0; i <= classSize; i++) {
                                classes.push(i *((qMax - qMin) / (classSize + 1)) + qMin);
                            }

                            let classValue = row[dimcount-1].qAttrExps.qValues[index].qNum;

                            if (!isNaN(classValue)) {
                                //let classValue = (((row[dimcount-1].qAttrExps.qValues[index].qNum) / (classLength + 1)));

                               

                                const isClassExp = (expr) => classValue >= expr && classValue < (expr +  ((qMax - qMin) / classSize + 1));
                                var index = classes.findIndex(isClassExp);
                                
                                // map max value to the last class
                                if (index == -1) {
                                    index = classSize - 1; 
                                }


                                return index * ((qMax - qMin) / classSize);*/
                            

                           





                           // var classLenght = scale.length;

                            //


 
                        
                    }
                    return null;
                }

                function getValueColorbyDimension_Expr(row) {
                    if (layout.color.mode === "byDimension") {
                        const isColorExp = (expr) => expr.id === "colorByAlternative";
                        var index = hypercube.qDimensionInfo[dimcount-1].qAttrDimInfo.findIndex(isColorExp);
                        let res = row[dimcount-1].qAttrDims.qValues[index].qText;
                        if (res !== undefined) {
                            return res;
                        } 
                        
                    } else if  (layout.color.mode === "byExpression") {
                        if (row[dimcount].qAttrExps != null) {
                            return row[dimcount].qAttrExps.qValues[0].qText;
                        }
                    }
                    return null;
                }

                function getDimensionColorScale(dataColorSize) {
                    const palettes = qTheme.properties.palettes.data.filter(palette =>
                        palette.propertyValue == layout.color.dimensionScheme);

                    var scales;

                     // on the first time no palette is selected
                    if (palettes.length == 1) {
                        scales = palettes[0].scale;
                    } else {
                        scales = qTheme.properties.palettes.data[0].scale;
                    }

                    if (Array.isArray(scales[0])) {
                        scales = scales[Math.min(dataColorSize, scales.length - 1)];
                    }

                    return scales;
                }


                
                function getMeasureColorScale(dataColorSize) {
                    var scales;

                    const palettes = qTheme.properties.scales.filter(scale =>
                        scale.propertyValue == layout.color.measureScheme);
                   
                    // on the first time no palette is selected
                    if (palettes.length == 1) {
                        scales = palettes[0].scale;
                    } else {
                        scales = qTheme.properties.scales[0].scale;
                    }

                    if (Array.isArray(scales[1])) {
                        // first scale is always "null"
                        scales = scales[Math.min(dataColorSize, scales.length - 1)];
                    }

                    return scales;

                }

                function getMeasurePaletteType(dataColorSize) {
                    const palettes = qTheme.properties.scales.filter(scale =>
                        scale.propertyValue == layout.color.measureScheme);
                    // determine if the color scale is gradient or class. 
                    // initially no palette is selected
                    if (palettes.length == 1) {
                        return palettes[0].type;
                    } else {
                        return"gradient";
                    }
                }



                function getAndFillTracesMapLineChart(qTheme) {
                    let tracesMap = new Map();

                    if (layout.prop.standardMode) {
                        _self.backendApi.eachDataRow(function (rownum, row) {
                            var coords;
        
                            var colorByMeasure = getValueColorbyMeasure(row);
                            var colorByDim_Expr = getValueColorbyDimension_Expr(row);
                      
                            if (dimcount == 1) {

                                var column = 0;
                                row.forEach(function(cell) {
                                    if (column > dimcount - 1) { 
                                        //key = row[column].qText;
                                        
                                        var key = hypercube.qMeasureInfo[column - dimcount].qFallbackTitle;
                                        //addCellToPointMap(key, row[0], cell);

                                        addRowToTracesMap(tracesMap, key, row[0], cell, row[0].qText, [row[0].qElemNumber], colorByMeasure, colorByDim_Expr, row[0].qAttrExps);

                                    }
                                column++;
                                

                                });	
                                
                               

                            } else {
                            
                                var key = row[1].qText;
           
                                addRowToTracesMap(tracesMap, key, row[0], row[2],  row[1].qText + ', ' + row[0].qText, [row[0].qElemNumber, row[1].qElemNumber], colorByMeasure, colorByDim_Expr, row[0].qAttrExps);
                                
                            }
                        });
                    } else {
                        fillTracesMapMaxPerformanceMode(tracesMap);
                    }

                    return tracesMap;
                
                } 


                function getAndFillTracesMapScatter(qTheme) {

                    let tracesMap = new Map();

                    if (layout.prop.standardMode) {
                        _self.backendApi.eachDataRow(function (rownum, row) {
                            
                            var key = getTraceKey(row);
                            var colorbyMeasure = getValueColorbyMeasure(row);

                            addRowToTracesMap(tracesMap, key, row[1], row[2], row[0].qText, [row[0].qElemNumber], colorbyMeasure, null, row[0].qAttrExps);



                            //20201201 cvh 4: adding custom tooltip
                            //Tooltip
                            //	var tmpTooltipArray = [];


                            //Loop on my attribute expressions
                            //hypercube.qDimensionInfo[0].qAttrExprInfo.forEach(function (callback, key) {
                            //	row[0].qAttrExps.qValues.forEach(function (tooltipRow, key) {
                            //Use tmp array for pushing array into another array
                            //	tmpTooltipArray.push(tooltipRow.qText);

                            //});


                            //Final array
                            //tooltipData.push(tmpTooltipArray);
                            //20201201 cvh 4: end

                        });
                    } else {

                        fillTracesMapMaxPerformanceMode(tracesMap);
                      
                    }


                    return tracesMap;
                }


                function fillTracesMapMaxPerformanceMode(tracesMap) {
                    _self.backendApi.eachDataRow(function (rownum, row) {
                        var x;
                        var y; 
                        var key;
                        var coords;
                        
                        try {
                            x = JSON.parse('[' + row[1].qText + ']');
                            y = JSON.parse('[' + row[2].qText + ']');
                            
                            
                        } catch (e) {
                            console.info(e);
                            x = [];
                            y = [];
                        }

                        //key = hypercube.qDimensionInfo[0].qFallbackTitle;
                        key = row[0].qText;
                        /*if (layout.color.auto) {
                            key = qTheme.properties.dataColors.primaryColor;
                            layout.color.auto

                        } else {
                            key = hypercube.qDimensionInfo[0].qFallbackTitle;
                            //if (layout.color.mode === "primary") {
                                //key = layout.color.paletteColor.color;
                                //key = hypercube.qDimensionInfo[0].qFallbackTitle;
                            //} else {
                            //	key = row[0].qText;
                            //}
                        } */
                        
                        coords = [x, y, [], [], [], null, []];

                        tracesMap.set(key, coords);
                    });
                }

                function addRowToTracesMap(tracesMap, key, x, y, text, qElemNumber, colorbyMeasure, colorByDim, tooltipData) {
                    var coords;
                    if (tracesMap.get(key) != null) {
                        coords = tracesMap.get(key)
                    } else {
                        coords = [[], [], [], [], [], null, []];

                        // limit to 100 colors / traces
                        if (tracesMap.size >= 1000) {
                            key = 'Others';
                        }
                        tracesMap.set(key, coords)
                    }

                    // x coordinate
                    coords[0].push(getFormattedCellValue(x, layout.xAxisSettings));
                    // y coordinate
                    coords[1].push(getFormattedCellValue(y, layout.yAxisSettings));
                    // add labels
                    coords[2].push(text);
                    // add qElemNumber for selection
                    coords[3].push(qElemNumber);

                    // add qElemNumber for selection
                    if (colorbyMeasure != null) {

                        coords[4].push(colorbyMeasure);
                    }

                    if (colorByDim != null) {
                        coords[5] = colorByDim;
                    }
                    if (!layout.tooltip.auto && tooltipData != null) {
                        var tp = [];
                        tooltipData.qValues.forEach(function (tooltipRow, key) {
                            //Use tmp array for pushing array into another array	
                            let toolText = tooltipRow.qText;
                            if (toolText !== null && toolText !== undefined) {
                                tp.push(tooltipRow.qText);
                            } else {
                                tp.push('-');
                            }
                            
                        });
                        coords[6].push(tp);
                    }
                }


                async function createPlot() {

                    
                    var qTheme = await getTheme();

                    addtoArray();
                    await getMoreData();
                    
                    await drawPlotlyPlot(qTheme);


                    //resolve();

                }


                function drawPlotlyPlot(qTheme) {

                    return new Promise(resolveDrawPlot => {



                    resolveDrawPlot();

                    });

                }

                //loop through the rows we have and render
                function addtoArray() {
                    //console.info("getRowCount" + _self.backendApi.getRowCount());
                    _self.backendApi.eachDataRow(function (rownum, row) {
                        //console.info("rownum " + rownum);
                        lastrow = rownum;
                        //do something with the row..

                    });

                }

                /*function getMoreData() {

                    return new Promise(resolve => {


                        if (_self.backendApi.getRowCount() > lastrow + 1 && lastrow <= layout.maxRecord) {

                            //we havent got all the rows yet, so get some more, 1000 rows
                            var requestPage = [{
                                qTop: lastrow + 1,
                                qLeft: 0,
                                qWidth: colcount, //should be # of columns
                                qHeight: Math.min(Math.floor(10000 / colcount), _self.backendApi.getRowCount() - lastrow.row)
                            }];
                            _self.backendApi.getData(requestPage).then(function (dataPages) {

                                //console.log(" Page  lastrow........... "  + lastrow);
                                //when we get the result trigger paint again
                                this.addtoArray();
                                resolve(this.getMoreData());

                            });

                        } else {
                            resolve();
                        }
                    });
                }*/

                /*function removeFontUnit(fontSize) {
                    return fontSize.replace(/[^\d.-]/g, '');
                }*/
           


        });
    },

    getTheme: function(app) {
        return new Promise(resolveTheme => {
            app.theme.getApplied().then(function (qTheme) {

                resolveTheme(qTheme);

            });
        });
    },

     getMoreData: function(_self, lastrow, layout, colcount) {

        var _this = this;
        return new Promise(resolve => {


            if (_self.backendApi.getRowCount() > lastrow.row + 1 && lastrow.row <= layout.maxRecord) {

                //we havent got all the rows yet, so get some more, 1000 rows
                var requestPage = [{
                    qTop: lastrow.row + 1,
                    qLeft: 0,
                    qWidth: colcount, //should be # of columns
                    qHeight: Math.min(Math.floor(10000 / colcount), _self.backendApi.getRowCount() - lastrow.row)
                }];
                _self.backendApi.getData(requestPage).then(function (dataPages) {

                    //console.log(" Page  lastrow.row ........... "  + lastrow);
                    //when we get the result trigger paint again
                    _this.addtoArray(_self, lastrow);
                    resolve(_this.getMoreData(_self, lastrow, layout, colcount));

                });

            } else {
                resolve();
            }
        });
    }, 
    //loop through the rows we have and render
    addtoArray: function (_self, lastrow) {
        //console.info("getRowCount" + _self.backendApi.getRowCount());
        _self.backendApi.eachDataRow(function (rownum, row) {
            //console.info("rownum " + rownum);
            lastrow.row = rownum;
            //do something with the row..

        });

    },

    removeFontUnit: function(fontSize) {
        return fontSize.replace(/[^\d.-]/g, '');
    },

    getPlotlyLayout: function(layout, qTheme, chartType) {

        return {
            hovermode: "closest",
            dragmode: "pan",
            automargin: true,
            paper_bgcolor: 'rgba(255,255,255,0)',
            plot_bgcolor: 'rgba(255,255,255,0)',
            margin: {
                l: layout.prop.margin.left,
                r: layout.prop.margin.right,
                b: layout.prop.margin.bottom,
                t: layout.prop.margin.top,
                pad: 5
            },
            font: {
                family: qTheme.properties.fontFamily
            },
            showlegend: layout.legend.showLegend,
            legend: {
                bgcolor: 'rgba(255,255,255,0)',
                orientation: layout.legend.orientation
            },
            modebar: {
                orientation: 'h',
                bgcolor: layout.prop.toolbar.bgColor//'rgba(255,255,255,1)'
            },
            xaxis: {
                type: layout.xAxisSettings.type,
                tickformat: layout.xAxisSettings.tickFormat,
                showline: layout.xAxisSettings.showLine,
                showgrid: layout.xAxisSettings.showGrid,
                showticklabels: layout.xAxisSettings.showTicklabels,
                zeroline: layout.xAxisSettings.showZeroLine,
                linecolor: qTheme.getStyle('object', 'axis.line.major', 'color'),
                tickangle: 'auto',
                tickcolor: qTheme.getStyle('object', 'axis.line.major', 'color'),
                gridcolor: qTheme.getStyle('object', 'axis.line.major', 'color'),
                title: {
                    text: layout.xAxisSettings.xTitle,
                    font: {
                        color: qTheme.getStyle('object', 'axis.title', 'color'),
                        size: this.removeFontUnit(qTheme.getStyle('object', 'axis.title', 'fontSize'))
                    }
                },
                font: {
                    color: qTheme.getStyle('object', 'axis.label.name', 'color'),
                    size: this.removeFontUnit(qTheme.getStyle('object', 'axis.label.name', 'fontSize'))
                },
                //20201201 cvh 2: add dynamic x axis (min and max)
                //range: [minValxAxis, maxValxAxis]
                
                //20201201 cvh 2: end
            },
            yaxis: {
                type: layout.yAxisSettings.type,
                tickformat: layout.yAxisSettings.tickFormat,
                showline: layout.yAxisSettings.showLine,
                showgrid: layout.yAxisSettings.showGrid,
                showticklabels: layout.yAxisSettings.showTicklabels,
                zeroline: layout.yAxisSettings.showZeroLine,
                linecolor: qTheme.getStyle('object', 'axis.line.major', 'color'),
                tickangle: 'auto',
                tickcolor: qTheme.getStyle('object', 'axis.line.major', 'color'),
                gridcolor: qTheme.getStyle('object', 'axis.line.major', 'color'),
                title: {
                    text: layout.yAxisSettings.yTitle,
                    font: {
                        color: qTheme.getStyle('object', 'axis.title', 'color'),
                        size: this.removeFontUnit(qTheme.getStyle('object', 'axis.title', 'fontSize'))
                    }
                },
                font: {
                    color: qTheme.getStyle('object', 'axis.label.name', 'color'),
                    size: this.removeFontUnit(qTheme.getStyle('object', 'axis.label.name', 'fontSize'))
                },

                fixedrange: (chartType==="line" ? true : false)
            }
        };
    },

    createPlotlyLines: function(layout, qTheme) {

        var _self = this;
        var lines = [];
        layout.refLineList.forEach(function (lineData) {
            var x = [];
            var y = [];
           
            try {   
                if (lineData.line.geometryX !== null && lineData.line.geometryY !== null ) {
                    x = JSON.parse('[' + lineData.line.geometryX + ']');
                    y = JSON.parse('[' + lineData.line.geometryY + ']');
                }
            } catch (e) {
                console.info(e);
            }
            
            //var x = [];
            //var y = [];
            /*var i = 0;

            lineArray.forEach(function (coord) {
                x.push(coord[0]);
                y.push(coord[1]);
                i++;
            });*/

            const line = {
                x: x,
                y: y,
                paper: 'paper',
                text: lineData.line.label,
                textposition: 'center right',
                mode: lineData.line.mode,
                type: 'scattergl',
                textfont: {
                    color: qTheme.getStyle('object', 'axis.label.value', 'color'),
                    size: _self.removeFontUnit(qTheme.getStyle('object', 'axis.label.value', 'fontSize'))
                },
                name: lineData.line.label,
                showlegend: lineData.line.showLegend,

                line: {
                    dash: lineData.line.lineStyle,
                    width: lineData.line.width,
                    color: lineData.line.lineColor.color,
                    shape: lineData.line.shape

                }
            };

            lines.push(line);


        });

        return lines;
    },

    createPlotlyShapes: function(layout) {   

        
        const shapeObjs = [];
        layout.shapes.forEach(function (shapeData) {

            var x0 = shapeData.shape.x0;
            var y0 = shapeData.shape.y0;
            var x1 = shapeData.shape.x1;
            var y1 = shapeData.shape.y1;

            if (shapeData.shape.refLine === 'h') {
                x0 = 0;
                x1 = 1;
            } else if (shapeData.shape.refLine === 'v') {
                y0 = 0;
                y1 = 1;
            }

            const shapeObj = {
                type: shapeData.shape.type,
                layer: shapeData.shape.layer,
                x0: x0,
                y0: y0,
                x1: x1,
                y1: y1,
                fillcolor: shapeData.shape.fillColor.color,
                opacity: shapeData.shape.opacity,
                line: {
                    dash: shapeData.shape.lineStyle,
                    width: shapeData.shape.width,
                    color: shapeData.shape.fillColor.color
                }
            }


            if (shapeData.shape.refLine === 'v') {
                shapeObj.yref = 'paper'
            } else if (shapeData.shape.refLine === 'h') {
                shapeObj.xref = 'paper'
            }


            shapeObjs.push(shapeObj);
        });

        return shapeObjs;
    }

        


       
}
    
});