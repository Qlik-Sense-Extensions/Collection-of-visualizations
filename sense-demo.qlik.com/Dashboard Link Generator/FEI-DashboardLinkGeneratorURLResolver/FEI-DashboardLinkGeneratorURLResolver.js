/*This Qlik Sense Mashup is a helper to the DashboardLinkGenerator extension used for decoding 
certain problematic charactersin the resultant link URL produced by the extension*/

//For IE that doesn't recognize the "includes" function
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    } 
    return query_string;
}();

//If the URL parameter coming in has selections whose certain characters we need to decode
if(QueryString.URL.includes("select/")){
    console.log('Before any selective decoding: ',QueryString.URL);
    //Splitting the main part of the URL and the selections part
    var mainURL = QueryString.URL.split("clearselections/");

    //Building a new final URL and initializing it with the main part of the URL we just split
    var finalURL = mainURL[0] + "clearselections";
    console.log("finalURL is now: ", finalURL);

    /*Splitting the selections part of the URL with slashes so we have the selections split in this order:
    "select/" then the fieldname then the selections themselves*/
    var splitBySlashes = mainURL[1].split("/");

    //Splitting the selected values themselves and fixing the problematic characters depending on what characters they have
    for(var i = 2; i<splitBySlashes.length; i+= 3){
        //Add the two parts we skipped (the "select" and the fieldname) to the final URL
        finalURL += "/" + splitBySlashes[i-2] + "/" + splitBySlashes[i-1] + "/"

        //Splitting the selected values by the semicolons that normally separate them
        var selectionsAlone = splitBySlashes[i].split("%3B");

        /*for every selected value, check if it has a %20 space. If it does, remove the encoded square brackets we 
        added to all selected values earlier. Otherwise if it doesn't, just decode the square brackets so 
        Sense can associate the selected value. Regardless, replace any slashes in the selected value.*/
        for(var j = 0; j<selectionsAlone.length; j++){
            //            if(selectionsAlone[j].includes("%20")){
            //                selectionsAlone[j] = selectionsAlone[j].replace(/%5D/g,"").replace(/%5B/g,"").replace(/%2F/g,"/");
            //            }
            //            else{
            selectionsAlone[j] = selectionsAlone[j].replace(/%5D/g,"]").replace(/%5B/g,"[").replace(/%2F/g,"/");
            //            }
            //Read the value to the final URL and add a semicolon before we load another selected value
            finalURL += selectionsAlone[j] + "%3B";
        }
        //Remove the last three characters (the last semicolon) after we're done loading all the selected values
        finalURL = finalURL.slice(0, -3);
    }
    //Redirect using the final URL
    console.log("finalURL is now: ", finalURL);
    window.location = finalURL;
}
else{window.location = QueryString.URL}