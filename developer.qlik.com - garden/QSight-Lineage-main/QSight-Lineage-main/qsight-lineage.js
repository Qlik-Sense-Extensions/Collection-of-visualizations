define(["qlik", 'util', './vis-network.min', './icons', "css!./qsight-lineage.css"], function(qlik, Util, vis) {



    return {

        definition: {
            type: "items",
            component: "accordion",
            items: {
                appearance: {
                    uses: "settings",
                    items: {
                        urlHeader: {
                            type: "items",
                            label: "About",
                            items: {
							      about1:{
									 "type":"string",
									 "component":"text",
									 "label":"Mustafa Aydogdu 2021"
								  },
                                about2: {
                                    "type": "string",
                                    "component": "text",
                                    "label": "BETA: v0.1.0"
                                },
                                about3: {
                                    "type": "string",
                                    "component": "text",
                                    "label": "GitHub: www.github.com/maydogdu"
                                },
								
								about4: {
                                    "type": "string",
                                    "component": "text",
                                    "label": "Network Visualization: visjs.org"
                                },
								
								about5: {
                                    "type": "string",
                                    "component": "text",
                                    "label": "Icons: iconify.design"
                                }

                            }
                        }
                    }
                }
            }
        },


        support: {
            snapshot: true,
            export: true,
            exportData: false
        },
        paint: function($element, layout, script) {
            //add your rendering code here
            var app = qlik.currApp(this);


            console.log(app);

            app.getScript().then(function(script) {
                script = script.qScript;

                script = script.replace(/\bLOOP\b/ig, 'Loop;');

                script = script.replace(/\bNEXT\b\s*;/ig, 'NEXT;');
                script = script.replace(/\bNEXT\s*$/ig, 'NEXT;');
                script = script.replace(/(\bNEXT\b)\s+(\w+)/gi, '$1 $2;');

                script = script.replace(/(\bFOR EACH\b.+\bIN\b.+)/gi, '$1;');
                script = script.replace(/(\bFOR\b.+\bTO\b.+)/gi, '$1;');
                script = script.replace(/(\bDO WHILE\b.*)/gi, '$1;');

                script = script.replace(/\bEND IF\b\s*;/ig, 'ENDIF;');
                script = script.replace(/\bENDIF\b\s*;/ig, 'ENDIF;');
                script = script.replace(/\bENDIF\b/ig, 'ENDIF;');
                script = script.replace(/\bEND IF\b/ig, 'ENDIF;');

                script = script.replace(/\bELSE\b/ig, 'ELSE;');
                script = script.replace(/(\bELSEIF\b.*\bTHEN\b)/ig, '$1;');
                script = script.replace(/(\bIF\b.*\bTHEN\b)/ig, '$1;');

                script = script.replace(/(\bSWITCH\b)\s+(\w+)/gi, '$1 $2;');
                //script= script.replace(/(\bCASE\b)\s+(\w+)/gi, '$1 $2;');
                script = script.replace(/(\bEND\b)\s+(\bSWITCH)\s*$/ig, '$1 $2;');


                script = script.replace(/(\bSUB\b.+)/gi, '$1;');
                script = script.replace(/(\bCALL\b.+)/gi, '$1;');
                script = script.replace(/(\bENDSUB\b)/ig, '$1;');
                script = script.replace(/(\bEND\b).*(\bSUB\b)/ig, '$1$2;');

                //Replace double semicolumns. should be last one.
                script = script.replace(/;\s*;/gi, ';');



                sections = script.split("///$tab");
                sections.shift();




                var i;
                var parsed_script = [];

                //**************Parse Script into Blocks****************
                for (i = 0; i < sections.length; i++) {
                    var t;
                    var inString = 0;
                    var inComment = 1; //First line is the name of section. It should be processed as a comment.
                    var inMultiLineComment = 0;
                    var script_line = '';
                    var prev_char = '';
                    var curr_char = '';
                    var spec_char_begin = '';
                    parsed_script[i] = [];
                    var inLoad = 0;
                    var row_number = 0;
                    var block_status = [];

                    for (t = 0; t < sections[i].length; t++) {

                        curr_char = sections[i][t];
                        script_line = script_line + curr_char;



                        if (inComment == 0 && inMultiLineComment == 0 && inString == 0 && curr_char == '\'') { //Check if there is an exceptin like string signs
                            spec_char_begin = curr_char;
                            inString = 1;
                            block_status.push('str');

                        } else if (inString == 1 && curr_char == '\'') {

                            inString = 0;

                        } else if (inComment == 0 && inMultiLineComment == 0 && inString == 0 && curr_char == ';') {
                            inLoad = 0;
                            parsed_script[i].push(script_line);
                            script_line = '';

                        }



                        //check comment start, exclude lib://
                        else if (curr_char == '*' && prev_char == '/' && inComment == 0 && inMultiLineComment == 0 && inString == 0) { //Process Comments
                            inMultiLineComment = 1;


                        } else if ((curr_char == '/') && prev_char == '/' && sections[i][t - 2] != ':' && inComment == 0 && inMultiLineComment == 0 && inString == 0) { //Process Comments

                            inComment = 1;



                        } else if (inComment == 1 && curr_char == '\n' && inString == 0) {

                            if (inLoad == 0) {
                                parsed_script[i].push(script_line);
                                script_line = '';
                            }

                            inComment = 0;
                        } else if (inMultiLineComment == 1 && prev_char == '*' && curr_char == '/' && inString == 0) {


                            if (inLoad == 0) {
                                parsed_script[i].push(script_line);
                                script_line = '';
                            }

                            inMultiLineComment = 0;

                        } else if (inComment == 0 && inMultiLineComment == 0 && (script_line.match(/\bload\b/gi) != null || script_line.match(/\bselect\b/gi) != null)) {
                            inLoad = 1;


                        }

                        //Eger load esnasinda comment varsa, bu commentleri scriptten cikart
                        if (inLoad == 1 && (inComment == 1 || inMultiLineComment == 1)) {

                            script_line = script_line.substring(0, script_line.length - 1);

                        }

                        prev_char = curr_char;
                    }
                }

                //console.log(parsed_script);
                //***************End of Parsing Script****************
                //Result of this part is an array --> parsed_script[][]


                //**************Start of Remove Blank Lines***************
                for (i = 0; i < parsed_script.length; i++) {
                    for (t = 1; t < parsed_script[i].length; t++) {
                        //if (merged_blocks[i][t]== '/\r?\n|\r/g' ){//|| merged_blocks[i][t].trim().includes('///$autogenerated') == true) {
                        //console.log(merged_blocks[i][t]+'geldi');
                        //merged_blocks[i].splice(t, 1);
                        //t--;

                        //parsed_script[i][t]=parsed_script[i][t].replace(/\/\*.*\*\//, '/*Long Comment*/');
                        parsed_script[i][t] = parsed_script[i][t].trim();

                        if (parsed_script[i][t].length < 1) {
                            parsed_script[i].splice(t, 1);
                            t--;
                        }



                        //}
                    }
                }
                //**************End of Remove Blank Lines***************	

                //console.log(parsed_script);

                function CheckLetSet(let_set_text) {
                    if (let_set_text.trim().substr(0, 3).toLowerCase() == 'let' || let_set_text.trim().substr(0, 3).toLowerCase() == 'set' || let_set_text.includes('=')) {

                        if (let_set_text.match(/\bload\b/gi) == null && let_set_text.match(/\bselect\b/gi) == null) {
                            return 1;
                        } else {
                            return 0;
                        }

                    } else {
                        return 0;
                    }
                }


                function CheckComment(string) {
                    if (string.trim().substr(0, 2) == '//') {
                        return 1;
                    } else {
                        return 0;
                    }
                }

                //SVG Encoder-----------------------------
                function EncodeSVG(SVG) {

                    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SVG);
                }

                //Find Script

                function FindScript(array, valuetofind) {

                    var loc = valuetofind.split("_");
                    return array[loc[0]][loc[1]].Script;

                }

                //---Find name of table--- Only for Load and Select

                function findTableName(script) {
                    var result = '';
                    const regex_load = /\S+(?=.*load)/gmis;
                    const regex_select = /\S+(?=.*select)/gmis;
                    const regex = /\w+(?=.*:)/gmis;

                    var temp = '';


                    if (script.match(regex_load) != null) {
                        var temp = script.match(regex_load).toString();

                        if (temp.match(regex)) {
                            temp = temp.match(regex);
                            result = temp[temp.length - 1];
                        } else {
                            result = null;
                        }
                    } else if (script.match(regex_select) != null) {
                        var temp = script.match(regex_select).toString();

                        if (temp.match(regex)) {
                            temp = temp.match(regex);
                            result = temp[temp.length - 1];
                        } else {
                            result = null;
                        }
                    } else {
                        result = null;
                    }

                    return result;

                }

                //--------Create Label for Nodes-------
                function CreateLabel(myJson) {
                    var result = '';

                    if (myJson.TableName != null) {

                        var tableName = myJson.TableName;

                        //If there are multiple table names then split them by comma
                        if (Array.isArray(tableName)) {

                            result = '<b>' + myJson.BlockType + '</b>';
                            tableName = tableName[0].split(',');

                            tableName.forEach(function(el, index) {

                                result = result + '\n<i>' + el + '</i>';
                            });



                        } else {
                            result = '<b>' + myJson.BlockType + '</b>\n<i>' + myJson.TableName + '</i>';
                        }

                    } else {
                        result = '<b>' + myJson.BlockType + '</b>';
                    }

                    return result;

                }


                //Script Formatting Function----------------------------
                function FormatScript(script, blockType) {

                    /*var result = script = script.replace(/\n/g,'<br>');

                    var keywords = ['FOR'];
                    
                    for (i=0;i<keywords.length;i++){
                    
                    	result = result.replace(new RegExp("\\b"+keywords[i]+"\\b", "ig"),  '<code class="w3-codespan">'+keywords[i]+'</code>');
                    	
                    }
                    
                    console.log(result);*/
                    if (blockType != 'Comment') {

                        script = script.replace(/\bSET\b/ig, '<code class="w3-codespan">SET</code>');
                        script = script.replace(/\bLET\b/ig, '<code class="w3-codespan">LET</code>');
                        script = script.replace(/\bSELECT\b/ig, '<code class="w3-codespan">SELECT</code>');
                        script = script.replace(/\bLOAD\b/ig, '<code class="w3-codespan">LOAD</code>');
                        script = script.replace(/\bFROM\b/ig, '<code class="w3-codespan">FROM</code>');
                        script = script.replace(/\bRESIDENT\b/ig, '<code class="w3-codespan">RESIDENT</code>');
                        script = script.replace(/\bDROP TABLE\b/ig, '<code class="w3-codespan">DROP TABLE</code>');
                        script = script.replace(/\bFOR EACH\b/ig, '<code class="w3-codespan">FOR EACH</code>');
                        script = script.replace(/\bFOR\b/ig, '<code class="w3-codespan">FOR</code>');
                        script = script.replace(/\bDO\b/ig, '<code class="w3-codespan">DO</code>');
                        script = script.replace(/\bLOOP\b/ig, '<code class="w3-codespan">LOOP</code>');
                        script = script.replace(/\bNEXT\b/ig, '<code class="w3-codespan">NEXT</code>');
                        script = script.replace(/\bSTORE\b/ig, '<code class="w3-codespan">STORE</code>');
                        script = script.replace(/\bWHILE\b/ig, '<code class="w3-codespan">WHILE</code>');
                        script = script.replace(/\bINTO\b/ig, '<code class="w3-codespan">INTO</code>');
                        script = script.replace(/\bLIB CONNECT TO\b/ig, '<code class="w3-codespan">LIB CONNECT TO</code>');
                        script = script.replace(/\bSUB\b/ig, '<code class="w3-codespan">SUB</code>');

                    }
                    script = script = script.replace(/\n/g, '<br>');
                    script = '<div style="background-color:white">' + script + '</div>';
                    return script;

                }


                //*************Start of Block Consolidation**************
                //In this part, I am gonna merge loop/if and similar conditions into one block.
                var merged_blocks = [];
                var y_order = 1;
                var x_order = 0;

                for (i = 0; i < sections.length; i++) {

                    var t;
                    var curr_row = '';
                    var inMerge = 0;
                    var row_begin = [];
                    var row_end = [];
                    var loop_parent_id = [];
                    var block_script = '';
                    merged_blocks[i] = [];
                    var last_push = '';
                    var prev_let_set = 0;
                    var curr_let_set = 0;
                    var endif_connections = [];
                    var inLoop = 0;
                    var curr_comment_check = 0;
                    var prev_comment_check = 0;
                    var inIF = 0;
                    var ifTracker = [];
                    var endif_max_x = x_order;
                    var prev_statement = '';
                    var inSwitch = 0;



                    for (t = 0; t < parsed_script[i].length; t++) {
                        curr_row = parsed_script[i][t];
                        last_push = '';


                        curr_let_set = CheckLetSet(curr_row);
                        curr_comment_check = CheckComment(curr_row);

                        if ((curr_row.match(/\bREM\b/ig) || curr_row.match(/\bTRACE\b/ig)) && curr_row.match(/\bIF\b/ig) == false && curr_row.match(/\bTHEN\b/ig) == false && curr_row.match(/\bWHILE\b/ig) == false && curr_row.match(/\FOR\b/ig) == false) {
                            block_script = curr_row;
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": merged_blocks[i].length - 1,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            x_order++;

                        } else if (curr_comment_check == 1 && prev_comment_check == 1) {
                            //block_script+='\n'+curr_row;

                            merged_blocks[i][merged_blocks[i].length - 1].Script += '\n' + curr_row;;


                        } else if (curr_comment_check == 1 && prev_comment_check == 0) {
                            block_script = curr_row;
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": merged_blocks[i].length - 1,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            x_order++;

                        } else if (curr_row.substr(0, 2) == '/*') {
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": merged_blocks[i].length - 1,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });
                            block_script = '';
                            x_order++;
                        }

                        //Do while
                        else if (curr_row.match(/\bDO\b/ig) && (curr_row.match(/\bWHILE\b/ig) || curr_row.match(/\bUNTIL\b/ig))) {
                            inMerge = 1;
                            row_begin.push('do');
                            row_end.push('loop');


                            block_script = '';

                            loop_parent_id.push(merged_blocks[i].length);
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": merged_blocks[i].length - 1,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            x_order++;
                            y_order++;



                        } //end of Do while



                        //FOR Each
                        else if (curr_row.match(/\bFOR EACH\b.*\bIN\b/ig) || curr_row.match(/\bFOR\b.*\bTO\b/ig)) {
                            inMerge = 1;
                            row_begin.push('for each');
                            row_end.push('next');


                            block_script = '';

                            loop_parent_id.push(merged_blocks[i].length);
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": merged_blocks[i].length - 1,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            x_order++;
                            y_order++;



                        } //end of FOR EACH

                        /*
                        						//For ve for each
                        						else if (curr_row.match(/\bFOR\b/ig) &&  curr_row.match(/\bEXIT\b/ig)==false) {
                        							console.log('for girdi');
                        							inMerge = 1;
                        							row_begin.push('for');
                        							row_end.push('next');

                        							//curr_row = curr_row.split('\n',2);
                        							//curr_row[1] = curr_row[1].trim();
                        							block_script='';
                        							//curr_let_set = CheckLetSet(curr_row[1]);
                        							//curr_comment_check = CheckComment(curr_row[1]);
                        							
                        							
                        							loop_parent_id.push(merged_blocks[i].length);							
                        							merged_blocks[i].push({"RowID":merged_blocks[i].length, "ParentID":merged_blocks[i].length-1, "LoopParentID":'', "Script":curr_row, "x_order": x_order, "y_order": y_order});

                        							x_order++;
                        							y_order++;
                        							
                        						} //end of for ve for each*/

                        //If statements
                        else if (curr_row.match(/\bIF\b/ig) && curr_row.match(/\bTHEN\b/ig)) {
                            inMerge = 1;

                            row_begin.push('if');
                            row_end.push('endif');
                            endif_connections = [];
                            //endif_connections.push(merged_blocks[i].length-1);

                            block_script = '';

                            loop_parent_id.push(merged_blocks[i].length);
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": merged_blocks[i].length - 1,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            x_order++;

                            if (prev_statement == 'ELSE' || prev_statement == 'ENDIF') {
                                ifTracker[ifTracker.length - 1].Type = 'IF';
                                ifTracker[ifTracker.length - 1].ID = merged_blocks[i].length;
                            } else {
                                ifTracker.push({
                                    "Type": 'IF',
                                    "ID": merged_blocks[i].length
                                });
                            }

                            inIF++;
                            prev_statement = 'IF';

                        } //end of statements


                        //else statements
                        else if (curr_row.match(/\bELSE\b/ig) || curr_row.match(/\bELSEIF\b/ig)) {
                            prev_statement = 'ELSE';
                            //loop_parent_id.push(merged_blocks[i].length);							
                            //endif_connections.push(merged_blocks[i].length-1);

                            //curr_row = curr_row.split('\n',2);
                            //curr_row[1] = curr_row[1].trim();
                            block_script = '';
                            //curr_let_set = CheckLetSet(curr_row[1]);
                            //curr_comment_check = CheckComment(curr_row[1]);

                            //curr_comment_check = CheckComment(curr_row[1]);

                            y_order++;
                            x_order = merged_blocks[i][loop_parent_id[loop_parent_id.length - 1]].x_order + (1+Math.random()/ 10);


                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": loop_parent_id[loop_parent_id.length - 1],
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            x_order++;

                            ifTracker.push({
                                "Type": 'ELSE',
                                "ID": merged_blocks[i].length
                            });

                            //merged_blocks[i].push({"RowID":merged_blocks[i].length, "ParentID":merged_blocks[i].length-1, "LoopParentID":'', "Script":curr_row[1], "Script":curr_row[1], "x_order": x_order, "y_order": y_order});

                            //x_order++;

                            last_push = 'multiple';
                        } //end of else statements

                        //loop next etc
                        else if (loop_parent_id.length > 0 && (curr_row.toLowerCase().includes('loop') || curr_row.toLowerCase().includes('next'))) {
                            row_begin.pop();
                            row_end.pop();


                            y_order--;

                            //loop_parent_id.push(merged_blocks[i].length);							
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": merged_blocks[i].length - 1,
                                "LoopParentID": loop_parent_id.pop(),
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            x_order++;

                            last_push = 'multiple';
                        } //loop next endif etc

                        //endif 
                        else if (curr_row.toLowerCase().includes('endif')) {
                            prev_statement = 'ENDIF';
                            row_begin.pop();
                            row_end.pop();

                            inIF--;

                            y_order = merged_blocks[i][loop_parent_id[loop_parent_id.length - 1]].y_order;
                            //loop_parent_id.push(merged_blocks[i].length);							

                            endif_connections = [];

                            //ifTracker.pop();

                            while (ifTracker[ifTracker.length - 1].Type != 'IF') {
                                var item = ifTracker.pop();
                                endif_connections.push(item.ID);

                            }

                            var item = ifTracker.pop();
                            endif_connections.push(item.ID);

                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": '',
                                "LoopParentID": endif_connections,
                                "Script": curr_row,
                                "x_order": endif_max_x,
                                "y_order": y_order
                            });
                            loop_parent_id.pop();
                            x_order = endif_max_x + 1;

                            last_push = 'multiple';

                            ifTracker.push({
                                "Type": 'ENDIF',
                                "ID": merged_blocks[i].length
                            });

                        } //endif
                        else if (curr_let_set == 1 && prev_let_set == 1) {
                            //block_script+='\n'+curr_row;

                            merged_blocks[i][merged_blocks[i].length - 1].Script += '\n' + curr_row;;

                        } else if (curr_let_set == 1 && prev_let_set == 0) {
                            block_script = curr_row;
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": merged_blocks[i].length - 1,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            x_order++;

                        }

                        //Detect Switch Statements
                        else if (curr_row.match(/\bSWITCH\b\s+\w+/ig)) {
                            inSwitch = merged_blocks[i].length;
                            row_begin.push('Switch');
                            row_end.push('End Switch');

                            block_script = '';

                            //loop_parent_id.push(merged_blocks[i].length);							
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": merged_blocks[i].length - 1,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            x_order++;
                            //y_order++;

                        } //end of //Detect Switch Statements

                        //Detect Case Statements
                        else if (curr_row.match(/\bCASE\b\s+\S+/i)) {

                            loop_parent_id.push(merged_blocks[i].length);
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": inSwitch,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            //x_order++;
                            y_order++;

                        } //end of //Detect Case Statements

                        //Detect DEFAULT Case
                        else if (curr_row.match(/\bDEFAULT\b/ig)) {

                            loop_parent_id.push(merged_blocks[i].length);
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": inSwitch,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            //x_order++;
                            y_order++;

                        } //end of DEFAULT Case

                        //END of Case
                        else if (curr_row.match(/\bEND SWITCH\b/ig)) {
                            x_order++;
                            y_order = merged_blocks[i][inSwitch].y_order;
                            inSwitch = 0;
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": '',
                                "LoopParentID": loop_parent_id,
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });

                            x_order++;
                        } //end of CASE
                        else {
                            merged_blocks[i].push({
                                "RowID": merged_blocks[i].length,
                                "ParentID": merged_blocks[i].length - 1,
                                "LoopParentID": '',
                                "Script": curr_row,
                                "x_order": x_order,
                                "y_order": y_order
                            });
                            block_script = '';
                            x_order++;

                        }

                        if (inIF > 0) {
                            ifTracker[ifTracker.length - 1].ID = merged_blocks[i].length - 1;


                        }

                        if (x_order > endif_max_x) {
                            endif_max_x = x_order;
                        }

                        prev_let_set = curr_let_set;
                        curr_let_set = 0;

                        prev_comment_check = curr_comment_check;
                        curr_comment_check = 0;

                        /*
                        						if (inMerge == 0 && last_push != 'multiple') {
                        							merged_blocks[i].push({"RowID":merged_blocks[i].length, "ParentID":merged_blocks[i].length-1, "LoopParentID":'', "Script":block_script});
                        							last_push = 'single'
                        							block_script = '';
                        						} //end of inmerge
                        */
                    } //end of for

                } //end of for

                //console.log(merged_blocks);
                //parsed_script ='';
                //**************End of Block Consolidation***************
                //Result set merged_blocks.




                //*************Start of Block Type Detection*************



                var block_details = [];
                var image_name = ''

                var sub_label = null;


                for (i = 0; i < merged_blocks.length; i++) {

                    block_details[i] = [];

                    for (t = 0; t < merged_blocks[i].length; t++) {
                        var curr_block = merged_blocks[i][t].Script.toLowerCase().trim();
                        var curr_block_case_sen = merged_blocks[i][t].Script.trim();
                        var block_type = '';
                        var block_dependency = ''; //If block loads from another block. Not the previous one.
                        var block_family = '';
                        var sub_label = null;


                        if (curr_block.substr(0, 5) == 'trace') {
                            block_type = 'Trace';
                            image_name = svg_other
                        } else if (curr_block.substr(0, 3) == 'rem') {
                            block_type = 'Remark';
                            image_name = svg_comment
                        } else if (curr_block.substr(0, 2) == '//') {
                            block_type = 'Comment';
                            image_name = svg_comment
                        } else if (curr_block.substr(0, 2) == '/*' && curr_block.includes('*/')) {
                            block_type = 'Comment';
                            image_name = svg_comment
                        } else if (curr_block.substr(0, 3) == 'set' || curr_block.substr(0, 3) == 'let') {
                            block_type = 'Variable';
                            image_name = svg_variable
                        } else if (curr_block.includes('load') && curr_block.includes('lib') && curr_block.includes('qvd')) {
                            block_type = 'Load QVD';
                            sub_label = findTableName(curr_block_case_sen);
                            image_name = svg_load_qvd
                        } else if (curr_block.includes('select') && curr_block.includes('from')) {
                            block_type = 'Load SQL';
                            sub_label = findTableName(curr_block_case_sen);
                            image_name = svg_load_sql
                        } else if (curr_block.includes('load') && curr_block.includes('resident')) {
                            block_type = 'Load Resident';
                            sub_label = findTableName(curr_block_case_sen);
                            image_name = svg_load_resident
                        } else if (curr_block.includes('load') && curr_block.includes('ooxml')) {
                            block_type = 'Load Excel';
                            sub_label = findTableName(curr_block_case_sen);
                            image_name = svg_load_xls
                        } else if (curr_block.includes('load') && curr_block.includes('inline')) {
                            block_type = 'Load Inline';
                            sub_label = findTableName(curr_block_case_sen);
                            image_name = svg_load_inline
                        } else if (curr_block.includes('load') && curr_block.includes('from') && curr_block.includes('csv')) {
                            block_type = 'Load CSV';
                            sub_label = findTableName(curr_block_case_sen);
                            image_name = svg_load_xls
                        } else if (curr_block.includes('load') && curr_block.includes('from') && curr_block.includes('txt')) {
                            block_type = 'Load TXT';
                            sub_label = findTableName(curr_block_case_sen);
                            image_name = svg_load_txt
                        } else if (curr_block.substr(0, 8) == 'do while') {
                            block_type = 'Do While';
                            block_family = 'multi';
                            image_name = svg_loop_start
                        } else if (curr_block.substr(0, 4) == 'loop') {
                            block_type = 'Do While';
                            block_family = 'multi';
                            image_name = svg_loop_end
                        } else if (curr_block.substr(0, 8) == 'for each') {
                            block_type = 'For Each';
                            block_family = 'multi';
                            image_name = svg_loop_start
                        } else if (curr_block.includes('next')) {
                            block_type = 'Next';
                            block_family = 'multi';
                            image_name = svg_loop_end
                        } else if (curr_block.substr(0, 4) == 'for ') {
                            block_type = 'For';
                            block_family = 'multi';
                            image_name = svg_loop_start
                        } else if (curr_block.includes('elseif')) {
                            block_type = 'Else If';
                            block_family = 'multi';
                            image_name = svg_decision_else
                        } else if (curr_block.includes('if ') && curr_block.includes('then')) {
                            block_type = 'If';
                            block_family = 'multi';
                            image_name = svg_decision
                        } else if (curr_block.includes('else')) {
                            block_type = 'Else';
                            block_family = 'multi';
                            image_name = svg_decision_else
                        } else if (curr_block.includes('endif')) {
                            block_type = 'End of If';
                            block_family = 'multi';
                            image_name = svg_decision_end
                        } else if (curr_block.substr(0, 8) == 'qualify ') {
                            block_type = 'Qualify';
                            image_name = svg_qualify
                        } else if (curr_block.substr(0, 10) == 'unqualify ') {
                            block_type = 'Unqualify';
                            image_name = svg_unqualify
                        } else if (curr_block.includes('lib ') && curr_block.includes('connect ') && curr_block.includes('to ')) {
                            block_type = 'Connection';
                            image_name = svg_connection
                        } else if (curr_block.includes('drop') && curr_block.includes('table')) {
                            block_type = 'Drop';
                            sub_label = curr_block_case_sen.match(/(?<=\btable)(.*)(?=;)/gi);
                            image_name = svg_trash_bin
                        } else if (curr_block.includes('store') && curr_block.includes('into')) {
                            block_type = 'Store';
                            sub_label = curr_block_case_sen.match(/(?<=\bstore )(.*)(?=\binto)/gi);
                            image_name = svg_store
                        } else if (curr_block.substr(0, 11) == 'exit script') {
                            block_type = 'Exit Script';
                            image_name = svg_exit
                        } else if (curr_block.includes('do ') && curr_block.includes('loop')) {
                            block_type = 'Do Loop';
                            block_family = 'multi';
                            image_name = svg_loop_start
                        } else if (curr_block.substr(0, 3) == 'sub') {
                            block_type = 'Sub Function';
                            image_name = svg_sub
                        } else if (curr_block.substr(0, 6) == 'endsub') {
                            block_type = 'End Sub';
                            image_name = svg_end_sub
                        } else if (curr_block.match(/\bEND SWITCH\b/gi)) {
                            block_type = 'End Switch';
                            block_family = 'multi';
                            image_name = svg_end_switch
                        } else if (curr_block.match(/\bSWITCH\b\s+\w+/ig)) {
                            block_type = 'Switch';
                            block_family = 'multi';
                            image_name = svg_switch
                        } else if (curr_block.match(/\bDEFAULT\b/i)) {
                            block_type = 'Case';
                            sub_label = 'Default';
                            block_family = 'multi';
                            image_name = svg_case
                        } else if (curr_block.match(/\bCASE\b\s+\S+/i)) {
                            block_type = 'Case';
                            sub_label = curr_block_case_sen.match(/(\bCASE\b\s+\S+)/i)[0];
                            block_family = 'multi';
                            image_name = svg_case
                        } else if (curr_block.match(/\bLOAD\b/gi)) {
                            block_type = 'Preceding Load';
                            sub_label = findTableName(curr_block_case_sen);
                            image_name = svg_load_preceding
                        } else {

                            block_type = 'Other';
                            image_name = svg_other
                        }



                        var json = {
                            "block_type": block_type,
                            "block_family": block_family,
                            "block": merged_blocks[i][t]
                        };

                        //block_details[i].push(json)
                        merged_blocks[i][t].BlockType = block_type;
                        merged_blocks[i][t].TableName = sub_label;
                        merged_blocks[i][t].Image = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(image_name); // image_url+image_name;

                    } //end of block loop

                } //End of section loop
                console.log(merged_blocks);



                //**************End of Block Type Detection**************				




                //**************Start of Visualization**************				

                var nodes = [];
                var edges = [];

                var section_loc = [];

                var x_min = 0,
                    y_min = 0,
                    x_max = 0,
                    y_max = 0;


                for (i = 0; i < merged_blocks.length; i++) {

                    section_loc[i] = ({
                        "x_min": 0,
                        "x_max": 0
                    })

                    if (merged_blocks[i].length > 1) {
                        x_min = merged_blocks[i][1].x_order * 200 - 100;
                        x_max = merged_blocks[i][merged_blocks[i].length - 1].x_order * 200 + 100;

                        section_loc[i] = ({
                            "x_min": x_min,
                            "x_max": x_max
                        })

                        for (t = 1; t < merged_blocks[i].length; t++) {

                            if (y_min > merged_blocks[i][t].y_order * 200) {
                                y_min = merged_blocks[i][t].y_order * 200;
                            }

                            if (y_max < merged_blocks[i][t].y_order * 200) {
                                y_max = merged_blocks[i][t].y_order * 200;
                            }


                            nodes.push({
                                id: i + '_' + merged_blocks[i][t].RowID,
                                shape: 'image',
                                image: merged_blocks[i][t].Image,
                                font: {
                                    multi: true,
                                    ital: {
                                        color: '#975587'
                                    }
                                },
                                label: CreateLabel(merged_blocks[i][t]),
                                title: FormatScript(merged_blocks[i][t].Script, merged_blocks[i][t].BlockType),
                                widthMin: 30,
                                widthMax: 30,
                                x: merged_blocks[i][t].x_order * 200,
                                y: merged_blocks[i][t].y_order * 200,
                            });


                            //Add Concatenate Node
                            if (merged_blocks[i][t].Script.match(/\bconcatenate\b/gi) != null && merged_blocks[i][t].BlockType != 'Comment') {


                                var left_node = '';
                                var right_node = merged_blocks[i][t].RowID;
                                var temp_script = merged_blocks[i][t].Script;

                                //find table name in paranthases which is between concatenate and load statements
                                temp_script = temp_script.match(/(?<=\bconcatenate)(.*)(?=load)/gmis).toString();

                                //Extract table name which is in between ()
                                temp_script = temp_script.match(/\((.*?)\)/);

                                if (temp_script != null) {

                                    var block_to_search = merged_blocks;

                                    block_to_search.forEach(function(el, index1) {

                                        el.forEach(function(el2, index2) {

                                            if (el2.TableName == temp_script[1] && el2.BlockType.includes('Load')) {
                                                left_node = index1 + '_' + el2.RowID;

                                            }

                                        });
                                    });
                                } else { //Find nearest load
                                    var temp_i = i;
                                    var temp_t = t - 1;
                                    while (merged_blocks[temp_i][temp_t].BlockType.includes('Load') == false) {

                                        if (temp_t == 0 && temp_i > 0) {
                                            temp_i = temp_i - 1;
                                            temp_t = merged_blocks[temp_i].length - 1;
                                        } else {
                                            temp_t--;
                                        }

                                        if (temp_i == 0 && temp_t == 0) {
                                            break;

                                        }
                                    }

                                    left_node = temp_i + '_' + merged_blocks[temp_i][temp_t].RowID;
                                }



                                var concat_node_id = i + '_' + right_node + '_' + merged_blocks[i][t].ParentID;
                                nodes.push({
                                    id: concat_node_id,
                                    shape: 'image',
                                    image: EncodeSVG(svg_concatenate),
                                    label: 'Concatenate',
                                    title: 'Concatenate',
                                    widthMin: 30,
                                    widthMax: 30,
                                    x: (merged_blocks[i][t].x_order - 0.5) * 200,
                                    y: (merged_blocks[i][t].y_order + 0.5) * 200,
                                });

                                edges.push({
                                    from: concat_node_id,
                                    to: i + '_' + right_node,
                                    dashes: true
                                });

                                edges.push({
                                    from: concat_node_id,
                                    to: left_node,
                                    dashes: true

                                });
                            }

                            if (merged_blocks[i][t].ParentID > -1) {
                                edges.push({
                                    from: i + '_' + merged_blocks[i][t].ParentID,
                                    to: i + '_' + merged_blocks[i][t].RowID,
                                    arrows: "to"
                                });

                            }

                            //Add additional Node for End If
                            if (merged_blocks[i][t].BlockType == 'End of If' || merged_blocks[i][t].BlockType == 'End Switch') {

                                var parent_array = merged_blocks[i][t].LoopParentID;

                                for (z = 0; z < parent_array.length; z++) {

                                    edges.push({
                                        to: i + '_' + merged_blocks[i][t].RowID,
                                        from: i + '_' + parent_array[z],
                                        arrows: "to"
                                    });
                                }

                            } else if (merged_blocks[i][t].LoopParentID != '') {
                                edges.push({
                                    from: i + '_' + merged_blocks[i][t].RowID,
                                    to: i + '_' + merged_blocks[i][t].LoopParentID,
                                    arrows: "to"
                                });

                            }


                        } //end of for
                    }


                } //end of for
                console.log(merged_blocks);
                console.log(nodes);
                console.log(edges);



                var container = document.createElement('div');
                container.setAttribute("class", "mynetwork");


                var data = {
                    nodes: nodes,
                    edges: edges
                };


                var options = {
                    physics: false,
                    interaction: {
                        tooltipDelay: 3600000 // Set a really big delay - one hour
                    },

                    edges: {
                        smooth: false,
                        color: {
                            color: "#7A89C2"
                        },
                        width: 3
                    },

                    nodes: {
                        shape: "dot",
                        size: 30,
                        color: {
                            border: '#2B7CE9',
                            background: '#97C2FC',

                        },
                        borderWidth: 2
                    }
                };


                var network = new vis.Network(container, data, options);


                //Draw Section Borders
                network.on("beforeDrawing", function(ctx) {
                    ctx.strokeStyle = "#7A7A7A";
                    ctx.beginPath();

                    ctx.lineWidth = "2";
                    ctx.font = "30px Arial";
                    ctx.fillStyle = "#7A7A7A";


                    for (i = 0; i < section_loc.length; i++) {
                        ctx.rect(
                            section_loc[i].x_min,
                            y_min,
                            section_loc[i].x_max - section_loc[i].x_min,
                            50
                        );
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill()
                    }
                    ctx.fillStyle = "white";
                    for (i = 0; i < section_loc.length; i++) {



                        ctx.rect(
                            section_loc[i].x_min,
                            y_min,
                            section_loc[i].x_max - section_loc[i].x_min,
                            y_max - y_min + 200
                        );
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fillText(merged_blocks[i][0].Script, section_loc[i].x_min + 10, y_min + 40);
                    }




                });


                var over_popup = document.createElement('div');
                over_popup.setAttribute("id", "overlay");
                over_popup.setAttribute("onclick", "$('#overlay').fadeOut(300)")

                over_popup.innerHTML = ' <div id="popup"> </div>      </div>';

                $element.append($(container));
                $element.append($(over_popup));

                //**************End of Visualization**************		


                // Node on Click Function to open popup	
                network.on("click", function(params) {

                    var node_id = this.getNodeAt(params.pointer.DOM);
                    var node_id2 = node_id;
                    var arr_dim_size = node_id2.split('_').length;

                    //arr_dim_size==2 means node is not concatenate node
                    if (node_id != undefined && arr_dim_size == 2) {
                        params.event = "[original event]";
                        $('#overlay').fadeIn(300);
                        var element = document.getElementById('popup');
                        element.innerHTML = FormatScript(FindScript(merged_blocks, node_id));
                    }

                });

            })
        }
    };

});