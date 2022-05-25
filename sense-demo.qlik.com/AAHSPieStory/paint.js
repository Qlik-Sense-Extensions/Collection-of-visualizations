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
		var md_cri = app.field("MD_CRIME%").getData();
		var md_hea = app.field("MD_HEALTH%").getData();
		
		function dataChange(){
			setTimeout(function() {
				var dets = getDeterminants(sdoh);
				
				var financeScore = getMeasureValue(layout.qHyperCube.qMeasureInfo, "fin");
				var foodScore = getMeasureValue(layout.qHyperCube.qMeasureInfo, "foo");
				var housingScore = getMeasureValue(layout.qHyperCube.qMeasureInfo, "hou");
				var crimeScore = getMeasureValue(layout.qHyperCube.qMeasureInfo, "cri");
				var healthScore = getMeasureValue(layout.qHyperCube.qMeasureInfo, "hea");
				
				var MD_POVERTY = md_pov.rows[0].qNum;
				var MD_STAMPS = md_stmp.rows[0].qNum;
				var MD_RENTINCOME = md_rtinc.rows[0].qNum;
				var MD_CRIME = md_cri.rows[0].qNum;
				var MD_HEALTH = md_hea.rows[0].qNum;
				
				var finDiff = financeScore-MD_POVERTY;
				var fooDiff = foodScore-MD_STAMPS;
				var houDiff = housingScore-MD_RENTINCOME;
				var criDiff = crimeScore-MD_CRIME;
				var heaDiff = healthScore-MD_HEALTH;
				
				var finPerc = finDiff/MD_POVERTY;
				var fooPerc = fooDiff/MD_STAMPS;
				var houPerc = houDiff/MD_RENTINCOME;
				var criPerc = criDiff/MD_CRIME;
				var heaPerc = heaDiff/MD_HEALTH;
				
				var scores = [];
				var totalPerc = 0;
				
				if(dets.includes("finance")){
					totalPerc += finPerc;
					scores.push({det: "finance", score: financeScore, percent: finPerc });
				}
				
				if(dets.includes("food")){
					totalPerc += fooPerc;
					scores.push({det: "food", score: foodScore, percent: fooPerc});
				}
				
				if(dets.includes("housing")){
					totalPerc += houPerc;
					scores.push({det: "housing", score: housingScore, percent: houPerc});
				}
				
				if(dets.includes("crime")){
					totalPerc += criPerc;
					scores.push({det: "crime", score: crimeScore, percent: criPerc});
				}
				
				if(dets.includes("healthcare")){
					totalPerc += heaPerc;
					scores.push({det: "healthcare", score: healthScore, percent: heaPerc});
				}
				
				totalPerc /= dets.length;
				
				var element = $("article.qv-object-AAHSPieStory div.qv-object-content div.ng-scope");
				element.empty();element.append(
				'<h1 class="slice-head"><img src="../Extensions/AAHSPieStory/pieslice.png" />Your Slice.</h1>'+
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

function getMeasureValue(measures, measure){
	return _.find(measures, function(cur){ return cur.qFallbackTitle == measure; }).qMax;
}

function getRiskAssessment(scores){
	var max = _.max(scores, function(score){ return score.percent; });
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
		measure = "The rate of food stamp usage ";
		neg = "higher";
		pos = "lower";
	break;
	case "healthcare":
		issue = "access to healthcare";
		measure = "The availability of health care ";
	break;
	case "crime":
		issue = "crime";
		measure = "The number of criminal cases ";
		neg = "higher";
		pos = "lower";
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