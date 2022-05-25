/*globals define*/
var myJS = {
    ref: "props.myJS",
    label: "JS File",
    type: "string"
};

define( ["jquery","text!./style.css"], function ( $, cssContent ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );

	return {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 20,
					qHeight: 30
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1
				},
				measures: {
					uses: "measures",
					min: 0
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings",
					items: {
						myHeader:{
							type: "boolean",
							component: "switch",
							translation: "Show Header",
							ref: "props.myHeader",
							defaultValue: true,
							trueOption: {
							  value: true,
							  translation: "properties.on"
							},
							falseOption: {
							value: false,
							translation: "properties.off"
							},
							show: true
						 },
						myJS: myJS
					}
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ( $element, layout  ) {
			var myid,colnum;
			var html ="", self = this, lastrow = 0, morebutton = false,cval = '';
			var js = layout.props.myJS;
			html += "<table class=formattable id=ftable>";
			if(layout.props.myHeader == true) {
				html+= "<thead><tr>";
				//render titles
				var t = 0;
				this.backendApi.getDimensionInfos().forEach( function ( cell ) {
					html += '<th id=head'+t+'>' + cell.qFallbackTitle + '</th>';
					t++;
				} );
				this.backendApi.getMeasureInfos().forEach( function ( cell ) {
					html += '<th id=head'+t+'>' + cell.qFallbackTitle + '</th>';
					t++;
				} );
				html += "</tr>";
			}
			html += "</thead><tbody>";
			//render data
			this.backendApi.eachDataRow( function ( rownum, row ) {
				lastrow = rownum;
				html += "<tr"+" id=row"+rownum+">";
				colnum = 0;
				row.forEach( function ( cell, index  ) {
					if ( cell.qIsOtherCell ) {
						cell.qText = this.backendApi.getDimensionInfos()[index].othersLabel;
					}
//					myid = 'cell'+rownum+' ';
					myid = 'cell'+rownum+'_'+colnum+' ';
					html += '<td id='+myid;
					html += " class='"+myid+" col"+colnum;
					if ( !isNaN( cell.qNum ) ) {
						html += "  numeric";
					}
					if(cell.qText.trim() == '-') {
						cval = '&nbsp;';
					} else {
						cval = cell.qText;
					}
					html += "'>" + cval + '</td>';
					colnum++;
				} );
				html += '</tr>';
			} );
			html += "</tbody></table>";

			//add 'more...' button
			if ( this.backendApi.getRowCount() > lastrow + 1 ) {
				html += "<button id='more'>More...</button>";
				morebutton = true;
			}
			if(js != '') {
				html += "<script src='/Extensions/FormatTable/js/"+js+"'></script>";
			}
			$element.html( html );
			if ( morebutton ) {
				var requestPage = [{
					qTop: lastrow + 1,
					qLeft: 0,
					qWidth: 20, //should be # of columns
					qHeight: Math.min( 30, this.backendApi.getRowCount() - lastrow )
				}];
				$element.find( "#more" ).on( "qv-activate", function () {
					self.backendApi.getData( requestPage ).then( function ( dataPages ) {
						self.paint( $element );
					} );
				} );
			}
		}
	};
} );
