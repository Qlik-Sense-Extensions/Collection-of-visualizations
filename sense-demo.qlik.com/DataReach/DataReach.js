define( [	"qlik", 
			"jquery",
			"text!./template.html",
			"text!./css/myStyle.css",
			"./js/CustomDirective",
			"./js/DataLineage.controller",
			"./js/settings/GeneralSettings",						// Variable with the General settings
			"./js/settings/ImageSettings",
			"./js/getHyperCube",
			"./js/getLevel1HyperCube",
			"./js/getLevel2HyperCube",
			"./js/getLevel3HyperCube",
			"./js/getLevel4HyperCube"
						
		],
	function ( qlik, $, template, boot,cssContent ) {
		"use strict";

		$( '<style>' ).html( boot ).appendTo( 'head' ); // Adding scoped bootstrap to head			
		$( '<style>' ).html( cssContent ).appendTo( 'head' ); // Adding scopped style to head					


	$( '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.2/css/font-awesome.min.css">' ).appendTo( 'head' ); // Font Awesome CDN		
	$( '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>' ).appendTo( 'body' ); // Bootstrap.js CDN

		var AdditionalInfo=[];
		var flagPageRafrash=false;
		var call=0
		var me = {
			template: template,
			
			initialProperties: {
				version: 1.2,
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 9,
						qHeight: 1000
					}]
				}
			},
			definition : {
				type : "items",
				component : "accordion",
				items : {
					dimensions : {
						uses : "dimensions",
						min : 1,
						max : 4
					},
					measures : {
						uses : "measures",
						min : 0
					},
					sorting : {
						uses : "sorting"
					},

					settings : {},
					image : {},
					dataHandling: {  
		               uses: "dataHandling"  
		          	}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: false
			}
		};	

		// Get Engine API app for Selections
		me.app = qlik.currApp(this);

		me.definition.items.settings = generalSettings;
		me.definition.items.image = imageSettings;

		me.controller = mainController;

		me.init = function(){	
			flagPageRafrash = true;
			// console.log("Init, Page Refresh :"+flagPageRafrash);
		};

		me.paint = function($element,layout) {

			var _this=this;
			var addInfosArray = [];

			var Metadata = splitObject(layout.qHyperCube.qDataPages[0].qMatrix);

			me.app.createCube(varLvl1Data,funLvl1Data);

			function funLvl1Data(reply, app){
					makeAdditionalInfo(reply,function(replay){
						addInfosArray.push(replay);
						me.app.createCube(varLvl2Data,funLvl2Data);
					});	
			}	

			function funLvl2Data(reply, app){
					makeAdditionalInfo(reply,function(replay){
						addInfosArray.push(replay);
						me.app.createCube(varLvl3Data,funLvl3Data);
					});	
			}	

			function funLvl3Data(reply, app){
					makeAdditionalInfo(reply,function(replay){
						addInfosArray.push(replay);
						me.app.createCube(varLvl4Data,funLvl4Data);
					});
			}

			function funLvl4Data(reply, app){
					makeAdditionalInfo(reply,function(replay){
						addInfosArray.push(replay);
						_this.$scope.MoreInfo = addInfosArray;

						_this.$scope.realSize = getElementContentWidth(document.getElementById("Line"));
						_this.$scope.elePosition = makeElementPosition(_this.$scope.realSize, Metadata[0], layout.settings,layout.qHyperCube.qDimensionInfo, addInfosArray);
						_this.$scope.arrowPosition = makeArrowsPosition(Metadata[1],_this.$scope.elePosition);
						_this.$scope.QlikApp =  qlik.currApp();

					});
			}	

			if ( !this.$scope.table ) {
				this.$scope.table = qlik.table( this );
			}
			flagPageRafrash = false;
			return qlik.Promise.resolve();	
		};		
		return me;
	});