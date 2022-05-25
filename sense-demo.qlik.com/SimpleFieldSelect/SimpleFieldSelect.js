define( ["qlik", "jquery", "text!./SimpleFieldStyle.css"], function ( qlik, $, cssContent ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	var debug = false;
	
	//If nothing selected but should be
	function checkDefaultValueSelection($element,countselected,layout,self){
	  if(debug) console.log('checkin default selection, selected: '+countselected);
	  if (countselected==0 && layout.qListObject.allwaysOneSelectedDefault != ''){
		var defaulttoselect = $element.find( '.defaultelement' );
		if (layout.qListObject.visualizationType=='dropdown'){
		  self.backendApi.selectValues( 0, [ parseInt(defaulttoselect.val(),10) ], false );
		} else {
		  self.backendApi.selectValues( 0, [ parseInt(defaulttoselect.attr( "data-value" ),10) ], false );
		}
	  }
	}
	
	return {
		initialProperties: {
			qListObjectDef: {
				//qShowAlternatives: true,
				//qFrequencyMode: "V",
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 1000
				}],
				allwaysOneSelectedDefault: "",
				selectOnlyOne: "",
				visualizationType: "checkbox",
				fontsizeChange: "",
				hideFromSelectionsBar: false,
				hideFromSelectionRealField: ""
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimension: {
					type: "items",
					label: "Dimensions",
					ref: "qListObjectDef",
					min: 1,
					max: 1,
					items: {
						label: {
							type: "string",
							ref: "qListObjectDef.qDef.qFieldLabels.0",
							label: "Label",
							show: false
						},
						
						field: {
							type: "string",
							expression: "always",
							expressionType: "dimension",
							ref: "qListObjectDef.qDef.qFieldDefs.0",
							label: "Field",
							show: function ( data ) {
								return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
							}
						}
					}
				},
				settings: {
					uses: "settings",
					items: {
                        
						Teksti: {
							type: "string",
							label: "Select this one as default",
							ref: "qListObjectDef.allwaysOneSelectedDefault"
						},
						SelectOnyOneOption: {
						  ref: "qListObjectDef.selectOnlyOne",
						  type: "boolean",
						  label: "Select only one?",
						  defaultValue: false
                        },
						HideFromSelectionsBar: {
						  ref: "qListObjectDef.hideFromSelectionsBar",
						  type: "boolean",
						  label: "Hide from selections bar",
						  defaultValue: false
						  
                        },
						HideFromSelectionsFieldOptional: {
						  ref: "qListObjectDef.hideFromSelectionRealField",
						  type: "string",
						  label: "(Opt) Name of the field without special marks",
						  defaultValue: ""
						  
                        },
						Visualization: {
							type: "string",
							component: "dropdown",
							label: "Visualization",
							ref: "qListObjectDef.visualizationType",
							options: [{
								value: "checkbox",
								label: "Checkbox"
							}, {
								value: "vlist",
								label: "Vertical QlikSense list"
							}, {
								value: "hlist",
								label: "Horizontal QlikSense list"
							}, {
								value: "dropdown",
								label: "Dropdown"
							}],
							defaultValue: "checkbox"
						},
						fontsize: {
							type: "string",
							component: "dropdown",
							label: "Font size",
							ref: "qListObjectDef.fontsizeChange",
							options: [{
								value: "75",
								label: "75%"
							}, {
								value: "100",
								label: "100%"
							}, {
								value: "125",
								label: "125%"
							}],
							defaultValue: "100"
						}
					}
				}
			}
		},
		support : {
			snapshot: false,
			export: false,
			exportData : false
		},
		paint: function ( $element,layout ) {
			if (debug) console.log('start painting');
			var self = this, html = "";
			if (layout.qListObject.hideFromSelectionsBar){
				var fieldToHide = layout.qListObject.hideFromSelectionRealField;
				if (fieldToHide == '' || !fieldToHide){
					fieldToHide = layout.qListObject.qDimensionInfo.qGroupFieldDefs[0]; //try this one if not defined.
					if (fieldToHide.slice(0,1)==='='){ //if first letter =
						fieldToHide = fieldToHide.slice(1);
					}
				}
				//qv-panel-current-selections
				//html += '<style>.qv-selections-pager li[data-csid="'+ layout.qListObject.qDimensionInfo.qGroupFallbackTitles[0] +'"] {display:none;} </style>';
				if ($(".hideselstyles").length>0){
					
				} else {
					$('.qv-selections-pager').append('<div style="display:none;" class=hideselstyles></div>');
				}
				if ($('#hid'+fieldToHide).length>0){} else {
					$('.hideselstyles').append('<style id="hid'+fieldToHide+'">.qv-selections-pager li[data-csid="'+ fieldToHide +'"] {display:none;}</style>');
				}
			}
			html += '<div class="checkboxgroup">';
			var app = qlik.currApp();
			var countselected = 0;
			var fontsizechanges = '';
			if (layout.qListObject.fontsizeChange && layout.qListObject.fontsizeChange != ''){
				fontsizechanges = ' style="font-size:'+layout.qListObject.fontsizeChange+'%;"';
			}
			if (layout.qListObject.visualizationType=='vlist'){
				html += '<ul'+fontsizechanges+'>';
			}else if (layout.qListObject.visualizationType=='hlist'){
				html += '<ul class="horizontal" '+fontsizechanges+'>';
			} else if (layout.qListObject.visualizationType=='checkbox'){
				html += '';
			} else if (layout.qListObject.visualizationType=='dropdown'){
				html += '<select class="dropdownsel" '+fontsizechanges+'>';
			} else {
				html += 'Select visualization type';
			}
			//print elements
			layout.qListObject.qDataPages[0].qMatrix.forEach( function ( row ) {
				//var elementid = layout.qInfo.qId+''+row[0].qElemNumber;
				var defaultelementclass = '',checkedstatus = '',dis = '', selectedClass = '', dropselection = '';
				if (row[0].qState === 'S') { 
					checkedstatus = ' checked'; 
					countselected += 1;
					selectedClass = ' selected';
					dropselection = ' selected';
				}
                
				//mark defaultvalue
				if (layout.qListObject.allwaysOneSelectedDefault != '' && row[0].qText == layout.qListObject.allwaysOneSelectedDefault) {
					defaultelementclass = " defaultelement";
				}
				//checkbox
				if (layout.qListObject.visualizationType=='checkbox'){
					html += '<label'+fontsizechanges+'><input type="checkbox" class="state' + row[0].qState +defaultelementclass+selectedClass+ '" data-value="' + row[0].qElemNumber + '"' + dis + checkedstatus + ' /> ' + row[0].qText; //
					html += '</label>';
				//lista
				} else if (layout.qListObject.visualizationType=='hlist' || layout.qListObject.visualizationType=='vlist'){
					
					html += '<li class="data '+selectedClass+defaultelementclass+' state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText;
					html += '</li>';
				//dropdown
				} else if (layout.qListObject.visualizationType=='dropdown'){
					html += '<option class="state' + row[0].qState +defaultelementclass+selectedClass+ '" value="' + row[0].qElemNumber + '"' + dis + dropselection + ' > ' + row[0].qText;
					html += '</option>';
				}
			});
			if (layout.qListObject.visualizationType=='hlist' || layout.qListObject.visualizationType=='vlist'){
				html += '</ul>';
			}else if (layout.qListObject.visualizationType=='dropdown'){
				html += '</select>';
			}
			html += '</div>';
			$element.html( html );
			
			//list action
			$element.find( 'li' ).on( 'qv-activate', function () {
				var klikkauskohde = $(this);
				var kohteenValueID = parseInt(klikkauskohde.attr( "data-value" ),10);
				if (debug) console.log('qv active on list change');
				//var value = parseInt( klikkauskohde.attr( "data-value" ), 10 );
				
				if (!$(this).hasClass('selected')){
					if (debug) console.log('is selected');
					if (layout.qListObject.selectOnlyOne){
					  if (debug) console.log('removing selections');
					  $element.find( '.selected' ).each(function(){
						var value = parseInt( $(this).attr( "data-value" ), 10 );
						if (value != kohteenValueID){
						  self.backendApi.selectValues( 0, [value], true );
						  $(this).removeClass('selected');
						}
					  });
					}
					self.backendApi.selectValues( 0, [ kohteenValueID ], true );
					this.classList.toggle("selected");
				//deselect
				} else {
					if (debug) console.log('is not selected');
					klikkauskohde.removeClass('selected');
					self.backendApi.selectValues( 0, [ kohteenValueID ], true );
					var selectedCount = 0;
					$element.find( '.selected' ).each(function(){
					  selectedCount += 1;
					});
					checkDefaultValueSelection($element,selectedCount,layout,self);
				}
			} );
			//select change
			$element.find( '.dropdownsel' ).on('change',function(){
				if (debug) console.log('select change action');
				var klikkauskohde = $(this).find(":selected");
				var kohteenValueID = parseInt(klikkauskohde.val(),10);
				$element.find( '.selected' ).each(function(){
						var value = parseInt( $(this).val(), 10 );
						if (value != kohteenValueID){
						  self.backendApi.selectValues( 0, [value], true );
						  $(this).removeClass('selected');
						}
				});
				klikkauskohde.addClass('selected').prop('selected',true);
				self.backendApi.selectValues( 0, [kohteenValueID], true );
			});
			//attach click event to checkbox
			if (layout.qListObject.visualizationType=='checkbox'){
			  $element.find( 'input' ).on( 'click', function () {
			  //self.backendApi.clearSelections();
				  if (debug) console.log('checkbox clicked action');
				  var klikkauskohde = $(this);
				  if ( $(this).attr( "data-value" ) ) {
					  var kohteenValueID = parseInt(klikkauskohde.attr( "data-value" ),10);
					  //when checking
					  if ($(this).is(':checked')){
						//if only one, clear others.
						if (layout.qListObject.selectOnlyOne){
							$element.find( 'input:checked' ).each(function(){
								var value = parseInt( $(this).attr( "data-value" ), 10 );
								if (value != kohteenValueID){
								  self.backendApi.selectValues( 0, [value], true );
								  $(this).prop('checked',false).removeClass('selected');
								}
							});
							//vai tarvitaanko?
							klikkauskohde.prop('checked',true).addClass('selected');
						}
						//console.log('select');
						var value = parseInt( klikkauskohde.attr( "data-value" ), 10 );
						self.backendApi.selectValues( 0, [value], true );
					  //remove check from box
					  } else {
						  //deselect
						  if (debug) console.log('deseelct');
						  //var value = parseInt( $(this).attr( "data-value" ), 10 );
						  klikkauskohde.prop('checked',false).removeClass('selected');
						  if (debug) console.log(klikkauskohde.attr("data-value"));
						  self.backendApi.selectValues( 0, [kohteenValueID], true );

						  var selectedCount = 0;
						  $element.find( 'input:checked' ).each(function(){
							  selectedCount += 1;
						  });
						  //default selection if needed
						  checkDefaultValueSelection($element,selectedCount,layout,self);
					  }
				  }
			  } );
			} //if
			//as default:
			checkDefaultValueSelection($element,countselected,layout,self);
				//defaulttoselect.prop('checked',true);
				//defaulttoselect.trigger('click');
				
				//self.backendApi.selectValues( 0, parseInt(defaulttoselect.attr( "data-value" )), true );
				//app.field(layout.qListObject.qDimensionInfo.qGroupFieldDefs[0]).clear();
				//console.log('selecting default '+layout.qListObject.allwaysOneSelectedDefault+' from '+layout.qListObject.qDimensionInfo.qGroupFieldDefs[0]);
				//app.field(layout.qListObject.qDimensionInfo.qGroupFieldDefs[0]).selectMatch(layout.qListObject.allwaysOneSelectedDefault, false);
				//console.log('select done');
			
			return qlik.Promise.resolve();
		}
	};
} );
