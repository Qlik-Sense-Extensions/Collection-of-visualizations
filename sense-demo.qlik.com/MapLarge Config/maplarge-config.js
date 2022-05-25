define(['jquery', 'qlik', 'text!./style.css'], function ($, qlik, cssContent) {
	
	$('<style>').html(cssContent).appendTo('head');

	var url;
	var appId;

	var fields;

	return {
		definition: {
			type: "items",
			component: "accordion",
			items: {
				data: {
					component: "expandable-items",
					label: "Settings",
					items: {
						header1: {
							type: "items",
							label: "Configuration",
							items: {
								mapType: {
									label: "MapLarge Service Url",
									type: "string",
									ref: "props.serviceUrl",
									defaultValue: "http://localhost:8585",
								}
							}
						}
					}
				}
			}
		},
		initialProperties: {
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

		paint: function ($element, layout) {
			var app = qlik.currApp();

			url = layout.props.serviceUrl || "http://localhost:8585";

			appId = app.id;

			if (appId.indexOf(".qvf") == -1)
				appId = appId + ".qvf";

			if (fields) {
				LoadAppOptions($element);
			}
			else {
				qlik.currApp().createGenericObject({
					"qFieldListDef": {
						"qShowSystem": false,
						"qShowHidden": false,
						"qShowSemantic": true,
						"qShowSrcTables": true
					}
				}, function (reply) {
					fields = reply.qFieldList.qItems;

					LoadAppOptions($element);
				});
			}
			
		}
	};

	function ErrorCallback($element, title, message) {
		title = title || "Cannot Connect";
		message = message || "Cannot communicate with the import service at " + url + ". Verify that the service is running and that the extension is configured with the correct url.";

		return function () {
			$element.empty();
			$element.append(
				'<div class="object-error hard-error">' +
					'<div class="object-error-content">' +
					  '<div class="object-error-title">' +
						'<span>' + title + '</span>' +
					  '</div>' +
					  '<div class="object-error-message">' +
					  message +
					  '</div>' +
					'</div>' +
				'</div>');
		};
	}

	function LoadAppOptions($element) {
		$.ajax(url + "/config/app/" + encodeURI(appId), {
			success: function (data) {
				DisplayAppOptions($element, data.Applications[appId] || {}, data);
			},
			error: ErrorCallback($element)
		});
	}

	function SaveUpdatedConfig($element, config, callback) {
		$.ajax({
			type: 'POST',
			url: url + "/config/app/" + encodeURI(appId),
			data: JSON.stringify(config),
			complete: callback,
			error: ErrorCallback($element)
		});
	}

	function DisableUpload($element, callback) {
		$.ajax({
			type: 'POST',
			url: url + "/config/app/disable/" + encodeURI(appId),
			complete: callback,
			error: ErrorCallback($element)
		});
	}

	function EnableUpload($element, callback) {
		$.ajax({
			type: 'POST',
			url: url + "/config/app/enable/" + encodeURI(appId),
			complete: callback,
			error: ErrorCallback($element)
		});
	}

	function ForceUpload($element, callback) {
		$.ajax({
			type: 'POST',
			url: url + "/config/app/forceUpload/" + encodeURI(appId),
			complete: callback,
			error: ErrorCallback($element)
		});
	}

	function DisplayAppOptions($element, appOptions, defaultOptions) {
		$element.empty();

		var tableMode = appOptions.TableWhiteList && appOptions.TableWhiteList.length > 0 ? 'include' : 'exclude';
		var columnMode = appOptions.ColumnWhiteList && appOptions.ColumnWhiteList.length > 0 ? 'include' : 'exclude';

		$element.append(
		"<div class='mlc-root'>" +
			"<h1 class='qv-object-title qvt-visualization-title'>MapLarge Configuration</h1>" +
			"<table class='mlc'>" +
				"<tr><td class='mlc-label'>Upload Enabled:</td><td><span class='mlc-enabled-text'></span> - <a href='#' class='mlc-toggle-enabled'></a></td></tr>" +
				"<tr><td class='mlc-label'>Last Upload:</td><td><span class='mlc-utime'></span><span class='mlc-reupload-span'> - <a href='#' class='mlc-reupload'>Force New Upload</a></span></td></tr>" +
				"<tr><td class='mlc-label'>MapLarge Url:</td><td><input type='text' class='mlc-mlurl qui-input' style='width:200px' /></td></tr>" +
				"<tr><td class='mlc-label'>MapLarge Account:</td><td><input type='text' class='mlc-mlacc qui-input' style='width:200px' /></td></tr>" +
				"<tr><td class='mlc-label'>MapLarge Upload User:</td><td><input type='text' class='mlc-uuser qui-input' /> <input type='text' class='mlc-upass qui-input' placeholder='Password' /></td></tr>" +
				//"<tr><td class='mlc-label'>MapLarge Upload Password:</td><td><input type='text' class='mlc-upass qui-input' /></td></tr>" +
				"<tr><td class='mlc-label'>MapLarge View User:</td><td><input type='text' class='mlc-vuser qui-input' /> <input type='text' class='mlc-vpass qui-input' placeholder='Password' /></td></tr>" +
				//"<tr><td class='mlc-label'>MapLarge View Password:</td><td><input type='text' class='mlc-vpass qui-input' /></td></tr>" +
				//"<tr><td class='mlc-label'>Included Tables:</td><td><input type='text' class='mlc-tw qui-input' style='width:100%' /></td></tr>" +
				//"<tr><td class='mlc-label'>Excluded Tables:</td><td><input type='text' class='mlc-tb qui-input' style='width:100%' /></td></tr>" +
				//"<tr><td class='mlc-label'>Included Columns:</td><td><input type='text' class='mlc-cw qui-input' style='width:100%' /></td></tr>" +
				//"<tr><td class='mlc-label'>Excluded Columns:</td><td><input type='text' class='mlc-cb qui-input' style='width:100%' /></td></tr>" +
			"</table>" +
			"<fieldset class='mlc-table-filter' style='margin: 20px;padding: 10px;border: 1px solid #999;border-radius: 3px;'><legend>Table Filter</legend>" +
				"<div style='margin-bottom:20px'>" +
					"<label class='qui-radiobutton' style='display:inline-block'><input type='radio' name='mlc-table-filter-type' value='exclude' " + (tableMode == 'exclude' ? "checked='checked'" : "") + " /><div class='radio-wrap'><span class='radio'></span><span class='radio-text' style='width:auto'>Import all tables except for tables selected:</span></div></label>" +
					"<label class='qui-radiobutton' style='display:inline-block;margin-left:10px'><input type='radio' name='mlc-table-filter-type' value='include' " + (tableMode == 'include' ? "checked='checked'" : "") + " /><div class='radio-wrap'><span class='radio'></span><span class='radio-text' style='width:auto'>Only import selected tables:</span></div></label>" +
				"</div>" +
				BuildTableCheckboxList(tableMode == 'include' ? appOptions.TableWhiteList : appOptions.TableBlackList) +
			"</fieldset>" +
			"<fieldset style='margin: 20px;padding: 10px;border: 1px solid #999;border-radius: 3px;'><legend>Field Filter</legend>" +
				"<div style='margin-bottom:15px'>" +
					"<label class='qui-radiobutton' style='display:inline-block'><input type='radio' name='mlc-column-filter-type' value='exclude' " + (columnMode == 'exclude' ? "checked='checked'" : "") + " /><div class='radio-wrap'><span class='radio'></span><span class='radio-text' style='width:auto'>Import all fields except for ones selected:</span></div></label>" +
					"<label class='qui-radiobutton' style='display:inline-block;margin-left:10px'><input type='radio' name='mlc-column-filter-type' value='include' " + (columnMode == 'include' ? "checked='checked'" : "") + " /><div class='radio-wrap'><span class='radio'></span><span class='radio-text' style='width:auto'>Only import selected fields:</span></div></label>" +
				"</div>" +
				BuildFieldCheckboxList(columnMode == 'include' ? appOptions.ColumnWhiteList : appOptions.ColumnBlackList) +
			"</fieldset>" +
			"<div class='mlc-buttons'>" +
				"<button type='button' class='mlc-update-button qui-button noIcon' style='width:100%'>Update Configuration</button>" +
			"</div>" +
		"</div>"
		);

		if (appOptions.ErrorCount >= 3) {
			$('.mlc-enabled-text', $element).html('<b style="color:red">Error Count Exceeded</b>');
		}
		else {
			$('.mlc-enabled-text', $element).text(appOptions.ScanEnabled ? "Yes" : "No");
		}

		if (appOptions.ScanEnabled) {
			$('.mlc-toggle-enabled', $element)
				.text('Disable')
				.click(function (e) {
					e.preventDefault();
					
					DisableUpload($element, function () {
						LoadAppOptions($element);
					});
				});
		}
		else {
			$('.mlc-toggle-enabled', $element)
				.text('Enable')
				.click(function (e) {
					e.preventDefault();

					EnableUpload($element, function () {
						LoadAppOptions($element);
					});
				});
		}

		if (!appOptions.LastUpload) {
			$('.mlc-utime', $element).text("N/A");
			$('.mlc-reupload-span', $element).hide();
		}
		else {
			$('.mlc-utime', $element).text(moment(appOptions.LastUpload).format("M/D/YYYY h:mm:ss a"));
			$('.mlc-reupload', $element).click(function (e) {
				e.preventDefault();

				ForceUpload($element, function () {
					LoadAppOptions($element);
				});
			});
		}

		$('.mlc-mlurl', $element)
			.val(appOptions.MapLargeUrl)
			.attr('placeholder', defaultOptions.MapLargeUrl);
		$('.mlc-mlacc', $element)
			.val(appOptions.MapLargeAccount)
			.attr('placeholder', defaultOptions.MapLargeAccount);
		$('.mlc-uuser', $element)
			.val(appOptions.MapLargeUploadUser)
			.attr('placeholder', defaultOptions.MapLargeUploadUser);
		$('.mlc-vuser', $element)
			.val(appOptions.MapLargeViewUser)
			.attr('placeholder', defaultOptions.MapLargeViewUser);

		$('.mlc-upass', $element)
			.val(appOptions.MapLargeUploadPassword ? "********" : "")
			.attr('placeholder', defaultOptions.MapLargeUploadPassword ? "********" : "");
		$('.mlc-vpass', $element)
			.val(appOptions.MapLargeViewPassword ? "********" : "")
			.attr('placeholder', defaultOptions.MapLargeViewPassword ? "********" : "");

		$('.mlc-tw', $element)
			.val(BuildListDisplay(appOptions.TableWhiteList))
			.attr('placeholder', BuildListDisplay(defaultOptions.TableWhiteList) || '*');
		$('.mlc-tb', $element)
			.val(BuildListDisplay(appOptions.TableBlackList))
			.attr('placeholder', BuildListDisplay(defaultOptions.TableBlackList) || 'None');
		$('.mlc-cw', $element)
			.val(BuildListDisplay(appOptions.ColumnWhiteList))
			.attr('placeholder', BuildListDisplay(defaultOptions.ColumnWhiteList) || '*');
		$('.mlc-cb', $element)
			.val(BuildListDisplay(appOptions.ColumnBlackList))
			.attr('placeholder', BuildListDisplay(defaultOptions.ColumnBlackList) || 'None');

		$('.mlc-table-filter input', $element).on('change', function () { AdjustColumnVisibility($element); });
		AdjustColumnVisibility($element);

		$('.mlc-update-button', $element).click(function () {
			var upass = $('.mlc-upass', $element).val().trim();
			var vpass = $('.mlc-vpass', $element).val().trim();

			var tableFilter = GetSelectedTableFilter($element);

			var twl = [];
			var tbl = [];

			if (tableFilter.type == 'exclude')
				tbl = tableFilter.tables;
			else
				twl = tableFilter.tables;

			var columnFilter = GetSelectedColumnFilter($element);

			var cwl = [];
			var cbl = [];

			if (columnFilter.type == 'exclude')
				cbl = columnFilter.tables;
			else
				cwl = columnFilter.tables;

			var config = {
				MapLargeUrl: $('.mlc-mlurl', $element).val().trim(),
				MapLargeAccount: $('.mlc-mlacc', $element).val().trim(),
				MapLargeUploadUser: $('.mlc-uuser', $element).val().trim(),
				MapLargeUploadPassword: /^\**$/.test(upass) ? appOptions.MapLargeUploadPassword : upass,
				MapLargeViewUser: $('.mlc-vuser', $element).val().trim(),
				MapLargeViewPassword: /^\**$/.test(vpass) ? appOptions.MapLargeViewPassword : vpass,
				TableWhiteList: twl,//ParseListDisplay($('.mlc-tw', $element).val().trim()),
				TableBlackList: tbl,//ParseListDisplay($('.mlc-tb', $element).val().trim()),
				ColumnWhiteList: cwl,//ParseListDisplay($('.mlc-cw', $element).val().trim()),
				ColumnBlackList: cbl,//ParseListDisplay($('.mlc-cb', $element).val().trim())
			};

			if (config.MapLargeUrl == "") delete config.MapLargeUrl;
			if (config.MapLargeAccount == "") delete config.MapLargeAccount;
			if (config.MapLargeUploadUser == "") delete config.MapLargeUploadUser;
			if (config.MapLargeUploadPassword == "") delete config.MapLargeUploadPassword;
			if (config.MapLargeViewUser == "") delete config.MapLargeViewUser;
			if (config.MapLargeViewPassword == "") delete config.MapLargeViewPassword;
			if (config.TableWhiteList == "") delete config.TableWhiteList;
			if (config.TableBlackList == "") delete config.TableBlackList;
			if (config.ColumnWhiteList == "") delete config.ColumnWhiteList;
			if (config.ColumnBlackList == "") delete config.ColumnBlackList;

			SaveUpdatedConfig($element, config, function () {
				LoadAppOptions($element);
			});
		});
	}

	function BuildListDisplay(list) {
		if (!list)
			return "";

		return list.join();
	}

	function ParseListDisplay(str) {
		var values = str.split(',');

		var result = [];

		for (var i = 0; i < values.length; i++) {
			var v = values[i].trim();

			if (v != "")
				result.push(v.toLowerCase());
		}

		return result;
	}

	function GetSelectedTableFilter($element) {
		var type = $('input[name=mlc-table-filter-type]:checked', $element).val();
		var checked = $('.mlc-table-checkbox:checked', $element).map(function () {
			return this.value;
		}).get();

		return {
			type: type,
			tables: checked
		};
	}

	function GetSelectedColumnFilter($element) {
		var type = $('input[name=mlc-column-filter-type]:checked', $element).val();
		var checked = $('.mlc-column-checkbox:checked', $element).map(function () {
			return this.value;
		}).get();

		return {
			type: type,
			tables: checked
		};
	}

	function ParseFieldList() {
		var tables = {};

		for (var i = 0; i < fields.length; i++) {
			var name = fields[i].qName;

			for (var j = 0; j < fields[i].qSrcTables.length; j++) {
				var table = fields[i].qSrcTables[j];

				if (!tables[table])
					tables[table] = [];

				tables[table].push(name);
			}
		}

		return tables;
	}

	function GetTableList() {
		var tableList = ParseFieldList();

		var tables = [];

		for (var t in tableList)
			tables.push(t);

		return tables;
	}

	function BuildTableCheckboxList(selected) {
		if (!selected)
			selected = [];

		var items = [];

		var tables = GetTableList();

		tables.sort(sortFunc);

		for (var i = 0; i < tables.length; i++) {
			var checked = selected.indexOf(tables[i]) > -1 ? "checked='checked'" : '';

			items.push("<label class='qui-checkboxicon' style='display:inline-block;margin: 3px 10px 0 3px'><input type='checkbox' class='mlc-table-checkbox' value='" + tables[i] + "' " + checked + " /><div class='check-wrap'><span class='check'></span><span class='check-text' style='max-width:150px;width:150px;'>" + tables[i] + "</span></div></label>");
		}

		return items.join('');
	}

	function BuildFieldCheckboxList(selected) {
		if (!selected)
			selected = [];

		var items = [];
		var fields = {};
		var fieldList = [];

		var tables = ParseFieldList();

		for (var t in tables) {
			for (var j = 0; j < tables[t].length; j++)
				fields[tables[t][j]] = true;
		}

		for (var f in fields)
			fieldList.push(f);

		fieldList.sort(sortFunc);

		for (var i = 0; i < fieldList.length; i++) {
			var checked = selected.indexOf(fieldList[i]) > -1 ? "checked='checked'" : '';

			items.push("<label class='qui-checkboxicon' style='display:inline-block;margin: 3px 10px 0 3px'><input type='checkbox' class='mlc-column-checkbox' value='" + fieldList[i] + "' " + checked + " /><div class='check-wrap'><span class='check'></span><span class='check-text' style='max-width:150px;width:150px;'>" + fieldList[i] + "</span></div></label>");
		}

		return items.join('');
	}

	function AdjustColumnVisibility($element) {
		var selectedTables = GetSelectedTableFilter($element);
		var tables = ParseFieldList();

		var fields = {};

		for (var t in tables) {
			if (selectedTables.type == "exclude" && selectedTables.tables.indexOf(t) == -1 ||
				selectedTables.type == "include" && selectedTables.tables.indexOf(t) > -1) {
				for (var i = 0; i < tables[t].length; i++)
					fields[tables[t][i]] = true;
			}
		}

		$('.mlc-column-checkbox', $element).each(function () {
			if (fields[this.value])
				$(this).closest('label').show();
			else
				$(this).closest('label').hide();
		});
	}

	function sortFunc(a, b) {
		if (a.toLowerCase() < b.toLowerCase()) return -1;
		if (a.toLowerCase() > b.toLowerCase()) return 1;
		return 0;
	}
});