define(["qlik", "./getMasterItems", "css!./style.css"], function (qlik, getMasterItems) {
	return {
		initialProperties: {
			listItems: []
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				DialogList: {
					type: "array",
					ref: "listItems",
					label: "Dialog Popup List",
					itemTitleRef: "dialogtitle",
					allowAdd: true,
					allowRemove: true,
					addTranslation: "Add Dialog",
					items: {
						DialogTitle: {
							ref: "dialogtitle",
							label: "Dialog Title",
							type: "string",
							defaultValue: "Title",
							expression: "optional"
						},
						ButtonText: {
							ref: "ButtonText",
							label: "Button Text",
							type: "string",
							defaultValue: "View Dialog",
							expression: "optional"
						},
						Dialogwidth: {
							ref: "dialogwidth",
							label: "Dialog Width in %",
							type: "string",
							defaultValue: "50",
							expression: "optional"
						},
						Dialogheight: {
							ref: "Dialogheight",
							label: "Dialog Height in px",
							type: "string",
							defaultValue: "300",
							expression: "optional"
						},
						defaultMasterObject: {
							type: "string",
							component: "dropdown",
							label: "Master Object",
							ref: "defaultMasterObject",
							options: function () {
								return getMasterItems().then(function (items) {
									return items;
								});
							}
						},
						ShowPara: {
							type: "boolean",
							label: "Add HTML Paragraph",
							ref: "ShowPara",
							defaultValue: false
						},
						Paragraph: {
							label: "HTML Paragraph",
							component: "textarea",
							rows: 7,
							maxlength: 100000,
							ref: "Paragraph",
							expression: "optional",
							show: function (d) {
								return d.ShowPara;
							}
						},
						Paragraphheight: {
							ref: "Paragraphheight",
							label: "Paragraph Height in px",
							type: "string",
							defaultValue: "300",
							expression: "optional",
							show: function (d) {
								return d.ShowPara;
							}
						},
						// end
					}
				},
				//end
				settings: {
					uses: "settings",
					items: {
						DialogSettings:{
							label:"Dialog Settings",
							type:"items",
							items:{
								ShowDialogTitle: {
									type: "boolean",
									label: "Show Dialog Title",
									ref: "ShowDialogTitle",
									defaultValue: true
								},
								ShowExport: {
									type: "boolean",
									label: "Show Export Button",
									ref: "ShowExport",
									defaultValue: true
								}
								/*
								ShowClose: {
									type: "boolean",
									label: "Show Close Button",
									ref: "ShowClose",
									defaultValue: true
								}
								style="'+(ShowClose?'':'display:none;')+'"
								*/
							}
						}
						
					}
				}
			}
		},
		support: {
			snapshot: false,
			export: false,
			exportData: false
		},
		paint: function ($element, layout) {
			//add your rendering code here
			var config = {
				host: window.location.hostname,
				prefix: "/",
				port: window.location.port,
				isSecure: window.location.protocol === "https:"
			},
				app = qlik.currApp(),
				sheetId = qlik.navigation.getCurrentSheetId().sheetId,
				layoutid = layout.qInfo.qId,
				btn = '<div class="lui-buttongroup">',
				htm = '',
				ShowDialogTitle = layout.ShowDialogTitle,
				ShowExport = layout.ShowExport,
				ShowClose = layout.ShowClose;
			// add html
			htm += '<div id="comment-diloag-' + layoutid + '" style="display: none;">';
			htm += '<div class="lui-dialog dialog-content"  style="">';
			htm += '<div class="lui-dialog__header" style="'+(ShowDialogTitle?'':'display:none;')+'">';
			htm += '  <div class="lui-dialog__title" id="Dialog-Title" ></div>';
			htm += '</div>';
			//lui-dialog__body
			htm += '<div class="lui-dialog__body2" id="cont-' + layoutid + '">';
			htm += '</div>';
			htm += '<div id="para-' + layoutid + '" style="height: 100px;overflow: scroll;padding: 5px;margin: 5px;border: 1px solid #ccc;"></div>';
			htm += '<div class="lui-dialog__footer">';
			htm += '<a target="_blank" id="download_file" >Click here to download your data file.</a>';
			htm += '<button id="Export" class="lui-button  lui-dialog__button export" style="'+(ShowExport?'':'display:none;')+'"><i class="lui-icon  lui-icon--export" style="margin-right: 2px;"></i>Export</button>';
			htm += '<button class="lui-button  lui-dialog__button cancel_'+layoutid+'" >Close</button>';
			htm += '</div>';
			htm += '</div>';
			htm += '</div>';
			//if ($('#comment-diloag-' + layoutid).length == 0) {
			if (!document.getElementById('comment-diloag-'+layoutid)) {
				$('#grid-wrap').append(htm);
				$(function () {
					//{ containment: ".qv-panel-content" }
					$("#comment-diloag-" + layoutid).draggable({ handle: "div.lui-dialog__header" });
				});
			}
			
			
			$.each(layout.listItems, function (k, v) {
				var Dialogtitle = v.dialogtitle;
				var ButtonText = v.ButtonText;
				var objid = v.defaultMasterObject;
				var width = v.dialogwidth;
				var height = v.Dialogheight;
				var path = k;
				btn += '<button path="' + path + '" class="lui-button lui-dialog__button view_dialog_'+layoutid+'" Dialog-Title="' + Dialogtitle + '" Dialog-width="' + width + '" Dialog-height="' + height + '" obj-id="' + objid + '" view-id="' + layoutid + '">' + ButtonText + '</button>';
			});
			btn += '</div>';
			$element.html(btn);
			$(".cancel_"+layoutid).click(function () {
				$('#comment-diloag-' + layoutid).css("display", "none");
				//$('#comment-diloag-' + layoutid).remove();
				//qlik.resize("comment-diloag-" + layoutid);
			});

			$(".view_dialog_"+layoutid).click(function () {
				var obj = $(this).attr("obj-id");
				var title = $(this).attr("Dialog-Title");
				var width = $(this).attr("Dialog-width");
				var height = $(this).attr("Dialog-height");
				var path = $(this).attr("path");
				var ShowPara = layout.listItems[path].ShowPara;
				var Paragraph = layout.listItems[path].Paragraph;
				var Paragraphheight = layout.listItems[path].Paragraphheight;
				$('#download_file').hide();
				$("#comment-diloag-" + layoutid).css("left", "0");
				$("#comment-diloag-" + layoutid).css("top", "0");
				//console.log(obj, title, width, height);
				$('#Dialog-Title').html(title);
				$("#comment-diloag-" + layoutid).css("display", "");
				$(".dialog-content").css("width", width + "%");
				$("#cont-" + layoutid).css("height", height + "px");
				//console.log(obj,ShowPara,Paragraph);
				if (ShowPara == "false" || ShowPara === false) {
					$("#para-" + layoutid).hide();
				} else {
					$("#para-" + layoutid).show().css("height",Paragraphheight+"px").html(Paragraph);
				}
				app.getObject('cont-' + layoutid, obj).then(function (modal) {
					qlik.resize(this);
					// export data excel
					//console.log(modal);
					//var qTable = qlik.table(modal);
					var title = modal.layout.qMeta.title;
					$('#Export').click(function () {
						//qTable.exportData({download: true,filename:title});						
						modal.exportData().then(function (reply) {
							//console.log('reply=',reply);  
							var url = (config.isSecure ? "https://" : "http://") + config.host + config.port + reply.qUrl;
							//var url = "../resources/../"+ config.host+reply.qUrl; 
							//var url = config.host+reply.qUrl; 
							console.log('qUrlModified', url);
							//window.open(url);
							$('#download_file').attr("href", url);
							$('#download_file').show();
						});
					});
				});
				
			});
			//needed for export
			return qlik.Promise.resolve();
		}
	};
});
