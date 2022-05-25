define(['jquery', 'qlik', 'angular', './propertiesPanel', 'text!./button.html', 'css!./LinkUp.css'], function($, qlik, angular, propertiesPanel, button) {
    return {
        //define the properties panel looks like
        template: button,
        definition: propertiesPanel,
        controller: ['$scope', '$element', function($scope, $element) {
            function createDataCube(recordSeparator, tagSeparator, valueSeparator, maxValuesSelectedInField) {
                return new Promise((resolve, reject) => {
                    //Create a hypercube with the GetCurrentSelections expression
                    app.createCube({
                        qMeasures: [{
                            qDef: {
                                qDef: "=GetCurrentSelections('" + recordSeparator + "','" + tagSeparator + "','" + valueSeparator + "'," + maxValuesSelectedInField + ")"
                            }
                        }],
                        qInitialDataFetch: [{
                            qTop: 0,
                            qLeft: 0,
                            qHeight: 1,
                            qWidth: 1
                        }]
                    }, function(reply) {
                        //console.log('App Integration API\'s reply is: ', reply);
                        let replyValue = reply.qHyperCube.qDataPages[0].qMatrix[0][0].qText;
                        //If the app's reply is not empty
                        if (replyValue && replyValue != '-') {
                            //Split the app's reply using the recordSeparator
                            let fieldSelections = replyValue.split(recordSeparator);

                            //console.log('Number of characters in the selections:',fieldSelections[0].length);
                            //If the array of split selected fields is more than zero
                            if (fieldSelections.length > 0) {
                                //Create a part of the App Integration API's URI responsible for selections
                                createSelectionURLPart(fieldSelections, tagSeparator, valueSeparator, true).then(function(selectionPartOfURL) {
                                    if (selectionPartOfURL.tooManySelectionsPossible) {
                                        //console.log("Possible 'x of y values' returned. Need to double check. These dimensions are suspected: "+selectionPartOfURL.suspectedFields);
                                        //If tooManySelections is possible, then create a new hypercube with the number of selections of the suspected fields
                                        let measuresDef = [];
                                        selectionPartOfURL.suspectedFields.forEach(function(field) {
                                            let measureDefinition = {
                                                qDef: {
                                                    qDef: "=GetSelectedCount([" + field + "],True())"
                                                }
                                            };
                                            measuresDef.push(measureDefinition);
                                        });
                                        app.createCube({
                                            qMeasures: measuresDef,
                                            qInitialDataFetch: [{
                                                qTop: 0,
                                                qLeft: 0,
                                                qHeight: 1,
                                                qWidth: selectionPartOfURL.suspectedFields.length
                                            }]
                                        }, function(reply) {
                                            let tooManySelectionsMade = false;
                                            reply.qHyperCube.qDataPages[0].qMatrix[0].forEach(function(suspectedSelection) {
                                                //check if the number of selected values is > "Max number of values selected in one field" property
                                                if (parseInt(suspectedSelection.qText) > layout.maxSelected)
                                                    tooManySelectionsMade = true;
                                            });
                                            if (tooManySelectionsMade) {
                                                //If this is the case for at least one field, disable the button
                                                $("#generateDashboardLink").text("Too Many Selections");
                                                $("#generateDashboardLink").prop("disabled", true);
                                            } else {
                                                //Considering it a false alarm (for example some field has actual value that follows the "x of y" pattern); activate the button
                                                let selectionPartOfURL = createSelectionURLPart(fieldSelections, tagSeparator, valueSeparator, false);
                                                resolve([$element, config, layout, baseURL + selectionPartOfURL.selectionURLPart, layout.props.emailRecipients, layout.props.emailTopic, layout.props.emailBody]);
                                            }
                                        }); //end of tooManySelections hypercube
                                    } //end of tooManySelections possibility
                                    else {
                                        //If there's no possibility of too many selections, activate the button with the selections part added to the baseURL
                                        resolve(baseURL + selectionPartOfURL.selectionURLPart);
                                    }
                                });
                            } //end of if split selected fields is zero
                            else {
                                //If the array of split selected fields is zero, activate the button with no selections added to the baseURL
                                resolve(baseURL);
                            }
                        } //end of if App Integration API's reply is empty
                        else {
                            //If the app's reply is empty, activate the button with no selections added to the baseURL
                            resolve(baseURL);
                        }
                    }); //end of reply and createCube
                });
            }

            function createSelectionURLPart(fieldSelections, tagSeparator, valueSeparator, checkForTooManySelections) {
                return new Promise((resolve, reject) => {
                    let returnObject = {
                        selectionURLPart: "",
                        tooManySelectionsPossible: false,
                        suspectedFields: []
                    };
                    fieldSelections.forEach(function(item) {
                        //If this function is instructed to check for tooManySelections, it checks if the selection contains the keywords of, ALL, or NOT, indicating that the selection is not in the 'x of y values' format
                        if (checkForTooManySelections && (item.includes(" of ") || item.includes("ALL") || item.includes("NOT")) && item.split(valueSeparator).length == 1) {
                            returnObject.tooManySelectionsPossible = true;
                            returnObject.suspectedFields.push(item.split(tagSeparator)[0]);
                        }
                        //Otherwise it just creates the selections part of the URL
                        else {
                            returnObject.selectionURLPart += "/select/" + encodeURIComponent(item.split(tagSeparator)[0]) + "/%5B" + encodeURIComponent(item.split(tagSeparator)[1].replace(tagSeparator, ";")) + "%5D";
                            splitForBrackets = returnObject.selectionURLPart.split("%3B%3B%3B%3B");
                            returnObject.selectionURLPart = splitForBrackets.join("%5D%3B%5B");
                        }
                    });
                    resolve(returnObject);
                });
            }

            function copyToClipboard(text) {
                let textArea = document.createElement("textarea");

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
                    let successful = document.execCommand('copy');
                    let msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Copying to Clipboard was ' + msg);
                    document.getElementById('generateDashboardLink').innerHTML = "Copied to Clipboard!";
                } catch (err) {
                    console.log('Oops, unable to copy');
                }
                document.body.removeChild(textArea);
            }

            function createEmail(url) {
                window.location.href = 'mailto:' + layout.props.emailRecipients + '?subject=' + layout.props.emailTopic + '&body=' + layout.props.emailBody + " " + "%0D%0A" + "%0D%0A" + encodeURIComponent(url);
            }

            function getProperties() {
                $scope.backendApi.getProperties().then(function(reply) {
                    reply.props[key] = value
                    $scope.backendApi.setProperties(reply)
                });
            }

            function setButton() {
                let button = $scope.layout.props;
                let buttonIconShow = button.iconShow;
                let buttonIcon = button.icon;
                let buttonIconSize = button.iconSize;
                let buttonText = button.buttonText;

                let buttonCSS = 'background-color:' + button.buttonBackground_color + ';';
                buttonCSS += 'border-color:' + button.border_color + ';';
                buttonCSS += 'border:' + button.border_style + ';';
                buttonCSS += 'border-radius:' + button.border_radius + ';';
                buttonCSS += 'color:' + button.font_color + ';';
                buttonCSS += 'font-size:' + button.font_size + ';';
                buttonCSS += 'font-weight:' + button.font_weight + ';';

                document.getElementById('generateDashboardLink').style.cssText = buttonCSS;

                if (buttonIconShow) {
                    var icon = '<span class="lui-icon  ' + buttonIcon + ' ' + buttonIconSize + '"></span>';
                } else {
                    var icon = '';
                }
                document.getElementById('generateDashboardLink').innerHTML = icon + ' ' + buttonText;
            }
            let layout = $scope.layout;
            let app = qlik.currApp(this);
            let config = {
                host: window.location.hostname,
                prefix: window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1),
                port: window.location.port,
                isSecure: window.location.protocol === "https:"
            }
            setButton()
                // Getting Application ID
            if (layout.props.appId == 0) {
                applicationId = app.id
            } else {
                applicationId = layout.props.appId;
            }

            if (applicationId.substring(applicationId.length - 4) == '.qvf') {
                applicationId = applicationId.slice(0, -4);
            }
            let applicationIdFr = encodeURIComponent(applicationId);

            // Getting Sheet ID
            if (layout.props.sheetId == 0) {
                var CurrentSheet = qlik.navigation.getCurrentSheetId().sheetId;
                layout.props.sheetId = CurrentSheet;
            } else {
                var CurrentSheet = layout.props.sheetId;
            }

            /*Creating base part of URL including clearing any leftover 
            selections before opening the new page with our selections*/
            let baseURL = (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + "/sense/app/" + applicationIdFr + "/sheet/" + CurrentSheet + "/state/analysis/options/clearselections";

            //Defining the separators used in GetCurrentSelections function call
            let recordSeparator = '&@#$^()';
            let tagSeparator = '::::';
            let valueSeparator = ';;;;';

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

            //If in edit mode, do nothing
            if (window.location.pathname.includes("/state/edit"))
                return;

            //Making sure the maximum selected values in a field is at least one
            let maxValuesSelectedInField = layout.props.maxSelected;
            maxValuesSelectedInField = maxValuesSelectedInField < 1 ? 1 : maxValuesSelectedInField;

            getProperties();

            $("#generateDashboardLink").on('click', () => {
                createDataCube(recordSeparator, tagSeparator, valueSeparator, maxValuesSelectedInField).then(function(url) {
                    switch (layout.props.outputMethod) {
                        case 1: // New Tab
                            window.open(url);
                            break;
                        case 2: // Copy to Clipboard
                            copyToClipboard(url);
                            break;
                        case 3: // Copy to Email
                            createEmail(url);
                            break;
                        case 4: // Copy from Texbox
                            copyToClipboard($element, config, layout.props, url, recipient, topic, body);
                            break;
                    }
                    //Waiting for 2.5 seconds and resetting the button's text so that users are not discouraged to make new selections and generate new links
                    setTimeout(function() {
                        setButton();
                    }, 2500);
                });
            });
        }],
        paint: function() {
            return qlik.Promise.resolve();
        }
    };
});