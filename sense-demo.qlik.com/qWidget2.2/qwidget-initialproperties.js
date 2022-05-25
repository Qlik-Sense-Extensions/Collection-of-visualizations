/*global define*/
define( [], function () {
	'use strict';

	// Return values
	// Note: 10.000 cells is the current limit, if we need more, we have to use getData() ...
	return {
		version: 1.0,
		qHyperCubeDef: {
			qDimensions: [],
			qMeasures: [],
			qInitialDataFetch: [
				{
					qWidth: 20,
					qHeight: 500
				}
			]
		},
		clientVersion: {
			qStringExpression: "=QlikViewVersion()"
		}
	};

} );

