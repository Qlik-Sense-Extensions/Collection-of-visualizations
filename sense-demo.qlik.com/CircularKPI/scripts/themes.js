define([], function() {
    var themes = [
        {
            id: 1,
            name: "Default",
            palette: ["#64b5f6", "#1976d2", "#ef6c00", "#ffd54f", "#455a64", "#96a6a6", "#dd2c00", "#00838f", "#00bfa5", "#ffa000"]
        },
        {
            id: 2,
            name: "Qualitative #1",
            palette: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a']
        },
        {
            id: 3,
            name: "Qualitative #2",
            palette: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd']
        },
        {
            id: 4,
            name: "Qualitative #3",
            palette: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']
        },
        {
            id: 5,
            name: "Qualitative #4",
            palette: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']
        },
        {
            id: 6,
            name: "Qualitative #5",
            palette: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666']
        },
        {
            id: 7,
            name: "Diverging #1",
            palette: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
        },
        {
            id: 8,
            name: "Diverging #2",
            palette: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b']
        },
        {
            id: 8,
            name: "Diverging #3",
            palette: ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e']
        },
        {
            id: 9,
            name: "Diverging #4",
            palette: ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']
        },
        {
            id: 10,
            name: "Sequential #1",
            palette: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
        },
        {
            id: 11,
            name: "Sequential #2",
            palette: ['#f0f9e8', '#bae4bc', '#7bccc4', '#43a2ca', '#0868ac']
        },
        {
            id: 12,
            name: "Clean Palette",
            palette: ["#4D4D4D", "#5DA5DA", "#FAA43A", "#60BD68", "#F17CB0", "#B2912F", "#B276B2", "#DECF3F", "#F15854"]
        },
        {
            id: 13,
            name: "Web theme #1",
            palette: ["#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D"]
        },
        {
            id: 14,
            name: "Web theme #2",
            palette: ["#99B898", "#FECEAB", "#FF847C", "#E84A5F", "#2A363B"]
        },
        {
            id: 15,
            name: "Web theme #3",
            palette: ["#A8E6CE", "#DCEDC2", "#FFD3B5", "#FFAAA6", "#FF8C94"]
        },
        {
            id: 16,
            name: "Web theme #4",
            palette: ["#A8A7A7", "#CC527A", "#E8175D", "#474747", "#363636"]
        },
        {
            id: 17,
            name: "Web theme #5",
            palette: ["#A7226E", "#EC2049", "#F26B38", "#F7DB4F", "#2F9599"]
        },
        {
            id: 18,
            name: "Web theme #6",
            palette: ["#E1F5C4", "#EDE574", "#F9D423", "#FC913A", "#FF4E50"]
        },
        {
            id: 19,
            name: "Web theme #7",
            palette: ["#E5FCC2", "#9DE0AD", "#45ADA8", "#547980", "#594F4F"]
        },
        {
            id: 20,
            name: "Web theme #8",
            palette: ["#FE4365", "#FC9D9A", "#F9CDAD", "#C8C8A9", "#83AF9B"]
        },
        {
            id: 21,
            name: "Papua New Guinea",
            palette: ["#5E412F", "#FCEBB6", "#78C0A8", "#F07818", "#F0A830"]
        },
        {
            id: 22,
            name: "Google",
            palette: ["#008744", "#0057e7", "#d62d20", "#ffa700", "#ffffff"]
        },
        {
            id: 23,
            name: "LongTheme (12)",
            palette: ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']
        },
        {
            id: 24,
            name: "ExtraLongTheme (24)",
            palette: ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f','#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']
        }		
		

    ];

    var chart_theme = themes.map(function(d) {
        return {
            value: d.palette,
            label: d.name
        }
    });
    
    return chart_theme;

});
