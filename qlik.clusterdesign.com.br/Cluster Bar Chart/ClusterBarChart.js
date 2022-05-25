define([
        'jquery',
        'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.2.1/echarts.min.js',
        "./Utils/properties",
        'qlik',
    ],
    function ($, echarts, properties, qlik) {
        'use strict';

        return {
            initialProperties: {
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [{
                        qWidth: 3,
                        qHeight: 500
                    }]
                }
            },
            definition: properties.properties,
            paint: function ($element, layout) {
                const { chartType, chartOrientation } = layout.props;
                // const firstDimension = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
                const dataset = { dimensions: null, data: [] };

                // const backendApi = this.backendApi;

                function  calculateColor() {
                    if(layout.color.type != undefined)
                        switch(layout.color.type) {
                            case 2: return layout.color.list.split(",");
                            case 3: return layout.color.colorPalette;
                        }

                    return layout.color.picker == undefined ? '#000000' : layout.color.picker.color;
                }

                const ColorDef = {
                    type: layout.color == undefined || layout.color.type == undefined ? 1 : layout.color.type,
                    color: calculateColor(),
                };

                dataset.dimensions = [...new Set(layout.qHyperCube.qDataPages[0].qMatrix.map(item => item[0].qText))];

                if(layout.qHyperCube.qDataPages[0].qMatrix[0].length === 2) {
                    dataset.data.push({
                        data: layout.qHyperCube.qDataPages[0].qMatrix.map(item => item[1].qNum),
                        type: 'bar',
                        label: { show: true },
                        emphasis: { focus: 'series' },
                    });
                } else {
                    const dados = [...new Set(layout.qHyperCube.qDataPages[0].qMatrix.map(item => item[1].qText))];

                    dados.map((dim, index) => {
                        if(chartType == 'g') 
                            dataset.data.push({
                                name: dim,
                                type: 'bar',
                                label: { show: true },
                                itemStyle: {
                                    color: ColorDef.color.length > 1 ? ColorDef.color[index] : ColorDef.color
                                },
                                emphasis: { focus: 'series' },
                                data: []
                            })
                        else
                            dataset.data.push({
                                name: dim,
                                type: 'bar',
                                stack: 'total',
                                itemStyle: {
                                    color: ColorDef.color.length > 1 ? ColorDef.color[index] : ColorDef.color
                                },
                                label: { show: true },
                                emphasis: { focus: 'series' },
                                data: []
                            })
                    });  

                    layout.qHyperCube.qDataPages[0].qMatrix.map(item => {
                        let index = dataset.data.findIndex(elem => elem.name === item[1].qText);
                        dataset.data[index].data.push(item[2].qNum);
                    })
                }

                const options = this.$scope.createOptions(chartOrientation, dataset, ColorDef);

                var myChart = echarts.init($element[0]);

                // use configuration item and data specified to show chart
                myChart.setOption(options, true);
                myChart.resize();
                // myChart.on('click', function (params) {
                //    var { name } = params;
                //     //TODO: nao funciona
                //     backendApi.selectValues(0, [name], true);
                //     // app.field(firstDimension).selectValues([name])
                // });
            },
            controller: ['$scope', function ( $scope ) {
                
                $scope.createOptions = ( chartOrientation, dataset, { type, color } ) => {
                    const SingleColor = type === 1 ? { color: [color] } : {};
                    

                    const CategoryAxis = {
                        type: 'category',
                        axisTick: { alignWithLabel: true },
                        data: dataset.dimensions
                    };
                    
                    const ValueAxis = { type: 'value' };
                    
                    const options = {
                        ...SingleColor,
                        tooltip: {
                          trigger: 'axis',
                          axisPointer: {
                              type: 'shadow'
                          }
                        },
                        legend: {
                            data: dataset.data.map(e => e.name)
                        },
                        grid: {
                          left: '3%',
                          right: '4%',
                          bottom: '3%',
                          containLabel: true
                        },
                        xAxis: [],
                        yAxis: [],
                        series: dataset.data
                    }
                    
                    if(chartOrientation === 'v') {
                        options.xAxis.push(CategoryAxis);
                        options.yAxis.push(ValueAxis);
                    } else {
                        options.xAxis.push(ValueAxis);
                        options.yAxis.push(CategoryAxis);
                    }
                    
                    return options;
                }
			}]
        };
    });