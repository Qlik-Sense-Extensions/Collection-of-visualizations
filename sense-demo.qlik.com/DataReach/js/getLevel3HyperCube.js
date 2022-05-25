var varLvl3Data = {
	"qInitialDataFetch": [
		{
			"qHeight": 1000,
			"qWidth": 8
		}
	],
	"qDimensions": [
		{
			"qDef": {
				"qFieldDefs": [
					"Lineage Document Id"
				],
			    "qFieldLabels": [
			      "Lineage Document Id"
			    ]
			},
			"qNullSuppression": true
		},
		{
			"qDef": {
				"qFieldDefs": [
					"Lineage Document Name"
				],
			    "qFieldLabels": [
			      "Title"
			    ],
			    "qSortCriterias": [
			      {
			        "qSortByAscii": 1
			      }
			    ]
			},
			"qNullSuppression": true
		},
		{
			"qDef": {
				"qFieldDefs": [
					"Document Owner by UserId"
				]
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"Stream Name"
				]
			}
		}
	],
	"qMeasures": [
		{
			"qDef": {
				"qDef": "if([Document Published Date]<>'1/1/1753', [Document Published Date],'Not Published')",
				"qLabel": "Published Date"
			},
			"qLibraryId": null,
			"qSortBy": {
				"qSortByNumeric": 1
			}
		},
		{
			"qDef": {
				"qDef": "num(sum([Document File Size])/1048576,'#,##0.00')&' Mb'",
				"qLabel": "Application Size"
			},
			"qLibraryId": null,
			"qSortBy": {
				"qSortByNumeric": 1
			}
		},
		{
			"qDef": {
				"qDef": "count(distinct [Application User])",
				"qLabel": "Users Accessed (Audit)"
			},
			"qLibraryId": null,
			"qSortBy": {
				"qSortByNumeric": 1
			}
		},
		{
			"qDef": {
				"qDef": "count(distinct [Application User with Access])",
				"qLabel": "Users Can Access"
			},
			"qLibraryId": null,
			"qSortBy": {
				"qSortByNumeric": 1
			}
		}
	],
	"qSuppressZero": false,
	"qSuppressMissing": false,
	"qMode": "S",
	"qInterColumnSortOrder": [],
	"qStateName": "$"
}