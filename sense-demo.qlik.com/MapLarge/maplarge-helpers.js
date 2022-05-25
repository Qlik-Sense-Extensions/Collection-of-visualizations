define(['qlik'], function (qlik) {
	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function (searchString, position) {
			position = position || 0;
			return this.substr(position, searchString.length) === searchString;
		};
	}

	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function (searchString, position) {
			var subjectString = this.toString();
			if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
				position = subjectString.length;
			}
			position -= searchString.length;
			var lastIndex = subjectString.indexOf(searchString, position);
			return lastIndex !== -1 && lastIndex === position;
		};
	}

	var defaultGeoField;
	var tablePrefix;

	var mlHelpers = {
		// Qlik Sense Palette for Color Picker - this is defined by them.
		// TODO Can we set our own custom palette?
		palette: [
			"#b0afae",
			"#7b7a78",
			"#545352",
			"#4477aa",
			"#7db8da",
			"#b6d7ea",
			"#46c646",
			"#f93f17",
			"#ffcf02",//yellow
			"#276e27",
			"#ffffff",
			"#000000"
		],

		defaultColors: [
			  {
			  	"min": "DarkRed",
			  	"max": "Red"
			  },
			  {
			  	"min": "Red",
			  	"max": "White"
			  },
			  {
			  	"min": "White",
			  	"max": "LightBlue"
			  },
			  {
			  	"min": "LightBlue",
			  	"max": "Blue"
			  },
			  {
			  	"min": "Blue",
			  	"max": "DarkBlue"
			  }
		],

		defaultLegend: [
			  "#ff0000",
			  "#ff7f7f",
			  "#ffffff",
			  "#7f7fff",
			  "#0000ff"
		],

		toMLColumnName: function (qlikName) {
			//remove ML-invalid characters
			return qlikName.replace(/[\W_]/g, '');
		},

		getCellValue: function (cell) {
			if (cell.qIsNull)
				return "";

			if (!isNaN(cell.qNum) && cell.qText.indexOf('/') == -1 && cell.qText.indexOf('-') == -1 && cell.qText.indexOf(':') == -1)
				return cell.qNum;

			return cell.qText;
		},

		parseExpression: function (expression) {
			////check for count(distinct col)
			//var uniqueRegex = /count\(distinct (.*)\)/;
			
			//if (uniqueRegex.test(measureDef)) {
			//		agg = 'unique';
			//		shadeCol = uniqueRegex.exec(measureDef)[1];
			//	}
			//else {					
			//	var measureMatch = /([\w]+)\((\[(.+?)\]|([^[\]]+?))\)/.exec(measureDef);
			
			//	agg = measureMatch[1].toLowerCase();
			//	shadeCol = mlHelpers.toMLColumnName(measureMatch[3] || measureMatch[4]);
			//}

			//var measureMatch = /([\w]+)\((\[(.+?)\]|(\w+?))\)/.exec(expression);
			var measureMatch = /^\s*([\w]+)\s*\(\s*(distinct\s+)?(\[([^\]]+?)\]|(\w+?))\s*\)\s*$/i.exec(expression);

			if (!measureMatch) {
				var fieldMatch = /^\s*=?\s*(\[[^\]]+\]|\w+)\s*$/.exec(expression);

				if (!fieldMatch)
					return null; //likely an unsupported expression
				else {
					return {
						column: fieldMatch[1]
					};
				}
			}
			else {
				var agg = measureMatch[1].toLowerCase();
				var distinct = measureMatch[2] && measureMatch[2].toLowerCase().trim() == "distinct";
				var shadeCol = measureMatch[4] || measureMatch[5];

				return {
					column: shadeCol,
					aggregate: agg,
					distinct: distinct
				}
			}
		},

		formatValue: function (value) {
			var absValue = Math.abs(value);

			var decimals = 0;

			if (absValue >= 1000) {
				return ml.util.addCommas(value.toFixed(0));
			}
			else if (absValue != 0) {
				decimals = 2;
				var counter = 1;

				while (decimals < 20 && absValue < counter) {
					decimals++;
					counter /= 10;
				}
			}

			return "" + (+value.toFixed(decimals));
		},

		getColorScale: function (colorConfig) {
			var scale;

			if (colorConfig.useCustomColors && colorConfig.number == "3" && colorConfig.middle)
				scale = new ml.ui.color.Scale([mlHelpers.palette[colorConfig.min], mlHelpers.palette[colorConfig.middle], mlHelpers.palette[colorConfig.max]], undefined, false, false);
			else
				scale = new ml.ui.color.Scale([mlHelpers.palette[colorConfig.min], mlHelpers.palette[colorConfig.max]], undefined, false, false);

			return scale;
		},

		getTablePrefix: function () {
			return tablePrefix;
		},

		getQlikTables: function (includeXY, includePoly) {
			var tables = ml.servercache.FetchStoredTables(true);

			if (tables) {
				var tableParts = tablePrefix.split('/');
				var matchingTables = [];

				for (var i = 0; i < tables.length; i++) {
					if (tables[i].acctcode == tableParts[0] && tables[i].name.startsWith(tableParts[1]) &&
						(tables[i].isXY && includeXY || tables[i].isPoly && includePoly)) {

						matchingTables.push(tables[i].acctcode + '/' + tables[i].name);
					}
				}

				return matchingTables;
			}
		},

		getPossiblePointFields: function () {
			var tables = mlHelpers.getQlikTables(true);
			var fields = [];

			for (var i = 0; i < tables.length; i++) {
				fields.push(tables[i].substr(tablePrefix.length));
			}

			return fields;
		},

		setDefaultGeoField: function (callback) {
			//find the field with the most values
			var fields = mlHelpers.getPossiblePointFields();

			if (fields.length > 0) {
				var app = qlik.currApp();

				app.getList('FieldList', function (reply) {
					var bestDefault;

					for (var i = 0; i < reply.qFieldList.qItems.length; i++) {
						var field = reply.qFieldList.qItems[i];

						if (fields.indexOf(mlHelpers.toMLColumnName(field.qName)) != -1) {
							if (!bestDefault || bestDefault.qCardinal < field.qCardinal)
								bestDefault = field;
						}
					}

					app.destroySessionObject(reply.qInfo.qId);

					if (bestDefault)
						defaultGeoField = bestDefault.qName;

					callback(defaultGeoField);
				});
			}
			else
				callback();
		},

		//getGeoFields: function (callback) {
		//	var app = qlik.currApp();

		//	app.getList('FieldList', function (reply) {
		//		var geoFields = [];

		//		for (var i = 0; i < reply.qFieldList.qItems.length; i++) {
		//			var field = reply.qFieldList.qItems[i];

		//			if (field.qTags.indexOf('$geopoint') > -1) {
		//				var tableName = tablePrefix + mlHelpers.toMLColumnName(field.qName);

		//				if (mlHelpers.DoesTableExist(tableName))
		//					geoFields.push(field.qName);
		//			}
		//		}

		//		app.destroySessionObject(reply.qInfo.qId);

		//		if (geoFields.length > 0)
		//			defaultGeoField = geoFields[0];

		//		callback(geoFields);
		//	});
		//},

		getDefaultGeoField: function () {
			return mlHelpers.toMLColumnName(defaultGeoField);
		},

		doesColumnExist: function (tableInfo, column) {
			return mlHelpers.getColumnInfo(tableInfo, column) != null;
		},

		getColumnInfo: function (tableInfo, column) {
			var mlColName = mlHelpers.toMLColumnName(column);

			//check to see if column exists in our table
			for (var j = 0; j < tableInfo.columns.length; j++) {
				if (tableInfo.columns[j].id.endsWith('/' + mlColName)) {
					return tableInfo.columns[j];
				}
			}

			return null;
		},

		buildWhere: function (selections, tableInfo) {
			var len = selections.length;

			//hard-coded removal of HI and AK
			/*var donorWhere = [
				{
					"col": "State",
					"test": "EqualNot",
					"value": "HI"
				},
				{
					"col": "State",
					"test": "EqualNot",
					"value": "AK"
				}
			];*/
			var donorWhere = [];

			for (var i = 0; i < len; i++) {
				var colname = selections[i].field;
				var mlColName = mlHelpers.toMLColumnName(colname);

				var validColumn = false;

				//check to see if column exists in our table
				for (var j = 0; j < tableInfo.columns.length; j++) {
					if (tableInfo.columns[j].id.endsWith('/' + mlColName)) {
						validColumn = true;
						break;
					}
				}

				if (validColumn) {
					var values = [];
					for (var j = 0; j < selections[i].values.length; j++) {
						values.push(selections[i].values[j]);
					}

					donorWhere.push({
						'col': mlHelpers.toMLColumnName(mlColName),
						'test': 'EqualAny',
						'value': values
					});
				}
			}

			if (donorWhere.length > 0) {
				donorWhere = [donorWhere];
			}

			return donorWhere;
		},

		EnsureAuthenticated: function (encodedCredentials, callback, failCallback) {
			if (!callback) callback = function () { };
			if (!failCallback) failCallback = function () { };

			var credentials = mlHelpers.decodeCredentials(encodedCredentials);

			if (credentials) {
				ml.apimanager.setAuthTokens(); //make sure tokens are set;

				if (ml.util.getCookie("mluser") && ml.util.getCookie("mltoken")) {
					ml.auth.whoami(function (result) {
						if (result.authed_mluser != credentials.user)
							mlHelpers.Login(credentials, callback, failCallback);
						else
							callback();
					});
				}
				else
					mlHelpers.Login(credentials, callback, failCallback);
			}
			else
				callback();
		},

		Login: function (credentials, callback, failCallback) {
			ml.auth.login(credentials.user, credentials.password, function (resp) {
				if (resp.success) {
					console.debug('User logged in successfully');
					callback(credentials);
				}
				else {
					failCallback(credentials);
				}
			});
		},

		decodeCredentials: function (encoded) {
			var value = atob(encoded);

			var passwordIndex = value.indexOf(';password=');

			if (passwordIndex == -1) {
				return null;
			}
			else {
				var user = value.substring(5, passwordIndex);
				var password = value.substring(passwordIndex + 10);

				return { user: user, password: password };
			}
		},

		GetAllSelections: function (app, callback) {

			var baseSelections = app.selectionState().selections.slice(0); //clone array because we will be modifying it

			var selections = [];

			var processNextSelection = function () {
				if (baseSelections.length == 0) {
					callback(selections);
					return;
				}

				var selection = baseSelections[0];
				baseSelections.shift();

				if (selection.selectedCount <= selection.qSelectionThreshold) {
					//selection object has all values
					var values = [];

					for (var i = 0; i < selection.selectedValues.length; i++) {
						values.push(selection.selectedValues[i].qName);
					}

					selections.push({
						field: selection.fieldName,
						values: values
					});
					
					processNextSelection();
				}
				else {
					//need to retrieve selected values
					var sessionObj;

					app.createList({
						"qDef": {
							"qFieldDefs": [
								selection.fieldName
							]
						},
						"qAutoSortByState": {
							qDisplayNumberOfRows: 1 //put selected values at top of list
						},
						"qInitialDataFetch": [{
							qTop: 0,
							qLeft: 0,
							qHeight: selection.selectedCount > 10000 ? 10000 : selection.selectedCount,
							qWidth: 1
						}]
					}, function () {
						mlHelpers.LoadAllListData(sessionObj, selection.selectedCount, function (rows) {
							var values = [];
							for (var i = 0; i < rows.length; i++) {
								var state = rows[i].qState;

								if (state == 'O' || state == 'S') //this should be unnecessary...
									values.push(mlHelpers.getCellValue(rows[i]));
							}

							selections.push({
								field: selection.fieldName,
								values: values
							});

							sessionObj.close();

							processNextSelection();
						});
					}).then(function (obj) {
						sessionObj = obj;
					});
				}
			};

			processNextSelection();
		},

		LoadAllData: function (layout, backendApi, pageSize, callback) {
			var rowcount = backendApi.getRowCount();

			//populate data pages once
			var populateDataPages = function () {
				var lastrow = 0;
				//loop through the rows we have and render

				//var lr = 0;
				//if()
				for (var i = 0; i < layout.qHyperCube.qDataPages.length; i++) {
					lastrow += layout.qHyperCube.qDataPages[i].qMatrix.length
				}
				//lastrow = layout.qHyperCube.qDataPages[0].qMatrix.length * layout.qHyperCube.qDataPages.length - 1;

				//thispaint.selectValues(0, indexes, false);

				if (rowcount > lastrow + 1) {
					//we havent got all the rows yet, so get some more, 1000 rows
					var requestPage = [{
						qTop: lastrow + 1,
						qLeft: 0,
						qWidth: pageSize.width, //should be # of columns
						qHeight: Math.min(pageSize.height, backendApi.getRowCount() - lastrow)
					}];
					backendApi.getData(requestPage).then(function (dataPages) {
						//when we get the result trigger paint again
						//console.log(dataPages);
						populateDataPages();
					}).fail(function (data) {
						console.log(data);
					});
				} else if (callback) {
					callback();
				}
			}
			populateDataPages();
		},

		BuildAnimationFrames: function (app, backendApi, fieldName, fieldIndex, callback) {
			//build list to find active values of the animation field
			app.createList({
				"qDef": {
					"qFieldDefs": [
						fieldName
					]
				},
				"qShowAlternatives": false,
				"qInitialDataFetch": [{
					qTop: 0,
					qLeft: 0,
					qHeight: 10000, //TODO: handle more than 10,000 selected values, or maybe decrease to limit number of animation frames
					qWidth: 1
				}]
			}, function (reply) {
				var frames = [];
				for (var i = 0; i < reply.qListObject.qDataPages[0].qMatrix.length; i++) {
					var state = reply.qListObject.qDataPages[0].qMatrix[i][0].qState;

					if (state == 'O' || state == 'S') {
						value = mlHelpers.getCellValue(reply.qListObject.qDataPages[0].qMatrix[i][0]);

						frames.push({
							label: value,
							filter: { col: mlHelpers.toMLColumnName(fieldName), test: 'Equal', value: value }
						});
					}
				}

				app.destroySessionObject(reply.qInfo.qId);

				callback(frames);
			});
		},

		MLRegionSelect: function (thispaint, cache, map, layout, backendApi, activeSelections, mapConfig, layerBuilder, layerParams, field) {

			var initialSelection = null;

			//keep track of initial selection, so that we don't lasso anything outside of it998929

			for (var i = 0; i < activeSelections.length; i++) {
				if (activeSelections[i].field == mapConfig.selectField) {
					initialSelection = {};

					for (var j = 0; j < activeSelections[i].values.length; j++)
						initialSelection[activeSelections[i].values[j]] = true;

					break;
				}
			}

			var drawingType = cache.selectTool || layout.props.defaultSelectTool || 'polygon';
			var dWithin = layout.props.selectDWithin || 100;

			if (!layout.props.selectDWithinUnit || layout.props.selectDWithinUnit == 'km')
				dWithin *= 1000;

			var RegionSelectOptions = {
				keepDrawings: false,
				map: map,
				drawingType: drawingType,
				callback: function (data) {

					var colname = mlHelpers.toMLColumnName(mapConfig.selectField);

					var q = ml.query().select(colname).from(mapConfig.pointTable).take(1000000);

					if (layerParams.whereClause && layerParams.whereClause[0])
						q.wheres = ml.$.extend(true, {}, layerParams).whereClause;

					if (mapConfig.polyTable) {
						var shapeCol = mapConfig.polyTable.split('/')[1];

						q.join(mapConfig.polyTable);

						if (drawingType == 'polygon' || drawingType == 'rectangle' || drawingType == 'circle')
							q.joins.where = [[{ col: shapeCol, test: 'Overlaps', value: "COL(" + shapeCol + "),WKT(" + data + ")" }]];
						else
							q.joins.where = [[{ col: shapeCol, test: 'DWithin:' + dWithin, value: "COL(" + shapeCol + "),WKT(" + data + ")" }]];

						var groupQ = ml.query().select(colname).from(q).groupby(colname).take(1000000);

						q = groupQ;
					}
					else {
						if (drawingType == 'polygon' || drawingType == 'rectangle' || drawingType == 'circle')
							q.where('XY', 'Contains', 'WKT(' + data + '),COL(XY)');
						else
							q.where('XY', 'DWithin:' + dWithin, 'WKT(' + data + '),COL(XY)');

						q.groupby(colname);
					}

					q.run(function (data) {
						//reset selections
						var shapes = data.data[colname];

						if (!shapes)
							return;

						var len = shapes.length;
						var indexes = [];
						var count = 0;

						if (!cache.pendingSelection)
							cache.pendingSelection = {
								values: {}
							};

						var selectedZips = {};

						for (var i = 0; i < shapes.length; i++) {
							if (shapes[i] == "" || shapes[i] == null)
								continue;

							selectedZips[shapes[i]] = true;
						}

						selectedElemNumbers = [];

						mlHelpers.LoadAllListData(field, function (rows) {
							for (var i = 0; i < rows.length; i++) {
								var cell = rows[i];

								var value = mlHelpers.getCellValue(cell);

								if (selectedZips[value] || selectedZips[Number(value)]) {
									if (initialSelection == null || initialSelection[value]) {
										if (!cache.pendingSelection.values[value]) {
											cache.pendingSelection.values[value] = true;
											selectedElemNumbers.push(cell.qElemNumber)
										}
									}
								}
							}

							mlHelpers.DisplayPendingSelection(thispaint.mapRefs, map, cache, layerBuilder, layerParams, mapConfig.selectField);

							thispaint.selectValues(mapConfig.selectFieldIndex, selectedElemNumbers, true);
						});
					});
				}
			};

			var rs = new ml.ui.map.RegionSelect(RegionSelectOptions);
			rs.beginDrawing();
		},

		HandlePolyClick: function (selectedValues, thispaint, map, layer, cache, mapConfig, layerBuilder, layerParams, field) {
			if (!cache.pendingSelection)
				cache.pendingSelection = {
					values: {}
				};

			var count = 0;

			//display selected values
			for (var key in selectedValues) {
				var value = selectedValues[key];
				count++;

				//toggle selection
				if (cache.pendingSelection.values[value])
					delete cache.pendingSelection.values[value];
				else
					cache.pendingSelection.values[value] = true;
			}

			mlHelpers.DisplayPendingSelection(thispaint.mapRefs, map, cache, layerBuilder, layerParams, mapConfig.selectField);
			
			//update Qlik selection
			mlHelpers.LoadAllListData(field, function (rows) {
				var selectedElemNumbers = [];

				for (var i = 0; i < rows.length; i++) {
					var cell = rows[i];
					var value = mlHelpers.getCellValue(cell);

					if (selectedValues[value] || selectedValues[Number(value)]) {
						selectedElemNumbers.push(cell.qElemNumber);

						if (selectedElemNumbers.length == count)
							break;
					}
				}

				thispaint.selectValues(mapConfig.selectFieldIndex, selectedElemNumbers, true);
			});
		},

		//This only works with lists with one column
		LoadAllListData: function (obj, numRowsToLoad, callback) {
			if (typeof numRowsToLoad === "function") {
				callback = numRowsToLoad;
				numRowsToLoad = null;
			}

			var totalRowCount = numRowsToLoad == null ? obj.layout.qListObject.qDimensionInfo.qCardinal : numRowsToLoad;
			var loadedCount = 0;

			for (var i = 0; i < obj.layout.qListObject.qDataPages.length; i++)
			{
				var page = obj.layout.qListObject.qDataPages[i];

				loadedCount += page.qMatrix.length;
			}
			
			if (loadedCount < totalRowCount) {
				var remainingRows = totalRowCount - loadedCount;

				return obj.rpc("GetListObjectData", null, ["/qListObjectDef", [{
					qTop: loadedCount,
					qLeft: 0,
					qWidth: 1,
					qHeight: remainingRows > 10000 ? 10000 : remainingRows
				}]]).then(function (b) {
					obj.layout.qListObject.qDataPages.push(b.qDataPages[0]);

					mlHelpers.LoadAllListData(obj, numRowsToLoad, callback);
				});
			}
			else if (callback) {
				var rows = [];

				for (var i = 0; i < obj.layout.qListObject.qDataPages.length; i++) {
					var page = obj.layout.qListObject.qDataPages[i];

					for (var j = 0; j < page.qMatrix.length; j++) {
						rows.push(page.qMatrix[j][0]);
					}
				}

				callback(rows);
			}
		},

		DisplayPendingSelection: function (mapRefs, map, cache, layerBuilder, layerParams, selectColumn) {
			if (mapRefs.animatedLayer) {
				var activeLayer = mapRefs.animatedLayer.activeLayer || mapRefs.layers[0];

				activeLayer.opacity.set(.4);
			}
			else
				mapRefs.layers[0].opacity.set(.4);

			var valueList = [];

			for (var key in cache.pendingSelection.values)
				valueList.push(key);

			layerParams = ml.$.extend(true, {}, layerParams);

			layerParams.alpha = 1;

			if (layerParams.whereClause && layerParams.whereClause[0])
				layerParams.whereClause = ml.$.extend(true, {}, layerParams).whereClause;
			else
				layerParams.whereClause = [[]];

			layerParams.whereClause[0].push({
				'col': mlHelpers.toMLColumnName(selectColumn),
				'test': 'EqualAny',
				'value': valueList
			});

			var layerJson = layerBuilder(layerParams);

			if (cache.pendingSelection.showingLayer1 !== true) {
				cache.pendingSelection.showingLayer1 = true;

				cache.pendingSelection.layer = new ml.layer(map, layerJson, function () {
					if (cache.pendingSelection.layer2) {
						cache.pendingSelection.layer2.remove();
						cache.pendingSelection.layer2 = null;
					}
				});
			}
			else {
				cache.pendingSelection.showingLayer1 = false;

				cache.pendingSelection.layer2 = new ml.layer(map, layerJson, function () {
					if (cache.pendingSelection.layer) {
						cache.pendingSelection.layer.remove();
						cache.pendingSelection.layer = null;
					}
				});
			}
		},

		OnLayerLoad: function (mapRefs, cache, isLayer0) {
			return function () {
				if (isLayer0 && !cache.layer0Extents && mapRefs.layers[0]) {
					mapRefs.layers[0].getLayerExtents().then(function (extents) {
						cache.layer0Extents = extents;
						mapRefs.map.setBounds(extents.sw, extents.ne);
					});
				}

				cache.layerLoaded = true;
			};
		},

		SetInitialPosition: function (cache, layout) {
			if (layout.props.initialPosition) {
				var sw = layout.props.initialPosition.sw.split(',');
				var ne = layout.props.initialPosition.ne.split(',');

				if (sw.length == 2 && ne.length == 2) {
					cache.layer0Extents = {
						sw: { lat: sw[0], lng: sw[1] },
						ne: { lat: ne[0], lng: ne[1] }
					};
				}
			}
		},

		DoesTableExist: function (tableName) {
			var tables = ml.servercache.FetchStoredTables(true);

			if (tables) {
				var tableParts = tableName.split('/');

				for (var i = 0; i < tables.length; i++) {
					if (tables[i].acctcode == tableParts[0] && tables[i].name == tableParts[1]) {
						return true;
					}
				}
			}

			return false;
		},

		GetTableInformation: function (tableName, callback, failCallback) {
			var cache = window.mlCache;

			if (!cache.tableInformation)
				cache.tableInformation = {};

			if (cache.tableInformation[tableName])
				callback(cache.tableInformation[tableName]);

			if (mlHelpers.DoesTableExist(tableName)) {
				ml.account.getTableInformation(tableName, function (data) {
					if (data.success) {
						cache.tableInformation[tableName] = data.table;

						callback(data.table);
					}
					else if (failCallback)
						failCallback();
				});
			} else if (failCallback)
				failCallback();
		},

		saveDrawings: function (drawingJson, backendApi) {
			backendApi.getProperties().then(function (props) {
				props.mapDrawings = drawingJson;

				backendApi.setProperties(props);
			});
		},

		DisplayError: function ($element, title, message, type) {
			$element.empty();
			$element.append(
				'<div class="object-error ' + (type || 'hard-error') + '">' +
					'<div class="object-error-content">' +
					  '<div class="object-error-title">' +
						'<span>' + title + '</span>' +
					  '</div>' +
					  '<div class="object-error-message">' +
					  message +
					  '</div>' +
					'</div>' +
				'</div>');
		},

		InitialSetup: function (url, encodedCredentials) {
			window.loadingML = true;

			if (!url) {
				window.loadingMLError = "MapLargeURL is not set.";
			}
			else {
				$.getScript(url, function () {
					mlHelpers.EnsureAuthenticated(encodedCredentials, function () {
						ml.servercache.MetaStorage.RefreshStoredTables(function () {
							mlHelpers.setDefaultGeoField(function () {
								window.mlTablesLoaded = true;
							});
						});
					}, function (credentials) {
						if (credentials)
							window.loadingMLError = "Error logging into MapLarge as " + credentials.user;
					});
				}).fail(function () {
					console.error("Error occurred while retrieving ML script.");
					window.loadingMLError = "Unable to load script from MapLarge server. Please check 'MapLargeURL' variable.";
				});
			}
		},

		isMLDataStale: function (lastUpload, lastReload) {
			if (!lastUpload || !lastReload)
				return false; //is this best?

			lastUpload = ml.moment(lastUpload);
			lastReload = ml.moment(lastReload);

			if (!lastUpload.isValid() || !lastReload.isValid)
				return false; //is this best?
			else
				return lastUpload.isBefore(lastReload);
		},

		PaintExtension: function (qlik, paintCore) {
			return function ($element, layout) {
				var thispaint = this;
				var extensionId = thispaint.options.id;

				//update tablePrefix
				tablePrefix = layout.MapLargeTablePrefix;

				if (layout.MapLargeLastUpload == "InProcess") {
					mlHelpers.DisplayError($element, "Data Refresh in Progress", "Your most recent data is being uploaded to MapLarge.", "soft-error");
					thispaint.mapRefs = null;
					return;
				}
				else if (layout.MapLargeLastUpload.startsWith("Error: ")) {
					mlHelpers.DisplayError($element, "Error During Data Refresh", layout.MapLargeLastUpload.substring("Error: ".length), "hard-error");
					thispaint.mapRefs = null;
					return;
				}

				if (!window.ml && !window.loadingML) {
					if (layout.MapLargeURL && layout.MapLargeURL != "-")
						mlHelpers.InitialSetup(layout.MapLargeURL, layout.MapLargeCredentials);
					else {
						//try to contact the import service
						var appId = qlik.currApp().id;

						url = layout.props.serviceUrl || "http://localhost:8585";

						if (appId.indexOf(".qvf") == -1)
							appId = appId + ".qvf";

						$.ajax({
							type: 'POST',
							url: url + "/config/app/enable/" + encodeURI(appId),
							complete: function () { },
							error: function (xhr, status, error) {
								mlHelpers.DisplayError($element, "Unable to Start Initial Upload", "Cannot connect to import service. Please make sure the service is running.", "hard-error");
							}
						});

						mlHelpers.DisplayError($element, "Waiting on Initial Upload", "Extension will be available after the initial data load completes.", "soft-error");
						thispaint.mapRefs = null;
						return;
					}
				}

				if (window.loadingMLError) {
					thispaint.$scope.throbberApi.hide();
					mlHelpers.DisplayError($element, "Load Error", window.loadingMLError === true ? "" : window.loadingMLError);
					return;
				}
				else if (!window.ml || !window.mlTablesLoaded) {
					console.warn('Waiting for ML script/data to load.');

					thispaint.$scope.throbberApi.show();
					thispaint.isShowingSpinner = true;

					setTimeout(function () {
						qlik.resize(extensionId);
					}, 500);

					return;
				}
				
				if (thispaint.isShowingSpinner) {
					thispaint.$scope.throbberApi.hide();

					thispaint.isShowingSpinner = false;
				}

				if (mlHelpers.isMLDataStale(layout.MapLargeLastUpload, layout.LastDataReload)) {
					mlHelpers.DisplayError($element, "Data Out of Date", "Your most recent data has not been upload to MapLarge yet.", "soft-error");
					thispaint.mapRefs = null;
					return;
				}

				if (!layout.props.pointField) {
					layout.props.pointField = mlHelpers.getDefaultGeoField();

					if (!layout.props.pointField) {
						mlHelpers.DisplayError($element, "Incomplete visualization", "Missing required configuration option 'Point Field'.", "soft-error");
						thispaint.mapRefs = null;
						return;
					}
				}
			
				

				var isFirstPaint = false;
				var currentMode = qlik.navigation.getMode();

				console.debug(extensionId + ' paint ');

				var cache = window.mlCache[extensionId];

				if (!cache) {
					isFirstPaint = true;
					window.mlCache[extensionId] = {
						invalidated: true
					};
					cache = window.mlCache[extensionId];

					console.debug(extensionId + ' First paint for ');
				}

				if (currentMode != cache.lastMode) {
					cache.invalidated = true; //repaint when switching mode
					cache.lastMode = currentMode;
				}

				$element.unbind('$destory').on('$destroy', function () {
					//This is called when our extension is being destroyed.
					if (thispaint.mapRefs && thispaint.mapRefs.map) {
						//clear tooltip and outlines
						thispaint.mapRefs.map.clearAllMarkers();

						if (thispaint.mapRefs.map.toolTip)
							thispaint.mapRefs.map.toolTip.hide();
					}
				});

				if (isFirstPaint) {
					//monitor for selection changes
					var app = qlik.currApp(thispaint);

					var selState = app.selectionState();

					var listener = function () {
						if (!thispaint.backendApi.inSelections()) {
							console.debug(extensionId + ' selection changed ');
							cache.invalidated = true;

							if (cache.layerLoaded)
								cache.layer0Extents = null; //force reload of extents (make sure this happens after the first load

							qlik.resize(extensionId);
						}
					};

					selState.OnData.bind(listener);
				}

				//monkey patch clearSelectedValues so we're notified when button is clicked
				if (!thispaint.origclearSelectedValues) {
					thispaint.origclearSelectedValues = thispaint.clearSelectedValues;
					thispaint.clearSelectedValues = function (el) {
						if (cache.pendingSelection.layer)
							cache.pendingSelection.layer.remove();
						if (cache.pendingSelection.layer2)
							cache.pendingSelection.layer2.remove();

						cache.pendingSelection = { values: {} };

						thispaint.origclearSelectedValues(el);
					};
				}

				//check if selection mode is over
				if (cache.pendingSelection && !thispaint.backendApi.inSelections()) {
					if (cache.pendingSelection.layer)
						cache.pendingSelection.layer.remove();
					if (cache.pendingSelection.layer2)
						cache.pendingSelection.layer2.remove();

					delete cache.pendingSelection;

					cache.layer0Extents = null; //force reload of extents

					if (!cache.invalidated) {
						//wait to make sure selection api has received updates
						setTimeout(function () {
							cache.invalidated = true;
							qlik.resize(extensionId);
						}, 200);
					}
				}

				//check if something has changed or if our map is gone
				if (!cache.invalidated && thispaint.mapRefs && thispaint.mapRefs.map) {
					console.debug(extensionId + ' Nothing changed, abandoning paint.');

					if (!cache.pendingSelection) {
						if (layout.props.drawingEnabled && thispaint.options.isZoomed && thispaint.mapRefs.map.drawingToolsHidden)
							thispaint.mapRefs.map.enableDrawing();
						else if (!thispaint.options.isZoomed && !thispaint.mapRefs.map.drawingToolsHidden) {
							mlHelpers.saveDrawings(thispaint.mapRefs.map.getDrawingsAsJSON(), thispaint.backendApi);
							thispaint.mapRefs.map.disableDrawing();
						}

						//still zoom, paint may be for a resize
						if (cache.layer0Extents) {
							//thispaint.mapRefs.map.setBounds(cache.layer0Extents.sw, cache.layer0Extents.ne);
						}
					}

					return;
				}

				cache.invalidated = false;

				//setTimeout(function () { //hack because selections don't always appear immediately
				console.debug(extensionId + ' paint inner ');
				var app = qlik.currApp(thispaint);

				mlHelpers.GetAllSelections(app, function (activeSelections) {

					//if there are no selections and we need extents, use initial position (if set)
					if (activeSelections.length == 0 && !cache.layer0Extents) {
						mlHelpers.SetInitialPosition(cache, layout);

						if (cache.layer0Extents && thispaint.mapRefs)
							thispaint.mapRefs.map.setBounds(cache.layer0Extents.sw, cache.layer0Extents.ne);
					}

					app.getObjectProperties(extensionId).then(function (props) {

						if (isFirstPaint) {
							props.Invalidated.bind(function () {
								if (qlik.navigation.getMode() == 'edit') {
									console.debug(extensionId + ' Invalidated ');

									cache.invalidated = true;

									//cache.layer0Extents = null; //force reload of extents
								}
							});
						}

						//set the first dimension if we can
						if ((!props.properties.qHyperCubeDef || props.properties.qHyperCubeDef.qDimensions.length == 0) && layout.props.pointField) {
							//if (!layout.qHyperCubeDef)
							//	layout.qHyperCubeDef = {};
							var pointField = layout.props.pointField;
							
							app.getList('FieldList', function (reply) {
								var qlikField;

								for (var i = 0; i < reply.qFieldList.qItems.length; i++) {
									var field = reply.qFieldList.qItems[i];

									if (mlHelpers.toMLColumnName(field.qName) == pointField) {
										qlikField = field.qName;
										break;
									}
								}

								app.destroySessionObject(reply.qInfo.qId);

								if (qlikField) {
									props.properties.qHyperCubeDef.qDimensions.push({
										qDef: {
											qFieldDefs: [qlikField]
										}
									});

									thispaint.backendApi.setProperties(props.properties);
								}
							});
						}

						paintCore($element, layout, thispaint, currentMode, props, activeSelections, cache, layout.MapLargeTablePrefix);

						if (thispaint.mapRefs)
							mlHelpers.DisplayExtraLayers(thispaint.mapRefs, layout);
					});
				});
				//}, 100);

			};
		},

		CreateAnimationLayers: function (qlik, $element, thispaint, mapConfig, currentMode, layerParams, activeSelections, legend, buildLayerFunc, pointTableInfo, cache) {
			var frameLabels = [];
			var frameParams = [];

			var mapRefs = thispaint.mapRefs;

			mlHelpers.BuildAnimationFrames(qlik.currApp(thispaint), thispaint.backendApi, mapConfig.animationField, mapConfig.animationFieldIndex, function (frames) {

				var framesToRender = frames.length;

				if (currentMode == 'edit')
					framesToRender = 1; //for performance, only render one frame when in edit mode

				//remove previous pending render
				if (mapRefs.pendingAnimationRender) {
					clearTimeout(mapRefs.pendingAnimationRender);
					delete mapRefs.pendingAnimationRender;
				}

				var loadLayer = function (i) {
					var whereClause = mlHelpers.buildWhere(activeSelections, pointTableInfo);

					if (whereClause[0] && whereClause[0].push)
						whereClause[0].push(frames[i].filter);
					else
						whereClause.push([frames[i].filter]);

					layerParams.whereClause = whereClause;

					var layerJson = buildLayerFunc(layerParams);

					layerJson.isAnimation = true;

					if (mapRefs.layers.length == 0 && legend) {
						layerJson.legend = legend;
					}

					if (mapRefs.layers.length <= i) {
						mapRefs.layers.push(new ml.layer(mapRefs.map, layerJson, mlHelpers.OnLayerLoad(mapRefs, cache, i == 0)));
					}
					else
						mapRefs.layers[i].load(layerJson);

					frameLabels.push(frames[i].label);
					frameParams.push(layerParams);
					layerParams = ml.$.extend(true, {}, layerParams);
				};

				//load initial layer
				loadLayer(0);

				$('.animationControlDiv', $element).text('Loading animation...');

				mapRefs.layers[0].opacity.set("100");
				$('.animationLabelDiv', $element).text(frameLabels[0]);

				//thispaint.$scope.throbberApi.show();

				//stop and remove old animation control
				if (mapRefs.animatedLayer && mapRefs.animatedLayerListener) {
					mapRefs.animatedLayer.index.removeChangeListener(mapRefs.animatedLayerListener);
					mapRefs.animatedLayer.stop();

					delete mapRefs.animatedLayer;
				}

				//remove all but first layer
				if (mapRefs.layers.length > 1) {
					for (var i = 1; i < mapRefs.layers.length; i++) {
						mapRefs.layers[i].remove();
					}

					mapRefs.layers.splice(1);
				}

				//load other layers
				mapRefs.pendingAnimationRender = setTimeout(function () {
					//create layers
					for (var i = 1; i < framesToRender; i++) {
						loadLayer(i);
					}

					mapRefs.animatedLayer = new ml.ui.map.AnimatedLayer({
						interval: 1000,
						layers: mapRefs.layers,
						controls: {
							div: $('.animationControlDiv', $element)
						}
					});

					mapRefs.animatedLayerListener = function (value) {
						$('.animationLabelDiv', $element).text(frameLabels[value]);
						cache.layerParams = frameParams[value]; //update params for selection
					};

					mapRefs.animatedLayer.index.addChangeListener(mapRefs.animatedLayerListener);

					mapRefs.layers[0].opacity.set("100");
					$('.animationLabelDiv', $element).text(frameLabels[0]);

					//wait to give layers a chance to start loading
					mapRefs.pendingAnimationRender = setTimeout(function () {
						$('.animationControlDiv', $element).show();
					}, 750);
					/*thispaint.$scope.$apply(function () {
						thispaint.$scope.throbberApi.hide();
					});*/
				}, 3000);
			});
		},

		DisplayExtraLayers: function (mapRefs, layout) {
			if (layout.props.showExtraLayers === false || !layout.props.extraLayers) {
				if (mapRefs.extraLayers && mapRefs.extraLayers.length > 0) {
					//remove all existing extra layers
					for (var i = 0; i < mapRefs.extraLayers.length; i++)
						mapRefs.extraLayers[i].remove();

					mapRefs.extraLayers = [];
					mapRefs.lastExtraLayerIds = [];
				}
				return;
			}

			if (!mapRefs.extraLayers)
				mapRefs.extraLayers = [];

			if (!mapRefs.lastExtraLayerIds)
				mapRefs.lastExtraLayerIds = [];

			if (!window.mlCache.extraLayerCache)
				window.mlCache.extraLayerCache = {};

			var cache = window.mlCache.extraLayerCache;

			var addLayers = function (ids) {
				//json should already be cached when this is called
				for (var i = 0; i < ids.length; i++) {
					var layerJson = cache[ids[i]];

					if (mapRefs.extraLayers.length <= i)
						mapRefs.extraLayers.push(ml.layer(mapRefs.map, layerJson));
					else if (mapRefs.lastExtraLayerIds[i] != ids[i]) {
						//layer id changed, so reload
						mapRefs.extraLayers[i].removeLegend() //if legend is still needed it will be recreated
						mapRefs.extraLayers[i].load(layerJson);
					}

					if (layout.props.extraLayersPosition != "Above")
						mapRefs.extraLayers[i].setZIndex(-100 - i);
					else
						mapRefs.extraLayers[i].setZIndex(100 - i);
				}

				mapRefs.lastExtraLayerIds = ids;

				//remove layers no longer used
				if (mapRefs.extraLayers.length > ids.length) {
					for (var i = ids.length; i < mapRefs.extraLayers.length; i++) {
						mapRefs.extraLayers[i].remove();
					}

					mapRefs.extraLayers.splice(ids.length);
				}
			}

			//load layer json
			var idsToLoad = [];
			var ids = [];

			for (var key in layout.props.extraLayers) {
				var id = layout.props.extraLayers[key];

				if (id) {
					ids.push(id);

					if (!cache[id])
						idsToLoad.push(id);
				}
			}

			if (idsToLoad.length > 0) {
				ml.widget.select().id(idsToLoad).take(idsToLoad.length).withdata().run(function (data) {
					for (var i = 0; i < data.records.length; i++) {
						var layerJson = data.records[i].data;
						var id = data.records[i].id;

						cache[id] = layerJson;
					}

					addLayers(ids);
				});
			}
			else
				addLayers(ids);
			
		}
	};


	return mlHelpers;
});