/**
 * E-mergo Table Inspector Property Panel definition
 *
 * @param  {Object} util          E-mergo utility functions
 * @param  {String} qext          Extension QEXT data
 * @return {Object}               Extension Property Panel definition
 */
define([
	"./util/util",
	"text!./qs-emergo-table-inspector.qext"
], function( util, qext ) {

	/**
	 * Holds the settings definition of the about sub-panel
	 *
	 * @type {Object}
	 */
	var about = {
		label: function() {
			return "About " + JSON.parse(qext).title;
		},
		type: "items",
		items: {
			author: {
				label: "This Qlik Sense extension is developed by E-mergo.",
				component: "text"
			},
			version: {
				label: function() {
					return "Version: " + JSON.parse(qext).version;
				},
				component: "text"
			},
			description: {
				label: "Please refer to the accompanying documentation page for a detailed description of this extension and its features.",
				component: "text"
			},
			help: {
				label: "Open documentation",
				component: "button",
				action: function() {
					util.requireMarkdownMimetype().finally( function() {
						window.open(window.requirejs.toUrl("extensions/qs-emergo-table-inspector/docs/docs.html"), "_blank");
					});
				}
			}
		}
	};

	return {
		type: "items",
		component: "accordion",
		items: {
			about: about
		}
	};
});
