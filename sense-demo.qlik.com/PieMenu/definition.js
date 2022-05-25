define([], function() {
	return  {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions",
                min: 0,
                max: 0
            },			
            settings: {
                uses: "settings"
            }
        }
    };
});