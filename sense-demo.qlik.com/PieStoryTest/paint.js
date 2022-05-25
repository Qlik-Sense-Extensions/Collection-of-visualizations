define(["jquery", "qlik"], function($, qlik) {
    return function($element, layout) {
		var app = qlik.currApp();
		var backend = this.backendApi;
		backend.getData([{
			qTop: 0,
			qLeft: 0,
			qWidth: 6,
			qHeight: 1
		}]);
		
		var millisecondsToWait = 1000;
		
		var sdoh = app.field('SDOH').getData();
		var counties = app.field("COUNTYNAME").getData();
		var md_pov = app.field("MD_POVERTY%").getData();
		var md_stmp = app.field("MD_STAMPS%").getData();
		var md_rtinc = app.field("MD_RENT/INCOME%").getData();
		
		function dataChange(){
			setTimeout(function() {
				var dets = getDeterminants(sdoh);
				
				var financeScore = layout.qHyperCube.qMeasureInfo[0].qMax;
				var foodScore = layout.qHyperCube.qMeasureInfo[1].qMax;
				var housingScore = layout.qHyperCube.qMeasureInfo[2].qMax;
				
				var MD_POVERTY = md_pov.rows[0].qNum;
				var MD_STAMPS = md_stmp.rows[0].qNum;
				var MD_RENTINCOME = md_rtinc.rows[0].qNum;
				
				var finDiff = financeScore-MD_POVERTY;
				var fooDiff = foodScore-MD_STAMPS;
				var houDiff = housingScore-MD_RENTINCOME;
				
				var finPerc = finDiff/MD_POVERTY;
				var fooPerc = fooDiff/MD_STAMPS;
				var houPerc = houDiff/MD_RENTINCOME;
				
				var scores = [];
				var totalPerc = 0;
				
				if(dets.includes("finance")){
					totalPerc += finPerc;
					scores.push({det: "finance", score: financeScore, percent: finPerc });
				}
				
				if(dets.includes("food")){
					totalPerc += finPerc;
					scores.push({det: "food", score: foodScore, percent: fooPerc});
				}
				
				if(dets.includes("housing")){
					totalPerc += finPerc;
					scores.push({det: "housing", score: housingScore, percent: houPerc});
				}
				
				totalPerc /= dets.length;
				/*console.log(dets);
				console.log(financeScore + " vs " + MD_POVERTY + " = " + finPerc);
				console.log(foodScore + " vs " + MD_STAMPS + " = " + fooPerc);
				console.log(housingScore + " vs " + MD_RENTINCOME + " = " + houPerc);
				console.log(totalPerc);*/
				
				var element = $("article.qv-object-PieStoryTest div.qv-object-content div.ng-scope");
				element.empty();element.append(
				'<h1 class="slice-head"><img src="../Extensions/PieStoryTest/pieslice.png" />Your Slice.</h1>'+
				getSlice(sdoh, counties, totalPerc * 100, scores));
			}, millisecondsToWait);
		}
		counties.OnData.bind(dataChange);
		sdoh.OnData.bind(dataChange);
    };
});

function getSlice(sdoh, counties, risk, scores){
	var dim = getDeterminants(sdoh)
	return "<p>You are currently considering <strong>"+(dim.length >= 5 ? 'all social determinants of health' : dim.toString().replace(/,/g, ", "))+"</strong> for " + getCounties(counties)
		+(Math.round(risk) != 0 ? (", which has a " + Math.round(Math.abs(risk)) + (risk > 0 ? "% higher " : "% lower ") +"risk than the entire state of Maryland"+
		".</p><br><p>"+getRiskAssessment(scores)+"</p>") : "");
	//
}

function getRiskAssessment(scores){
	var max = _.max(scores, function(score){ return score.score; });
	var assessment = "The greatest issue in this region is <strong>";
	var issue = "";
	var measure = "";
	var neg = "worse";
	var pos = "better";
	
	if(scores.length == 1)
		assessment = "";
		
	switch(max.det){
	case "housing":
		issue = "affordable housing";
		measure = "The income to rent/mortgage ratio ";
		
	break;
	case "finance":
		issue = "poverty";
		measure = "The income to poverty level ratio ";
	break;
	case "food":
		issue = "affordable food";
		measure = "The rate of food stamp usage";
		neg = "higher";
		pos = "lower";
	break;
	case "healthcare":
		issue = "access to healthcare";
		
	break;
	case "crime":
	break;
	}
	
	assessment = assessment.concat((scores.length == 1 ? "" : issue+"</strong>. "), measure, 
									"for this region is <strong>", Math.round(Math.abs(max.percent*100)),	
									"%</strong> ", (max.percent > 0 ? neg : pos), 
									" than the state of Maryland as a whole.");
	
	return assessment;
}

function getDeterminants(sdoh){	
	var dim = [];
	
	var dim = _.map(
		_.filter(sdoh.rows,
			function(cur){
				return cur.qState!=='X';
			}
		),
		function(cur){
			return cur.qText;
		}
	);
	
	
	
	return dim;
}

function getCounties(counties){	
	var dim = [];
	var BC = false;
	counties.rows.forEach(function(row){
		if(row.qState !== 'X' && row.qText !== 'Baltimore City')
			dim.push(row.qText);
		else if(row.qText === 'Baltimore City' && row.qState !== 'X')
			BC = true;
	});
	
	if(dim.length >= 23){
		return "all Maryland counties" + ((BC) ? ", as well as Baltimore City" : "");
	}
	
	if(dim.length >= 2 || !BC){
		return "a region including " + dim.toString().replace(/,/g, ", ") + ((!BC && dim.length == 1) ? " county" : " counties") + ((BC) ? ", as well as Baltimore City" : "");
	}
	
	return 'Baltimore City';
	
}