define([], function() {
	return  {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions",
                min: 0,
                max: 1
            },
			measures: {
				uses: "measures",
				min: 0,
				max: 10
			},
            settings: {
                uses: "settings",
				
			}
        }
    };
});