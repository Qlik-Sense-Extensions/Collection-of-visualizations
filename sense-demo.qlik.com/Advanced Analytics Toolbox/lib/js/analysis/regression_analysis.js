"use strict";define(["../util/utils","ng!$q"],function(t,e){return{createCube:function(e,a){var s=a.layout,r=t.validateDimension(s.props.dimensions[0]),n=[{qNullSuppression:!0,qDef:{qFieldDefs:[r]}}],l=s.props.measures.length;a.rowsLabel=["(Intercept)",""!=s.props.measures[1].label?s.props.measures[1].label:t.validateMeasure(s.props.measures[0])];for(var d=t.validateMeasure(s.props.measures[0])+" as mea0, "+t.validateMeasure(s.props.measures[1])+" as mea1",i="q$mea0 ~ q$mea1",u="NN",o=2;o<l;o++){var p=t.validateMeasure(s.props.measures[o]);if(p.length>0){var m=","+p+" as mea"+o;d+=m,i+=" + q$mea"+o,u+="N",a.rowsLabel.push(t.validateMeasure(s.props.measures[o]))}}t.displayDebugModeMessage(s.props.debugMode);var h=t.getDebugSaveDatasetScript(s.props.debugMode,"debug_regression_analysis.rda"),c="R.ScriptEvalExStr('"+u+"','"+h+" library(jsonlite); lm_result <- lm("+i+');lm_summary <- summary(lm_result);\n      json <- toJSON(list(coef(lm_summary)[,"Estimate"], coef(lm_summary)[,"Std. Error"], coef(lm_summary)[,"t value"], coef(lm_summary)[,"Pr(>|t|)"],\n      as.double(summary(lm_result$residuals)), summary(lm_result)$sigma, summary(lm_result)$df, lm_summary$r.squared, lm_summary$adj.r.squared,\n      summary(lm_result)$fstatistic, extractAIC(lm_result)[2])); json;\','+d+")";t.displayRScriptsToConsole(s.props.debugMode,[c]);var q=[{qDef:{qDef:c}},{qDef:{qLabel:"-",qDef:""}},{qDef:{qLabel:"-",qDef:""}},{qDef:{qLabel:"-",qDef:""}},{qDef:{qLabel:"-",qDef:""}}];return a.backendApi.applyPatches([{qPath:"/qHyperCubeDef/qDimensions",qOp:"replace",qValue:JSON.stringify(n)},{qPath:"/qHyperCubeDef/qMeasures",qOp:"replace",qValue:JSON.stringify(q)}],!1),a.patchApplied=!0,null},drawChart:function(a){var s=e.defer(),r=a.layout,n=(t.validateDimension(r.props.dimensions[0]),[{qTop:0,qLeft:0,qWidth:2,qHeight:1}]);return a.backendApi.getData(n).then(function(e){a.layout.qHyperCube.qMeasureInfo;if(0===e[0].qMatrix[0][1].qText.length||"-"==e[0].qMatrix[0][1].qText)t.displayConnectionError(a.extId);else{t.displayReturnedDatasetToConsole(r.props.debugMode,e[0]);for(var n=JSON.parse(e[0].qMatrix[0][1].qText),l=n[0],d=n[1],i=n[2],u=n[3],o=Math.max.apply(null,u),p=n[4],m=n[5],h=n[6],c=n[7],q=n[8],f=n[9],b=n[10],y='\n            <h2>Residuals:</h2>\n            <table class="simple">\n              <thead>\n                <tr>\n                  <th>Min</th><th>1Q</th><th>Median</th><th>3Q</th><th>Max</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr>\n                  <td>'+p[0]+"</td><td>"+p[1]+"</td><td>"+p[2]+"</td><td>"+p[4]+"</td><td>"+p[5]+'</td>\n                </tr>\n             </tbody>\n            </table>\n\n            <h2>Coefficients:</h2>\n            <table class="simple">\n              <thead>\n                <tr>\n                  <th></th><th>Estimate</th><th>Std.Error</th><th>t value</th><th>Pr(>|t|)</th><th>Signif</th>\n                </tr>\n              </thead>\n              <tbody>\n          ',v=0;v<a.rowsLabel.length;v++)y+="<tr><td>"+a.rowsLabel[v]+"</td><td>"+l[v]+"</td><td>"+d[v]+"</td><td>"+i[v]+"</td><td>"+u[v]+"</td>\n                      <td>"+(u[v]<.001?'<span class="lui-icon  lui-icon--star"></span><span class="lui-icon  lui-icon--star"></span><span class="lui-icon  lui-icon--star"></span>':u[v]<.01?'<span class="lui-icon  lui-icon--star"></span><span class="lui-icon  lui-icon--star"></span>':u[v]<.05?'<span class="lui-icon  lui-icon--star"></span>':u[v]<.1?".":"")+"</td>\n                    </tr>";y+='\n              </tbody>\n            </table>\n            <div>Signif. codes: 0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1</div>\n\n            <h2>Others:</h2>\n            <table class="simple">\n              <thead>\n                <tr>\n                  <th>Item</th><th>Value</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr><td>Residual standard error</td><td>'+m[0]+" on "+h[1]+" degrees of freedom</td></tr>\n                <tr><td>Multiple R-squared</td><td>"+c[0]+"</td></tr>\n                <tr><td>Adjusted R-squared</td><td>"+q[0]+"</td></tr>\n                <tr><td>F-statistic</td><td> "+f[0]+" on "+f[1]+" and "+f[2]+" DF,  p-value: < "+o+"</td></tr>\n                <tr><td>AIC</td><td>"+b[0]+"</td></tr>\n             </tbody>\n            </table>\n          ",$(".advanced-analytics-toolsets-"+a.extId).html(y)}return s.resolve()}),s.promise}}});
//# sourceMappingURL=../../maps/analysis/regression_analysis.js.map