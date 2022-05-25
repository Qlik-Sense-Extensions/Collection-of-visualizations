requirejs.config({
    paths: {
        "amcharts": "/extensions/amCombo/library/amcharts",
        "amcharts.serial": "/extensions/amCombo/library/serial",
        "amcharts.theme.dark": "/extensions/amCombo/library/dark",
        "amcharts.theme.black": "/extensions/amCombo/library/black",
        "amcharts.theme.chalk": "/extensions/amCombo/library/light",
        "amcharts.theme.light": "/extensions/amCombo/library/chalk",
        //"amcharts.theme.patterns": "/extensions/amCombo/library/patterns"
    },
    shim: {
        "amcharts.serial": {
            deps: ["amcharts", "amcharts.theme.dark", "amcharts.theme.black", "amcharts.theme.chalk", "amcharts.theme.light"],
            exports: "AmCharts",
            init: function() {
                AmCharts.isReady = true;
            }
        }
    }
});
define([
        'qlik',
        'jquery',
        './properties',
        'amcharts.serial'
    ],
    function(qlik, $, props) {
        return {
            definition: props,
            initialProperties: {
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [{
                        qWidth: 6,
                        qHeight: 1500
                    }]
                }
            },
            paint: function($element, layout) {
                var self = this;
                var hc = layout.qHyperCube;
                var dataProvider = [];
                var dataProviderStart = {};
                var dataProviderEnd = {};
                var trendLines = [];
                var trendLinesEnd = {};
                var amGraphs = [];
                hc.qDataPages.forEach(function(page, index) {
                    page.qMatrix.forEach(function(row, rindex) {
                        var dataProviderObj = {};
                        var trendLinesObj = {};
                        row.forEach(function(cell, index) {
                            var cId;
                            if (index < hc.qDimensionInfo.length) {

                                cId = hc.qDimensionInfo[index].cId;
                                dataProviderObj["elemNumber" + cId] = cell.qElemNumber;
                                dataProviderObj["text" + cId] = cell.qText;
                                dataProviderObj.dimText = cell.qText;
                            } else {
                                cId = hc.qMeasureInfo[index - hc.qDimensionInfo.length].cId;

                                // Create initial object for start values (waterfall)
                                if (rindex === 0 && hc.qMeasureInfo[index - hc.qDimensionInfo.length].amGraph.type == 'Waterfall') {

                                    dataProviderStart["text" + hc.qDimensionInfo[0].cId] = hc.qMeasureInfo[index - hc.qDimensionInfo.length].waterfall.startLabel;
                                    dataProviderStart["text" + cId] = hc.qMeasureInfo[index - hc.qDimensionInfo.length].waterfall.start;
                                    dataProviderStart["elemNumber" + hc.qDimensionInfo[0].cId] = -2;
                                    dataProviderStart["open" + cId] = 0;
                                    dataProviderStart["close" + cId] = hc.qMeasureInfo[index - hc.qDimensionInfo.length].waterfall.start;
                                    dataProviderStart["color" + cId] = "#1c8ceb";
                                    dataProviderStart["lineColor" + cId] = "#888888";
                                    dataProviderStart.dimText = hc.qMeasureInfo[index - hc.qDimensionInfo.length].waterfall.startLabel;
                                    dataProvider.push(dataProviderStart);
                                }

                                // Create last object for end values (waterfall)
                                if (rindex == hc.qSize.qcy - 1 && hc.qMeasureInfo[index - hc.qDimensionInfo.length].amGraph.type == 'Waterfall') {

                                    dataProviderEnd["text" + hc.qDimensionInfo[0].cId] = hc.qMeasureInfo[index - hc.qDimensionInfo.length].waterfall.endLabel;
                                    dataProviderEnd["text" + cId] = hc.qMeasureInfo[index - hc.qDimensionInfo.length].waterfall.end;
                                    dataProviderEnd["elemNumber" + hc.qDimensionInfo[0].cId] = -2;
                                    dataProviderEnd["open" + cId] = 0;
                                    dataProviderEnd["close" + cId] = hc.qMeasureInfo[index - hc.qDimensionInfo.length].waterfall.end;
                                    dataProviderEnd["color" + cId] = "#1c8ceb";
                                    dataProviderEnd["lineColor" + cId] = "#888888";
                                    dataProviderEnd.dimText = hc.qMeasureInfo[index - hc.qDimensionInfo.length].waterfall.endLabel;
                                }

                                dataProviderObj["text" + cId] = cell.qText;

                                if (hc.qMeasureInfo[index - hc.qDimensionInfo.length].amGraph.type == 'Waterfall') {
                                    dataProviderObj["open" + cId] = dataProvider[rindex]["close" + cId];
                                    dataProviderObj["lineColor" + cId] = "#888888";

                                    if (dataProviderObj["open" + cId] + cell.qNum > dataProvider[rindex]["close" + cId]) {
                                        dataProviderObj["color" + cId] = "#54cb6a";
                                    } else {
                                        dataProviderObj["color" + cId] = "#cc4b48";
                                    }
                                } else {
                                    dataProviderObj["open" + cId] = 0;
                                    dataProviderObj["color" + cId] = cell.qAttrExps.qValues[0].qText;
                                    dataProviderObj["lineColor" + cId] = cell.qAttrExps.qValues[1].qText;
                                }

                                if (hc.qMeasureInfo[index - hc.qDimensionInfo.length].amGraph.type == 'Waterfall') {
                                    trendLinesObj.dashLength = 3;
                                    trendLinesObj.finalCategory = dataProviderObj.dimText;
                                    trendLinesObj.initialCategory = dataProvider[rindex].dimText;
                                    trendLinesObj.initialValue = dataProvider[rindex]["close" + hc.qMeasureInfo[index - hc.qDimensionInfo.length].cId];
                                    trendLinesObj.lineColor = "#888888";
                                    trendLinesObj.finalValue = dataProviderObj["open" + cId];
                                    trendLines.push(trendLinesObj);

                                    //add last trend line (waterfall)
                                    if (rindex == hc.qSize.qcy - 1) {
                                        trendLinesEnd.dashLength = 3;
                                        trendLinesEnd.finalCategory = hc.qMeasureInfo[index - hc.qDimensionInfo.length].waterfall.endLabel;
                                        trendLinesEnd.initialCategory = dataProviderObj.dimText;
                                        trendLinesEnd.initialValue = dataProviderObj["open" + cId] + cell.qNum;
                                        trendLinesEnd.lineColor = "#888888";
                                        trendLinesEnd.finalValue = hc.qMeasureInfo[index - hc.qDimensionInfo.length].waterfall.end;
                                        trendLines.push(trendLinesEnd);
                                    }
                                }

                                dataProviderObj["close" + cId] = dataProviderObj["open" + cId] + cell.qNum;
                            }
                            if (cell.qNum == 'NaN') {
                                dataProviderObj[cId] = cell.qText;
                            } else {
                                dataProviderObj[cId] = cell.qNum;
                            }

                        });
                        dataProvider.push(dataProviderObj);
                    });
                    var waterfallCount = 0;
                    hc.qMeasureInfo.forEach(function(mes, index) {
                        if (mes.amGraph.type == 'Waterfall') {
                            waterfallCount++;
                        }
                    });
                    if (waterfallCount > 0) {
                        dataProvider.push(dataProviderEnd);
                    }
                });
                hc.qMeasureInfo.forEach(function(measureDef, index) {
                    var amGraph = {};
                    if (measureDef.amGraph.type == 'Waterfall') {
                        amGraph.type = 'column';
                    } else {
                        amGraph.type = measureDef.amGraph.type;
                    }
                    if (measureDef.amGraph.showLabel === true) {
                        amGraph.labelText = "[[text" + measureDef.cId + "]]";
                    }
                    amGraph.fillColorsField = 'color' + measureDef.cId;
                    amGraph.colorField = 'color' + measureDef.cId;
                    amGraph.lineColorField = 'lineColor' + measureDef.cId;
                    amGraph.id = measureDef.cId;
                    amGraph.openField = "open" + measureDef.cId;
                    amGraph.valueField = "close" + measureDef.cId;
                    amGraph.title = hc.qMeasureInfo[index].qFallbackTitle;
                    amGraph.bulletBorderAlpha = 1;
                    amGraph.hideBulletsCount = 50;
                    amGraph.useLineColorForBulletBorder = true;
                    amGraph.balloonText = "<b>[[title]]</b><br/>[[text" + measureDef.cId + "]]";
                    amGraph.valueAxis = measureDef.amGraph.valueAxis;
                    amGraph.fillAlphas = measureDef.amGraph.fillAlphas;
                    amGraph.fontSize = measureDef.amGraph.fontSize;
                    amGraph.columnWidth = measureDef.amGraph.columnWidth;
                    amGraph.clustered = measureDef.amGraph.clustered;
                    amGraph.lineThickness = measureDef.amGraph.lineThickness;
                    amGraph.dashLength = measureDef.amGraph.dashLength;
                    amGraph.bullet = measureDef.amGraph.bullet;
                    amGraph.bulletAlpha = measureDef.amGraph.bulletAlpha;
                    amGraph.bulletColor = measureDef.amGraph.bulletColor;
                    amGraph.bulletSize = measureDef.amGraph.bulletSize;
                    amGraph.labelOffset = measureDef.amGraph.labelOffset;
                    amGraph.labelPosition = measureDef.amGraph.labelPosition;
                    amGraph.labelRotation = measureDef.amGraph.labelRotation;
                    amGraph.behindColumns = measureDef.amGraph.behindColumns;
                    amGraphs.push(amGraph);
                });

                //Set themes
                AmCharts.themes.dark = amChartsThemesDark;
                AmCharts.themes.light = amChartsThemesLight;
                AmCharts.themes.black = amChartsThemesBlack;
                AmCharts.themes.chalk = amChartsThemesChalk;

                var chart = AmCharts.makeChart($element[0], {
                    "type": "serial",
                    "rotate": layout.amChart.rotate,
                    "theme": layout.amChart.theme,
                    "depth3D": layout.amChart.depth3D,
                    "angle": layout.amChart.angle,
                    "fontFamily": layout.amChart.fontFamily,
                    "fontSize": layout.amChart.fontSize,
                    "handDrawn": layout.amChart.handDrawn,
                    "precision": 2,
                    "titles": [{
                        text: layout.amChart.titles.text,
                        alpha: layout.amChart.titles.alpha,
                        bold: layout.amChart.titles.bold,
                        size: layout.amChart.titles.size
                    }],
                    "valueAxes": [{
                        "id": "v1",
                        "position": "left",
                        "autoGridCount": false,
                        "stackType": layout.amChart.valueAxis.leftStackType,
                        "fontSize": layout.amChart.valueAxis.fontSize,
                        "title": layout.amChart.valueAxis.leftTitle
                    }, {
                        "id": "v2",
                        "position": "right",
                        "autoGridCount": false,
                        "stackType": layout.amChart.valueAxis.rightStackType,
                        "fontSize": layout.amChart.valueAxis.fontSize,
                        "title": layout.amChart.valueAxis.rightTitle
                    }],
                    "graphs": amGraphs,
                    "trendLines": trendLines,
                    "chartCursor": {
                        "selectWithoutZooming": true,
                        "pan": false,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true,
                        "cursorAlpha": 0,
                        "valueLineAlpha": 0.2
                    },
                    "categoryField": "text" + hc.qDimensionInfo[0].cId,
                    "categoryAxis": {
                        "parseDates": false,
                        "dashLength": 1,
                        "minorGridEnabled": true,
                        "labelRotation": layout.amChart.categoryAxis.labelRotation,
                        "fontSize": layout.amChart.categoryAxis.fontSize,
                        "title": layout.amChart.categoryAxis.title
                    },
                    "legend": {
                        "equalWidths": false,
                        "useGraphSettings": true,
                        "valueText": "",
                        "enabled": layout.amChart.legend.enabled,
                        "position": layout.amChart.legend.position
                    },
                    "balloon": {
                        "enabled": layout.amChart.balloon.enabled
                    },
                    "export": {
                        "enabled": true
                    },
                    "dataProvider": dataProvider
                });

                //CSS STUFF
                if (layout.amChart.handDrawn) {
                    $element.find("*").css("font-family", "Kristen ITC");
                } else {
                    $element.find("*").css("font-family", layout.amChart.fontFamily);
                }

                if (layout.amChart.theme == 'dark' || layout.amChart.theme == 'chalk') {
                    $element.css("background-color", "#282828");
                } else {
                    if (layout.amChart.theme == 'black') {
                        $element.css("background-color", "#222222");
                    } else {
                        $element.css("background-color", "#FFFFFF");
                    }
                }

                $element.css('border-radius', '10px');

                //EVENTS
                chart.chartCursor.addListener("selected", zoomy);

                function zoomy(zomzom) {
                    var dimValArray = [];
                    dataProvider.forEach(function(row, index) {
                        if (index >= zomzom.start && index <= zomzom.end && row["elemNumber" + hc.qDimensionInfo[0].cId] >= 0) {
                            dimValArray.push(row["elemNumber" + hc.qDimensionInfo[0].cId]);
                        }
                    });
                    self.selectValues(0, dimValArray, false);
                }

                chart.addListener("clickGraphItem", handleClickGraphItem);

                function handleClickGraphItem(event) {
                    var dimValArray = [];
                    if (dataProvider[event.index]["elemNumber" + hc.qDimensionInfo[0].cId] >= 0) {
                        dimValArray.push(dataProvider[event.index]["elemNumber" + hc.qDimensionInfo[0].cId]);
                    }
                    self.selectValues(0, dimValArray, false);
                }
            }

        };

    });
