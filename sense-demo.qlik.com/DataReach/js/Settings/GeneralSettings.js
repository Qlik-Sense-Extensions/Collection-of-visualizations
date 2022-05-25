var generalSettings = {
		uses : "settings",
		items : {
			initFetchRows : {
					ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
					label : "Initial fetch rows",
					type : "number",
					defaultValue : 50
			},
			general: {
					type: "items",
					label: "General",
					items : {
						Width: {
							type: "number",
							expression: "optional",
							label: "Image Width",
							defaultValue: 100,
							ref: "settings.image.width"
						},
						Height: {
							type: "number",
							expression: "optional",
							label: "Image Height",
							defaultValue: 100,
							ref: "settings.image.height"
						}
					
				}				
		}
	}
}