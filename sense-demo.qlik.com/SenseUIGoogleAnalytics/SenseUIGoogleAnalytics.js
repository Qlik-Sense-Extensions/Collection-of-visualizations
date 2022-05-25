/**
 * @name SenseUIGoogleAnalytics
 * @author yianni.ververis@qlik.com
 * @requires string: GA Code (UA-XXXXXXXX-XX)
 * @requires string: Sheet Title
 * @param {string} gaCode - The Google Analytics Tracking Code in the form of UA-XXXXXXXX-XX
 * @description
 * Insert the extension in the first public page. This will insert the GA Code in the header
 * No need to set the extension on any other sheet. The code will be tracking the entire app as long as it is open,
 */

define( [ 
	"qlik"
],
qlik => {
	// Define properties
	var me = {
		definition: {
			type: "items",
			component: "accordion",
			items: {
				settings : {
					uses : "settings",
					items: {
						Chart: {
							type: "items",
							label: "Settings",
							items: {
								gaCode: {
									type: "string",
									expression: "none",
									label: "Ga Code",
									defaultValue: "UA-XXXXXXXX-XX",
									ref: "vars.gacode"
								},
							}
						}
					}
				}
			}
		}
	};

	me.support = {
		snapshot: true,
		export: true,
		exportData : false
	};

	// Get Engine API app for Selections
	me.app = qlik.currApp(this);

	me.paint = ($element, layout) => {
		var vars = {
			v: '1.0',
			name: 'SenseUIGoogleAnalytics',
			gaCode: layout.vars.gacode,
			currentPage: ($('.sheet-title-text').text().length) ? $('.sheet-title-text').text() : 'No Sheet Title' 
		}
		var scriptElement = document.createElement('script'); 
		scriptElement.type = 'text/javascript'; 
		scriptElement.async = true;
		scriptElement.id = vars.name;
		// Google Analytics script
		scriptElement.innerHTML = `
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
			ga('create', '${vars.gaCode}', 'auto');
		`;
		// Get the first script position so we can inject our code above it
		var scriptPosition = document.getElementsByTagName('script')[0];
		// Inject the Google Analytics script only once
		if (!document.getElementById(scriptElement.id)) {
			scriptPosition.parentNode.insertBefore(scriptElement, scriptPosition);
		}
		// Add the page tracking for every sheet
		$element.html(`<script>ga('send', 'pageview', '${vars.currentPage}')</script>`)
		console.info('%c SenseUI-Google Analytics: ', 'color: red', 'v' + vars.v);
		//needed for export
		return qlik.Promise.resolve();
	};

	return me;
} );

