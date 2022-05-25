define( ["jquery", "css!./dynamictable.css"], function ( $, cssContent ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	/**
	 * Set column to be first in sort order
	 * @param self The extension
	 * @param col Column number, starting with 0
	 */
	function setSortOrder ( self, col ) {
		//set this column first
		var sortorder = [col];
		//append the other columns in the same order
		self.backendApi.model.layout.qHyperCube.qEffectiveInterColumnSortOrder.forEach( function ( val ) {
			if ( val !== sortorder[0] ) {
				sortorder.push( val );
			}
		} );
		self.backendApi.applyPatches( [{
			'qPath': '/qHyperCubeDef/qInterColumnSortOrder',
			'qOp': 'replace',
			'qValue': '[' + sortorder.join( ',' ) + ']'
		}], true );
	}

	/**
	 * Reverse sort order for column
	 * @param self The extension
	 * @param col The column number, starting with 0
	 */
	function reverseOrder ( self, col ) {
		var hypercube = self.backendApi.model.layout.qHyperCube;
		var dimcnt = hypercube.qDimensionInfo.length;
		var reversesort = col < dimcnt ? hypercube.qDimensionInfo[col].qReverseSort :
			hypercube.qMeasureInfo[col - dimcnt].qReverseSort;
		self.backendApi.applyPatches( [{
			'qPath': '/qHyperCubeDef/' +
			( col < dimcnt ? 'qDimensions/' + col : 'qMeasures/' + ( col - dimcnt ) ) +
			'/qDef/qReverseSort',
			'qOp': 'replace',
			'qValue': ( !reversesort ).toString()
		}], true );
	}

	function formatHeader ( col, value, sortorder ) {
		var html =
			'<th data-col="' + col + '">' + value.qFallbackTitle ;
		//sort Ascending or Descending ?? add arrow
		if(value.qSortIndicator === 'A' || value.qSortIndicator === 'D') {
			html += (value.qSortIndicator === 'A' ? "<i class='icon-triangle-top" : "<i class='icon-triangle-bottom");
			if ( sortorder && sortorder[0] !== col ) {
				html += " secondary";
			}
			html += "'></i>";
		}
		html += "</th>";
		return html;
	}

	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 20,
					qHeight: 50
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
						initFetchRows: {
							ref: "qHyperCubeDef.qInitialDataFetch.0.qHeight",
							label: "Initial fetch rows",
							type: "number",
							defaultValue: 50
						},
					}
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ( $element ) {
			var html = "<table><thead><tr>", self = this, lastrow = 0, morebutton = false,
				dimcount = this.backendApi.getDimensionInfos().length, sortorder = this.backendApi.model.layout.qHyperCube.qEffectiveInterColumnSortOrder;
			//render titles
			this.backendApi.getDimensionInfos().forEach( function ( value, col ) {
				html += formatHeader( col, value, sortorder );
			} );
			this.backendApi.getMeasureInfos().forEach( function ( value, col ) {
				html += formatHeader( col + dimcount, value, sortorder );
			} );
			html += "</tr></thead><tbody>";
			//render data
			this.backendApi.eachDataRow( function ( rownum, row ) {
				lastrow = rownum;
				html += '<tr>';
				row.forEach( function ( cell, col ) {
					if ( cell.qIsOtherCell ) {
						cell.qText = self.backendApi.getDimensionInfos()[col].othersLabel;
					}
					html += "<td class='";
					if ( !isNaN( cell.qNum ) ) {
						html += "numeric ";
					}
					//negative elementnumbers are not selectable
					if ( col < dimcount && cell.qElemNumber > -1 ) {
						html += "selectable' data-value='" + cell.qElemNumber + "' data-dimension='" + col + "'";
					} else {
						html += "'";
					}
					html += '>' + cell.qText + '</td>';
				} );
				html += '</tr>';
			} );
			html += "</tbody></table>";
			//add 'more...' button
			if ( this.backendApi.getRowCount() > lastrow + 1 ) {
				html += "<button id='more'>More...</button>";
				morebutton = true;
			}
			$element.html( html );
			if ( morebutton ) {
				var requestPage = [{
					qTop: lastrow + 1,
					qLeft: 0,
					qWidth: 20, //should be # of columns
					qHeight: Math.min( 50, this.backendApi.getRowCount() - lastrow )
				}];
				$element.find( "#more" ).on( "qv-activate", function () {
					self.backendApi.getData( requestPage ).then( function ( dataPages ) {
						self.paint( $element );
					} );
				} );
			}
			$element.find( '.selectable' ).on( 'qv-activate', function () {
				if ( this.hasAttribute( "data-value" ) ) {
					var value = parseInt( this.getAttribute( "data-value" ), 10 ), dim = parseInt( this.getAttribute( "data-dimension" ), 10 );
					self.selectValues( dim, [value], true );
					$element.find( "[data-dimension='" + dim + "'][data-value='" + value + "']" ).toggleClass( "selected" );
				}
			} );
			$element.find( 'th' ).on( 'qv-activate', function () {
				if ( this.hasAttribute( "data-col" ) ) {
					var col = parseInt( this.getAttribute( "data-col" ), 10 );
					setSortOrder( self, col );
				}
			} );
			$element.find( 'th i' ).on( 'qv-activate', function () {
				var parent = this.parentNode;
				if ( parent.hasAttribute( "data-col" ) ) {
					var col = parseInt( parent.getAttribute( "data-col" ), 10 );
					reverseOrder( self, col );
				}
			} );
		}
	};
} );
