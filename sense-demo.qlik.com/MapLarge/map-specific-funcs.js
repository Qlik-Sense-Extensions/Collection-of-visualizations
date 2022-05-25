define(['./maplarge-helpers'], function (mlHelpers) {

	var pointInPolyFuncs = function () {
		function MLgetPolyRange(thispaint, layout, mapConfig, cache, callback) {
			if (layout.props && layout.props.useCustomRange && layout.props.max > 0) {
				var rangedata = {
					max: layout.props.max,
					min: layout.props.min
				};
				callback(rangedata);
			} else if (cache.cachedMinMax) {
				callback(cache.cachedMinMax);
			} else {
				var parsedMeasure = mlHelpers.parseExpression(mapConfig.measureExpression);
				var pointCol = mlHelpers.toMLColumnName(parsedMeasure.column);

				var colAgg = pointCol + '.' + parsedMeasure.aggregate;
				var colCount = pointCol + '.count';
				//TODO filter outliers
				var resultdata = {};
				var maxQuery = ml.query()
					.select(colAgg)
					.select(colCount)
					.select('XY.key')
					.from(mapConfig.pointTable)
					.groupby('XY.PointInPoly.' + mapConfig.polyTable + '/' + mapConfig.polyTable.split('/')[1])  // we must have the geometry column appended to the table name with a slash
					.orderby(colAgg, 'desc')
					.take(2);

				if (mapConfig.hasAnimation)
					maxQuery.groupby(mlHelpers.toMLColumnName(mapConfig.animationField));

				maxQuery.run(function (data) {
					resultdata.max = data.data[colAgg][1] / 40;

					var minQuery = ml.query()
					.select(colAgg)
					.select(colCount)
					.select('XY.key')
					.from(mapConfig.pointTable)
					.groupby('XY.PointInPoly.' + mapConfig.polyTable + '/' + mapConfig.polyTable.split('/')[1])  // we must have the geometry column appended to the table name with a slash
					.orderby(colAgg, 'asc')
					.take(2);

					if (mapConfig.hasAnimation)
						minQuery.groupby(mlHelpers.toMLColumnName(mapConfig.animationField));

					minQuery.run(function (data2) {
						resultdata.min = data2.data[colAgg][1] / 40;

						cache.cachedMinMax = resultdata;

						callback(resultdata);
					});
				});
			}
		};

		function BuildPolyLayerObject(params) {

			var layerJson = {
				"query": {
					"select": {
						"type": "geo.poly"
					},
					//"where": (params.polyTable == 'world/statesAndProvincesShape') ? [[{ "col": "ISO", "test": "Equal", "value": "USA" }]] : [],
					"table": {
						"name": params.polyTable
					},
					"join": {
						"method": "PointInPolyJoin",
						"table": params.pointTable,
						"where": params.whereClause
					}
				},
				"style": {
					"method": "rules",
					"colorTransform": {
						"alpha": params.alpha
					}
				},
				"visible": true,
				"zIndex": "1",
				"opacity": "1",
				"type": "layer",
				"hoverFunc": function (data) {
					var value = Number(data.subTotals[params.column][params.agg]);

					return mlHelpers.formatValue(value);
				},
				"clickFunc": params.clickFunc,
				"hoverFieldsCommaDel": params.column + "~" + params.agg,
				special: {}
			};

			if (params.shadeMethod == 'numeric') {
				layerJson.style.method = 'interval';
				layerJson.style.shadeBy = params.pointTable + '.' + params.column + '.' + params.agg;
				layerJson.style.ranges = params.ranges;
				layerJson.style.colors = params.colors;

				layerJson.hoverFieldsCommaDel = params.column + "~" + params.agg;
				layerJson.hoverFunc = function (data) {
					var value = Number(data.subTotals[params.column][params.agg]);

					return mlHelpers.formatValue(value);
				};
			}

			return layerJson;
		}

		function HandlePolyClick(data, thispaint, layer, cache, mapConfig) {
			var colName = mlHelpers.toMLColumnName(mapConfig.selectField);

			var q = ml.query().select(colName).from(mapConfig.pointTable).take(1000000);

			if (cache.layerParams.whereClause && cache.layerParams.whereClause[0])
				q.wheres = ml.$.extend(true, {}, cache.layerParams).whereClause;

			var shapeCol = mapConfig.polyTable.split('/')[1];

			q.join(mapConfig.polyTable);
			q.joins.where = [[{ col: shapeCol, test: 'Contains', value: "COL(" + shapeCol + "),WKT(POINT(" + data.lng + " " + data.lat + "))" }]];
			//TODO: add group by

			var groupQ = ml.query().select(colName).from(q).groupby(colName).take(1000000);

			q = groupQ;

			q.run(function (data) {
				if (data.data && data.data[colName] && data.data[colName].length > 0) {

					var unique = {};
					//var uniqueArray = [];

					for (var i = 0; i < data.data[colName].length; i++)
						unique[data.data[colName][i]] = data.data[colName][i];

					//for (var key in unique)
					//	uniqueArray.push(unique[key]);

					mlHelpers.HandlePolyClick(unique, thispaint, thispaint.mapRefs.map, layer, cache, mapConfig, BuildPolyLayerObject, cache.layerParams, cache.selectionField);
				}
			});
		}

		return {
			getMapConfig: function (layout, extensionProps, tablePrefix) {
				var missingConfig = [];

				//get tables
				var polyTable = layout.props.polyTable;

				if (!polyTable) {
					var uploadedTables = mlHelpers.getQlikTables(false, true);

					if (uploadedTables.length >= 1)
						polyTable = uploadedTables[0];
				}

				if (!polyTable)
					polyTable = 'world/WorldStates2012';

				var pointTable = tablePrefix + mlHelpers.toMLColumnName(layout.props.pointField);

				//get fields
				var hasAnimation = layout.qHyperCube.qDimensionInfo.length > 1;

				var hyperCubeDef = extensionProps.properties.qHyperCubeDef;

				if (hyperCubeDef.qDimensions.length == 0)
					missingConfig.push("Missing first dimension (selection field)");
				else if (layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs.length > 1)
					missingConfig.push("Grouped dimension not supported for first dimension (selection field)");
				else
					var dimName = hyperCubeDef.qDimensions[0].qDef.qFieldDefs[0] || layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0];

				var measureDef, measureLabel;

				if (hyperCubeDef.qMeasures.length > 0) {
					measureDef = hyperCubeDef.qMeasures[0].qDef.qDef;
					measureLabel = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
				}
				else {
					//find the latitude column, so we can have a default count measure
					var tables = ml.servercache.FetchStoredTables(true);
					var tableParts = pointTable.split('/');

					for (var i = 0; i < tables.length; i++) {
						if (tables[i].acctcode == tableParts[0] && tables[i].name == tableParts[1]) {
							var columns = tables[i].columns.names.split(',');

							for (var j = 0; j < columns.length; j++) {
								var colLower = columns[j].toLowerCase();

								if (colLower == 'latitude' || colLower == 'lat') {
									measureDef = 'count(' + columns[j] + ')';
									measureLabel = 'Count';

									break;
								}
							}
						}
					}
				}

				var animationDimName = hasAnimation ? hyperCubeDef.qDimensions[1].qDef.qFieldDefs[0] : '';
				var animationDimIndex = 1;

				return {
					isComplete: missingConfig.length == 0,
					missingConfig: missingConfig,

					pointTable: pointTable,
					polyTable: polyTable,

					selectField: dimName,
					selectFieldIndex: 0,

					measureExpression: measureDef,
					measureLabel: measureLabel,

					hasAnimation: hasAnimation,
					animationField: animationDimName,
					animationFieldIndex: animationDimIndex
				};
			},

			BuildLayerObject: BuildPolyLayerObject,

			GetRange: MLgetPolyRange,

			HandleClick: HandlePolyClick
		};
	};

	var pointFuncs = function () {
		function MLgetPointRange(thispaint, layout, mapConfig, cache, callback) {
			if (layout.props && layout.props.useCustomRange && layout.props.max > 0) {
				var rangedata = {
					max: layout.props.max,
					min: layout.props.min
				};
				callback(rangedata);
			} else if (cache.cachedMinMax) {
				callback(cache.cachedMinMax);
			} else {
				var pointCol = mlHelpers.toMLColumnName(mapConfig.measureExpression);
				var colMax = pointCol + '.max';
				var colMin = pointCol + '.min';

				var resultdata = {};
				var maxQuery = ml.query()
					.select('*')
					.select(colMax)
					.select(pointCol + '.key')
					.from(mapConfig.pointTable)
					.groupby(pointCol + '.count.100')
					.orderby(pointCol, 'desc')
					.take(100);

				//if (animationCol)
				//	maxQuery.groupby(animationCol);

				maxQuery.run(function (data) {
					resultdata.max = data.data[pointCol + '.max'][5];
					resultdata.max = Math.round(resultdata.max * 100) / 100;

					var minQuery = ml.query()
					//.select('*')
					.select(colMin)
					.select(pointCol + '.key')
					.from(mapConfig.pointTable)
					.groupby(pointCol + '.count.100')
					.orderby(pointCol, 'asc')
					.take(100);

					//if (animationCol)
					//	minQuery.groupby(animationCol);

					minQuery.run(function (data2) {
						resultdata.min = data2.data[pointCol + '.min'][5];
						resultdata.min = Math.round(resultdata.min * 100) / 100;

						cache.cachedMinMax = resultdata;

						callback(resultdata);
					});
				});
			}
		};

		function BuildPointLayerObject(params) {
			var layerJson = {
				"query": {
					"select": {
						"type": "geo.dot"
					},
					"where": params.whereClause,
					"table": {
						"name": params.pointTable
					}
				},
				"style": {
					"method": "rules",
					"shape": "round",
					"height": "6",
					"width": "6",
					"colorTransform": {
						"alpha": params.alpha
					}
				},
				"visible": true,
				"zIndex": "1",
				"opacity": "1",
				"type": "layer",
				
				"clickFunc": params.clickFunc,
				special: {}
			};

			if (params.shadeMethod == 'numeric') {
				layerJson.style.method = 'interval';
				layerJson.style.shadeBy = params.pointTable + '.' + params.column;
				layerJson.style.ranges = params.ranges;
				layerJson.style.colors = params.colors;

				layerJson.hoverFieldsCommaDel = params.column;
				layerJson.hoverFunc = function (data) {
					var value = Number(data.data[params.column]);

					return mlHelpers.formatValue(value);
				};
			}

			return layerJson;
		};

		return {
			getMapConfig: function (layout, extensionProps, tablePrefix) {
				var missingConfig = [];

				//get fields
				var hasAnimation = layout.qHyperCube.qDimensionInfo.length > 2;

				var hyperCubeDef = extensionProps.properties.qHyperCubeDef;

				if (hyperCubeDef.qDimensions.length == 0 || layout.qHyperCube.qDimensionInfo.length == 0)
					missingConfig.push("Missing first dimension (selection field)");
				else if (layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs.length > 1)
					missingConfig.push("Grouped dimension not supported for first dimension (selection field)");
				else
					var dimName = hyperCubeDef.qDimensions[0].qDef.qFieldDefs[0] || layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0];
					

				var measureDef = null, measureLabel = null;

				if (hyperCubeDef.qDimensions.length > 1) {
					if (layout.qHyperCube.qDimensionInfo[1].qGroupFieldDefs.length > 1)
						missingConfig.push("Grouped dimension not supported for second dimension (shade by field)");
					else {
						measureDef = hyperCubeDef.qDimensions[1].qDef.qFieldDefs[0] || layout.qHyperCube.qDimensionInfo[1].qGroupFieldDefs[0];
						measureLabel = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;

						if (/\w/.test(measureDef) && !/\[.+\]/.test(measureDef))
							measureDef = "[" + measureDef + "]";
					}
				}

				var animationDimName = hasAnimation ? hyperCubeDef.qDimensions[2].qDef.qFieldDefs[0] : '';
				var animationDimIndex = 2;

				//get tables
				var pointTable = tablePrefix + mlHelpers.toMLColumnName(layout.props.pointField);

				return {
					isComplete: missingConfig.length == 0,
					missingConfig: missingConfig,

					pointTable: pointTable,
					polyTable: null,

					selectField: dimName,
					selectFieldIndex: 0,

					measureExpression: measureDef,
					measureLabel: measureLabel,

					hasAnimation: hasAnimation,
					animationField: animationDimName,
					animationFieldIndex: animationDimIndex
				};
			},

			BuildLayerObject: BuildPointLayerObject,

			GetRange: MLgetPointRange,

			HandleClick: function (data, thispaint, layer, cache, mapConfig) {
				var value = data.data[mlHelpers.toMLColumnName(mapConfig.selectField)];

				if (value != undefined) {
					var obj = {};
					obj[value] = value;

					mlHelpers.HandlePolyClick(obj, thispaint, thispaint.mapRefs.map, layer, cache, mapConfig, BuildPointLayerObject, cache.layerParams, cache.selectionField);
				}
			}
		};
	};

	var typeFuncs = {
		pointInPoly: pointInPolyFuncs(),
		point: pointFuncs()
	}

	return typeFuncs;
});