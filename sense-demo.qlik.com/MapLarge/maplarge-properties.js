define(['ng!$q', './maplarge-helpers', 'qvangular'], function ($q, mlHelpers, qvangular) {
	var palette = [
		"#b0afae",
		"#7b7a78",
		"#545352",
		"#4477aa",
		"#7db8da",
		"#b6d7ea",
		"#46c646",
		"#f93f17",
		"#ffcf02",
		"#276e27",
		"#ffffff",
		"#000000"
	];


	var savedLayersDeferred;
	var lastSavedLayersLoadTime;

	var getSavedLayers = function () {
		if (savedLayersDeferred && Date.now() - lastSavedLayersLoadTime < 10000) //cache saved layers
			return savedLayersDeferred.promise;

		var defer = $q.defer();

		var query = new ml.widget.query('select');
		query.cachebust(true);
		query.type('layer');
		//query.security(true);
		query.run(function (data) {
			var items = [{ label: '', value: '' }];

			for (var a = 0; a < data.records.length; a++) {
				var d = data.records[a];
				var _name = d.name.split('/');
				
				var name = _name[1];

				if (d.tags.description)
					name += ' - ' + d.tags.description;

				items.push({
					label: name,
					value: d.id
				})
			}

			defer.resolve(items);
		});

		savedLayersDeferred = defer;
		lastSavedLayersLoadTime = Date.now();

		return defer.promise;
	}

	//var savedGeoFieldsDeferred;

	var getGeoFields = function () {
		//if (savedGeoFieldsDeferred)
		//	return savedGeoFieldsDeferred.promise;

		//var defer = $q.defer();

		var fields = mlHelpers.getPossiblePointFields();

		fields.sort();

		var items = [];

		for (var i = 0; i < fields.length; i++) {
			items.push({ label: fields[i], value: fields[i] });
		}

		return items;
		//defer.resolve(items);

		//savedGeoFieldsDeferred = defer;

		//return defer.promise;
	}

	//getGeoFields();

	var props = {
		type: "items",
		component: "accordion",
		items: {
			data: {
				component: "expandable-items",
				label: "Map",
				items: {
					header1: {
						type: "items",
						label: "Configuration",
						items: {
							mapType: {
								label: "Map Type",
								type: "string",
								ref: "props.mapType",
								defaultValue: "point",
								component: "dropdown",
								options: [{
									value: "point",
									label: "Point"
								}, {
									value: "pointInPoly",
									label: "Point in Poly"
								}]
							},
							pointField: {
								label: "Point Dataset",
								type: "string",
								ref: "props.pointField",
								component: "dropdown",
								//defaultValue: function () { return mlHelpers.getDefaultGeoField(); },
								options: function () {
									return getGeoFields();
								}
							},
							polyTable: {
								label: "Group by",
								type: "string",
								ref: "props.polyTable",
								//defaultValue: "maplarge/County2012",
								component: "dropdown",
								show: function (data) {
									return data.props.mapType == 'pointInPoly';
								},
								options: function (data) {
									var items = [];
									var prefix = mlHelpers.getTablePrefix();

									//add uploaded tables first
									var uploadedTables = mlHelpers.getQlikTables(false, true);
									
									uploadedTables.sort();

									for (var i = 0; i < uploadedTables.length; i++)
										items.push({ value: uploadedTables[i], label: uploadedTables[i].substr(prefix.length) });


									//get non-uploaded tables
									if (items.length == 0 || data.props.showAllPolyTables) {
										var tables = ml.servercache.FetchStoredTables(true) || [];
										var tableNames = [];

										for (var i = 0; i < tables.length; i++) {
											if (tables[i].isPoly) {
												var table = tables[i].acctcode + '/' + tables[i].name;

												if (!table.startsWith(prefix))
													tableNames.push(table);
											}
										}

										tableNames.sort();

										for (var i = 0; i < tableNames.length; i++)
											items.push({ value: tableNames[i], label: tableNames[i] });
									}

									return items;
								}
							},
							showAll: {
								label: "Include all available tables",
								type: "boolean",
								ref: "props.showAllPolyTables",
								defaultValue: false,
								show: function (data) {
									return mlHelpers.getQlikTables(false, true).length > 0;
								}
							}
						}
					},
					behavior: {
						label: "Behavior",
						type: "items",
						items: {
							sync: {
								label: "Sync with other maps",
								type: "boolean",
								component: "switch",
								ref: "behavior.syncEnabled",
								options: [{
									label: "Disabled",
									value: false
								}, {
									label: "Enabled",
									value: true
								}],
								defaultValue: false
							},
							popout: {
								label: "Enable map pop-out",
								type: "boolean",
								component: "switch",
								ref: "props.popoutEnabled",
								options: [{
									label: "Disabled",
									value: false
								}, {
									label: "Enabled",
									value: true
								}],
								defaultValue: false
							},
							drawing: {
								label: "Enable drawing tools in fullscreen view",
								type: "boolean",
								component: "switch",
								ref: "props.drawingEnabled",
								options: [{
									label: "Disabled",
									value: false
								}, {
									label: "Enabled",
									value: true
								}],
								defaultValue: false
							}
						}
					},
					selection: {
						label: "Selection",
						type: "items",
						items: {
							mapType: {
								label: "Default method",
								type: "string",
								ref: "props.defaultSelectTool",
								defaultValue: "polygon",
								component: "dropdown",
								options: [{
									value: "circle",
									label: "Circle"
								}, {
									value: "polyline",
									label: "Line"
								}, {
									value: "marker",
									label: "Point"
								}, {
									value: "polygon",
									label: "Polygon"
								}, {
									value: "rectangle",
									label: "Rectangle"
								}]
							},
							distance: {
								label: 'Distance Within (for line and point)',
								type: 'number',
								ref: 'props.selectDWithin',
								defaultValue: 100,
								component: 'slider',
								min: 1,
								max: 1000,
								step: 1
							},
							distanceUnit: {
								//label: 'Distance unit',
								type: 'string',
								ref: 'props.selectDWithinUnit',
								defaultValue: 'km',
								component: 'radiobuttons',
								options: function (data) {
									return [{
										value: 'm',
										label: data.props.selectDWithin + ' Meters'
									}, {
										value: 'km',
										label: data.props.selectDWithin + ' Kilometers'
									}];
								},
								/*options: [{
									value: 'm',
									label: 'Meters'
								}, {
									value: 'km',
									label: 'Kilometers'
								}]*/
							}
						}
					}
				}
			},
			dimensions: {
				uses: "dimensions",
				min: 0,
				max: 3
			},
			measures: {
				uses: "measures",
				min: 0,
				max: 1
			},
			settings: {
				uses: "settings",
				items: {
					colors: {
						label: "Colors",
						type: "items",
						items: {
							useCustomColors: {
								label: "Custom Colors",
								type: "boolean",
								component: "switch",
								ref: "colors.useCustomColors",
								options: [{
									label: "Disabled",
									value: false
								}, {
									label: "Enabled",
									value: true
								}],
								defaultValue: false
							},
							NumberOfColors: {
								label: "Number of Colors",
								type: "string",
								ref: "colors.number",
								defaultValue: "2",
								component: "dropdown",
								options: [{
									value: "2",
									label: "2"
								}, {
									value: "3",
									label: "3"
								}]
							},
							MinColor: {
								type: "string",
								expression: "optional",
								component: "color-picker",
								label: "Min Color",
								ref: "colors.min",
								show: function (data) {
									return true;
									//if(data.color.type){
									//	return false;
									//}
									//else{
									//	if (!data.onlyonemeasure && data.qHyperCubeDef.qMeasures.length > 1) { //if a color measure is added don't display this property
									//		return false;
									//	}
									//	else{
									//		return true;
									//	}
									//}
								},
								defaultValue: 7
							},
							MiddleColor: {
								type: "string",
								expression: "optional",
								component: "color-picker",
								label: "Middle Color",
								ref: "colors.middle",
								show: function (data) {
									return data.colors.number == "3";
								},
								//defaultValue: 10
							},
							MaxColor: {
								type: "string",
								expression: "optional",
								component: "color-picker",
								label: "Max Color",
								ref: "colors.max",
								show: function (data) {
									return true;
									//if(data.color.type){
									//	return false;
									//}
									//else{
									//	if (!data.onlyonemeasure && data.qHyperCubeDef.qMeasures.length > 1) { //if a color measure is added don't display this property
									//	}
									//	else{
									//		return true;
									//	}
									//}
								},
								defaultValue: 4
							},
						}
					},
					range: {
						label: "Range Min/Max",
						type: "items",
						items: {
							useCustomRange: {
								label: "Custom Range",
								type: "boolean",
								component: "switch",
								ref: "props.useCustomRange",
								options: [{
									label: "Disabled",
									value: false
								}, {
									label: "Enabled",
									value: true
								}],
								//ref: "waterfall.useoffset",
								defaultValue: false
							},
							min: {
								label: "Min",
								type: "number",
								expression: "optional",
								ref: "props.min"
							},
							max: {
								label: "Max",
								type: "number",
								expression: "optional",
								ref: "props.max"
							}
						}
					},
					initialPosition: {
						label: "Initial Position",
						type: "items",
						items: {
							ne: {
								label: "Northeast Corner",
								type: "string",
								ref: "props.initialPosition.ne"
							},
							sw: {
								label: "Southwest Corner",
								type: "string",
								ref: "props.initialPosition.sw"
							},
							set: {
								label: "Set Position",
								component: "button",
								action: function (data) {
									var latlong = window.mlCache[data.qInfo.qId].layer0Extents;

									if (latlong) {
										if (!data.props)
											data.props = {};

										data.props.initialPosition = {
											ne: latlong.ne.lat + ", " + latlong.ne.lng,
											sw: latlong.sw.lat + ", " + latlong.sw.lng
										};
									}

									//qvangular.$rootScope.appIsDirty = true;
									//undocumented way to get Qlik to detect the change
									//got the 'saveProperties' event from looking at what happens on change for a text field
									var scope = angular.element($("div.qv-panel-properties button:contains('Set Position')")).scope();
									scope.$emit("saveProperties", data);
								}
							}
						}
					}
				}
			},
			extraLayers: {
				//type: "items", //<== not necessary to define "items"
				component: "expandable-items",
				label: "Additional Layers",
				items: {
					header1: {
						type: "items",
						label: "Behavior",
						items: {
							showLayers: {
								label: "Show Additional Layers",
								type: "boolean",
								component: "switch",
								ref: "props.showExtraLayers",
								options: [{
									label: "No",
									value: false
								}, {
									label: "Yes",
									value: true
								}],
								defaultValue: true
							},
							layerPlacement: {
								label: "Placement",
								type: "string",
								component: "radiobuttons",
								ref: "props.extraLayersPosition",
								options: [{
									label: "Above data layer",
									value: "Above"
								}, {
									label: "Below data layer",
									value: "Below"
								}],
								defaultValue: "Below"
							}
						}
					},
					header2: {
						type: "items",
						label: "Layers",
						items: {
							layer1: {
								type: "string",
								component: "dropdown",
								label: "Layer 1",
								ref: "props.extraLayers.layer1",
								defaultValue: "",
								show: function (data) {
									return true;//data.props.isActionsBefore;
								},
								options: function () {
									return getSavedLayers().then(function (items) {
										return items;
									});
								}
							},
							layer2: {
								type: "string",
								component: "dropdown",
								label: "Layer 2",
								ref: "props.extraLayers.layer2",
								defaultValue: "",
								show: function (data) {
									return data.props.extraLayers && (data.props.extraLayers.layer1 || data.props.extraLayers.layer2);
								},
								options: function () {
									return getSavedLayers().then(function (items) {
										return items;
									});
								}
							},
							layer3: {
								type: "string",
								component: "dropdown",
								label: "Layer 3",
								ref: "props.extraLayers.layer3",
								defaultValue: "",
								show: function (data) {
									return data.props.extraLayers && (data.props.extraLayers.layer2 || data.props.extraLayers.layer3);
								},
								options: function () {
									return getSavedLayers().then(function (items) {
										return items;
									});
								}
							}
						}
					}
				}
			}
		}
	}

	return props;
});
