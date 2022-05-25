/**
 * E-mergo Table Inspector Initial Properties
 *
 * @package E-mergo Tools Bundle
 *
 * @param  {String} qext          Extension QEXT data
 * @return {Object}               Initial properties
 */
define([
	"text!./qs-emergo-table-inspector.qext"
], function( qext ) {
	return {
		props: {
			tableName: false,
			tableStructure: [],
			exportDimensions: [],
			removedFields: []
		},
		qHyperCubeDef: {
			qDimensions: [],
			qColumnOrder: [],
			qInterColumnSortOrder: []
		},
		showTitles: false,
		title: JSON.parse(qext).title,
		subtitle: ""
	};
});
