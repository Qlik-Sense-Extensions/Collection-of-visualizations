define(['jquery', 'qlik', 'angular', 'ng!$q', 'css!./FEI-DashboardLinkGenerator.css'], function ($, qlik, angular, $q) {

    return {
        //define the properties panel looks like
        definition: {
            type: "items",
            component: "accordion",
            items: {
                exportSettings: {
                    type: "items",
                    label: "Export Settings",
                    items: {
                        outputMethod: {
                            ref: "outputMethod",
                            component: "radiobuttons",
                            type: "string",
                            label: "Output Method",
                            options: [
                                {value: "clipboard",
                                 label: "Copy To Clipboard Button"},
                                {value: "email",
                                 label: "Create New Email Button"},
                                {value: "textbox",
                                 label: "Copy From Textbox"}

                            ],
                            defaultValue: "clipboard",
                        },
                        maxSelected: {
                            ref: "maxSelected",
                            type: "integer",
                            label: "Max Values Selected in One Field",
                            defaultValue: "100",
                            min: 1
                        }
                    }
                },

                emailOptions: {
                    type: "items",
                    label: "E-mail Settings",
                    items: {
                        urlResolver: {
                            ref: "urlResolver",
                            type: "string",
                            label: "URL Resolver Mashup Link",
                            defaultValue: "extensions/FEI-DashboardLinkGenerator/FEI-DashboardLinkGeneratorURLResolver/FEI-DashboardLinkGeneratorURLResolver.html"
                        },
                        emailRecipients: {
                            ref: "emailRecipients",
                            type: "string",
                            label: "Recipients",
                            defaultValue: "",
                            show: false
                        },
                        emailTopic: {
                            ref: "emailTopic",
                            type: "string",
                            label: "E-mail Subject",
                            defaultValue: "Link to Qlik Sense application"
                        },

                        emailBody: {
                            ref: "emailBody",
                            type: "string",
                            label: "E-mail Body",
                            expression: "optional",
                            defaultValue: "Thought you might be interested in seeing this: ",
                            show: true
                        }
                    }
                }
            }
        },

        paint: function ($element, layout, jquery) {
            var self = this;

            //Defining the separators used in GetCurrentSelections function call
            var recordSeparator = '&@#$^()';
            var tagSeparator = '::::';
            var valueSeparator = ';;;;';

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

            //Obtaining the global object to use it for generating the first part of the App Integration API's URI (host/ip, app id, sheet id)
            var config = {
                host: window.location.hostname,
                prefix: window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1),
                port: window.location.port,
                isSecure: window.location.protocol === "https:"
            };
            var global = qlik.getGlobal(config);



            //Getting the current application
            var app = qlik.currApp(this);
            var applicationId = app.model.layout.qFileName;


            if (applicationId.substring(applicationId.length - 4) == '.qvf') {
                applicationId = applicationId.slice(0, -4);
            }
            var applicationIdFr = encodeURIComponent(applicationId);

            //Getting the current sheet
            var CurrentSheet = qlik.navigation.getCurrentSheetId();
            var SheetID = CurrentSheet.sheetId;



            /*Creating base part of URL including clearing any leftover 
            selections before opening the new page with our selections*/
            var baseURL = (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + "/sense/app/" + applicationIdFr + "/sheet/" + SheetID + "/state/analysis/options/clearselections";

            //If the user chose to output the link through an email, only create a button, otherwise create a textbox as well
            if(layout.outputMethod == "email"){
                var buttonHTMLCode = '<button name="'+"GenerateDashboardLink"+'" id="generateDashboardLink" class="dashboardLinkGenerator">'+"Email Link"+'</button>';
                $element.html(buttonHTMLCode);
            }
            else if(layout.outputMethod == "clipboard"){
                var buttonHTMLCode = '<button name="'+"GenerateDashboardLink"+'" id="generateDashboardLink" class="dashboardLinkGenerator">'+"Copy Dashboard Link"+'</button>';
                $element.html(buttonHTMLCode);
                //                var buttonHTMLCode = '<button name="GenerateDashboardLink" id="generateDashboardLink" class="dashboardLinkGenerator">Generate Link</button>';
                //                var textboxHTMLCode = '<textarea id="textbox" class="linkTextboxArea" type="text" readOnly="true" style="height: 90%;width: 90%;font-size: 10px;" value="0"/>';
                //
                //                //Creating the button, its name, its CSS class, and its original text
                //                $element.html('<table style="height:100%;text-align: center;"><tr><td style="width:20%;">'+buttonHTMLCode+'</td><td style="width:80%;">'+textboxHTMLCode+'</td></tr></table>');
            }
            else if(layout.outputMethod == "textbox"){
                var buttonHTMLCode = '<button name="GenerateDashboardLink" id="generateDashboardLink" class="dashboardLinkGenerator">Generate Link</button>';
                var textboxHTMLCode = '<textarea id="textbox" class="linkTextboxArea" type="text" readOnly="true" style="height: 90%;width: 90%;font-size: 10px;" value="0"/>';

                //Creating the button, its name, its CSS class, and its original text
                $element.html('<table style="height:100%;text-align: center;"><tr><td style="width:20%;">'+buttonHTMLCode+'</td><td style="width:80%;">'+textboxHTMLCode+'</td></tr></table>');
            }


            //If in edit mode, do nothing
            if(window.location.pathname.includes("/state/edit"))
                return;

            //Making sure the maximum selected values in a field is at least one
            var maxValuesSelectedInField = layout.maxSelected;
            maxValuesSelectedInField = maxValuesSelectedInField<1?1:maxValuesSelectedInField;

            //Create a hypercube with the GetCurrentSelections expression
            app.createCube({
                qMeasures : [
                    {
                        qDef : {
                            qDef : "=GetCurrentSelections('"+recordSeparator+"','"+tagSeparator+"','"+valueSeparator+"',"+maxValuesSelectedInField+")"
                        }
                    }
                ],
                qInitialDataFetch : [{
                    qTop : 0,
                    qLeft : 0,
                    qHeight : 1,
                    qWidth : 1
                }]
            }, function(reply) {
                console.log('App Integration API\'s reply is: ', reply);
                //If the app's reply is not empty
                if(reply.qHyperCube.qDataPages[0].qMatrix[0][0].qText && reply.qHyperCube.qDataPages[0].qMatrix[0][0].qText != '-') {
                    //Split the app's reply using the recordSeparator
                    var fieldSelections = reply.qHyperCube.qDataPages[0].qMatrix[0][0].qText.split(recordSeparator);
                    //console.log('Number of characters in the selections:',fieldSelections[0].length);
                    //If the array of split selected fields is more than zero
                    if (fieldSelections.length > 0) {
                        //Create a part of the App Integration API's URI responsible for selections
                        var selectionPartOfURL = createSelectionURLPart(fieldSelections,tagSeparator,valueSeparator,true); 
                        if(selectionPartOfURL.tooManySelectionsPossible){
                            //console.log("Possible 'x of y values' returned. Need to double check. These dimensions are suspected: "+selectionPartOfURL.suspectedFields);
                            //If tooManySelections is possible, then create a new hypercube with the number of selections of the suspected fields
                            var measuresDef = [];
                            selectionPartOfURL.suspectedFields.forEach(function(field){
                                var measureDefinition = {
                                    qDef : {
                                        qDef : "=GetSelectedCount(["+field+"],True())"
                                    }
                                };
                                measuresDef.push(measureDefinition);
                            });
                            app.createCube({
                                qMeasures : measuresDef,
                                qInitialDataFetch : [{
                                    qTop : 0,
                                    qLeft : 0,
                                    qHeight : 1,
                                    qWidth : selectionPartOfURL.suspectedFields.length
                                }]
                            }, function(reply) {
                                var tooManySelectionsMade = false;
                                reply.qHyperCube.qDataPages[0].qMatrix[0].forEach(function (suspectedSelection) {
                                    //check if the number of selected values is > "Max number of values selected in one field" property
                                    if(parseInt(suspectedSelection.qText) > layout.maxSelected)
                                        tooManySelectionsMade = true;
                                });
                                if(tooManySelectionsMade) {
                                    //If this is the case for at least one field, disable the button
                                    $("#generateDashboardLink").text("Too Many Selections");
                                    $("#generateDashboardLink").prop("disabled",true);
                                }
                                else {
                                    //Considering it a false alarm (for example some field has actual value that follows the "x of y" pattern); activate the button
                                    var selectionPartOfURL = createSelectionURLPart(fieldSelections,tagSeparator,valueSeparator,false);
                                    addOnActivateButtonEvent($element,config,layout,baseURL+selectionPartOfURL.selectionURLPart,layout.emailRecipients,layout.emailTopic,layout.emailBody);
                                }
                            }); //end of tooManySelections hypercube
                        } //end of tooManySelections possibility
                        else { 
                            //If there's no possibility of too many selections, activate the button with the selections part added to the baseURL
                            addOnActivateButtonEvent($element,config,layout,baseURL+selectionPartOfURL.selectionURLPart,layout.emailRecipients,layout.emailTopic,layout.emailBody);
                        }
                    } //end of if split selected fields is zero
                    else{
                        //If the array of split selected fields is zero, activate the button with no selections added to the baseURL
                        addOnActivateButtonEvent($element,config,layout,baseURL,layout.emailRecipients,layout.emailTopic,layout.emailBody);
                    }
                } //end of if App Integration API's reply is empty
                else{
                    //If the app's reply is empty, activate the button with no selections added to the baseURL
                    addOnActivateButtonEvent($element,config,layout,baseURL,layout.emailRecipients,layout.emailTopic,layout.emailBody);
                }
            }); //end of reply and createCube
        }
    };
}); 


//Helper function for creating App Integration API's URI part responsible for selections
var createSelectionURLPart = function (fieldSelections,tagSeparator,valueSeparator,checkForTooManySelections) {
    var returnObject = {
        selectionURLPart : "",
        tooManySelectionsPossible : false,
        suspectedFields : []
    };
    fieldSelections.forEach(function (item) {
        //If this function is instructed to check for tooManySelections, it checks if the selection contains the keywords of, ALL, or NOT, indicating that the selection is not in the 'x of y values' format
        if (checkForTooManySelections && (item.includes(" of ") || item.includes("ALL") || item.includes("NOT")) && item.split(valueSeparator).length == 1) {
            returnObject.tooManySelectionsPossible = true;
            returnObject.suspectedFields.push(item.split(tagSeparator)[0]);
        }
        //Otherwise it just creates the selections part of the URL
        else {
            returnObject.selectionURLPart += "/select/"+encodeURIComponent(item.split(tagSeparator)[0]) + "/%5B" + encodeURIComponent(item.split(tagSeparator)[1].replace(tagSeparator,";"))+"%5D";
            splitForBrackets = returnObject.selectionURLPart.split("%3B%3B%3B%3B");
            returnObject.selectionURLPart = splitForBrackets.join("%5D%3B%5B");
        }
    });
    return returnObject;
};

//Helper funciton for adding on a "qv-activate" event of button/link
var addOnActivateButtonEvent = function ($element,config,layout,url,recipient,topic,body) {
    var encodedURL = encodeURIComponent(url);

    $("#generateDashboardLink").on('qv-activate', function () {
        var finalURL = (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + "/" + layout.urlResolver + "?URL=" + encodedURL;

        if(layout.outputMethod == "email"){
            //Opening a new email with the user settings' input subject, the dashboard generated link, and the user settings' input body
            window.location.href =  'mailto:' + recipient + '?subject=' + topic + '&body=' + body + " " + "%0D%0A" + "%0D%0A" + (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + "/" + layout.urlResolver + "?URL=" + encodedURL + "%0D%0A" + "%0D%0A" + "%0D%0A" + "http://www.qlik.com";
        }
        else if(layout.outputMethod == "clipboard"){
            //Copying the generated link
            var textboxReference = document.querySelector('.dashboardLinkGenerator');
            textboxReference.addEventListener('click', function(event) {
                copyTextToClipboard((config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + "/" + layout.urlResolver + "?URL=" + url);
            });
            //Changing the button's text temporarily to mark success
            document.getElementById('generateDashboardLink').innerHTML= "Copied To Clipboard!";
            //Waiting for 1.5 seconds and resetting the button's text so that users are not discouraged to make new selections and generate new links
            setTimeout(function(){
                document.getElementById('generateDashboardLink').innerHTML= "Copy Dashboard Link";
            },1500)
        }
        else if(layout.outputMethod == "textbox"){
            //Adding the dashboard generated link to the textbox
            document.getElementById('textbox').value = decodeURIComponent(finalURL);

            //Copying the textbox's text (which we just added the generated link to)
            var textboxReference = document.querySelector('.dashboardLinkGenerator');
            textboxReference.addEventListener('click', function(event) {
                var copyTextarea = document.querySelector('.linkTextboxArea');
                copyTextarea.select();
                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Copying text command was ' + msg);
                } catch (err) {
                    console.log('Oops, unable to copy.');
                }
            });
            //Changing the button's text temporarily to mark success
            document.getElementById('generateDashboardLink').innerHTML= "Copied To Clipboard!";
            //Waiting for 1.5 seconds and resetting the button's text so that users are not discouraged to make new selections and generate new links
            setTimeout(function(){
                document.getElementById('generateDashboardLink').innerHTML= "Generate Link";
            },1500)
        }
        window.onbeforeunload = null;
        return false;
    });
    $("#generateDashboardLink").prop("disabled",false);
};

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}