var varLvl2Data =	{
	"qInitialDataFetch": [
		{
			"qHeight": 1000,
			"qWidth": 6
		}
	],
	"qDimensions": [
		{
			"qDef": {
				"qFieldDefs": [
					"Field Id"
				],
			    "qFieldLabels": [
			      "Field Id"
			    ]
			},
			"qNullSuppression": true
		},
		{
			"qDef": {
				"qFieldDefs": [
					"Field Name"
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
					"Table Name"
				]
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"Sensitive Field (Lineage)"
				],
			    "qFieldLabels": [
			      "Type of Field Data"
			    ]
			}
		}
	],
	"qMeasures": [
		{
			"qDef": {
				"qDef": "Max([Field Total Distinct Values])",
				"qLabel": "Distinct Values"
			},
			"qLibraryId": null,
			"qSortBy": {
				"qSortByNumeric": 1
			}
		},
		{
			"qDef": {
				"qDef": "Sum([Field Number of Rows])",
				"qLabel": "Total Rows"
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