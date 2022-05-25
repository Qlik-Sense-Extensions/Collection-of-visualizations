/**
 * E-mergo Table Inspector Extension
 *
 * @since 20191019
 * @author Laurens Offereins <https://github.com/lmoffereins>
 *
 * @param  {Object} qlik             Qlik's core API
 * @param  {Object} qvangular        Qlik's Angular implementation
 * @param  {Object} $                jQuery
 * @param  {Object} _                Underscore
 * @param  {Object} $q               Angular's promise library
 * @param  {Object} qUtil            Qlik's utility library
 * @param  {Object} Resize           Qlik's resize API
 * @param  {Object} objectConversion Qlik's object conversion API
 * @param  {Object} props            Property panel definition
 * @param  {Object} initProps        Initial properties
 * @param  {Object} util             E-mergo utility functions
 * @param  {Object} uiUtil           E-mergo interface utility functions
 * @param  {String} css              Extension stylesheet
 * @param  {String} tmpl             Extension template file
 * @return {Object}                  Extension structure
 */
define([
	"qlik",
	"qvangular",
	"jquery",
	"underscore",
	"ng!$q",
	"util",
	"core.utils/resize",
	"objects.extension/object-conversion",
	"client.services/export-dialog/export-dialog",
	"./properties",
	"./initial-properties",
	"./util/util",
	"./util/ui-util",
	"text!./style.css",
	"text!./template.ng.html"
], function( qlik, qvangular, $, _, $q, qUtil, Resize, objectConversion, exportDialog, props, initProps, util, uiUtil, css, tmpl ) {

	// Add global styles to the page
	util.registerStyle("qs-emergo-table-inspector", css);

	// Get current app
	var app = qlik.currApp(),

	/**
	 * Relevant paths for applying patches on the visualization objects
	 *
	 * @type {Array}
	 */
	pathsToPatch = {
		dataTable: [
			"/qHyperCubeDef/qDimensions",
			"/qHyperCubeDef/qColumnOrder",
			"/qHyperCubeDef/qInterColumnSortOrder",
			"/props/tableName",
			"/props/removedFields",
			"/title",
			"/subtitle"
		],
		extension: [
			"/qHyperCubeDef/qColumnOrder",
			"/qHyperCubeDef/qInterColumnSortOrder",
			"/props/tableName",
			"/props/tableStructure",
			"/props/exportDimensions",
			"/props/removedFields"
		]
	},

	/**
	 * Return the extension scope
	 *
	 * @param  {HTMLElement} element HTML element in extension
	 * @return {Object} Scope
	 */
	getExtensionScopeFromElement = function( element ) {
		return $(element).parents(".qs-emergo-table-inspector").scope();
	},

	/**
	 * Query the app's tables and keys
	 *
	 * @return {Promise} List of app tables
	 */
	getAppTables = function() {
		return qlik.currApp().model.engineApp.getTablesAndKeys({}, {}, 0, true, false).then( function( items ) {
			return items.qtr.filter( function( a ) {

				// Discard synthetic tables
				return 0 !== a.qName.indexOf("$Syn");

			}).map( function( a ) {

				// Quick replace synthetic keys
				a.qFields = a.qFields.reduce( function( arr, item ) {
					var add;

					if (item.qOriginalFields.length) {
						add = item.qOriginalFields.map( function( b ) {

							// Original field metadata is not used, so only store the field's name
							return {
								qName: b
							};
						});
					} else {
						add = [item];
					}

					return arr.concat(add);
				}, []);

				return {
					value: a.qName,
					qData: a
				};
			});
		});
	},

	/**
	 * Return the table data for the given table
	 *
	 * @param  {String} tableName Table name
	 * @return {Promise} Table data
	 */
	getAppTableByName = function( tableName ) {
		return getAppTables().then( function( items ) {
			return items.find( function( a ) {
				return a.value === tableName;
			});
		});
	},

	/**
	 * Return the table's field names
	 *
	 * @param  {String} tableName Table name
	 * @return {Promise} Table field names
	 */
	getAppTableFieldNames = function( tableName ) {
		return getAppTableByName(tableName).then( function( a ) {
			return a ? a.qData.qFields.map( function( b ) {
				return b.qName;
			}) : [];
		});
	},

	/**
	 * Return picked properties for the table object
	 *
	 * @param  {Object} props Properties
	 * @return {Object}       Picked properties
	 */
	getTablePropsFromObjProps = function( props ) {
		props = props || { props: { removedFields: [] }, qHyperCubeDef: {} };

		var a = _.pick(props, "props", "qHyperCubeDef");

		// Define additional table properties
		a.title = "Table Inspector - " + props.props.tableName;
		a.subtitle = props.props.removedFields.length ? "Removed fields: " + props.props.removedFields.join(", ") : "";

		return a;
	},

	/**
	 * Setup `getPatches` for a type of either 'dataTable' or 'extension'
	 *
	 * @param  {String} type Optional. Type of patch generator. Defaults to 'dataTable'.
	 * @return {Function} Get patches function for the type
	 */
	getPatches = function( type ) {
		type = type || "dataTable";

		/*
		 * Setup patches for a list of properties to save
		 *
		 * @param  {Object} props   List of properties to save
		 * @param  {String} path    Optional. Patch path
		 * @param  {Array}  patches Optoinal. Set of patches
		 * @return {Array} Patches
		 */
		return function( props, path, patches ) {
			props = props || {};
			path = path || "/";
			patches = patches || [];

			for (var i in props) {
				if (props.hasOwnProperty(i)) {
					if ("object" === typeof props[i] && ! Array.isArray(props[i])) {
						getPatches(type)(props[i], path + i + "/", patches);
					} else if (-1 !== pathsToPatch[type].indexOf(path + i)) {
						patches.push({
							qOp: "replace",
							qPath: path + i,
							qValue: JSON.stringify(props[i])
						});
					}
				}
			}

			return patches;
		};
	},

	/**
	 * Return the effective properties of an object by id
	 *
	 * @param  {String} id Visualization object id
	 * @return {Promise}    Effective properties
	 */
	getEffectivePropertiesById = function( id ) {

		// Get the extension's object model
		return app.getObject(id).then( function( model ) {
			return model.getEffectiveProperties();
		});
	},

	/**
	 * Update the properties of the visualization
	 *
	 * @param  {Object} $scope Extension scope
	 * @param  {Object} props  Properties
	 * @return {Promise} Visualization is updated
	 */
	updateExtensionVisualization = function( $scope, props ) {
		var patcher = getPatches("extension");

		// Clear the table structure
		props.props.tableStructure = [];

		// Walk the visualization's dimensions
		props.qHyperCubeDef.qDimensions.forEach( function( a ) {

			// Rebuild the table structure
			props.props.tableStructure.push(a.qDef.qFieldDefs[0]);
		});

		// Get the extension's object model
		return $scope.object.model.applyPatches(patcher(props));
	},

	/**
	 * Remove the saved properties from the visualization
	 *
	 * @param  {Object} $scope Extension scope
	 * @return {Promise} Visualization is reset
	 */
	resetExtensionVisualization = function( $scope ) {

		// Update the extension's object with initial properties
		return updateExtensionVisualization($scope, util.copy(initProps)).then( function() {

			// Get the table's object
			return app.visualization.get($scope.vizId).then( function( object ) {

				// Break engine connection and destroy scope
				object.close().then( function() {

					// Trigger idle state
					$scope.fsm.close();
				});
			});
		}).catch(console.error);
	},

	/**
	 * Procedure for selecting a data table
	 *
	 * @param  {Object} $scope Extension scope
	 * @param  {Object} tableData Table data
	 * @return {Promise} Table is selected
	 */
	selectTable = function( $scope, tableData ) {

		// Trigger loading state
		$scope.fsm.select();

		// Update extension's hypercube and properties
		return prepareEmbeddedViz($scope, tableData).then( function( props ) {

			// Create or update the embedded visualization
			var promise = $scope.vizId ? updateEmbeddedViz($scope, props) : createEmbeddedViz($scope, props);

			// When table is created/updated
			promise.then( function() {

				// Trigger table state
				$scope.fsm.open();

				// Get the embedded visualization's properties
				return getEffectivePropertiesById($scope.vizId).then( function( modelProps ) {

					// Keep dimension data for export purposes. This set contains
					// more data than the qDimensions setup in `prepareEmbeddedViz()`.
					props.props.exportDimensions = modelProps.qHyperCubeDef.qDimensions.map( function( a ) {

						// Generate the dimension's id when missing
						if (! a.qDef.cId) {
							a.qDef.cId = qUtil.generateId();
						}

						// Keep the stringify'd version
						return JSON.stringify(a);
					});

					return updateExtensionVisualization($scope, props);
				});
			});
		}).catch(console.error);
	},

	/**
	 * Reset the visualization's hypercube definition
	 *
	 * @param  {Object} $scope Extension scope
	 * @param  {Object} tableData Table data
	 * @return {Promise} Properties are saved
	 */
	prepareEmbeddedViz = function( $scope, tableData ) {
		var dfd = $q.defer(), newProps = util.copy(initProps);

		// Reset table name and dimensions
		newProps.props.tableName = tableData.value;
		newProps.qHyperCubeDef.qDimensions = [];

		// Reset existing properties
		if ($scope.vizId) {

			// Keep the removed fields when preparing the same table
			if ($scope.layout.props.tableName === tableData.value) {
				newProps.props.removedFields = $scope.removedFields;
			} else {
				$scope.removedFields = [];
			}

			dfd.resolve();

		// Setup new properties
		} else {

			// Set the removed fields. Maybe stored values are present.
			newProps.props.removedFields = $scope.removedFields = $scope.layout.props.removedFields || [];

			// Get the object's properties
			$scope.object.model.getProperties().then( function( props ) {

				// When available, fetch details from a previously saved table
				if (props.qHyperCubeDef) {
					newProps.qHyperCubeDef.qColumnOrder = props.qHyperCubeDef.qColumnOrder || [];
					newProps.qHyperCubeDef.qInterColumnSortOrder = props.qHyperCubeDef.qInterColumnSortOrder || [];
				}
			}).then(dfd.resolve);
		}

		// Return the prepared properties
		return dfd.promise.then( function() {
			var actualRemovedFields = [];

			// Walk selected table's fields
			tableData.qData.qFields.forEach( function( a ) {

				// Skip removed fields
				if (-1 !== newProps.props.removedFields.indexOf(a.qName)) {
					actualRemovedFields.push(a.qName);
					return;
				}

				// Add field to hypercube
				newProps.qHyperCubeDef.qDimensions.push({
					qDef: {
						qFieldDefs: [a.qName],
						qFieldLabels: [a.qName],
						autoSort: true,
						qSortCriterias: [{
							qSortByAscii: 1
						}]
					}
				});
			});

			// Correct the removed fields
			newProps.props.removedFields = actualRemovedFields;

			// Add the fields to ordering and sorting lists
			["qColumnOrder", "qInterColumnSortOrder"].forEach( function( a ) {
				var listDiff = newProps.qHyperCubeDef.qDimensions.length - newProps.qHyperCubeDef[a].length;

				newProps.qHyperCubeDef[a] = newProps.qHyperCubeDef[a].length
					// Use previously defined ordering and sorting lists
					? (0 < listDiff)

						// The new field list is longer
						? newProps.qHyperCubeDef[a].concat(
							_.keys(newProps.qHyperCubeDef.qDimensions).map(Number).slice(newProps.qHyperCubeDef[a].length)
						)

						// The new field list is shorter
						: newProps.qHyperCubeDef[a].filter( function( b ) {
							return b < newProps.qHyperCubeDef.qDimensions.length;
						})

					// Define new ordering and sorting lists
					: _.keys(newProps.qHyperCubeDef.qDimensions).map(Number);
			});

			// Save new selections
			return updateExtensionVisualization($scope, newProps).then( function() {
				return newProps;
			});
		}).catch(console.error);
	},

	/**
	 * Create a new embedded visualization object
	 *
	 * @param  {Object} $scope Extension scope
	 * @return {Promise} Table is created
	 */
	createEmbeddedViz = function( $scope, props ) {
		var _props = getTablePropsFromObjProps(props);

		// Extra table properties
		_props.showTitles = true;
		_props.totals = {
			show: false
		};

		// Create viz-on-the-fly with selected patches
		return app.visualization.create("table", [], _props).then( function( object ) {
			var $container = $("#" + $scope.containerId),

			// Insert object in the extension's element
			showed = object.show($scope.containerId, {
				/**
				 * Act when the table is rendered
				 *
				 * This fires only when the data model is reloaded or the sheet is (re)build. The
				 * following logic enables auto-updates on removal or adding of fields in the app's
				 * datamodel. Field selections do not affect visualization rendering.
				 *
				 * @return {Void}
				 */
				onRendered: function() {

					// Find the current table structure
					getAppTableFieldNames($scope.layout.props.tableName).then( function( fieldNames ) {
						var prevStructure = _.difference($scope.layout.props.tableStructure, $scope.removedFields),
						    newStructure = _.difference(fieldNames, $scope.removedFields),
						    hasNewStructure = _.difference(prevStructure, newStructure).length || _.difference(newStructure, prevStructure).length;

						// Structure was not found, table removed, so reset the extension visualization
						if (!fieldNames.length){
							resetExtensionVisualization($scope);

						// Structure was changed, so reload the embedded visualization
						} else if (hasNewStructure) {
							reloadEmbeddedViz($scope);
						}
					});
				}
			});

			// Store visualization id for future reference
			$scope.vizId = object.id;

			return showed;
		});
	},

	/**
	 * Updates the embedded visualization object
	 *
	 * @param  {Object} $scope Extension scope
	 * @param  {Object} props  Propeprties with updates
	 * @return {Promise} Table is updated
	 */
	updateEmbeddedViz = function( $scope, props ) {
		var dfd = $q.defer(), patcher = getPatches("dataTable");

		// Get the table's object model
		return app.getObject($scope.vizId).then( function( model ) {

			// Remove soft patches just before updating
			model.clearSoftPatches();

			// Apply patches
			return model.applyPatches(patcher(getTablePropsFromObjProps(props)));
		}).catch(console.error);
	},

	/**
	 * Shorthand for updating both the data table and the extension
	 *
	 * @param  {Object} $scope Extension scope
	 * @param  {Object} props  Properties with updates
	 * @return {Promise} Table is updated
	 */
	updateEmbeddedVizAndExtension = function( $scope, props ) {
		return updateEmbeddedViz($scope, props).then( function() {
			return updateExtensionVisualization($scope, props);
		});
	},

	/**
	 * Reload the embedded visualization object
	 *
	 * @param  {Object} $scope Extension scope
	 * @return {Promise} Table is reloaded
	 */
	reloadEmbeddedViz = function( $scope ) {
		return getAppTableByName($scope.layout.props.tableName).then( function( tableData ) {
			return selectTable($scope, tableData);
		});
	},

	/**
	 * Add a field to the embedded visualization
	 *
	 * @param  {Object} $scope Extension scope
	 * @param  {Object} tableData Table data
	 * @param  {String} fieldName Field name
	 * @return {Promise} Field is added
	 */
	addTableField = function( $scope, tableData, fieldName ) {

		// Remove the field from the table's hidden fields list
		$scope.removedFields = _.difference($scope.removedFields, [fieldName]);

		// Get the embedded visualization's properties
		return getEffectivePropertiesById($scope.vizId).then( function( props ) {
			var newProps = {
				qHyperCubeDef: props.qHyperCubeDef,
				props: {
					tableName: tableData.value,
					removedFields: $scope.removedFields
				}
			};

			// Add field to the dimension list
			newProps.qHyperCubeDef.qDimensions.push({
				qDef: {
					qFieldDefs: [fieldName],
					qFieldLabels: [fieldName],
					autoSort: true,
					qSortCriterias: [{
						qSortByAscii: 1
					}]
				}
			});

			// Add the field to ordering and sorting lists
			["qColumnOrder", "qInterColumnSortOrder"].forEach( function( a ) {
				newProps.qHyperCubeDef[a].push(newProps.qHyperCubeDef.qDimensions.length - 1);
			});

			// Update props on the table and extension
			return updateEmbeddedVizAndExtension($scope, newProps);
		}).catch(console.error);
	},

	/**
	 * Add all removed fields to the embedded visualization
	 *
	 * @param  {Object} $scope Extension scope
	 * @param  {Object} tableData Table data
	 * @return {Promise} Field is added
	 */
	addAllTableFields = function( $scope, tableData ) {

		// Get the embedded visualization's properties
		return getEffectivePropertiesById($scope.vizId).then( function( props ) {
			var newProps = {
				qHyperCubeDef: props.qHyperCubeDef,
				props: {
					tableName: tableData.value,
					removedFields: []
				}
			};

			// Walk the removed fields
			$scope.removedFields.forEach( function( a ) {

				// Add field to the dimension list
				newProps.qHyperCubeDef.qDimensions.push({
					qDef: {
						qFieldDefs: [a],
						qFieldLabels: [a],
						autoSort: true,
						qSortCriterias: [{
							qSortByAscii: 1
						}]
					}
				});

				// Add the field to ordering and sorting lists
				["qColumnOrder", "qInterColumnSortOrder"].forEach( function( a ) {
					newProps.qHyperCubeDef[a].push(newProps.qHyperCubeDef.qDimensions.length - 1);
				});
			});

			// Remove all fields from the table's hidden fields list
			$scope.removedFields = [];

			// Update props on the table and extension
			return updateEmbeddedVizAndExtension($scope, newProps);
		}).catch(console.error);
	},

	/**
	 * Remove a field from the embedded visualization
	 *
	 * @param  {Object} $scope Extension scope
	 * @param  {Object} tableData Table data
	 * @param  {String} fieldName Field name
	 * @return {Promise} Field is hidden
	 */
	removeTableField = function( $scope, tableData, fieldName ) {

		// Add the field to the table's hidden fields list
		$scope.removedFields = _.uniq($scope.removedFields.concat([fieldName]));

		// Get the embedded visualization's properties
		return getEffectivePropertiesById($scope.vizId).then( function( props ) {
			var newProps = {
				qHyperCubeDef: props.qHyperCubeDef,
				props: {
					tableName: tableData.value,
					removedFields: $scope.removedFields
				}
			};

			// Find field in hypercube
			field = newProps.qHyperCubeDef.qDimensions.find(function( a ) {
				return a.qDef.qFieldDefs[0] === fieldName;
			});

			// Field is found
			if (field) {

				// Remove the field from the dimension list
				var i = newProps.qHyperCubeDef.qDimensions.indexOf(field);
				newProps.qHyperCubeDef.qDimensions.splice(i, 1);

				// Remove the field from ordering and sorting lists
				["qColumnOrder", "qInterColumnSortOrder"].forEach( function( a ) {
					newProps.qHyperCubeDef[a] = newProps.qHyperCubeDef[a].filter( function( b ) {
						return b !== i;
					}).map( function( b ) {
						return b < i ? b : b - 1;
					});
				});

				// Update props on the table and extension
				return updateEmbeddedVizAndExtension($scope, newProps);
			}
		}).catch(console.error);
	},

	/**
	 * Remove all but the indicated field from the embedded visualization
	 *
	 * @param  {Object} $scope Extension scope
	 * @param  {Object} tableData Table data
	 * @param  {String} fieldName Field name
	 * @return {Promise} Fields are hidden
	 */
	removeOtherTableFields = function( $scope, tableData, fieldName ) {

		// Add all other fields to the table's hidden fields list
		$scope.removedFields = _.difference(_.uniq($scope.removedFields.concat(_.pluck(tableData.qData.qFields, "qName"))), [fieldName]);

		// Get the embedded visualization's properties
		return getEffectivePropertiesById($scope.vizId).then( function( props ) {
			var newProps = {
				qHyperCubeDef: props.qHyperCubeDef,
				props: {
					tableName: tableData.value,
					removedFields: $scope.removedFields
				}
			};

			// Find field in hypercube
			field = newProps.qHyperCubeDef.qDimensions.find(function( a ) {
				return a.qDef.qFieldDefs[0] === fieldName;
			});

			// Field is found
			if (field) {

				// Keep the field from the dimension list
				newProps.qHyperCubeDef.qDimensions = newProps.qHyperCubeDef.qDimensions.splice(newProps.qHyperCubeDef.qDimensions.indexOf(field), 1);

				// Remove the other fields from ordering and sorting lists
				newProps.qHyperCubeDef.qColumnOrder = [0];
				newProps.qHyperCubeDef.qInterColumnSortOrder = [0];

				// Update props on the table and extension
				return updateEmbeddedVizAndExtension($scope, newProps);
			}
		}).catch(console.error);
	},

	/**
	 * Extension controller function
	 *
	 * @param  {Object} $scope Extension scope
	 * @param  {Object} $el Scope's jQuery element
	 * @return {Void}
	 */
	controller = ["$scope", "$element", function( $scope, $el ) {

		/**
		 * Define the app popover
		 *
		 * @return {Object} Popover methods
		 */
		var popover = uiUtil.uiSearchableListPopover({
			title: "Tables",
			get: function( setItems ) {
				getAppTables().then( function( items ) {
					setItems(items);
				});
			},
			select: function( item ) {
				selectTable($scope, item);
			},
			alignTo: function() {
				return $el.find(".open-button")[0];
			},
			closeOnEscape: true,
			outsideIgnore: ".open-button",
			dock: "right"
		});

		/**
		 * Define a three-tiered state-machine for handling events
		 *
		 * @type {StateMachine}
		 */
		$scope.fsm = new util.StateMachine({
			name: "emergoTableInspector",
			transitions: [{
				from: "IDLE", to: "LOADING", name: "SELECT"
			}, {
				from: "LOADING", to: "TABLE", name: "OPEN"
			}, {
				from: "LOADING", to: "IDLE", name: "CLOSE"
			}, {
				from: "TABLE", to: "LOADING", name: "SELECT"
			}, {
				from: "TABLE", to: "IDLE", name: "CLOSE"
			}],
			on: {
				enterLoading: function( lifecycle ) {
					$scope.loading = true;
				},
				leaveLoading: function( lifecycle ) {
					$scope.loading = false;
				},
				enterIdle: function( lifecycle ) {

					// Clear inner html
					$("#" + $scope.containerId).empty();

					// Detach id from scope
					$scope.vizId = undefined;
				}
			}
		});

		// Container id
		$scope.containerId = "qs-emergo-table-inspector-" + $scope.$id;

		// Removed fields
		$scope.removedFields = $scope.layout.removedFields || [];

		// Initiate first data table when set
		getAppTableByName($scope.layout.props.tableName).then( function( tableData ) {

			// Select the table when found
			if (tableData) {
				selectTable($scope, tableData);
			}
		});

		/**
		 * Switch to Analysis mode
		 *
		 * @return {Void}
		 */
		$scope.switchToAnalysis = function() {
			qlik.navigation.setMode(qlik.navigation.ANALYSIS);

			// Open the app popover after the mode is fully switched
			qvangular.$rootScope.$$postDigest($scope.open);
		};

		/**
		 * Button select handler
		 *
		 * @return {Void}
		 */
		$scope.open = function() {
			if (! $scope.object.inEditState() && ! $scope.vizId) {
				popover.isActive() ? popover.close() : popover.open();
			}
		};

		// Map popover.isActive() to scope
		$scope.isActive = popover.isActive;

		// Close popover on window resize
		Resize.on("start", popover.close);

		/**
		 * Clean up when the controller is destroyed
		 *
		 * @return {Void}
		 */
		$scope.$on("$destroy", function() {
			Resize.off("start", popover.close);
			popover.close();
		});
	}],

	/**
	 * Return the element's straight table cell's scope
	 *
	 * @param  {Element} element HTML element to find its cell scope for
	 * @return {Object} The cell's scope
	 */
	getStCellScope = function( element ) {
		var cellClasses = ".qv-st-data-cell, .qv-st-header-cell",
		    $element = $(element);

		return $element.is(cellClasses) ? $element.scope() : $element.parents(cellClasses).scope();
	},

	/**
	 * Modify the extension's context menu
	 *
	 * @param  {Object} object Extension object
	 * @param  {Object} menu   Menu container
	 * @param  {Object} $event HTML event data
	 * @return {Void}
	 */
	getContextMenu = function( object, menu, $event ) {

		// Bail when we're in Edit mode
		if (object.inEditState()) {
			return;
		}

		var $scope = getExtensionScopeFromElement($event.target),

		/**
		 * Add a new table menu item to the provided menu
		 *
		 * @param  {Object} menu Menu to add to
		 * @param  {Object} a    Table data
		 * @return {Void}
		 */
		addTableMenuItem = function( menu, a ) {
			menu.addItem({
				label: a.value,
				tid: a.value,
				icon: "lui-icon lui-icon--table",
				select: function() {
					selectTable($scope, a);
				}
			});
		};

		// Add menu items
		$q.all({
			items: getAppTables(),
			model: $scope.vizId ? app.getObject($scope.vizId) : $q.resolve() // Table visualization for reading the current column order
		}).then( function( args ) {
			var items = args.items, model = args.model;

			if ($scope.vizId) {
				var switchTableSubmenu, addFieldSubmenu, removeFieldSubmenu, cellFieldName,

				// Find the cell's scope
				cellScope = getStCellScope($event.target) || {},

				// Find the cell's cell data
				cell = cellScope.cell || cellScope.header,

				// Find the selected table
				selectedTable = items.find( function( a ) {
					return a.value === object.layout.props.tableName;
				});

				// Copy cell value
				if (cell && !! cell.text) {
					menu.addItem({
						translation: "contextMenu.copyCellValue",
						tid: "copy-cell-context-item",
						icon: "lui-icon lui-icon--copy",
						select: function() {
							util.copyToClipboard(cell.text);
						}
					});
				}

				// Reset inspector
				menu.addItem({
					label: "Reset inspector",
					tid: "reset-inspector",
					icon: "lui-icon lui-icon--close",
					select: function() {
						resetExtensionVisualization($scope);
					}
				});

				// Switch to another table
				switchTableSubmenu = menu.addItem({
					label: "Switch table",
					tid: "switch-table",
					icon: "lui-icon lui-icon--table"
				});

				items.forEach( function( a ) {
					if (a.value === selectedTable.value) {
						switchTableSubmenu.addItem({
							label: a.value,
							tid: "reload-table",
							icon: "lui-icon lui-icon--reload",
							select: function() {
								reloadEmbeddedViz($scope);
							}
						});
					} else {
						addTableMenuItem(switchTableSubmenu, a);
					}
				});

				// Add field sub-items
				if (object.layout.props.removedFields.length) {

					// Create submenu when multiple fields are removed
					if (object.layout.props.removedFields.length > 1) {
						addFieldSubmenu = menu.addItem({
							label: "Add field",
							tid: "add-field",
							icon: "lui-icon lui-icon--paste"
						});

						addFieldSubmenu.addItem({
							label: "Add all fields",
							tid: "add-all-fields",
							select: function() {
								addAllTableFields($scope, selectedTable);
							}
						});

						selectedTable.qData.qFields.filter( function( a ) {
							return -1 !== object.layout.props.removedFields.indexOf(a.qName);
						}).forEach( function( a ) {
							addFieldSubmenu.addItem({
								label: a.qName,
								tid: "add-field-" + a.qName,
								select: function() {
									addTableField($scope, selectedTable, a.qName);
								}
							});
						});
					} else {
						menu.addItem({
							label: "Add field '" + object.layout.props.removedFields[0] + "'",
							tid: "add-field",
							icon: "lui-icon lui-icon--paste",
							select: function() {
								addTableField($scope, selectedTable, object.layout.props.removedFields[0]);
							}
						});
					}
				}

				// Remove field sub-items. Keep 1 remaining field in the table
				if (object.layout.props.removedFields.length < (selectedTable.qData.qFields.length - 1)) {
					if (cell) {
						cellFieldName = cellScope.$parent.$parent.grid.headerList.rows[0].cells.filter( function( a ) {
							return a.dataColIx === cell.dataColIx;
						})[0].fieldName;
					}

					// Context: Top level item: Remove this field
					if (!! cellFieldName) {
						menu.addItem({
							label: "Remove field '" + cellFieldName + "'",
							tid: "remove-this-field",
							icon: "lui-icon lui-icon--cut",
							select: function() {
								removeTableField($scope, selectedTable, cellFieldName);
							}
						});
					}

					removeFieldSubmenu = menu.addItem({
						label: "Remove field",
						tid: "remove-field",
						icon: "lui-icon lui-icon--cut"
					});

					// Context: Sub level item: Remove all other fields
					if (!! cellFieldName) {
						removeFieldSubmenu.addItem({
							label: "Remove all but '" + cellFieldName + "'",
							tid: "remove-other-fields",
							select: function() {
								removeOtherTableFields($scope, selectedTable, cellFieldName);
							}
						});
					}

					selectedTable.qData.qFields.filter( function( a ) {
						return -1 === object.layout.props.removedFields.indexOf(a.qName);
					}).map( function( v, i ) {
						v.$index = i;
						return v;
					}).sort( function( a, b ) {
						return model.layout.qHyperCube.qColumnOrder.indexOf(a.$index) - model.layout.qHyperCube.qColumnOrder.indexOf(b.$index);
					}).forEach( function( a ) {
						removeFieldSubmenu.addItem({
							label: a.qName,
							tid: "remove-field-" + a.qName,
							select: function() {
								removeTableField($scope, selectedTable, a.qName);
							}
						});
					});
				}

				// // Convert to regular table when user can edit
				// if (qlik.navigation.isModeAllowed(qlik.navigation.EDIT)) {
				// 	menu.addItem({
				// 		translation: ["contextMenu.convertTo", "Table"],
				// 		tid: "convert",
				// 		select: function() {
				// 			$scope.ext._convert(
				// 				visualizations.getType("table"), // How to?
				// 				"table",
				// 				builder.item // How to?
				// 			);
				// 		}
				// 	});
				// }

				// Export data
				menu.addItem({
					translation: "contextMenu.export",
					tid: "export",
					icon: "lui-icon lui-icon--export",
					select: function() {
						exportDialog.show(model);
					}
				});

			// Add selectable tables
			} else {
				if (items.length > 4) {
					var selectTableSubmenu = menu.addItem({
						label: "Select table",
						tid: "select-table",
						icon: "lui-icon lui-icon--table",
					});

					items.forEach( function( a ) {
						addTableMenuItem(selectTableSubmenu, a);
					});
				} else {
					items.forEach( function( a ) {
						addTableMenuItem(menu, a);
					});
				}
			}
		}).catch(console.error);
	},

	/**
	 * Handle conversions from a different visualization type
	 *
	 * @param  {Object} exportedFmt Export model from the originating visualization
	 * @param  {Object} initialProperties Initial properties of this extension
	 * @param  {Object} ext Extension object
	 * @param  {String} hyperCubePath Hypercube path (?)
	 * @return {Object} Export model
	 */
	importProperties = function( exportedFmt, initialProperties, ext, hyperCubePath ) {
		var retval = objectConversion.hypercube.importProperties.apply(this, arguments);

		// Overwrite title properties
		retval.qProperty.showTitles = initProps.showTitles || false;
		retval.qProperty.title = initProps.title;
		retval.qProperty.subtitle = initProps.subtitle;

		return retval;
	},

	/**
	 * Handle conversions to a different visualization type
	 *
	 * @param  {Object} propertyTree  Property tree of the current extension
	 * @param  {String} hyperCubePath Hypercube path (?)
	 * @return {Object} Export model
	 */
	exportProperties = function( propertyTree, hyperCubePath ) {
		var retval = objectConversion.hypercube.exportProperties.apply(this, arguments);

		// Add fields as dimensions
		propertyTree.qProperty.props.exportDimensions.forEach( function( fieldData ) {
			var field = JSON.parse(fieldData);

			// Include field when not removed
			if (-1 === propertyTree.qProperty.props.removedFields.indexOf(field.qDef.qFieldDefs[0])) {
				retval.data[0].dimensions.push(field);
			}
		});

		// Reset metadata
		retval.properties.showTitles = true;
		retval.properties.title = "";
		retval.properties.subtitle = "";

		return retval;
	};

	return {
		definition: props,
		initialProperties: initProps,
		template: tmpl,
		controller: controller,
		getContextMenu: getContextMenu,
		importProperties: importProperties,
		exportProperties: exportProperties,

		/**
		 * Setup listeners and watchers when the object is mounted
		 *
		 * @return {Void}
		 */
		mounted: function() {},

		/**
		 * Clean-up before the extension object is destroyed
		 *
		 * @return {Void}
		 */
		beforeDestroy: function() {
			var $scope = this.$scope;

			// Get the embedded visualization
			if ($scope.vizId) {
				app.getObject($scope.vizId).then( function( model ) {

					// Break engine connection and destroy scope
					model.close();
				});
			}
		},

		support: {
			cssScaling: false,
			sharing: false,
			snapshot: false,
			export: false,
			exportData: false // Data export is supported for the embedded visualization
		}
	};
});
