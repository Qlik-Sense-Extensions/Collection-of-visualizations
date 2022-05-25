/*global define*/
define( [
	'jquery',
	'underscore',
	'qlik',
	'./lib/external/sense-extension-utils/extUtils',
	'ng!$q',
	'ng!$http'
], function ( $, _, qlik, extUtils, $q, $http ) {

	var app = qlik.currApp();

	// ****************************************************************************************
	// Helper Promises
	// ****************************************************************************************
	var getBookmarkList = function () {
		var defer = $q.defer();

		app.getList( 'BookmarkList', function ( items ) {
			defer.resolve( items.qBookmarkList.qItems.map( function ( item ) {
					return {
						value: item.qInfo.qId,
						label: item.qData.title
					}
				} )
			);
		} );
		return defer.promise;
	};
	

	var getStoryList = function () {

		var defer = $q.defer();

		app.getList( 'story', function ( data ) {
			var stories = [];
			if ( data && data.qAppObjectList && data.qAppObjectList.qItems ) {
				data.qAppObjectList.qItems.forEach( function ( item ) {
					stories.push( {
						value: item.qInfo.qId,
						label: item.qMeta.title
					} );
				} )
			}
			return defer.resolve( _.sortBy( stories, function ( item ) {
				return item.label;
			} ) );

		} );

		return defer.promise;

	};
	

	// ****************************************************************************************
	// Layout
	// ****************************************************************************************
	
	var buttonLabel = {
		ref: "props.buttonLabel",
		label: "Label",
		type: "string",
		expression: "optional",
		show: function () {
			return true;
		},
		defaultValue: "Guided"
	};
	

	// ****************************************************************************************
	// Actions
	// ****************************************************************************************
	
	var delay = {
		ref: "props.delay",
		label: "Delay in miliseconds",
		type: "number",
		expression: "optional",
		show: function () {
			return true;
		},
		defaultValue: 500
	};
	
	var actionOptions = [
		{
			value: "none",
			label: "None"
		},
		{
			value: "applyBookmark",
			label: "Apply Bookmark"
		},
		{
			value: "clearAll",
			label: "Clear All Selections"
		},
		{
			value: "clearField",
			label: "Clear Selection in Field"
		},
		{
			value: "lockField",
			label: "Lock Field"
		},
		{
			value: "selectPossible",
			label: "Select Possible Values"
		},
		{
			value: "selectExcluded",
			label: "Select Excluded Values"
		},
		{
			value: "selectAlternative",
			label: "Select Alternative Values"
		},
		{
			value: "selectandLockField",
			label: "Select and Lock in Field"
		},
		{
			value: "selectField",
			label: "Select Value in Field"
		},
		{
			value: "selectValues",
			label: "Select Multiple Values in Field"
		},
		{
			value: "setVariable",
			label: "Set Variable Value"
		},
		{
			value: "lockAll",
			label: "Lock All Selections"
		},
		{
			value: "unlockAll",
			label: "Unlock All Selections"
		}
	];

	var actionBefore1 = {
		type: "string",
		component: "dropdown",
		label: "First Action",
		ref: "props.actionBefore1",
		defaultValue: "none",
		options: actionOptions
	};
	var actionBefore2 = {
		type: "string",
		component: "dropdown",
		label: "Second Action",
		ref: "props.actionBefore2",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.actionBefore1 !== 'none';
		},
		options: actionOptions
	};	
	var actionBefore3 = {
		type: "string",
		component: "dropdown",
		label: "Third Action",
		ref: "props.actionBefore3",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.actionBefore1 && data.props.actionBefore2 !== 'none';
		},
		options: actionOptions
	};
	var actionBefore4 = {
		type: "string",
		component: "dropdown",
		label: "Fourth Action",
		ref: "props.actionBefore4",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.actionBefore1 && data.props.actionBefore2 && data.props.actionBefore3 !== 'none';
		},
		options: actionOptions
	};
	var actionBefore5 = {
		type: "string",
		component: "dropdown",
		label: "Fifth Action",
		ref: "props.actionBefore5",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.actionBefore1 && data.props.actionBefore2 && data.props.actionBefore3 && data.props.actionBefore4 !== 'none';
		},
		options: actionOptions
	};
	var actionBefore6 = {
		type: "string",
		component: "dropdown",
		label: "Sixth Action",
		ref: "props.actionBefore6",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.actionBefore1 && data.props.actionBefore2 && data.props.actionBefore3 && data.props.actionBefore4 && data.props.actionBefore5 !== 'none';
		},
		options: actionOptions
	};
	var actionBefore7 = {
		type: "string",
		component: "dropdown",
		label: "Seventh Action",
		ref: "props.actionBefore7",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.actionBefore1 && data.props.actionBefore2 && data.props.actionBefore3 && data.props.actionBefore4 && data.props.actionBefore5 && data.props.actionBefore6 !== 'none';
		},
		options: actionOptions
	};
	var actionBefore8 = {
		type: "string",
		component: "dropdown",
		label: "Eighth Action",
		ref: "props.actionBefore8",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.actionBefore1 && data.props.actionBefore2 && data.props.actionBefore3 && data.props.actionBefore4 && data.props.actionBefore5 && data.props.actionBefore6 && data.props.actionBefore7 !== 'none';
		},
		options: actionOptions
	};
	var actionBefore9 = {
		type: "string",
		component: "dropdown",
		label: "Nineth Action",
		ref: "props.actionBefore9",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.actionBefore1 && data.props.actionBefore2 && data.props.actionBefore3 && data.props.actionBefore4 && data.props.actionBefore5 && data.props.actionBefore6 && data.props.actionBefore7 && data.props.actionBefore8 !== 'none';
		},
		options: actionOptions
	};
	var actionBefore10 = {
		type: "string",
		component: "dropdown",
		label: "Tenth Action",
		ref: "props.actionBefore10",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.actionBefore1 && data.props.actionBefore2 && data.props.actionBefore3 && data.props.actionBefore4 && data.props.actionBefore5 && data.props.actionBefore6 && data.props.actionBefore7 && data.props.actionBefore8 && data.props.actionBefore9 !== 'none';
		},
		options: actionOptions
	};

	var fieldEnabler = ['selectField', 'selectValues', 'clearField', 'selectandLockField', 'lockField', 'selectAlternative', 'selectExcluded','selectPossible'];
	var field1 = {
		type: "string",
		ref: "props.field1",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	var field2 = {
		type: "string",
		ref: "props.field2",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};
	var field3 = {
		type: "string",
		ref: "props.field3",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore3 ) > -1;
		}
	};
	var field4 = {
		type: "string",
		ref: "props.field4",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore4 ) > -1;
		}
	};
	var field5 = {
		type: "string",
		ref: "props.field5",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore5 ) > -1;
		}
	};
	var field6 = {
		type: "string",
		ref: "props.field6",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore6 ) > -1;
		}
	};
	var field7 = {
		type: "string",
		ref: "props.field7",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore7 ) > -1;
		}
	};
	var field8 = {
		type: "string",
		ref: "props.field8",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore8 ) > -1;
		}
	};
	var field9 = {
		type: "string",
		ref: "props.field9",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore9 ) > -1;
		}
	};
	var field10 = {
		type: "string",
		ref: "props.field10",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore10 ) > -1;
		}
	};

	var bookmarkEnabler = ['applyBookmark'];
	var bookmark1 = {
		type: "string",
		ref: "props.bookmark1",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	var bookmark2 = {
		type: "string",
		ref: "props.bookmark2",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};
	var bookmark3 = {
		type: "string",
		ref: "props.bookmark3",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore3 ) > -1;
		}
	};
	var bookmark4 = {
		type: "string",
		ref: "props.bookmark4",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore4 ) > -1;
		}
	};
	var bookmark5 = {
		type: "string",
		ref: "props.bookmark5",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore5 ) > -1;
		}
	};
	var bookmark6 = {
		type: "string",
		ref: "props.bookmark6",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore6 ) > -1;
		}
	};
	var bookmark7 = {
		type: "string",
		ref: "props.bookmark7",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore7 ) > -1;
		}
	};
	var bookmark8 = {
		type: "string",
		ref: "props.bookmark8",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore8 ) > -1;
		}
	};
	var bookmark9 = {
		type: "string",
		ref: "props.bookmark9",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore9 ) > -1;
		}
	};
	var bookmark10 = {
		type: "string",
		ref: "props.bookmark10",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore10 ) > -1;
		}
	};


	var variableEnabler = ['setVariable'];
	var variable1 = {
		type: "string",
		ref: "props.variable1",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore1 ) > -1
		}
	};
	var variable2 = {
		type: "string",
		ref: "props.variable2",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore2 ) > -1
		}
	};
	var variable3 = {
		type: "string",
		ref: "props.variable3",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore3 ) > -1
		}
	};
	var variable4 = {
		type: "string",
		ref: "props.variable4",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore4 ) > -1
		}
	};
	var variable5 = {
		type: "string",
		ref: "props.variable5",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore5 ) > -1
		}
	};
	var variable6 = {
		type: "string",
		ref: "props.variable6",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore6 ) > -1
		}
	};
	var variable7 = {
		type: "string",
		ref: "props.variable7",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore7 ) > -1
		}
	};
	var variable8 = {
		type: "string",
		ref: "props.variable8",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore8 ) > -1
		}
	};
	var variable9 = {
		type: "string",
		ref: "props.variable9",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore9 ) > -1
		}
	};
	var variable10 = {
		type: "string",
		ref: "props.variable10",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore10 ) > -1
		}
	};

	var valueEnabler = ['selectField', 'selectValues', 'setVariable', 'selectandLockField'];
	var value1 = {
		type: "string",
		ref: "props.value1",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	var value2 = {
		type: "string",
		ref: "props.value2",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};
	var value3 = {
		type: "string",
		ref: "props.value3",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore3 ) > -1;
		}
	};
	var value4 = {
		type: "string",
		ref: "props.value4",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore4 ) > -1;
		}
	};
	var value5 = {
		type: "string",
		ref: "props.value5",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore5 ) > -1;
		}
	};
	var value6 = {
		type: "string",
		ref: "props.value6",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore6 ) > -1;
		}
	};
	var value7 = {
		type: "string",
		ref: "props.value7",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore7 ) > -1;
		}
	};
	var value8 = {
		type: "string",
		ref: "props.value8",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore8 ) > -1;
		}
	};
	var value9 = {
		type: "string",
		ref: "props.value9",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore9 ) > -1;
		}
	};
	var value10 = {
		type: "string",
		ref: "props.value10",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore10 ) > -1;
		}
	};

	var valueDescEnabler = ['selectValues'];
	var value1Desc = {
		type: "text",
		component: "text",
		ref: "props.value1Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore1) > -1;
		}
	};
	var value2Desc = {
		type: "string",
		component: "text",
		ref: "props.value2Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore2) > -1;
		}
	};
	var value3Desc = {
		type: "string",
		component: "text",
		ref: "props.value3Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore3) > -1;
		}
	};
	var value4Desc = {
		type: "string",
		component: "text",
		ref: "props.value4Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore4) > -1;
		}
	};
	var value5Desc = {
		type: "string",
		component: "text",
		ref: "props.value5Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore5) > -1;
		}
	};
	var value6Desc = {
		type: "string",
		component: "text",
		ref: "props.value6Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore6) > -1;
		}
	};
	var value7Desc = {
		type: "string",
		component: "text",
		ref: "props.value7Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore7) > -1;
		}
	};
	var value8Desc = {
		type: "string",
		component: "text",
		ref: "props.value8Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore8) > -1;
		}
	};
	var value9Desc = {
		type: "string",
		component: "text",
		ref: "props.value9Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore9) > -1;
		}
	};
	var value10Desc = {
		type: "string",
		component: "text",
		ref: "props.value10Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore10) > -1;
		}
	};


	var bookmark1Enabler = ['applyBookmark'];
	var bookmark1 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark1",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark1Enabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	var bookmark2Enabler = ['applyBookmark'];
	var bookmark2 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark2",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark2Enabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};
	var bookmark3Enabler = ['applyBookmark'];
	var bookmark3 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark3",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark3Enabler.indexOf( data.props.actionBefore3 ) > -1;
		}
	};
	var bookmark4Enabler = ['applyBookmark'];
	var bookmark4 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark4",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark4Enabler.indexOf( data.props.actionBefore4 ) > -1;
		}
	};
	var bookmark5Enabler = ['applyBookmark'];
	var bookmark5 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark5",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark5Enabler.indexOf( data.props.actionBefore5 ) > -1;
		}
	};
	var bookmark6Enabler = ['applyBookmark'];
	var bookmark6 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark6",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark6Enabler.indexOf( data.props.actionBefore6 ) > -1;
		}
	};
	var bookmark7Enabler = ['applyBookmark'];
	var bookmark7 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark7",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark7Enabler.indexOf( data.props.actionBefore7 ) > -1;
		}
	};
	var bookmark8Enabler = ['applyBookmark'];
	var bookmark8 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark8",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark8Enabler.indexOf( data.props.actionBefore8 ) > -1;
		}
	};
	var bookmark9Enabler = ['applyBookmark'];
	var bookmark9 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark9",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark9Enabler.indexOf( data.props.actionBefore9 ) > -1;
		}
	};
	var bookmark10Enabler = ['applyBookmark'];
	var bookmark10 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark10",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark10Enabler.indexOf( data.props.actionBefore10 ) > -1;
		}
	};

	var softLockEnabler = ['selectAlternative', 'selectExcluded','selectPossible'];
	var softlock1 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock1",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	var softlock2 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock2",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};
	var softlock3 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock3",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore3 ) > -1;
		}
	};
	var softlock4 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock4",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore4 ) > -1;
		}
	};
	var softlock5 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock5",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore5 ) > -1;
		}
	};
	var softlock6 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock6",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore6 ) > -1;
		}
	};
	var softlock7 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock7",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore7 ) > -1;
		}
	};
	var softlock8 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock8",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore8 ) > -1;
		}
	};
	var softlock9 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock9",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore9 ) > -1;
		}
	};
	var softlock10 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock10",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore10 ) > -1;
		}
	};

	// ****************************************************************************************
	// Setup
	// ****************************************************************************************
	var settings = {
		uses: "settings",
		items: {
			general: {
				items: {
					showTitles: {
						defaultValue: false
					}
				}
			},
			layout: {
				type: "items",
				label: "Layout",
				items: {
					label: buttonLabel,										
				}
			},
			actionsBefore: {
				type: "items",
				label: "Actions",
				items: {
					delay: delay,
					actionBefore1: actionBefore1,
					field1: field1,
					variable1: variable1,
					value1: value1,
					value1Desc: value1Desc,
					bookmark1: bookmark1,
					softlock1: softlock1,
					actionBefore2: actionBefore2,
					field2: field2,
					variable2: variable2,
					value2: value2,
					value2Desc: value2Desc,
					bookmark2: bookmark2,
					softlock2: softlock2,
					actionBefore3: actionBefore3,
					field3: field3,
					variable3: variable3,
					value3: value3,
					value3Desc: value3Desc,
					bookmark3: bookmark3,
					softlock3: softlock3,
					actionBefore4: actionBefore4,
					field4: field4,
					variable4: variable4,
					value4: value4,
					value4Desc: value4Desc,
					bookmark4: bookmark4,
					softlock4: softlock4,
					actionBefore5: actionBefore5,
					field5: field5,
					variable5: variable5,
					value5: value5,
					value5Desc: value5Desc,
					bookmark5: bookmark5,
					softlock5: softlock5,
					actionBefore6: actionBefore6,
					field6: field6,
					variable6: variable6,
					value6: value6,
					value6Desc: value6Desc,
					bookmark6: bookmark6,
					softlock6: softlock6,
					actionBefore7: actionBefore7,
					field7: field7,
					variable7: variable7,
					value7: value7,
					value7Desc: value7Desc,
					bookmark7: bookmark7,
					softlock7: softlock7,
					actionBefore8: actionBefore8,
					field8: field8,
					variable8: variable8,
					value8: value8,
					value8Desc: value8Desc,
					bookmark8: bookmark8,
					softlock8: softlock8,
					actionBefore9: actionBefore9,
					field9: field9,
					variable9: variable9,
					value9: value9,
					value9Desc: value9Desc,
					bookmark9: bookmark9,
					softlock9: softlock9,
					actionBefore10: actionBefore10,
					field10: field10,
					variable10: variable10,
					value10: value10,
					value10Desc: value10Desc,
					bookmark10: bookmark10,
					softlock10: softlock10
				}
			}
		}
	};

	var panelDefinition = {
		type: "items",
		component: "accordion",
		items: {
			settings: settings
		}
	};

	// ****************************************************************************************
	// Return Values
	// ****************************************************************************************
	return panelDefinition;

} );
