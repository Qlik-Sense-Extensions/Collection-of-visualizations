define(["qlik", 'ng!$q'], function ( qlik, $q) {
	//'use strict';

	var app = qlik.currApp(this);

	// ****************************************************************************************
	// Properties Definition
	// ****************************************************************************************
	var getMasterObjectList = function () {

		var defer = $q.defer();

		app.getAppObjectList( 'masterobject', function ( data ) {
			var masterobject = [];
			var sortedData = _.sortBy( data.qAppObjectList.qItems, function ( item ) {
				return item.qData.rank;
			} );
			_.each( sortedData, function ( item ) {
				masterobject.push( {
					value: item.qInfo.qId,
					label: item.qMeta.title
				} );
			} );
			return defer.resolve( masterobject );
		} );

		return defer.promise;
	};

  //Number of Tabs
  var num_of_tabs = {
		ref : "props.num_of_tabs",
		label	 : "Number of Tabs",
		type : "string",
		defaultValue : "2",
		component : "dropdown",
		options: [{
					value: "1",
					label: "1"
				}, {
					value: "2",
					label: "2"
				}, {
					value: "3",
					label: "3"
				}, {
					value: "4",
					label: "4"
				}, {
					value: "5",
					label: "5"
				}]
	};


  //Chart for Tab1
  var chart_for_tab1 = {
		ref : "props.chart_for_tab1",
		label	 : "Chart1",
		component : "dropdown",
		type : "string",
		//defaultValue : "V",
    options: function () {
			return getMasterObjectList().then( function ( items ) {
				return items;
			} );
		}
	};

  //Chart for Tab2
  var chart_for_tab2 = {
		ref : "props.chart_for_tab2",
		label	 : "Chart2",
		component : "dropdown",
		type : "string",
		show: function(data) { return data.props.num_of_tabs >= 2; },
    options: function () {
			return getMasterObjectList().then( function ( items ) {
				return items;
			} );
		}
	};

  //Chart for Tab3
	var chart_for_tab3 = {
		ref : "props.chart_for_tab3",
		label	 : "Chart3",
		component : "dropdown",
		type : "string",
		show: function(data) { return data.props.num_of_tabs >= 3; },
    options: function () {
			return getMasterObjectList().then( function ( items ) {
				return items;
			} );
		}
	};

  //Chart for Tab4
	var chart_for_tab4 = {
		ref : "props.chart_for_tab4",
		label	 : "Chart4",
		component : "dropdown",
		type : "string",
		show: function(data) { return data.props.num_of_tabs >= 4; },
    options: function () {
			return getMasterObjectList().then( function ( items ) {
				return items;
			} );
		}
	};

  //Chart for Tab5
	var chart_for_tab5 = {
		ref : "props.chart_for_tab5",
		label	 : "Chart5",
		component : "dropdown",
		type : "string",
		show: function(data) { return data.props.num_of_tabs >= 5; },
    options: function () {
			return getMasterObjectList().then( function ( items ) {
				return items;
			} );
		}
	};

	//Chart Label1
  var label_for_tab1 = {
		ref : "props.label_for_tab1",
		label	 : "Label1",
		type : "string",
		defaultValue : "Tab1"
	};

	//Chart Label2
  var label_for_tab2 = {
		ref : "props.label_for_tab2",
		label	 : "Label2",
		type : "string",
		show: function(data) { return data.props.num_of_tabs >= 2; },
		defaultValue : "Tab2"
	};

	//Chart Label3
  var label_for_tab3 = {
		ref : "props.label_for_tab3",
		label	 : "Label3",
		type : "string",
		show: function(data) { return data.props.num_of_tabs >= 3; },
		defaultValue : "Tab3"
	};

	//Chart Label4
  var label_for_tab4 = {
		ref : "props.label_for_tab4",
		label	 : "Label4",
		type : "string",
		show: function(data) { return data.props.num_of_tabs >= 4; },
		defaultValue : "Tab4"
	};

	//Chart Label5
	var label_for_tab5 = {
		ref : "props.label_for_tab5",
		label	 : "Label5",
		type : "string",
		show: function(data) { return data.props.num_of_tabs >= 5; },
		defaultValue : "Tab5"
	};

	//Export Checkbox1
	var export_for_tab1 = {
		ref : "props.export_for_tab1",
		label: "Enable export for chart1",
		type : "boolean",
		defaultValue : true
	};

	//Export Checkbox2
  var export_for_tab2 = {
		ref : "props.export_for_tab2",
		label: "Enable export for chart2",
		type : "boolean",
		show: function(data) { return data.props.num_of_tabs >= 2; },
		defaultValue : true
	};

	//Export Checkbox3
	var export_for_tab3 = {
		ref : "props.export_for_tab3",
		label	: "Enable export for chart3",
		type : "boolean",
		show: function(data) { return data.props.num_of_tabs >= 3; },
		defaultValue : true
	};

	//Export Checkbox4
	var export_for_tab4 = {
		ref : "props.export_for_tab4",
		label : "Enable export for chart4",
		type : "boolean",
		show: function(data) { return data.props.num_of_tabs >= 4; },
		defaultValue : true
	};

	//Export Checkbox5
  var export_for_tab5 = {
		ref : "props.export_for_tab5",
		label : "Enable export for chart5",
		type : "boolean",
		show: function(data) { return data.props.num_of_tabs >= 5; },
		defaultValue : true
	};

	// ****************************************************************************************
	// Property Panel Definition
	// ****************************************************************************************
	// Settings -Properties
	var myCustomSection = {
		component : "expandable-items",
		label : "Settings",
		items : {
			header1 : {
				type : "items",
				label : "Properies",
				items : {
					num_of_tabs : num_of_tabs,
					chart_for_tab1 : chart_for_tab1,
					label_for_tab1 : label_for_tab1,
					export_for_tab1 : export_for_tab1,
					chart_for_tab2 : chart_for_tab2,
					label_for_tab2 : label_for_tab2,
					export_for_tab2 : export_for_tab2,
					chart_for_tab3 : chart_for_tab3,
					label_for_tab3 : label_for_tab3,
					export_for_tab3 : export_for_tab3,
					chart_for_tab4 : chart_for_tab4,
					label_for_tab4 : label_for_tab4,
					export_for_tab4 : export_for_tab4,
					chart_for_tab5 : chart_for_tab5,
					label_for_tab5 : label_for_tab5,
					export_for_tab5 : export_for_tab5
				}
			}
		}
	};

	//Return values
	return {
		type : "items",
		component : "accordion",
		items : {
			customSection : myCustomSection
		}
	};
});
