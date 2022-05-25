define(["jquery"], function($) {
    var qscPaintCounter = 0;
    var qscStyleCounter = 0;
    if (!qscPaintCounter) {
        $("<style>").html("/* Pivot/Transpose Table Embedded Styles */ \
        .qsc-pivot-table td {border: 1px solid #ccc; padding-left:5px; padding-right:5px;} \
        .qsc-tbl-row-0 td, .qsc-tbl-col-0 {font-weight: bold;} \
        .qsc-pivot-table tr.child-row td {font-weight: normal;} \
        .qsc-tbl-col-0 {background:#BEBFC4;} \
        .qsc-tbl-row-0 td {background:#61A729; color:#fff;} \
        tr.qsc-tbl-row-0 td.qsc-tbl-col-0 {background:transparent;} \
        tr[id^='qsc-tbl-row-parent'] span {/*content: '+';*/ font-size: 25px; color: #61A729; line-height: 9px; display: inline-block; padding: 2px; height: 15px; width: 15px; margin-top: 3px; margin-right: 3px; border-radius: 7px; padding-top: 0px; position: relative; bottom: -2px;} \
        tr[id^='qsc-tbl-row-parent'] {cursor:pointer; padding-left:5px;} \
        tr[class^='qsc-tbl-row'] td.qsc-tbl-col-0 {padding-left:12px;} \
        tr[class^='qsc-tbl-row'].child-row td.qsc-tbl-col-0 {padding-left:35px;} \
        tr[id^='qsc-tbl-row-parent'] {padding-left:0px;} \
        .child-row-toggle-on {display:none;} \
        .parent-row-toggle-on td {border-bottom: green 1px solid;} \
        /*table th{font-weight:bold;}table td,table th{padding:9px 10px;text-align:left;}@media only screen and (max-width: 767px) {table.responsive{margin-bottom:0;}.pinned{position:absolute;left:0;top:0;background:#fff;width:35%;overflow:hidden;overflow-x:scroll;border-right:1px solid #ccc;border-left:1px solid #ccc;}.pinned table{border-right:none;border-left:none;width:100%;}.pinned table th,.pinned table td{white-space:nowrap;}.pinned td:last-child{border-bottom:0;}div.table-wrapper{position:relative;margin-bottom:20px;overflow:hidden;border-right:1px solid #ccc;}div.table-wrapper div.scrollable table{margin-left:35%;}div.table-wrapper div.scrollable{overflow:scroll;overflow-y:hidden;}table.responsive td,table.responsive th{position:relative;white-space:nowrap;overflow:hidden;}table.responsive th:first-child,table.responsive td:first-child,table.responsive td:first-child,table.responsive.pinned td{display:none;}} */\
        ").appendTo("head");
    }
    return {
        initialProperties: {
            version: 1.0,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 100,
                    qHeight: 100
                }],
                title: "/title"
            },
            chartType: "BarChart"
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 1,
                    max: 4
                },
                measures: {
                    uses: "measures",
                    min: 1,
                    max: 35
                },
                sorting: {
                    uses: "sorting"
                },
                pivtablesettings: {
                    type: "item",
                    label: "Table Options",
                    items: {
                        qTransposeActivate: {
                            type: "boolean",
                            label: "Transpose Table?",
                            ref: "qTransposeTable",
                            defaultValue: 1
                        },
                        qTotals: {
                            type: "boolean",
                            label: "Add Totals Column?",
                            ref: "qTotalOn",
                            defaultValue: false
                        },
                        qFirstParentRow: {
                            type: "number",
                            label: "Parent Row A Index #",
                            ref: "qParentRowOne",
                            defaultValue: -1
                        },
                        qFirstParentChildStart: {
                            type: "number",
                            label: "For Parent Row A: First Child Row Index #",
                            ref: "qChildStartForParentOne",
                            defaultValue: -1
                        },
                        qFirstParentChildEnd: {
                            type: "number",
                            label: "For Parent Row A: Last Child Row Index #",
                            ref: "qChildEndForParentOne",
                            defaultValue: -1
                        },
                        qSecondParentRow: {
                            type: "number",
                            label: "Parent Row B Index #",
                            ref: "qParentRowTwo",
                            defaultValue: -1
                        },
                        qSecondParentChildStart: {
                            type: "number",
                            label: "For Parent Row B: First Child Row Index #",
                            ref: "qChildStartForParentTwo",
                            defaultValue: -1
                        },
                        qSecondParentChildEnd: {
                            type: "number",
                            label: "For Parent Row B: Last Child Row Index #",
                            ref: "qChildEndForParentTwo",
                            defaultValue: -1
                        },
                        qThirdParentRow: {
                            type: "number",
                            label: "Parent Row C Index #",
                            ref: "qParentRowThree",
                            defaultValue: -1
                        },
                        qThirdParentChildStart: {
                            type: "number",
                            label: "For Parent Row C: First Child Row Index #",
                            ref: "qChildStartForParentThree",
                            defaultValue: -1
                        },
                        qThirdParentChildEnd: {
                            type: "number",
                            label: "For Parent Row C: Last Child Row Index #",
                            ref: "qChildEndForParentThree",
                            defaultValue: -1
                        },
                        qFourthParentRow: {
                            type: "number",
                            label: "Parent Row D Index #",
                            ref: "qParentRowFour",
                            defaultValue: -1
                        },
                        qFourthParentChildStart: {
                            type: "number",
                            label: "For Parent Row D: First Child Row Index #",
                            ref: "qChildStartForParentFour",
                            defaultValue: -1
                        },
                        qFourthParentChildEnd: {
                            type: "number",
                            label: "For Parent Row D: Last Child Row Index #",
                            ref: "qChildEndForParentFour",
                            defaultValue: -1
                        },

                        qFifthParentRow: {
                            type: "number",
                            label: "Parent Row E Index #",
                            ref: "qParentRowFive",
                            defaultValue: -1
                        },
                        qFifthParentChildStart: {
                            type: "number",
                            label: "For Parent Row E: First Child Row Index #",
                            ref: "qChildStartForParentFive",
                            defaultValue: -1
                        },
                        qFifthParentChildEnd: {
                            type: "number",
                            label: "For Parent Row E: Last Child Row Index #",
                            ref: "qChildEndForParentFive",
                            defaultValue: -1
                        }
                    }
                }
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },

        paint: function($element, layout) {
            var stored = {};
            var currentTableQvid = layout.qInfo.qId;
            if ($("#qsc-pivot-table-body-" + currentTableQvid + "").length) {
                var pliableTable = null; // document.getElementById("qsc-pivot-table-body-" + currentTableQvid + "");
                var transposeThisTable = null; // layout.qTransposeTable;
                var tempMasterArray = null; // []; //Master temp array
                var measureCount = null; // this.backendApi.getMeasureInfos().length;
                var dimensionTitle = null; // this.backendApi.getDimensionInfos()[0].qFallbackTitle;
                var totalColOn = null; // layout.qTotalOn;
                $('body').off('resize', stored.sizeTableWrapper);
            }
            $element.hide();
            $('table').hide();
            $element.html('');

            /*
            if (qscPaintCounter==0) {
            $element.html('<table id="qsc-table-' + currentTableQvid + '" class="qsc-pivot-table"><tbody id="qsc-pivot-table-body' + currentTableQvid + '"></tbody></table>');
            }
            */

            $element.html('<table id="qsc-table-' + currentTableQvid + '" class="qsc-pivot-table responsive"><tbody id="qsc-pivot-table-body-' + currentTableQvid + '"></tbody></table>');
            var pliableTable = document.getElementById("qsc-pivot-table-body-" + currentTableQvid + "");
            var transposeThisTable = layout.qTransposeTable;
            var tempMasterArray = []; //Master temp array
            var measureCount = this.backendApi.getMeasureInfos().length;
            var dimensionTitle = this.backendApi.getDimensionInfos()[0].qFallbackTitle;
            var totalColOn = layout.qTotalOn;
            //totalColOn  = true;

            //retrieve dimension title
            var dimTitle = this.backendApi.getDimensionInfos()[0].qFallbackTitle;


            if (transposeThisTable) {
                var innerArrayCntr = this.backendApi.getMeasureInfos().length + 1;
            } //set number of inner arrays
            else {
                var innerArrayCntr = this.backendApi.getRowCount() + 1;
            }
            //if (totalColOn) {innerArrayCntr++;}
            for (var addPlaceHolders = 0; addPlaceHolders < innerArrayCntr; addPlaceHolders++) {
                //add nested placeholder array
                tempMasterArray.push(new Array());


                if (!transposeThisTable && addPlaceHolders == 0) {
                    measureCount++; //1 represents dimension count
                    for (var aMeasureCntr = 0; aMeasureCntr < measureCount; aMeasureCntr++) {
                        if (aMeasureCntr == 0) {
                            tempMasterArray[addPlaceHolders].push(this.backendApi.getDimensionInfos()[aMeasureCntr].qFallbackTitle);
                        } else {
                            tempMasterArray[addPlaceHolders].push(this.backendApi.getMeasureInfos()[(aMeasureCntr - 1)].qFallbackTitle);
                        }
                    }
                }

                if (transposeThisTable) {
                    if (addPlaceHolders == 0) { //Dimension Row
                        //push blank space as title for Dimension Row (Row 0 Column 0)  
                        tempMasterArray[addPlaceHolders].push(" ");
                    } else { //Measure Row
                        //push Mesure Title into array  (Row # addPlaceHolders Column 0)
                        tempMasterArray[addPlaceHolders].push(this.backendApi.getMeasureInfos()[(addPlaceHolders - 1)].qFallbackTitle);
                    }
                }
            }
            //Build temp arrays, each array corresponds to one measure and will be used to make html table rows
            this.backendApi.eachDataRow(function(key, row) {
                qscCellCnt = 0;
                //if (totalColOn) {qscCellCnt -= 1;}
                for (var qscCells = row.length; qscCellCnt < qscCells; qscCellCnt++) {
                    if (transposeThisTable) {
                        if (qscCellCnt == 0) {
                            tempMasterArray[qscCellCnt].push((dimTitle + " " + row[qscCellCnt].qText)); //Dimension values + titles as first temp array
                        } else {
                            tempMasterArray[qscCellCnt].push(row[qscCellCnt].qText); //Value for Measure goes into measure-specific array
                        }
                    } else {
                        if (qscCellCnt == 0) { //Dimension values + titles as first temp array
                            tempMasterArray[(key + 1)].push(dimensionTitle + " " + row[qscCellCnt].qText);
                        } else {
                            tempMasterArray[(key + 1)].push(row[qscCellCnt].qText);
                        }
                    }

                }
            });
            var totalsArr = [];
            var sumItAllUp = 0;
            var summer = 0;
            var putInParens = false;
            var commaSeparate = function(totsTikr) {
                if (totsTikr < 0) {
                    totsTikr = totsTikr * -1;
                    putInParens = true;
                } else {
                    putInParens = false;
                }
                while (/(\d+)(\d{3})/.test(totsTikr.toString())) {
                    totsTikr = totsTikr.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
                }
                if (putInParens) {
                    return ("(" + totsTikr + ")");
                } else {
                    return totsTikr;
                }
            };
            stored.sizeTableWrapper = function() {
                var tableHeight = $('.qsc-pivot-table').outerHeight();
                $('#table-on-bottom').css({
                    'height': tableHeight + 26,
                });

                if ($('#table-on-bottom').outerWidth() < $('#qsc-table-' + currentTableQvid + '').outerWidth()) {
                    $('#table-on-bottom').css({
                        // 'height': tableHeight,
                        'overflow-x': 'scroll'
                    });
                } else {
                    $('#table-on-bottom').css({
                        // 'height': tableHeight,
                        'overflow-x': 'visible'
                    });
                }

            };
            if (transposeThisTable && totalColOn) {
                //go through each temp master array and summ values to produce a totals array of total values for each measure
                for (var totsIter = (tempMasterArray.length), totsTikr = 0; totsTikr < totsIter; totsTikr++) { //totsTikr = 1 to skip the first temp array containing dim titles also subtract one from length to disclude totals 

                    sumItAllUp = 0; //reset sumItAllUp for the next mesasure
                    for (var totsInIter = tempMasterArray[totsTikr].length, totsInTikr = 1; totsInTikr < totsInIter; totsInTikr++) {
                        summer = (tempMasterArray[totsTikr][totsInTikr]).replace(/,/g, '');

                        sumItAllUp += parseFloat(summer);
                        if (parseFloat(summer) < 0) { //if current value < 0 then take abs value, comma seperate and put in parens
                            tempMasterArray[totsTikr][totsInTikr] = "(" + commaSeparate((parseFloat(summer) * -1)) + ")";
                        }
                        if (totsInTikr == (totsInIter - 1)) { //PV FACTOR FIX, totsTikr == 1 represents PV factor row/col
                            if (totsTikr == 1) {
                                sumItAllUp = sumItAllUp.toFixed(4);
                                tempMasterArray[totsTikr].push(sumItAllUp); //no commas in PV factor, commaSperate adds commas to after the decimal place if you let it
                            } else {
                                totsTikr == 0 ? tempMasterArray[totsTikr].push('Totals') : tempMasterArray[totsTikr].push(commaSeparate(sumItAllUp));
                            }
                        }
                    }
                    //tempMasterArray[(this.backendApi.getMeasureInfos().length + 1)].push(sumItAllUp);
                }
            }

            if (!transposeThisTable && totalColOn) {
                alert('Total Column For Non Transposed Table Function Not Complete');
                //go through each temp master array and summ values to produce a totals array of total values for each measure
                tempMasterArray.push([]); //add an extra array for new totals row
                for (var totsIter = (tempMasterArray.length - 1), totsTikr = 1; totsTikr < totsIter; totsTikr++) { //totsTikr = 1 to skip the first temp array containing dim/meas titles also subtract one from length to disclude totals col

                    sumItAllUp = 0; //reset sumItAllUp for the next mesasure
                    for (var totsInIter = tempMasterArray[totsTikr].length, totsInTikr = 1; totsInTikr < totsInIter; totsInTikr++) {
                        summer = (tempMasterArray[totsTikr][totsInTikr]).replace(/,/g, '');

                        sumItAllUp += parseFloat(summer);

                        if (totsInTikr == (totsInIter - 1)) {

                            totsTikr == 0 ? tempMasterArray[totsTikr].push('Totals') : tempMasterArray[totsIter].push(sumItAllUp);
                        }

                    }
                    //tempMasterArray[(this.backendApi.getMeasureInfos().length + 1)].push(sumItAllUp);

                }
            }

            var makeHeader = false; //option to disable table header
            for (var bldraLen = tempMasterArray.length, bldra = 0; bldra < bldraLen; bldra++) {
                //Make html table row
                var qscRowHtml = document.createElement('tr');
                for (var bldrbLen = tempMasterArray[bldra].length, bldrb = 0; bldrb < bldrbLen; bldrb++) {
                    //var htmlCellHldr = tempMasterArray[nth].[bldrb];
                    var qscCellHtml = document.createElement('td');

                    //Make html table column
                    qscCellHtml.innerHTML = tempMasterArray[bldra][bldrb];
                    qscCellHtml.className = "qsc-tbl-col-" + bldrb; //css class based on col location
                    qscRowHtml.appendChild(qscCellHtml); //add current col to current row
                }
                qscCellHtml = null;
                if (typeof pliableTable === "undefined" || pliableTable == null) {
                    //pliableTable = document.getElementById("qsc-pivot-table-body-" + currentTableQvid + "");
                    return;

                }
                pliableTable.appendChild(qscRowHtml); //add current row to the table

                qscRowHtml.className = "qsc-tbl-row-" + bldra; //css class based on row location
            }
            tempMasterArray = null;
            qscRowHtml = null;
            pliableTable = null;
            qscPaintCounter++;



            //make expandable rows by running function tblMakeExapnd with three parameters parent row index no. (where first row is row 0), first child row index number, last child row index number
            var greatestHeight = 0; //hold the row height for the tallest row to match this height on the other rows later on
            function tblMakeExapnd(mkeParent, childStart, childEnd) {
                $("#qsc-table-" + currentTableQvid + " tbody tr").each(function() { //match makeParent, childStart, and childEnd with table row index numbers and apply appropriate css class and id names, and then apply event handlers to contract and expand children
                    if ($(this).hasClass("qsc-tbl-row-" + mkeParent + "")) {
                        $(this).attr('id', "qsc-tbl-row-parent-" + mkeParent + "");
                        $("#qsc-tbl-row-parent-" + mkeParent + " td.qsc-tbl-col-0").attr('id', "click-to-expand-parent-" + mkeParent + "-" + currentTableQvid + "");
                        (function() {
                            var parentMaker = document.getElementById("click-to-expand-parent-" + mkeParent + "-" + currentTableQvid + "");
                            parentMaker.insertAdjacentHTML("afterbegin", "<span class='qTbl-expander'><i class=\"fa fa-caret-down\"></i> </span>");
                            parentMaker = null;
                        })();
                    } else if ($(this).hasClass("qsc-tbl-row-" + childStart + "")) {
                        $(this).addClass("child-of-row-" + mkeParent + "").addClass("child-row");

                        if (childStart != childEnd) { //if more than one child row add event listeners and class identifiers to next child rows
                            var pivTblRows = $("#qsc-table-" + layout.qInfo.qId + " tbody tr");
                            for (var childRowCntr = 1; childRowCntr < (childEnd - mkeParent); childRowCntr++) { //get the index number of child row childStart and iterate over the next found html nodes that are not children, apply css classes for children until we reach childEnd
                                var nextChildRow = pivTblRows.eq(pivTblRows.index(this) + childRowCntr);
                                nextChildRow.addClass("child-of-row-" + mkeParent + "").addClass("child-row");

                            } //end if we're done
                        } //end if
                        pivTblRows = null;

                    } //end else if --> look for child rows
                    $element.show();
                    $('table').show();
                    if ($(this).height() > greatestHeight) {
                        greatestHeight = $(this).height();
                    }
                    $element.hide();
                    $('table').hide();
                });

                var makeExpandables = function() { //event handlers
                    $(".child-of-row-" + mkeParent + "").toggleClass("child-row-toggle-on");
                    $(".qsc-tbl-row-" + mkeParent + "").toggleClass("parent-row-toggle-on");
                };
                $("#click-to-expand-parent-" + mkeParent + "-" + currentTableQvid + "").off('click', makeExpandables);
                $("#click-to-expand-parent-" + mkeParent + "-" + currentTableQvid + "").on('click', makeExpandables);

                if (greatestHeight) {
                    $("#qsc-table-" + layout.qInfo.qId + " tbody tr").css({
                        "height": greatestHeight
                    }); //height equalizer

                }

                if (qscStyleCounter == 0) { //match left alignment on all rows, only once
                    $("<style>").html("/* Pivot/Transpose Table TR Special Embedded Styles For Expanders Enabled*/\
                qsc-table-" + currentTableQvid + " tr[class^='qsc-tbl-row'] td.qsc-tbl-col-0 {padding-left:12px;} ]\
                ").appendTo("head");
                    qscStyleCounter++;
                }
            }


            if (qscPaintCounter > 0) { //do not add expandable rows on first paint, only on subsequent paints
                if (layout.qParentRowOne > -1) {
                    tblMakeExapnd(layout.qParentRowOne, layout.qChildStartForParentOne, layout.qChildEndForParentOne);
                }
                if (layout.qParentRowTwo > -1) {
                    tblMakeExapnd(layout.qParentRowTwo, layout.qChildStartForParentTwo, layout.qChildEndForParentTwo);
                }
                if (layout.qParentRowThree > -1) {
                    tblMakeExapnd(layout.qParentRowThree, layout.qChildStartForParentThree, layout.qChildEndForParentThree);
                }
                if (layout.qParentRowFour > -1) {
                    tblMakeExapnd(layout.qParentRowFour, layout.qChildStartForParentFour, layout.qChildEndForParentFour);
                }
                if (layout.qParentRowFive > -1) {
                    tblMakeExapnd(layout.qParentRowFive, layout.qChildStartForParentFive, layout.qChildEndForParentFive);
                }

            }


            $element.show();
            $('table').show();

            var suffix = " - Qlik Sense",
                weAreInSense = document.title.indexOf(suffix, document.title.length - suffix.length) !== -1;
            if (weAreInSense) {
                $element[0].style.overflowY = "scroll";
            } else {
                stored.sizeTableWrapper();
                $('body').on('resize', stored.sizeTableWrapper);
            }

        }



    };


});
