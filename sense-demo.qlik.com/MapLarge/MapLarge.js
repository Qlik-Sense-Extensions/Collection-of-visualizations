define(['jquery', './maplarge-properties', 'qlik', './maplarge-helpers', './map-specific-funcs'],
	function ($, properties, qlik, mlHelpers, mapFuncs) {
		'use strict';

		function monkeyPatchLeaflet(map) {
			//monkey patch scrollwheel handling inside leaflet
			//Qlik sends 2 wheel events at once, the second with a delta of +/- 3. This patch will ignore the second event
			var leafletMap = map.getInternalMap();
			var wheelScroll = leafletMap.scrollWheelZoom._onWheelScroll;

			leafletMap.scrollWheelZoom.removeHooks.call(leafletMap.scrollWheelZoom);

			leafletMap.scrollWheelZoom._onWheelScroll = function (e) {
				var delta = L.DomEvent.getWheelDelta(e);

				if ((delta >= 3 || delta <= -3) && this._delta != 0)
					return;

				wheelScroll.call(leafletMap.scrollWheelZoom, e);
			};

			leafletMap.scrollWheelZoom.addHooks.call(leafletMap.scrollWheelZoom);
		}

		var pageSize = {
			width: 5,
			height: 100
		};

		//shared cache
		if (!window.mlCache)
			window.mlCache = {};

		return {
			definition: properties,
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [
						{
							qWidth: pageSize.width,
							qHeight: pageSize.height
						}
					]
				},
				MapLargeURL: {
					qStringExpression: "=$(MapLargeURL)"
				},
				MapLargeCredentials: {
					qStringExpression: "=$(MapLargeCredentials)"
				},
				MapLargeLastUpload: {
					qStringExpression: "=$(MapLargeLastUpload)"
				},
				MapLargeTablePrefix: {
					qStringExpression: "=$(MapLargeTablePrefix)"
				},
				LastDataReload: {
					qStringExpression: "=ReloadTime()"
				},
				selectionMode: 'CONFIRM'
			},

			//Paint resp.Rendering logic
			paint: mlHelpers.PaintExtension(qlik, function ($element, layout, thispaint, currentMode, props, activeSelections, cache, tablePrefix) {
				var funcs = mapFuncs[layout.props.mapType || 'point'];

				var mapConfig = funcs.getMapConfig(layout, props, tablePrefix);

				if (!mapConfig.isComplete) {
					thispaint.mapRefs = null;
					mlHelpers.DisplayError($element, 'Incomplete visualization', mapConfig.missingConfig, 'soft-error');
					return;
				}

				//check if sync should be disabled
				var newSyncSetting = layout.behavior && layout.behavior.syncEnabled;

				if (cache.currentSyncSetting && !newSyncSetting && window.mlSync && thispaint.mapRefs) {
					//disabling sync
					window.mlSync.removeMap(thispaint.mapRefs.map);
					thispaint.mapRefs = null;
				}

				//check if we need to create map
				if (!thispaint.mapRefs) {
					$element.empty();

					//fix Qlik's right-click shading
					$element.closest('div.cell').children('div.greyDim').css('z-index', 1);

					//create map
					$element.append(
						'<div style="position: absolute; top:10px; right:10px;z-index:100;">' +
							'<div class="select-button" style="background: #fff;border-radius: 4px;padding:2px;box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 1px 1px;opacity:.7;">' +
								'<button class="point-in-poly-lasso" style="background:#fff;cursor:pointer;padding: 4px 6px 0 4px;border: none;vertical-align: middle;font-size:16px;color:#000"><i class="mlicon-MapLarge-icons_polygon" /></button>' +
								'<button class="additional-selection-button" style="background:#fff;cursor:pointer;padding: 4px 3px;border: none;border-left:1px solid #bbb;vertical-align: middle;font-size:10px;color:#000" data-jq-dropdown="#ml-mapeditor-layer-dropdown-menu' + thispaint.options.id + '">&#x25BC</button>' +
							'</div>' +
							'<div id="ml-mapeditor-layer-dropdown-menu' + thispaint.options.id + '" class="jq-dropdown jq-dropdown-tip jq-dropdown-relative jq-dropdown-anchor-right" style="display:none">' +
								'<ul class="jq-dropdown-menu" style="min-width:0">' +
									'<li><a href="#" data-type="circle">Circle</a></li>' +
									'<li><a href="#" data-type="polyline">Line</a></li>' +
									'<li><a href="#" data-type="marker">Point</a></li>' +
									'<li><a href="#" data-type="polygon">Polygon</a></li>' +
									'<li><a href="#" data-type="rectangle">Rectangle</a></li>' +
								'</ul>' +
							'</div>' +
						'</div>');
					$element.append('<button class="save-map-button" style="display:none;position: absolute; top:50px; right:10px;z-index:99;background: #fff;border-radius: 4px;border: none;padding: 4px 4px 0 4px;cursor: pointer;box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 1px 1px;opacity:.7"><img src="/extensions/MapLarge/save.png" alt="Lasso Tool" height="24" width="24"></button>');
					

					var mapDiv = document.createElement('div');
					$(mapDiv).height('100%');
					$(mapDiv).width('100%');
					$(mapDiv).addClass('mapContainer');
					$element.append(mapDiv);

					var mapOptions = new ml.ui.map.MapOptions();
					mapOptions.searchBox = false;
					mapOptions.disableReverseGeocoder = true;

					thispaint.mapRefs = {
						map: ml.map(mapDiv, mapOptions),
						layers: [],
						extraLayers: [],
						animatedLayer: null
					};

					//reset position
					if (!cache.layer0Extents)
						mlHelpers.SetInitialPosition(cache, layout);

					//fix for Qlik wheel events
					monkeyPatchLeaflet(thispaint.mapRefs.map);
					
					//set initial position
					if (cache.layer0Extents)
						thispaint.mapRefs.map.setBounds(cache.layer0Extents.sw, cache.layer0Extents.ne);

					//keep track of position as user moves map
					var positionChange = function() {
						if (cache.layer0Extents && thispaint.mapRefs && thispaint.mapRefs.map) { //only update if it's already set
							var latlong = thispaint.mapRefs.map.getVisibleBB();

							if (latlong.minLat != latlong.maxLat) {
								cache.layer0Extents = {
									sw: { lat: latlong.minLat, lng: latlong.minLng },
									ne: { lat: latlong.maxLat, lng: latlong.maxLng }
								};
							}
						}
					}

					thispaint.mapRefs.map.center.addChangeListner(positionChange);
					thispaint.mapRefs.map.zoom.addChangeListner(positionChange);

					//add any saved drawings
					if (layout.mapDrawings) {
						thispaint.mapRefs.map.addDrawings(layout.mapDrawings);
					}

					//add animation controls
					$element.append('<div style="width: 100%;margin-top:5px;text-align:center;display:none;" class="animationLabelDiv"></div>');
					$element.append('<div style="width: 100%;display:none" class="animationControlDiv"></div>');
				}

				var mapRefs = thispaint.mapRefs;

				var setSelectTool = function (tool) {
					cache.selectTool = tool;

					var icon;

					switch (tool) {
						case "circle":
							icon = "mlicon-MapLarge-icons_circle";
							break;
						case "polyline":
							icon = "mlicon-MapLarge-icons_polyline";
							break;
						case "marker":
							icon = "mlicon-MapLarge-icons_annotations";
							break;
						case "polygon":
							icon = "mlicon-MapLarge-icons_polygon";
							break;
						case "rectangle":
							icon = "mlicon-MapLarge-icons_rectangle";
							break;
					}

					$('.point-in-poly-lasso i', $element).removeClass().addClass(icon);
				}

				var startSelection = function () {
					if (mapRefs.animatedLayer && mapRefs.animatedLayer.isPlaying)
						mapRefs.animatedLayer.stop();

					mlHelpers.MLRegionSelect(thispaint, cache, mapRefs.map, layout, thispaint.backendApi, activeSelections, mapConfig, funcs.BuildLayerObject, cache.layerParams, cache.selectionField);
				}

				$element.unbind('click').click(function (event) {
					if (currentMode == 'edit') {
						event.preventDefault();
						$element.closest('div.cell').trigger("qv-activate");
					}
				});

				$('.point-in-poly-lasso', $element).unbind('click').click(function (event) {
					event.preventDefault();

					if (currentMode == 'analysis') {
						startSelection();
					}
				});

				$('#ml-mapeditor-layer-dropdown-menu' + thispaint.options.id + ' a').unbind('click').click(function (event) {
					event.preventDefault();

					if (currentMode == 'analysis') {
						setSelectTool($(this).data('type'));

						//ml.$('.additional-selection-button', $element).jqDropdown('hide');
						//$('#ml-mapeditor-layer-dropdown-menu' + thispaint.options.id).hide();
						$('.additional-selection-button', $element).click();

						startSelection();
					}

					return false;
				});

				setSelectTool(cache.selectTool || layout.props.defaultSelectTool || 'polygon');

				if (layout.props.popoutEnabled)
					$('.save-map-button', $element).show();
				else
					$('.save-map-button', $element).hide();

				$('.save-map-button', $element).unbind('click').click(function (event) {
					if (currentMode == 'analysis') {
						event.stopPropagation();

						var data =  mapRefs.map.save();

						for (var i = 0; i < data.layers.length; i++) {
							delete data.layers[i].clickFunc;
							delete data.layers[i].hoverFunc;
						}

						var widget = {
							name: tablePrefix + "savedmap",
							type: "map",
							tags: { createdBy: 'qlik' },
							data: data
						};

						ml.widget.save(widget, function (response) {
							window.open(ml.url("/Map.html?id=" + response.data, '', null, '', false));
						});
					}
				});

				//show/hide animation controls
				if (mapConfig.hasAnimation) {
					$('.mapContainer', $element).height('calc(100% - 60px)');

					$('.animationLabelDiv', $element).show();
					$('.animationControlDiv', $element).show();
				}
				else {
					$('.mapContainer', $element).height('100%');

					$('.animationLabelDiv', $element).hide();
					$('.animationControlDiv', $element).hide();
				}

				//check if we should enable map sync
				if (!cache.currentSyncSetting && newSyncSetting) {
					if (!window.mlSync)
						window.mlSync = new ml.ui.map.MapSync([mapRefs.map]);
					else
						window.mlSync.addMap(mapRefs.map);
				}

				cache.currentSyncSetting = newSyncSetting;



				//check if dimension or measure changed
				var dimOrMeasureChanged = !cache.lastMapConfig ||
					mapConfig.selectField != cache.lastMapConfig.selectField || mapConfig.measureExpression != cache.lastMapConfig.measureExpression || mapConfig.animationFieldName != cache.lastMapConfig.animationFieldName;

				if (dimOrMeasureChanged) {
					cache.lastMapConfig = mapConfig;

					cache.cachedMinMax = null; //force recalculation

					//load selection field
					if (cache.selectionField) {
						cache.selectionField.close();
					}

					qlik.currApp(thispaint).createList({
						"qDef": {
							"qFieldDefs": [
								mapConfig.selectField
							]
						},
						"qInitialDataFetch": [{
							qTop: 0,
							qLeft: 0,
							qHeight: 10000,
							qWidth: 1
						}]
					}).then(function (obj) {
						cache.selectionField = obj;
					});
				}

				//clean up measure name
				var parsedMeasure = { column: null };

				if (mapConfig.measureExpression)
					parsedMeasure = mlHelpers.parseExpression(mapConfig.measureExpression);

				if (!parsedMeasure) {
					thispaint.mapRefs = null;
					mlHelpers.DisplayError($element, 'Invalid Configuration', 'Expression not supported: ' + mapConfig.measureExpression, 'soft-error');
					return;
				} else if (parsedMeasure.distinct) {
					thispaint.mapRefs = null;
					mlHelpers.DisplayError($element, 'Invalid Configuration', 'Distinct not supported in expression: ' + mapConfig.measureExpression, 'soft-error');
					return;
				} else if (parsedMeasure.aggregate && ['count', 'avg', 'min', 'max', 'sum'].indexOf(parsedMeasure.aggregate) == -1) {
					thispaint.mapRefs = null;
					mlHelpers.DisplayError($element, 'Invalid Configuration', 'Unsupported function: ' + parsedMeasure.aggregate, 'soft-error');
					return;
				}

				//make sure tables exist
				if (!mlHelpers.DoesTableExist(mapConfig.pointTable)) {
					thispaint.mapRefs = null;
					mlHelpers.DisplayError($element, 'Table not Found', 'Could not find table ' + mapConfig.pointTable + ' on MapLarge instance ' + layout.MapLargeURL, 'hard-error');
					return;
				}
				if (mapConfig.polyTable && !mlHelpers.DoesTableExist(mapConfig.polyTable)) {
					thispaint.mapRefs = null;
					mlHelpers.DisplayError($element, 'Table not Found', 'Could not find table ' + mapConfig.polyTable + ' on MapLarge instance ' + layout.MapLargeURL, 'hard-error');
					return;
				}

				mlHelpers.GetTableInformation(mapConfig.pointTable, function (pointTableInfo) {

					var shadeMethod = 'none';

					//make sure the fields exist on table
					if (!mlHelpers.doesColumnExist(pointTableInfo, mapConfig.selectField)) {
						thispaint.mapRefs = null;
						mlHelpers.DisplayError($element, 'Invalid Configuration', 'Field ' + mapConfig.selectField + ' does not exist in MapLarge dataset', 'hard-error');
						return;
					}

					if (!parsedMeasure.column) {
						shadeMethod = 'none';
					}
					else if (!mlHelpers.doesColumnExist(pointTableInfo, parsedMeasure.column)) {
						thispaint.mapRefs = null;
						mlHelpers.DisplayError($element, 'Invalid Configuration', 'Field ' + parsedMeasure.column + ' does not exist in MapLarge dataset', 'hard-error');
						return;
					} else {
						var col = mlHelpers.getColumnInfo(pointTableInfo, parsedMeasure.column);

						if (col.type == "Int32" || col.type == "Int64" || col.type == "Double")
							shadeMethod = 'numeric';
						else {
							thispaint.mapRefs = null;
							mlHelpers.DisplayError($element, 'Invalid Configuration', 'The field used for shading must be numeric. ' + parsedMeasure.column + ' is a ' + col.type + ' field.', 'soft-error');
							return;
						}
					}

					if (mapConfig.animationField && !mlHelpers.doesColumnExist(pointTableInfo, mapConfig.animationField)) {
						thispaint.mapRefs = null;
						mlHelpers.DisplayError($element, 'Invalid Configuration', 'Field ' + mapConfig.animationField + ' does not exist in MapLarge dataset', 'hard-error');
						return;
					}

					//clear tooltip and outlines
					mapRefs.map.clearAllMarkers();

					if (mapRefs.map.toolTip)
						mapRefs.map.toolTip.hide();

					//add layers

					var layerParams = {
						polyTable: mapConfig.polyTable,
						pointTable: mapConfig.pointTable,
						whereClause: null,
						shadeMethod: shadeMethod,
						columnLabel: mapConfig.measureLabel,
						column: parsedMeasure.column ? mlHelpers.toMLColumnName(parsedMeasure.column) : null,
						agg: parsedMeasure.aggregate,
						alpha: .74,
						//colors: colors,
						//ranges: ranges,
						clickFunc: function (data, layer) {
							if (currentMode == 'analysis') {
								if (mapRefs.animatedLayer && mapRefs.animatedLayer.isPlaying)
									mapRefs.animatedLayer.stop();

								funcs.HandleClick(data, thispaint, layer, cache, mapConfig);
							}
						}
					};

					cache.layerParams = layerParams;

					function render(legend) {
						if (mapConfig.hasAnimation) {
							mlHelpers.CreateAnimationLayers(qlik, $element, thispaint, mapConfig, currentMode, layerParams, activeSelections, legend, funcs.BuildLayerObject, pointTableInfo, cache);
						}
						else {
							layerParams.whereClause = mlHelpers.buildWhere(activeSelections, pointTableInfo);

							var layerJson = funcs.BuildLayerObject(layerParams);

							if (legend)
								layerJson.legend = legend;

							if (mapRefs.layers.length == 0) {
								mapRefs.layers.push(new ml.layer(mapRefs.map, layerJson, mlHelpers.OnLayerLoad(mapRefs, cache, true)));
							}
							else {
								if (!legend)
									mapRefs.layers[0].removeLegend();

								mapRefs.layers[0].load(layerJson);
							}

						}
					}

					if (shadeMethod == 'numeric') {
						// let's get our colors
						if (!layout.colors) {
							layout.colors = {
								max: 4,
								min: 7
							};
						}

						var scale = mlHelpers.getColorScale(layout.colors);
						var customColors = scale.getEquidistantColors(10);
						var legendColors = scale.getEquidistantColors(5);

						//get ranges and update map
						funcs.GetRange(thispaint, layout, mapConfig, cache, function (data) {
							var max = 0, min = 0, intervals = 20;

							max = data.max;
							min = data.min;

							if (Math.abs(max) >= 1000 || Math.abs(min) >= 1000) {
								max = +max.toFixed(0);
								min = +min.toFixed(0);
							}

							var interval = (max - min) / 5;

							var ranges = [
									{
										"min": min,
										"max": min + (interval * 1)
									},
									{
										"min": min + (interval * 1),
										"max": min + (interval * 2)
									},
									{
										"min": min + (interval * 2),
										"max": min + (interval * 2.5)
									},
									{
										"min": min + (interval * 2.5),
										"max": min + (interval * 3)
									},
									{
										"min": min + (interval * 3),
										"max": min + (interval * 5)
									}
							];

							var colors = (layout.colors && layout.colors.useCustomColors) ? [
									{
										"min": customColors[0],
										"max": customColors[1]
									},
									{
										"min": customColors[2],
										"max": customColors[3]
									},
									{
										"min": customColors[4],
										"max": customColors[5]
									},
									{
										"min": customColors[6],
										"max": customColors[7]
									},
									{
										"min": customColors[8],
										"max": customColors[9]
									}
							] : mlHelpers.defaultColors;

							var legend = legend = {
								"title": mapConfig.measureLabel,
								"scale": (layout.colors && layout.colors.useCustomColors) ? [
									legendColors[0],
									legendColors[1],
									legendColors[2],
									legendColors[3],
									legendColors[4]
								] : mlHelpers.defaultLegend,
								"min": mlHelpers.formatValue(min),
								"max": mlHelpers.formatValue(max)
							};

							layerParams.colors = colors;
							layerParams.ranges = ranges;

							render(legend);
						});
					} else {
						render();
					}
				}, function () {
					thispaint.mapRefs = null;
					mlHelpers.DisplayError($element, 'Table not Found', 'Could not find table ' + mapConfig.pointTable + ' on MapLarge instance ' + layout.MapLargeURL, 'hard-error');
					return;
				});
			})
		};
	});