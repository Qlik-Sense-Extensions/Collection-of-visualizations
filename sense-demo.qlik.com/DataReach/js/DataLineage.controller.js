var mainController = ['$scope', function ( $scope ) {

	$scope.Table={};

	$scope.makeASelection = function(){
		var Field='Reach Level '+this.ele.Level;

			switch(this.ele.Level){
				case 0:
					Field="[libName]";					
					break;
				case 1:
					Field="[Field Id]";
					break;	
				case 2:
					Field="[Lineage Document Id]";
					break;
				case 3:
					Field="[Application User with Access]";
					break;					
			}		

		$scope.QlikApp.field(Field).selectValues([this.ele.Name], false);

	}

	$scope.writeTable = function(a){
		var table_title = $scope.MoreInfo[a.ele.Level][a.ele.Name].Title;
		$scope.Table.ObjName = table_title;

		var tableDetails = $scope.MoreInfo[a.ele.Level][a.ele.Name];
		delete tableDetails["Title"];
		$scope.MoreInfo[a.ele.Level][a.ele.Name] = tableDetails;
		
		$scope.AddInfo = $scope.MoreInfo[a.ele.Level][a.ele.Name];
		$scope.tmpTitle = table_title;

			$('#collapseExample').removeClass('noBorder');
			$('#collapseExample').addClass('withBorder');
			$('#collapseExample').show();

		$scope.arrowPosition = colorPath(a.ele.Name,$scope.arrowPosition,0);
	}

	$scope.cleanTable = function(a){
		$scope.MoreInfo[a.ele.Level][a.ele.Name].Title = $scope.tmpTitle;
		$scope.Table = {};
			$('#collapseExample').removeClass('withBorder');
			$('#collapseExample').addClass('noBorder');
			$('#collapseExample').hide();

		for(var arrow in $scope.arrowPosition){
			$scope.arrowPosition[arrow][6]='#afafaf';
		}
	}
}];


var colorPath  = function myself  (elemName,arrowPosition, step){

	if((step>6) || (step == undefined))
		return ;

	for(var arrow in arrowPosition){
		if((arrowPosition[arrow][4] == elemName) || (arrowPosition[arrow][5] == elemName)) {
			arrowPosition[arrow][6]='#6bb344';
			step = step + 1;
			myself(arrowPosition[arrow][4],arrowPosition,step);
		}
	}
	return (arrowPosition);
}


function makeAdditionalInfo(reply,callback) {
	var outFields = {};


	var numDimensioni = reply.qHyperCube.qDimensionInfo.length;
	var numMisure = reply.qHyperCube.qMeasureInfo.length;

	for(var fields in reply.qHyperCube.qDataPages[0].qMatrix){
		for(var field in reply.qHyperCube.qDataPages[0].qMatrix[fields]){	
			if(field == 0){
				var campo = reply.qHyperCube.qDataPages[0].qMatrix[fields][field].qText;
				var outField = {};
			}
			if(field<numDimensioni){
				var FieldName = reply.qHyperCube.qDimensionInfo[field].qFallbackTitle; 
				var FieldValue = reply.qHyperCube.qDataPages[0].qMatrix[fields][field].qText;
				if( FieldName == "Title"){ 
					var Title = FieldValue;
				}
			}
			else {
				var FieldName = reply.qHyperCube.qMeasureInfo[field-numDimensioni].qFallbackTitle; 
				var FieldValue = reply.qHyperCube.qDataPages[0].qMatrix[fields][field].qText;
			}

			outField[FieldName] = FieldValue;
			outField['Title'] = Title;
			
		}
		outFields[campo]=outField;
	}

	callback(outFields);
}

function getElementContentWidth(element) {
  var style = window.getComputedStyle(element);
  return {'width' : style.width, 'height':style.height};
}

function splitObject(matrix){
	var nexMatrix=[];
	var arrowsMatrix=[];
	for(var i=0; i<matrix[0].length; i++ )
		nexMatrix.push([]);

	for(ele in matrix){
		for (f in matrix[ele]){
			var found = jQuery.inArray(matrix[ele][f].qText, nexMatrix[f]);
			if (found == -1) {
				nexMatrix[f].push(matrix[ele][f].qText);
			}
			if(f>0){
				found = jQuery.inArray(matrix[ele][f-1].qText+"^"+matrix[ele][f].qText, arrowsMatrix);			
				if ((found == -1) && ((matrix[ele][f-1].qText != "-") || (matrix[ele][f].qText != "-")) ) {
					arrowsMatrix.push(matrix[ele][f-1].qText+"^"+matrix[ele][f].qText);
				}
			}
			
		}
	}
	return [
				nexMatrix,
				arrowsMatrix
			];

}

function calcoloNuovoPuntoFinale(x1, y1, x2, y2){
	var x = x2 - 20;

	var n1 = y2 -y1;
	var n2 = x2 - x1;
	var n3 = (y1*n2)*-1;
	var n4 = (x1*n1)*-1;
	var m = (y2-y1)/(x2-x1);

    if(x1 == x2)
    	y=y1-5;
    else    	
	    y = ((x * m) - (m*x1)) +y1;

	return([x,y]);
}


String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


function makeArrowsPosition(arrows, elements){
	var lookup = {};
	var links = [];

	for (var i = 0, len = elements.length; i < len; i++) {
	    lookup[elements[i].Name] = {'backPoint' : elements[i]['backPoint'], 'forwardPoint':elements[i]['forwardPoint'],'Node':elements[i].Name,'Level':elements[i].Level};
	}
	for(arrow in arrows){
		var Ele=arrows[arrow].split("^");
		var EleFrom=Ele[0];
		var EleTo=Ele[1];
		
		if((EleTo != '-') && (EleFrom != '-'))
		{
			var key =  EleFrom+"^"+EleTo;
			var hash = key.hashCode().toString(16);
			var coords=[];
		}
		else if(arrow == 3)
		{

				EleTo=arrows[4].split("^")[1];
		}
		if(((EleTo != '-') && (EleFrom != '-')) || (arrow == 3)) {
			nuoveCoord = calcoloNuovoPuntoFinale(lookup[EleFrom].forwardPoint.wPos, lookup[EleFrom].forwardPoint.hPos, lookup[EleTo].backPoint.wPos,  lookup[EleTo].backPoint.hPos);
			var x = nuoveCoord[0];
			var y = nuoveCoord[1];

			var link=[lookup[EleFrom].forwardPoint.wPos, lookup[EleFrom].forwardPoint.hPos, x,  y, lookup[EleFrom].Node, lookup[EleTo].Node,'#afafaf'];
			links.push(link);
		}
	}
	return(links);
}


function makeElementPosition(boxDimension, Elements, settings, qDimensionInfo, elementsInfos){
	var elements=[];
	var element={};
	var hDistance=[];

	var marginRight=settings.image.margin.right;
	var marginLeft=settings.image.margin.left;
	var marginTop=settings.image.margin.top;
	var marginBottom=settings.image.margin.bottom;

	var height = boxDimension.height.substring(0,boxDimension.height.indexOf("px"));
	var width = boxDimension.width.substring(0,boxDimension.width.indexOf("px"));

	var imgHeight = height - marginTop - marginBottom;
	var imgWidth = width - marginRight - marginLeft;

	wDistance = imgWidth / Elements.length;

	for(ele in Elements){
		hDistance[ele] = imgHeight / Elements[ele].length;
	}


	var countW=0;
	
	for(ele in Elements){
		var countH=0;

		for(var field in Elements[ele]) {

			backPoint=[];
			forwardPoint=[];
			var maxWidth=0;
			if(Elements[ele][field] == '-'){
				// console.log("Trovato Elemento nullo :");
			}
			else
			{
				element['Name'] = Elements[ele][field];

				switch(qDimensionInfo[ele].qFallbackTitle){
					case "Reach Level 1":
						element['icon'] = "/extensions/datareach/img/data-connection.png";
						element['Level'] = 0;
						element['TextColor'] = "#000000"; 

						for (var key in elementsInfos[ele]) { 
						    if (elementsInfos[ele].hasOwnProperty(key)) { 
						        if(elementsInfos[ele][key].Title == Elements[ele][field]){ 
									element['Title'] = elementsInfos[ele][key].Title; 
									element['TextWidth'] = element['Title'].length * 7.5;
									if(elementsInfos[ele][key]["Connection Type"]==="folder"){
										element['icon'] = "/extensions/datareach/img/folder.png";
									}if(elementsInfos[ele][key]["Connection Type"]==="ODBC" 
										|| elementsInfos[ele][key]["Connection Type"]==="OLEDB"
										|| elementsInfos[ele][key]["Connection Type"]==="QvOdbcConnectorPackage.exe"){
										element['icon'] = "/extensions/datareach/img/source.png";
									}if(elementsInfos[ele][key]["Connection Type"]==="QvDataMarketConnector.exe"
										|| elementsInfos[ele][key]["Connection Type"]==="IdevioGeoAnalyticsConnector.exe"
										|| elementsInfos[ele][key]["Connection Type"]==="QvRestConnector.exe"){
										element['icon'] = "/extensions/datareach/img/connector.png";
									}
								}
						    }
						}

						break;
					case "Reach Level 2":
						element['icon'] = "/extensions/datareach/img/field.png";
						element['Level'] = 1;
						element['TextColor'] = "#000000"; 

						for (var key in elementsInfos[ele]) { 
						    if (elementsInfos[ele].hasOwnProperty(key)) { 
						        if(elementsInfos[ele][key]["Field Id"] == Elements[ele][field]){ 
									element['Title'] = elementsInfos[ele][key].Title; 
									element['TextWidth'] = element['Title'].length * 7.5;
									if(elementsInfos[ele][key]["Type of Field Data"]==="Sensitive Field"){
										element['TextColor'] = "#FF6902";
										element['icon'] = "/extensions/datareach/img/sensitive-field.png";
									}
								}
						    }
						}

						break;	
					case "Reach Level 3":
						element['icon'] = "/extensions/datareach/img/qlik-sense-app.png";
						element['Level'] = 2;
						element['TextColor'] = "#000000"; 

						for (var key in elementsInfos[ele]) { 
						    if (elementsInfos[ele].hasOwnProperty(key)) { 
						        if(elementsInfos[ele][key]["Lineage Document Id"] == Elements[ele][field]){ 
									element['Title'] = elementsInfos[ele][key].Title; 
									element['TextWidth'] = element['Title'].length * 7.5;
								} 
						    } 
						} 

						break;
					case "Reach Level 4":
						element['icon'] = "/extensions/datareach/img/user.png";
						element['Level'] = 3;
						element['TextColor'] = "#000000"; 

						for (var key in elementsInfos[ele]) { 
						    if (elementsInfos[ele].hasOwnProperty(key)) { 
						        if(elementsInfos[ele][key].Title == Elements[ele][field]){ 
									element['Title'] = elementsInfos[ele][key].Title; 
									element['TextWidth'] = element['Title'].length * 7.5;
								} 
						    } 
						} 

						break;
				}			


				element['hPos'] = (countH * hDistance[ele])+marginTop;
				element['wPos'] = ((countW * wDistance) + marginLeft);

				element['hBox'] = element['hPos'];
				element['wBox'] = element['wPos'] + 35;
				

				// BackPoint attach
				backPoint['hPos'] = element['hPos']+15;
				backPoint['wPos'] = element['wPos'];
				element['backPoint']=backPoint;

				//forwardPoint
				forwardPoint['hPos'] = element['hPos']+15
				forwardPoint['wPos'] = element['wPos']+35;
				element['forwardPoint']=forwardPoint;

				elements.push(element);
				
				element={};
				countH +=1;
			}
		
		}
		countW +=1;
	}
	return elements;
}