define( ["jquery", "./bootstrap.min", "text!./bootstrap.min.css", "text!./style.css", "qlik"], function ( $, bootstrap, bootstrapcssContent, cssContent, qlik) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	//$( "<style>" ).html( bootstrapcssContent ).appendTo( "head" );
	return {
		initialProperties: {
			version: 1.0,
			qListObjectDef: {
				qShowAlternatives: true,
				qFrequencyMode : "V",
				qSortCriterias : {
					qSortByState : 1
				},
				qInitialDataFetch: [{
					qWidth: 1,
					qHeight: 10000
				}]
			},
			FixedNumberofColumn: 1,
			InitialNumCols: 1,
			InitialRows: "",
			InitialCols: "",
			Fontsize: "13",
			DimTextColor: "Black",
			LabelAlign: "left",
			CollapseColor: "#4479BA",
			AllowChanges: false,
			Defaulthighlightvalue: "",
			Defaulthighlight: false,
			StyleOverride: "radio",
			selectionMode : "CONFIRM",
			ListType : "vertical"
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimension : {
					type : "items",
					label : "Dimensions",
					ref : "qListObjectDef",
					min : 1,
					max : 1,
					items : {
						label : {
							type : "string",
							ref : "qListObjectDef.qDef.qFieldLabels.0",
							label : "Label",
							show : true
						},
						libraryId : {
							type : "string",
							component : "library-item",
							libraryItemType : "dimension",
							ref : "qListObjectDef.qLibraryId",
							label : "Dimension",
							show : function(data) {
								return data.qListObjectDef && data.qListObjectDef.qLibraryId;
							}
						},
						field : {
							type : "string",
							expression : "always",
							expressionType : "dimension",
							ref : "qListObjectDef.qDef.qFieldDefs.0",
							label : "Field",
							show : function(data) {
								return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
							}
						},
						qSortByState:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by State",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByState",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
							defaultValue : 0,
							
						},
						qSortByNumeric:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Numeric",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByNumeric",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
							defaultValue : 0,
							
						},
						
						qSortByLoadOrder:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Load Order",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByLoadOrder",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
							defaultValue : 0,
							
						},
						
						qSortByFrequency:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Frequence",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByFrequency",
							options : [{
								value : -1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : 1,
								label : "Descending"
							}],
							defaultValue : 0,
							
						},
						qSortByAscii:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Alphabetical",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByAscii",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
							defaultValue : 0,							
						}
					}
				},
				settings: {
					uses : "settings",
					items: {
						Listbox: {
							type: "items",
							label: "Listbox Settings",
							items: {
								StyleOverride:{
									ref: "StyleOverride",
									expression:"optional",
									translation: "Style Override",
									type: "string",
									defaultValue: "radio",
									component: "dropdown",
									options: [ {
											value: "radio",
											label: "radio"
										}, {
											value: "checkbox",
											label: "checkbox"
										}, {
											value: "listbox",
											label: "listbox"
										}, {
											value: "dropdown",
											label: "dropdown"
										}]
								},
								FixedNumberofColumn:{
									ref: "FixedNumberofColumn",
									expression:"optional",
									translation: "No of Visible Values (1 to 20)",
									type: "integer",
									defaultValue: 1,
									component: "slider",
									min: 1,
									max: 20,
									step: 1,
									show : function(data) {
										return data.ListType;
									}
								},
								
								ListType:{
									ref: "ListType",
									expression:"optional",
									translation: "List Type",
									type: "string",
									defaultValue: "vertical",
									component: "dropdown",
									options: [ {
											value: "horizontal",
											label: "horizontal"
										}, {
											value: "vertical",
											label: "vertical"
										}]
								},
								
								
								
															
								Fontsize:{
									ref: "Fontsize",
									translation: "Label Font Size (px)",
									type: "number",
									defaultValue: "13"
								},
								DimTextColor:{
									ref: "DimTextColor",
									translation: "Label Text Color",
									type: "string",
									defaultValue: "Black"
								},
								LabelAlign:{
									ref: "LabelAlign",
									expression:"optional",
									translation: "Label Align",
									type: "string",
									defaultValue: "left",
									component: "dropdown",
									options: [ {
											value: "left",
											label: "left"
										}, {
											value: "center",
											label: "center"
										}, {
											value: "right",
											label: "right"
										}]
								},
								Defaulthighlight : {
							ref : "Defaulthighlight",
							type : "boolean",
							label : "Always One Selected value",
							defaultValue : false
							},
								Defaulthighlightvalue:{
									ref: "Defaulthighlightvalue",
									translation: "Default Selected Value *",
									type: "string",
									defaultValue: " ",
									show : function(data) {
								return data.Defaulthighlight;
							}
								}
								
							
							
							
							
							}
						}
					}
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ( $element , layout) {
			var html = '', app = qlik.currApp();
			var Obj_Id = layout.qInfo.qId;
			//alert(id);
			var styletype =layout.StyleOverride;
			var Fontsize =layout.Fontsize;
			var LabelTextColor =layout.DimTextColor;
			var LabelAlign =layout.LabelAlign;
			var ListType = layout.ListType;
			var width = $element.width();
			var Defaulthighlightvalue = layout.Defaulthighlightvalue;
			// Chart object height
			var height = $element.height();
			var Dim =[];
			var SelectedCount =[];
			this.backendApi.eachDataRow(function(rownum, row) {
				Dim.push(row[0].qText);
			} );
			//alert(layout.qFallbackTitle);
			this.backendApi.eachDataRow(function(rownum, row) {
			 if(row[0].qState=='S')
			 SelectedCount.push(row[0].qText)
		 
		 
			 });
			
			
			if(layout.FixedNumberofColumn>Dim.length){
				var Noofval = Dim.length;
			}
			else
			{
				var Noofval = layout.FixedNumberofColumn;
				
				}
			
			var Split=100/Noofval;
			var listboxdimname =[];
			//
			$.each(this.backendApi.getDimensionInfos(), function(key, value) {
				listboxdimname.push(value.qFallbackTitle)
			});
			//alert();
			//console.log(layout);
			
			if(ListType=='horizontal')
			{
			var style ='style="width:'+(Split-1)+'% !important;float:left !important;font-size: '+Fontsize+'px;color:'+LabelTextColor+';text-align:'+LabelAlign+';padding:6px 0;max-height:20px;overflow:hidden;"';
			var overallwidth = '100';
			}
			
			else
			{
			var style ='style="width:99% !important;font-size: '+Fontsize+'px;color:'+LabelTextColor+';text-align:'+LabelAlign+';overflow:hidden;';
			if(styletype=='listbox')
			style +='border-bottom:#CCCCCC 1px solid;"';
			else
			style +='min-height:25px !important;"';
			
			var overallwidth = '100';
			}
			
			if(styletype=='dropdown')
			{				
				var style ='style="color: '+LabelTextColor+';font-size: '+(Fontsize)+'px;"';
			}
			//alert(style);
			var style1 = 'style="width:'+10+'% !important'+';"';
			var style2 = 'style="width:'+(70)+'% !important'+';font-size: '+Fontsize+'px;color:'+LabelTextColor+';text-align:'+LabelAlign+';height:20px;"';
			
			
			var self = this, html = '<div class="'+styletype+'" style="width:'+(overallwidth)+'% !important;overflow:auto !important;height:'+(height)+'px;">', style;

			//alert(selvalue);	
			if(styletype=='dropdown')	
			html += '<div class"bieralistboxdb"><select ' +style+ ' class="'+Obj_Id+'styled-select styled-select" id="'+Obj_Id+'dbList">';
		
			this.backendApi.eachDataRow(function(rownum, row) {
										 
											 
			if(Defaulthighlightvalue==row[0].qText && SelectedCount.length==0 && layout.Defaulthighlight==true)
			{
			var defaultstate = 'stateS';
			self.backendApi.selectValues(0, [row[0].qElemNumber], true);
			}
			else
			{
				if(styletype=='listbox' && SelectedCount.length==0 && layout.Defaulthighlight==true)
				var defaultstate = 'stateA';
				else
				var defaultstate = '';
			}
						
			 if(row[0].qState=='S')
			 {
			 var checkedstatus ='checked="checked"';
			 var selectedstatus ='selected="selected"';
			 }
			 else
			 {
			 var checkedstatus ='';
			 var selectedstatus ='';
			 }
		 
			
			if(styletype=='listbox')
			{
				html += '<p id="'+Obj_Id+'" for="'+row[0].qText+'"' + style + ' class="'+defaultstate+' data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText + '</p>';
				
			}
			else if(styletype=='dropdown')
			{
				html += '<option ' +style+ ' '+selectedstatus+' value="' + row[0].qElemNumber + '">' + row[0].qText + '</option>';
				
			}
			else
			{
				html +='<div ' + style + ' class="bieralistbox data state' + row[0].qState + '" >'
				html += '<input id="'+row[0].qText+'" '+checkedstatus+' type="'+styletype+'" name="'+layout.qInfo.qId+'" value="'+row[0].qText+'"' + style1 + ' class="'+defaultstate+' data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">';
				
				html += '<label id="'+Obj_Id+'" for="'+row[0].qText+'"' + style2 + ' class="'+defaultstate+' data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText + '</label>';
				
				html += '</div>';
			}
				
			

		
			});
			
			if(styletype=='dropdown')
			{				
			
			if(SelectedCount.length==0)
			html += '<option selected="selected" >'+listboxdimname+'</option>';	
				
			html += '</select></div>';
			}			
			html += "</div>";
			
			
			
			$element.html(html);
			var condition = 0;		
		
		
		    
		
			if(this.selectionsEnabled && layout.selectionMode !== "NO") {
				$element.find('label#'+Obj_Id).on('qv-activate', function() {
					if(this.hasAttribute("data-value")) {
						var value = parseInt(this.getAttribute("data-value"), 10), dim = 0;
						if(layout.Defaulthighlight==false) {					
							self.backendApi.selectValues(dim, [value], true);
						} else {							
							self.backendApi.selectValues(dim, [value], false);														
						}
					}
				});
				
				//$('.'+Obj_Id+'styled-select').click(function(){
                  $('#'+Obj_Id+'dbList').change(function(){
					var value = $(this).val();
                    if(value) {
						var value = parseInt(value, 10), dim = 0;												
						self.backendApi.selectValues(dim, [value], false);																				
					}                 
                  })
				//});
				
				$element.find('p#'+Obj_Id).on('qv-activate', function() {
					if(this.hasAttribute("data-value")) {
						var value = parseInt(this.getAttribute("data-value"), 10), dim = 0;
							if(layout.Defaulthighlight==false)
							self.backendApi.selectValues(dim, [value], true);
							else
							self.backendApi.selectValues(dim, [value], false);
							
					}
				});
			}
				
			
			
			
			
			}
	};
} );
