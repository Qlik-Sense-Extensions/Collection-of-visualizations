var imageSettings = {
			type: "items",
			label: "Image",
			items : {
				image: {
					type: "items",
					label: "Image",
					items : {
						marginLeft: {
							type: "number",
							expression: "optional",
							label: "Image margin Left",
							defaultValue: 20,
							ref: "settings.image.margin.left"
						},

						marginRight: {
							type: "number",
							expression: "optional",
							label: "Image margin Right",
							defaultValue: 20,
							ref: "settings.image.margin.right"
						},

						marginTop: {
							type: "number",
							expression: "optional",
							label: "Image margin Top",
							defaultValue: 20,
							ref: "settings.image.margin.top"
						},

						marginBottom: {
							type: "number",
							expression: "optional",
							label: "Image margin Bottom",
							defaultValue: 20,
							ref: "settings.image.margin.bottom"
						}
					}
				}	
			}				
		}