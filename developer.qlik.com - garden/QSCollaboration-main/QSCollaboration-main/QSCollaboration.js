define(["qlik", "text!./layout.html", "./fSelect", "css!./fSelect.css", "css!./style.css"], function(qlik, html) {
	"use strict";

	function exportToJsonFile(jsonData, exportFileDefaultName) {
		let dataStr = JSON.stringify(jsonData);
		let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
		//let exportFileDefaultName = 'data.json';
		let linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', exportFileDefaultName);
		linkElement.click();
		$('#log').append('<p>Download File : <strong>' + exportFileDefaultName + '</strong> successfully.</p>');
	}

	function readBlob(opt_startByte, opt_stopByte) {
		var files = document.getElementById('read_files').files;
		if (!files.length) {
			alert('Please select a file!');
			return;
		}
		var file = files[0];
		var start = parseInt(opt_startByte) || 0;
		var stop = parseInt(opt_stopByte) || file.size - 1;
		var reader = new FileReader();
		// If we use onloadend, we need to check the readyState.
		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) { // DONE == 2
				document.getElementById('file_data').textContent = evt.target.result;
				return evt.target.result;
			}
		};
		var blob = file.slice(start, stop + 1);
		reader.readAsBinaryString(blob);
		return reader;
	}

	return {
		support: {
			snapshot: false,
			export: false,
			exportData: false
		},
		paint: function($element, layout) {
			//add your rendering code here
			var id = layout.qInfo.qId,
				currApp = qlik.currApp(),
				enigma = this.backendApi.model.enigmaModel.app,
				enigmaGlobal = enigma.global,
				enigmaSelectedApp = '',
				enigmaGlobalSelectedApp = '',
				maxRankSheet = [],
				backendapi = this.backendApi;
			//console.log(enigma);
			currApp.getList("sheet", function(reply) {
				$.each(reply.qAppObjectList.qItems, function(key, value) {
					maxRankSheet.push(value.qData.rank);
				});
			}).then(function() {
				//console.log("Max sheet rank is ", Math.max.apply(Math, maxRankSheet), maxRankSheet);
			});
			$element.html(html);
			$('#log').append('<p><strong>Welcome to Qlik Sense Collaboration for developers.</strong></p>');
			$('#log').append('<p><strong>Note:</strong>All Log displayed is temporary & not saved for any refrence.</p>');
			enigmaGlobal.getDocList().then(function(reply) {
				//console.log(reply);
				$.each(reply, function(k, v) {
					//console.log(v.qDocId,v.qTitle);
					$('#select_App').append(' <option value="' + v.qDocId + '">' + v.qTitle + '</option>');
				});
			});
			$(".select").change(function() {
				var sel = $(this).parent().next().children();
				//console.log(sel);
				var count = $(this).children("option:selected").length;
				$.each(sel,function(k,v){
					if (count > 0) {
						$(v).removeAttr('disabled');
					} else {
						$(v).attr('disabled', 'disabled');
					}
				});
			});
			var selectedApp = '',
				selectedAppName = '',
				SnapshotList = [];
			//$('.clone_btn').hide();
			$('#select_Variable').hide();
			$('#select_Master_Mes').hide();
			$('#select_Master_Dim').hide();
			$('#select_Master_Viz').hide();
			$('#select_Story').hide();
			$('#select_Sheet').hide();
			$('#select_Connections').hide();
			$('#get_script').hide();
			$('#copy_script').hide();
			
			$("#SelectApp").click(function() {
				$('#log').append('<p><strong>Please Wait Loading Metadata.</strong></p>');
			
				selectedApp = $("select#select_App option:selected").val();
				selectedAppName = $("select#select_App option:selected").text();
				$('#log').append("<p>You have selected - <strong>" + selectedAppName + "</strong>.</p>");
				const app = qlik.openApp(selectedApp);
				//console.log(app);
				//$('.clone_btn').show();
				$('#get_script').show();
				$('#select_Variable').empty().hide();
				$('#select_Master_Mes').empty().hide();
				$('#select_Master_Dim').empty().hide();
				$('#select_Master_Viz').empty().hide();
				$('#select_Story').empty().hide();
				$('#select_Sheet').empty().hide();
				$('#select_Connections').empty().hide();
				app.getList("VariableList", function(reply) {
					$.each(reply.qVariableList.qItems, function(key, value) {
						$('#select_Variable').append(' <option value="' + value.qInfo.qId + '">' + value.qName + '</option>');
					});
				}).then(function(appModel) {
					enigmaSelectedApp = app.model.enigmaModel.app;
					enigmaGlobalSelectedApp = app.model.enigmaModel.app.global;
					enigmaSelectedApp.getConnections().then(function(reply) {
						//console.log(reply);
						$.each(reply, function(key, value) {
							$('#select_Connections').append(' <option value="' + value.qId + '">' + value.qName + ' > ' + value.qType + ' </option>');
						});
					}).then(function() {
						$('#select_Connections').fSelect().hide();
					});
					$('#select_Variable').fSelect().hide();
				});
				app.getList("MasterObject", function(reply) {
					$.each(reply.qAppObjectList.qItems, function(key, value) {
						$('#select_Master_Viz').append(' <option value="' + value.qInfo.qId + '">' + value.qMeta.title + '</option>');
					});
				}).then(function() {
					$('#select_Master_Viz').fSelect();
				});
				app.getList("sheet", function(reply) {
					$.each(reply.qAppObjectList.qItems, function(key, value) {
						$('#select_Sheet').append(' <option value="' + value.qInfo.qId + '">' + value.qMeta.title + '</option>');
					});
				}).then(function() {
					$('#select_Sheet').fSelect();
				});
				app.getList("SnapshotList", function(reply) {
					//console.log("SnapshotList",reply);
					$.each(reply.qBookmarkList.qItems, function(key, value) {
						SnapshotList.push(value);
						//	$('#select_Sheet').append(' <option value="' + value.qInfo.qId + '">' + value.qMeta.title + '</option>');
					});
				}).then(function() {
					//$('#select_Sheet').fSelect();
				});
				app.getList("story", function(reply) {
					//console.log(reply);
					$.each(reply.qAppObjectList.qItems, function(key, value) {
						$('#select_Story').append(' <option value="' + value.qInfo.qId + '">' + value.qMeta.title + '</option>');
					});
				}).then(function() {
					$('#select_Story').fSelect();
				});
				app.createGenericObject({
					"qMeasureListDef": {
						"qType": "measure",
						"qData": {
							"qLayout": "/qLayout",
							"qMeasure": "/qMeasure",
							"qMeta": "/qMeta"
						}
					}
				}, function(reply) {
					$.each(reply.qMeasureList.qItems, function(k, v) {
						$('#select_Master_Mes').append(' <option value="' + v.qInfo.qId + '">' + v.qData.qMeasure.qLabel + '</option>');
					});
				}).then(function() {
					$('#select_Master_Mes').fSelect();
				});
				app.createGenericObject({
					"qDimensionListDef": {
						"qType": "dimension",
						"qData": {
							"qLayout": "/qLayout",
							"qDimInfos": "/qDimInfos",
							"qMetaDef": "/qMetaDef",
							"qDim": "/qDim"
						}
					}
				}, function(reply) {
					$.each(reply.qDimensionList.qItems, function(k, v) {
						$('#select_Master_Dim').append(' <option value="' + v.qInfo.qId + '">' + v.qData.qDim.title + '</option>');
					});
				}).then(function() {
					$('#select_Master_Dim').fSelect();
				});
				// search
			});
			$("#clear_log").click(function() {
				$('#log').empty();
				$('#copy_script').hide();
			});
			$("#clone_file").click(function() {
				var data = readBlob();
				data.onloadend = function(evt) {
					if (evt.target.readyState == FileReader.DONE) { // DONE == 2
						document.getElementById('file_data').textContent = evt.target.result;
						var fData = JSON.parse(evt.target.result),
							filetype = $("#file_type :selected").val();
						//console.log(filetype, fData);
						$.each(fData, function(k, v) {
							if (filetype == 'Variable') {
								//console.log(v);
								//debugger;
								enigma.getVariableByName(v.qName+"").then(function(r) {
									//console.log(r);
									enigma.destroyVariableById(r.id).then(function() {
										enigma.createVariableEx(v).then(function(NewVarModel) {
											$('#log').append("<p>Deleted & Created Variable ID: <strong>" + NewVarModel.id + "</strong> to App <strong>:" + enigma.id + "</strong></p>");
											enigma.doSave();
										});
									});
								});
								
								enigma.createVariableEx(v).then(function(NewVarModel) {
									$('#log').append("<p>Variable ID: <strong>" + NewVarModel.id + "</strong> to App <strong>:" + enigma.id + "</strong></p>");
									enigma.doSave();
								});
								
								
							} else if (filetype == 'Measure') {
								enigma.createMeasure(v).then(function(NewMeasModel) {
									$('#log').append("<p>Measure ID: <strong>" + NewMeasModel.id + "</strong> to App : <strong>" + enigma.id + "</strong></p>");
									enigma.doSave();
								});
							} else if (filetype == 'Dimension') {
								enigma.createDimension(v).then(function(NewDimModel) {
									$('#log').append("<p>Dimension ID: <strong>" + NewDimModel.id + "</strong> to App : <strong>" + enigma.id + "</strong></p>");
									enigma.doSave();
								});
							} else if (filetype == 'Visualization') {
								//console.log(v);
								enigma.createObject(v.qProperty).then(function(NewVizModel) {
										if( v.qProperty.visualization == 'filterpane'){
												v.qChildren.forEach(cell1 => {
													NewVizModel.createChild(cell1.qProperty).then(newObject => {
														//console.log(newObject);
														$('#log').append('<p>Type: <strong>' + NewVizModel.qProperty.visualization + '</strong> Added Dimension.</p>');
													});
												});
										}
									$('#log').append("<p>Object ID: <strong>" + NewVizModel.id + "</strong> to App : <strong>" + enigma.id + "</strong></p>");
									enigma.doSave();
								});
							} else if (filetype == 'Connections') {
								enigma.createConnection(v).then(function(NewModel) {
									$('#log').append("<p>Connections ID: <strong>" + NewModel + "</strong> to App <strong>:" + enigma.id + "</strong></p>");
									enigma.doSave();
								});
							}
						});
					}
				};
			});
			$("#clone_Connections").click(function() {
				$('#select_Connections :selected').each(function() {
					//console.log($(this).val());
					enigmaSelectedApp.getConnection($(this).val()).then(function(model) {
						enigma.createConnection(model).then(function(NewModel) {
							$('#log').append("<p>Connections ID: <strong>" + NewModel + "</strong> to App <strong>:" + enigma.id + "</strong></p>");
							enigma.doSave();
						});
					});
				});
			});
			$("#clone_Connections_Download").click(function() {
				var Meta = [];
				$('#select_Connections :selected').each(function() {
					//console.log($(this).val());
					var getObjectProperties = enigmaSelectedApp.getConnection($(this).val());
					Meta.push(getObjectProperties);
				});
				Promise.all(Meta).then((rep) => {
					//console.log(rep);
					exportToJsonFile(rep, 'ConnectionList_' + selectedAppName + '.json');
				});
			});
			$("#clone_Variable").click(function() {
				$('#select_Variable :selected').each(function() {
					//console.log($(this).val());
					enigmaSelectedApp.getVariableById($(this).val()).then(function(model) {
						model.getProperties().then(function(VarModel) {
							enigma.getVariableByName(VarModel.qName).then(function(r) {
								//console.log(r);
								enigma.destroyVariableById(r.id).then(function() {
									enigma.createVariableEx(VarModel).then(function(NewVarModel) {
										$('#log').append("<p>Deleted & Created Variable ID: <strong>" + NewVarModel.id + "</strong> to App <strong>:" + enigma.id + "</strong></p>");
										enigma.doSave();
									});
								});
							});
							enigma.createVariableEx(VarModel).then(function(NewVarModel) {
								$('#log').append("<p>Variable ID: <strong>" + NewVarModel.id + "</strong> to App <strong>:" + enigma.id + "</strong></p>");
								enigma.doSave();
							});
						});
					});
				});
			});
			$("#clone_Variable_Download").click(function() {
				var Meta = [];
				$('#select_Variable :selected').each(function() {
					//console.log($(this).val());
					var getObjectProperties = enigmaSelectedApp.getVariableById($(this).val()).then((model) => model.getProperties());
					var fProp = getObjectProperties.then(sourceObjectProperties => {
						return sourceObjectProperties;
					});
					Meta.push(fProp);
				});
				Promise.all(Meta).then((rep) =>
					//console.log(rep)
					exportToJsonFile(rep, 'VariableList_' + selectedAppName + '.json'));
			});
			$("#clone_Master_Mes").click(function() {
				$('#select_Master_Mes :selected').each(function() {
					enigmaSelectedApp.getMeasure($(this).val()).then(function(model) {
						model.getProperties().then(function(MeasModel) {
							//console.log(MeasModel);
							MeasModel.qMeasure.qLabel = MeasModel.qMeasure.qLabel + "-Clone";
							MeasModel.qMetaDef.title = MeasModel.qMeasure.qLabel + "-Clone";
							enigma.createMeasure(MeasModel).then(function(NewMeasModel) {
								//enigma.getMeasure(NewMeasModel.id).then(function(r){
								//	console.log(r);
								//	var Fname = '{ "title": "'+Name+'"}';
								//	console.log(JSON.stringify(Fname),NewMeasModel);
								//	NewMeasModel.enigmaModel.app.applyPatches({
								//		"qOp": "replace",
								//		"qPath": "/qMetaDef",
								//		"qValue": "{ \"title\": \"revTime-Clone\"}"
								//	});	
								$('#log').append("<p>Measure ID: <strong>" + NewMeasModel.id + "</strong> to App : <strong>" + enigma.id + "</strong></p>");
								enigma.doSave();
								//});
							});
						});
					});
				});
			});
			$("#clone_Master_Mes_Download").click(function() {
				var Meta = [];
				$('#select_Master_Mes :selected').each(function() {
					var getObjectProperties = enigmaSelectedApp.getMeasure($(this).val()).then((model) => model.getProperties());
					var fProp = getObjectProperties.then(sourceObjectProperties => {
						return sourceObjectProperties;
					});
					Meta.push(fProp);
				});
				Promise.all(Meta).then((rep) =>
					//console.log(rep)
					exportToJsonFile(rep, 'MeasureList_' + selectedAppName + '.json'));
			});
			$("#clone_Master_Dim").click(function() {
				$('#select_Master_Dim :selected').each(function() {
					enigmaSelectedApp.getDimension($(this).val()).then(function(model) {
						model.getProperties().then(function(DimModel) {
							console.log(DimModel);
							DimModel.qMetaDef.title = DimModel.qMetaDef.title + '-Clone';
							DimModel.qDim.title = DimModel.qMetaDef.title + '-Clone';
							enigma.createDimension(DimModel).then(function(NewDimModel) {
								//	NewDimModel.title = Name+'-Clone';
								$('#log').append("<p>Dimension ID: <strong>" + NewDimModel.id + "</strong> to App : <strong>" + enigma.id + "</strong></p>");
								enigma.doSave();
							});
						});
					});
				});
			});
			$("#clone_Master_Dim_Download").click(function() {
				var Meta = [];
				$('#select_Master_Dim :selected').each(function() {
					var getObjectProperties = enigmaSelectedApp.getDimension($(this).val()).then((model) => model.getProperties());
					var fProp = getObjectProperties.then(sourceObjectProperties => {
						return sourceObjectProperties;
					});
					Meta.push(fProp);
				});
				Promise.all(Meta).then((rep) =>
					//console.log(rep)
					exportToJsonFile(rep, 'DimensionList_' + selectedAppName + '.json'));
			});
			$("#clone_Master_Viz").click(function() {
				$('#select_Master_Viz :selected').each(function() {
					var GetFullPropertyTree = enigmaSelectedApp.getObject($(this).val()).then(co => co.getFullPropertyTree());
					enigmaSelectedApp.getObject($(this).val()).then(function(model) {
						model.getProperties().then(function(VizModel) {
							
							enigma.createObject(VizModel).then(function(NewVizModel) {
								$('#log').append("<p>Object ID: <strong>" + NewVizModel.id + "</strong> to App : <strong>" + enigma.id + "</strong></p>");
								
								if( VizModel.visualization == 'filterpane'){
											//console.log(GetFullPropertyTree);
											GetFullPropertyTree.then(function(Child){
												//console.log(Child.qChildren);
												Child.qChildren.forEach(cell1 => {
													NewVizModel.createChild(cell1.qProperty).then(newObject => {
														//console.log(newObject);
														$('#log').append('<p>Type: <strong>' + VizModel.visualization + '</strong> Added Dimension.</p>');
													});
												});
											});
										}
								
								
								enigma.doSave();
							});
						});
					});
				});
			});
			$("#clone_Master_Viz_Download").click(function() {
				var Meta = [];
				$('#select_Master_Viz :selected').each(function() {
					var getObjectProperties = enigmaSelectedApp.getObject($(this).val()).then((model) => model.getFullPropertyTree());
					var fProp = getObjectProperties.then(sourceObjectProperties => {
						return sourceObjectProperties;
					});
					Meta.push(fProp);
				});
				Promise.all(Meta).then((rep) =>
					//console.log(rep)
					exportToJsonFile(rep, 'Visualization_' + selectedAppName + '.json'));
			});
			$("#get_script").click(function() {
				enigmaSelectedApp.getScript().then(function(script) {
					//console.log(script);
					$('#log').append("<textarea id='qvscript' class='script_cont'>" + script + "</textarea>");
					$('#copy_script').show();
					//exportToJsonFile(script, 'Script_' + selectedAppName + '.txt');
				});
			});
			$("#copy_script").click(function() {
				$("#qvscript").select();
				document.execCommand('copy');
			});
			$("#clone_Story").click(function() {
				$('#log').append('<p><strong>Note:</strong>All Object ID displayed in log will be of selected application, Object ID for host application will change for all objects.</p>');
				$('#select_Story :selected').each(function() {
					enigmaSelectedApp.getObject($(this).val()).then(sourceStory => {
						//console.log("SnapshotList",SnapshotList);
						sourceStory.getFullPropertyTree().then(sourceStoryProperties => {
							console.log('source sheet props:', sourceStoryProperties);
							var getObjectProperties = enigmaSelectedApp.getObject(sourceStoryProperties.qProperty.qInfo.qId).then(co => co.getProperties());
							var createObjectPromise = getObjectProperties.then(sourceObjectProperties => {
								console.log('source object properties', sourceObjectProperties);
								// reset id so qlik sense can generate a new one 
								//sourceObjectProperties.qInfo.qId = undefined;
								// create object in target application
								enigma.createObject(sourceObjectProperties).then(newObject => {
									console.log('created object L1:', newObject);
									$('#log').append('<p>Sheet Name <strong>' + sourceObjectProperties.qMetaDef.title + '</strong> copied successfully.</p>');
									sourceStoryProperties.qChildren.forEach(cell => {
										$('#log').append('<p>Created object type: <strong>' + cell.qProperty.qInfo.qType + '</strong> with ID: <strong>' + cell.qProperty.qInfo.qId + '</strong>.</p>');
										var getObjectProperties = enigmaSelectedApp.getObject(cell.qProperty.qInfo.qId).then(co => co.getProperties());
										//console.log("L2 getObjectProperties",getObjectProperties);
										var createObjectPromise = getObjectProperties.then(sourceObjectProperties1 => {
											console.log('source object properties L2', sourceObjectProperties1);
											// reset id so qlik sense can generate a new one 
											//sourceObjectProperties.qInfo.qId = undefined;
											// create object in target application
											newObject.createChild(sourceObjectProperties1).then(newObject1 => {
												console.log('created object L2:', newObject1);
												// set cell name to objects id before creating new sheet
												//cell.name = newObject.id;
												cell.qChildren.forEach(cell1 => {
													$('#log').append('<p>Created object type: <strong>' + cell1.qProperty.qInfo.qType + '</strong> with ID: <strong>' + cell1.qProperty.qInfo.qId + '</strong>.</p>');
													var getObjectProperties = enigmaSelectedApp.getObject(cell1.qProperty.qInfo.qId).then(co => co.getProperties());
													//console.log("cell",cell);
													var createObjectPromise = getObjectProperties.then(sourceObjectProperties => {
														//console.log('source object properties', sourceObjectProperties);
														// reset id so qlik sense can generate a new one 
														//sourceObjectProperties.qInfo.qId = undefined;
														// create object in target application
														newObject1.createChild(sourceObjectProperties).then(newObject => {
															console.log('created object L3:', newObject);
															// set cell name to objects id before creating new sheet
															//cell.name = newObject.id;
															enigma.doSave();
															if (cell1.qProperty.visualization == "snapshot") {
																enigmaSelectedApp.getBookmark(cell1.qProperty.style.id).then(function(model) {
																	model.getProperties().then(function(VizModel) {
																		//console.log("VizModel",VizModel);
																		enigma.createBookmark(VizModel).then(function(NewVizModel) {
																			console.log("NewVizModel", NewVizModel);
																			$('#log').append("<p>Snapshot Object ID: <strong>" + NewVizModel.id + "</strong> to App : <strong>" + enigma.id + "</strong></p>");
																			enigma.doSave();
																		});
																	});
																});
															}
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
			//https://github.com/sitmsc/sense-copy-sheet/blob/master/sense-copy-sheet.js
			$("#clone_Sheet").click(function() {
				$('#log').append('<p><strong>Note:</strong>All Object ID displayed in log will be of selected application, Object ID for host application will change for all objects.</p>');
				$('#select_Sheet :selected').each(function() {
					// load sheet from source application
					enigmaSelectedApp.getObject($(this).val()).then(sourceSheet => {
						//console.log('source sheet:', sourceSheet);
						sourceSheet.getProperties().then(sourceSheetProperties => {
							//console.log('source sheet props:', sourceSheetProperties);
							var promises = [];
							// loop over every object on source sheet
							sourceSheetProperties.cells.forEach(cell => {
								$('#log').append('<p>Created chart type: <strong>' + cell.type + '</strong> with ID: <strong>' + cell.name + '</strong>.</p>');
								var getObjectProperties = enigmaSelectedApp.getObject(cell.name).then(co => co.getProperties());
								
								var GetFullPropertyTree = enigmaSelectedApp.getObject(cell.name).then(co => co.getFullPropertyTree());
								
								var createObjectPromise = getObjectProperties.then(sourceObjectProperties => {
									//console.log('source object properties', sourceObjectProperties);
									// reset id so qlik sense can generate a new one 
									sourceObjectProperties.qInfo.qId = undefined;
									// create object in target application
									return enigma.createObject(sourceObjectProperties).then(newObject => {
										//console.log('created object:', newObject);
										// set cell name to objects id before creating new sheet
										cell.name = newObject.id;
										
										
										if( cell.type == 'filterpane'){
											
											GetFullPropertyTree.then(function(Child){
												//console.log(Child.qChildren);
												Child.qChildren.forEach(cell1 => {
													newObject.createChild(cell1.qProperty).then(newObject => {
														//console.log(newObject);
														$('#log').append('<p>Type: <strong>' + cell.type + '</strong> Added Dimension.</p>');
													});
												});
											});
											
										}
									});
								});
								promises.push(createObjectPromise);
							});
							// wait for every object to be created before proceeding
							var allProp = Promise.all(promises).then(() => sourceSheetProperties);
							//console.log(allProp);
							return allProp;
						}).then(sourceSheetProperties => {
							//console.log('before create new sheet:', sourceSheetProperties);
							// reset id so qlik sense can generate a new one 
							// (?OPTIONAL?: maybe keep old id, maybe setting?)
							sourceSheetProperties.qInfo.qId = undefined;
							// TODO: load sheet-count from api and assign it to rank.
							var rank = Math.max.apply(Math, maxRankSheet) + 1;
							///console.log("Sheet Rank is ", rank);
							sourceSheetProperties.rank = rank;
							// TODO: then with promise.all
							// create sheet using the properties of the source sheet
							enigma.createObject(sourceSheetProperties).then(newSheet => {
								//console.log('created sheet:', newSheet);	
								$('#log').append('<p>Sheet Name <strong>' + sourceSheetProperties.qMetaDef.title + '</strong> copied successfully.</p>');
								enigma.doSave();
							});
						});
					});
				});
			});
			//needed for export
			return qlik.Promise.resolve();
		},
		resize: function(e, l) {}
	};
});