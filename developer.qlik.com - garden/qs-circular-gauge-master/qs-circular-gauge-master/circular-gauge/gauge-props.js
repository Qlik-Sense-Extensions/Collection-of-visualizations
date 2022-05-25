// JavaScript
define([], function () {

	var palette = [
		"#b0afae",
		"#7b7a78",
		"#545352",
		"#4477aa",
		"#7db8da",
		"#b6d7ea",
		"#46c646",
		"#f93f17",
		"#ffcf02",
		"#276e27",
		"#ffffff",
		"#000000"
	];

	var colorPicker  = {
		label:"Color Lookup 🎨",
		component: "button",
		action: function(data){
			//add your button action here
			$('#color-'+data.qInfo.qId+"-container").css("display","flex");
		}
	};

	var kpi1 = {
		ref: "props.kpi1",
		label: "Kpi",
		type: "number",
		expression: "optional"
	};

	var maxKpi1 = {
		ref: "props.maxKpi1",
		label: "Kpi max value",
		type: "number",
		expression: "optional",
		defaultValue: 1
	};


	var kpi = {
		label: "KPI",
		type: "items",
		items: {
			kpi1: kpi1,
			maxKpi1: maxKpi1
		}
	}

	var showCenterKpi = {
		type: "boolean",
		label: "Show Kpi",
		ref: "props.showCenterKpi",
		defaultValue: false
	};
	var kpi2 = {
		ref: "props.kpi2",
		label: "Center Kpi",
		type: "number",
		expression: "optional",
		show:function(data){
			return data.props.showCenterKpi == true;
		}
	};

	var kpi2Label = {
		ref: "props.kpi2Label",
		label: "Label",
		type: "string",
		expression: "optional",
		show:function(data){
			return data.props.showCenterKpi == true;
		}
	};

	var kpi2Icon = {
		ref: "props.kpi2Icon",
		label: "Icon",
		type: "string",
		expression: "optional",
		show:function(data){
			return data.props.showCenterKpi == true;
		}
	};
	var kpi2IconLookup =  {
		label:"Icon Lookup",
		component: "button",
		action: function(data){
			//add your button action here
			$('#fa-'+data.qInfo.qId+"-container").css("display","flex");
		}
	// 	options: [{
	// 		value: "l",
	// 		label: "Left",
	// 		tooltip: "Select for left aligned header and footer"
	// 	}, {
	// 		value: "c",
	// 		label: "Center",
	// 		tooltip: "Select for center aligned header and footer"
	// 	},
	// 	, {
	// 		value: "r",
	// 		label: "Right",
	// 		tooltip: "Select for right aligned header and footer"
	// 	}],
	// 	defaultValue: "l"
	// };
	};

	var kpi2Color = {
		ref: "props.kpi2Color",
		label: "Color 🎨",
		type: "string",
		expression: "optional",
		show:function(data){
			return data.props.showCenterKpi == true;
		}
	};
	var kpi2Size = {
		type: "number",
		component: "slider",
		label: "Font Size",
		ref: "props.kpi2FontSize",
		min: 1,
		max: 5,
		step: 1,
		defaultValue: 3,
		show:function(data){
			return data.props.showCenterKpi == true;
		}
	};



	var subKpiLabel = {
		ref: "props.subKpiLabel",
		label: "Sub kpi label",
		type: "string",
		expression: "optional",
		show:function(data){
			return data.props.showCenterKpi == true;
		}
	};

	var subKpi = {
		ref: "props.subKpi",
		label: "Sub Kpi",
		type: "number",
		expression: "optional",
		show:function(data){
			return data.props.showCenterKpi == true;
		}
	};

	var subKpiColor = {
		ref: "props.subKpiColor",
		label: "Sub kpi Color 🎨",
		type: "string",
		expression: "always",
		show:function(data){
			return data.props.showCenterKpi == true;
		}
	};

	var centerKpi = {
		label: "Center Kpi",
		type: "items",
		items: {
			showCenterKpi: showCenterKpi,
			kpi2Label : kpi2Label,
			kpi2: kpi2,
			kpi2Icon:kpi2Icon,
			kpi2IconLookup:kpi2IconLookup,
			kpi2Size : kpi2Size,
			kpi2Color : kpi2Color,
			colorPicker:colorPicker
			// subKpiLabel: subKpiLabel,
			// subKpi: subKpi,
			// subKpiColor:subKpiColor
		}
	};

	var data = {
		label: "Data",
		type: "items",
		component: "expandable-items",
		items: {
			kpi: kpi,
			centerKpi: centerKpi
		}

	};
	var background = {
		label: "Chart background 🎨",
		//component: "color-picker",
		ref: "props.background",
		type: "string",
		expression: "optional",
		defaultValue: '#fff'
	};

	var chartBackground = {
		label: "Chart background",
		type: "items",
		items: {
			background: background,
			colorPicker: colorPicker
		}

	};

	var dialAngle = {
		type: "number",
		component: "slider",
		label: "Dial Size",
		ref: "props.dialSize",
		min: 0,
		max: 135,
		step: 5,
		defaultValue: 90
	};
	var dialWidth = {
		ref: "props.dialwidth",
		label: "Dial width",
		type: "number",
		expression: "optional",
		defaultValue: 10
	};

	var showDialFullRing = {
		type: "boolean",
		label: "Show dial full ring",
		ref: "props.showDialFullRing",
		defaultValue: false
	};

	var dialRingFillColor = {
		ref: "props.dialRingFillColor",
		label: "Dial ring fill color 🎨",
		type: "string",
		expression: "optional",
		defaultValue: '#fff',
		show : function(data) {
			//console.log('peps',data)
			return data.props.showDialFullRing == true
		}
	};

	var dialRingStrokeColor = {
		ref: "props.dialRingStrokeColor",
		label: "Dial ring stroke color 🎨",
		type: "string",
		expression: "optional",
		defaultValue: '#fff',
		show : function(data) {
			//console.log('peps',data)
			return data.props.showDialFullRing == true
		}
	};

	var numberOfTicks = {
		ref: "props.numberOfTicks",
		label: "Number of ticks",
		type: "number",
		expression: "optional",
		defaultValue: 5
	};
	var showTickSegments = {
		type: "boolean",
		label: "Show tick segments",
		ref: "props.showTickSegments",
		defaultValue: false
	};
	var showNumber = {
		type: "boolean",
		label: "Show number",
		ref: "props.showNumber",
		defaultValue: false
	};
	var tickTextColor = {
		label: "Tick text color 🎨",
		//component: "color-picker",
		ref: "props.tickTextColor",
		type: "string",
		expression: "optional",
		defaultValue: 'steelblue'
	};


	var dialArcColor = {
		label: "Dial arc color 🎨",
		//component: "color-picker",
		ref: "props.dialColor",
		type: "string",
		expression: "optional",
		defaultValue: 'steelblue'
	};

	var dialArcStroke = {
		label: "Dial arc stroke color 🎨",
		//component: "color-picker",
		ref: "props.dialStroke",
		type: "string",
		expression: "optional",
		defaultValue: 'steelblue'
	};

	var showNeedle = {
		type: "boolean",
		label: "Show needle",
		ref: "props.showNeedle",
		defaultValue: true
	};
	var needleColor = {
		label: "Needle color 🎨",
		//component: "color-picker",
		ref: "props.needleColor",
		type: "string",
		expression: "optional",
		defaultValue: 'steelblue'
	};



	var needleBorderColor = {
		label: "Needle border color 🎨",
		//component: "color-picker",
		ref: "props.needleBorderColor",
		type: "string",
		expression: "optional",
		defaultValue: 'steelblue'
	};

	var dial = {
		label: "Dial",
		type: "items",
		items: {
			dialAngle: dialAngle,
			dialWidth: dialWidth,
			dialArcColor: dialArcColor,
			dialArcStroke: dialArcStroke,
			showDialFullRing: showDialFullRing,
			dialRingFillColor: dialRingFillColor,
			dialRingStrokeColor:dialRingStrokeColor,
			numberOfTicks: numberOfTicks,
			showTickSegments: showTickSegments,
			showNumber: showNumber,
			tickTextColor: tickTextColor,
			colorPicker : colorPicker

		}
	};

	var needles = {
		label: "Needle",
		type: "items",
		items: {
			showNeedle: showNeedle,
			needleColor: needleColor,
			needleBorderColor: needleBorderColor,
			colorPicker:colorPicker
		}
	};



	var segments = {
		type: "array",
		ref: "props.segments",
		label: "Kpi segments",
		itemTitleRef: "start",
		allowAdd: true,
		allowRemove: true,
		addTranslation: "Add Segment",
		items: {
			start: {
				ref: "start",
				label: "Start % (0 - 100)",
				type: "number",
				expression: "optional",
				defaultValue: 80
			},
			end: {
				ref: "end",
				label: "End % (0 - 100)",
				type: "number",
				expression: "optional",
				defaultValue: 90
			},
			color: {
				ref: "color",
				label: "Color 🎨",
				type: "string",
				expression: "optional",
				defaultValue: 'green'
			},
			colorPicker:colorPicker
		}
	};

	var kpiSegments = {
		label: "Kpi segments",
		type: "items",
		items: {
			segments: segments
		}
	};
	var headerFooterAlignment =  {
		type: "string",
		component: "buttongroup",
		label: "Header and Footer alignment",
		ref: "props.headerFooterAlignment",
		options: [{
			value: "l",
			label: "Left",
			tooltip: "Select for left aligned header and footer"
		}, {
			value: "c",
			label: "Center",
			tooltip: "Select for center aligned header and footer"
		},
		, {
			value: "r",
			label: "Right",
			tooltip: "Select for right aligned header and footer"
		}],
		defaultValue: "l"
	};

	let headerColor = {
		ref: "props.headerColor",
		label: "Header color 🎨",
		type: "string",
		expression: "optional",
		defaultValue: '#666'
	};

	let headerBgColor = {
		ref: "props.headerBgColor",
		label: "Header Background color 🎨",
		type: "string",
		expression: "optional",
		defaultValue: '#fff'
	};

	let footerColor = {
		ref: "props.footerColor",
		label: "Footer color 🎨",
		type: "string",
		expression: "optional",
		defaultValue: '#666'
	};

	let footerBgColor = {
		ref: "props.footerBgColor",
		label: "Footer Background color 🎨",
		type: "string",
		expression: "optional",
		defaultValue: '#fff'
	};
	var headerFooter = {
		label: "Customize Header/Footer",
		type: "items",
		items: {
			headerFooterAlignment: headerFooterAlignment,
			headerColor : headerColor,
			headerBgColor : headerBgColor,
			footerColor : footerColor,
			footerBgColor : footerBgColor,
			colorPicker:colorPicker
		}
	};

	var design = {
		label: "Design",
		type: "items",
		uses: "settings",
		items: {
			
			chartBackground: chartBackground,
			dial: dial,
			kpiSegments: kpiSegments,
			needles: needles,
			headerFooter : headerFooter
		}
	};





	return {
		type: "items",
		component: "accordion",
		items: {
			data: data,
			design: design
			/*buttonProps : buttonProps*/
		}
	};

});

