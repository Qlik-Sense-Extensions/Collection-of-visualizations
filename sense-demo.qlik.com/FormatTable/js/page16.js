function mergeCells (x1, y1, x2, y2) {
	var cell, col, row;
	for(var i = x1; i <=x2; i++) {
		for(var j = y1; j <=y2; j++) {
			if((x1 != i) || (y1 != j)) {
				cell = 'cell'+i+'_'+j;
				console.log(cell);
				$('#'+cell).remove()
			} else {
				basecell = 'cell'+i+'_'+j;				
			}
		}
	}
	row = x2 - x1 + 1;
	if(row > 1) $('#'+basecell).attr('rowspan',row);
	col = y2 - y1 + 1;
	if(col > 1) $('#'+basecell).attr('colspan',col);
}

mergeCells(0, 0, 0, 21);
mergeCells(1, 0, 1, 2);
mergeCells(2, 0, 2, 2);
mergeCells(1, 3, 1, 7);
mergeCells(1, 9, 1, 13);
mergeCells(1, 15, 1, 19);


$('#head0').attr('style','');

$('#head1').attr('style','');

$('#head2').attr('style','');

$('#head3').attr('style','');

$('#head4').attr('style','');

$('#head5').attr('style','');

$('#head6').attr('style','');

$('#head7').attr('style','');

$('#head8').attr('style','');

$('#head9').attr('style','');

$('#head10').attr('style','');

$('#head11').attr('style','');

$('#head12').attr('style','');

$('#head13').attr('style','');

$('#head14').attr('style','');

$('#head15').attr('style','');

$('#head16').attr('style','');

$('#head17').attr('style','');

$('#head18').attr('style','');

$('#head19').attr('style','');

$('#head20').attr('style','');

$('#cell0_0').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_1').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_2').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_3').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_4').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_5').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_6').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_7').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_8').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_9').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_10').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_11').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_12').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_13').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_14').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_15').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_16').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_17').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_18').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_19').attr('style','background-color: rgb(0, 0, 128);');

$('#cell0_20').attr('style','background-color: rgb(0, 0, 128);');

$('#cell1_0').attr('style','background-color: rgb(0, 0, 128);');

$('#cell1_1').attr('style','background-color: rgb(0, 0, 128);');

$('#cell1_2').attr('style','background-color: rgb(0, 0, 128);');

$('#cell1_3').attr('style','font-weight: bold; text-align: center; background-color: rgb(166, 202, 240);');

$('#cell1_4').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_5').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_6').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_7').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_8').attr('style','background-color: rgb(0, 0, 128);');

$('#cell1_9').attr('style','font-weight: bold; text-align: center; background-color: rgb(166, 202, 240);');

$('#cell1_10').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_11').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_12').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_13').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_14').attr('style','background-color: rgb(0, 0, 128);');

$('#cell1_15').attr('style','font-weight: bold; text-align: center; background-color: rgb(166, 202, 240);');

$('#cell1_16').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_17').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_18').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_19').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell1_20').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell2_0').attr('style','background-color: rgb(0, 0, 128);');

$('#cell2_1').attr('style','background-color: rgb(0, 0, 128);');

$('#cell2_2').attr('style','background-color: rgb(0, 0, 128);');

$('#cell2_3').attr('style','color: rgb(255, 255, 255); font-weight: bold; background-color: rgb(0, 0, 128);');

$('#cell2_4').attr('style','color: rgb(255, 255, 255); font-weight: bold; background-color: rgb(0, 0, 128);');

$('#cell2_5').attr('style','color: rgb(255, 255, 255); font-weight: bold; background-color: rgb(0, 0, 128);');

$('#cell2_6').attr('style','color: rgb(255, 255, 255); font-weight: bold; background-color: rgb(0, 0, 128);');

$('#cell2_7').attr('style','color: rgb(255, 255, 255); font-weight: bold; background-color: rgb(0, 0, 128);');

$('#cell2_8').attr('style','background-color: rgb(0, 0, 128);');

$('#cell2_9').attr('style','color: rgb(255, 255, 255); font-weight: bold; background-color: rgb(0, 0, 128);');

$('#cell2_10').attr('style','color: rgb(255, 255, 255); font-weight: bold; background-color: rgb(0, 0, 128);');

$('#cell2_11').attr('style','color: rgb(255, 255, 255); font-weight: bold; background-color: rgb(0, 0, 128);');

$('#cell2_12').attr('style','color: rgb(255, 255, 255); font-weight: bold; background-color: rgb(0, 0, 128);');

$('#cell2_13').attr('style','color: rgb(255, 255, 255); font-weight: bold; background-color: rgb(0, 0, 128);');

$('#cell2_14').attr('style','background-color: rgb(0, 0, 128);');

$('#cell2_15').attr('style','font-weight: bold; color: rgb(255, 255, 255); background-color: rgb(0, 0, 128);');

$('#cell2_16').attr('style','font-weight: bold; color: rgb(255, 255, 255); background-color: rgb(0, 0, 128);');

$('#cell2_17').attr('style','font-weight: bold; color: rgb(255, 255, 255); background-color: rgb(0, 0, 128);');

$('#cell2_18').attr('style','font-weight: bold; color: rgb(255, 255, 255); background-color: rgb(0, 0, 128);');

$('#cell2_19').attr('style','font-weight: bold; color: rgb(255, 255, 255); background-color: rgb(0, 0, 128);');

$('#cell2_20').attr('style','font-weight: bold; color: rgb(255, 255, 255); background-color: rgb(0, 0, 128);');

$('#cell3_0').attr('style','text-align: left; font-weight: bold;');

$('#cell3_1').attr('style','');

$('#cell3_2').attr('style','');

$('#cell3_3').attr('style','');

$('#cell3_4').attr('style','');

$('#cell3_5').attr('style','');

$('#cell3_6').attr('style','');

$('#cell3_7').attr('style','');

$('#cell3_8').attr('style','');

$('#cell3_9').attr('style','');

$('#cell3_10').attr('style','');

$('#cell3_11').attr('style','');

$('#cell3_12').attr('style','');

$('#cell3_13').attr('style','');

$('#cell3_14').attr('style','');

$('#cell3_15').attr('style','');

$('#cell3_16').attr('style','');

$('#cell3_17').attr('style','');

$('#cell3_18').attr('style','');

$('#cell3_19').attr('style','');

$('#cell3_20').attr('style','');

$('#cell4_0').attr('style','text-align: right;');

$('#cell4_1').attr('style','');

$('#cell4_2').attr('style','');

$('#cell4_3').attr('style','');

$('#cell4_4').attr('style','');

$('#cell4_5').attr('style','');

$('#cell4_6').attr('style','');

$('#cell4_7').attr('style','');

$('#cell4_8').attr('style','');

$('#cell4_9').attr('style','');

$('#cell4_10').attr('style','');

$('#cell4_11').attr('style','');

$('#cell4_12').attr('style','');

$('#cell4_13').attr('style','');

$('#cell4_14').attr('style','');

$('#cell4_15').attr('style','');

$('#cell4_16').attr('style','');

$('#cell4_17').attr('style','');

$('#cell4_18').attr('style','');

$('#cell4_19').attr('style','');

$('#cell4_20').attr('style','');

$('#cell5_0').attr('style','text-align: right;');

$('#cell5_1').attr('style','');

$('#cell5_2').attr('style','');

$('#cell5_3').attr('style','');

$('#cell5_4').attr('style','');

$('#cell5_5').attr('style','');

$('#cell5_6').attr('style','');

$('#cell5_7').attr('style','');

$('#cell5_8').attr('style','');

$('#cell5_9').attr('style','');

$('#cell5_10').attr('style','');

$('#cell5_11').attr('style','');

$('#cell5_12').attr('style','');

$('#cell5_13').attr('style','');

$('#cell5_14').attr('style','');

$('#cell5_15').attr('style','');

$('#cell5_16').attr('style','');

$('#cell5_17').attr('style','');

$('#cell5_18').attr('style','');

$('#cell5_19').attr('style','');

$('#cell5_20').attr('style','');

$('#cell6_0').attr('style','text-align: right;');

$('#cell6_1').attr('style','');

$('#cell6_2').attr('style','');

$('#cell6_3').attr('style','');

$('#cell6_4').attr('style','');

$('#cell6_5').attr('style','');

$('#cell6_6').attr('style','');

$('#cell6_7').attr('style','');

$('#cell6_8').attr('style','');

$('#cell6_9').attr('style','');

$('#cell6_10').attr('style','');

$('#cell6_11').attr('style','');

$('#cell6_12').attr('style','');

$('#cell6_13').attr('style','');

$('#cell6_14').attr('style','');

$('#cell6_15').attr('style','');

$('#cell6_16').attr('style','');

$('#cell6_17').attr('style','');

$('#cell6_18').attr('style','');

$('#cell6_19').attr('style','');

$('#cell6_20').attr('style','');

$('#cell7_0').attr('style','text-align: right;');

$('#cell7_1').attr('style','');

$('#cell7_2').attr('style','');

$('#cell7_3').attr('style','');

$('#cell7_4').attr('style','');

$('#cell7_5').attr('style','');

$('#cell7_6').attr('style','');

$('#cell7_7').attr('style','');

$('#cell7_8').attr('style','');

$('#cell7_9').attr('style','');

$('#cell7_10').attr('style','');

$('#cell7_11').attr('style','');

$('#cell7_12').attr('style','');

$('#cell7_13').attr('style','');

$('#cell7_14').attr('style','');

$('#cell7_15').attr('style','');

$('#cell7_16').attr('style','');

$('#cell7_17').attr('style','');

$('#cell7_18').attr('style','');

$('#cell7_19').attr('style','');

$('#cell7_20').attr('style','');

$('#cell8_0').attr('style','text-align: right;');

$('#cell8_1').attr('style','');

$('#cell8_2').attr('style','');

$('#cell8_3').attr('style','text-decoration: underline;');

$('#cell8_4').attr('style','text-decoration: underline;');

$('#cell8_5').attr('style','text-decoration: underline;');

$('#cell8_6').attr('style','text-decoration: underline;');

$('#cell8_7').attr('style','text-decoration: underline;');

$('#cell8_8').attr('style','text-decoration: underline;');

$('#cell8_9').attr('style','text-decoration: underline;');

$('#cell8_10').attr('style','text-decoration: underline;');

$('#cell8_11').attr('style','text-decoration: underline;');

$('#cell8_12').attr('style','text-decoration: underline;');

$('#cell8_13').attr('style','text-decoration: underline;');

$('#cell8_14').attr('style','text-decoration: underline;');

$('#cell8_15').attr('style','text-decoration: underline;');

$('#cell8_16').attr('style','text-decoration: underline;');

$('#cell8_17').attr('style','text-decoration: underline;');

$('#cell8_18').attr('style','text-decoration: underline;');

$('#cell8_19').attr('style','text-decoration: underline;');

$('#cell8_20').attr('style','text-decoration: underline;');

$('#cell9_0').attr('style','text-align: right;');

$('#cell9_1').attr('style','');

$('#cell9_2').attr('style','');

$('#cell9_3').attr('style','');

$('#cell9_4').attr('style','');

$('#cell9_5').attr('style','');

$('#cell9_6').attr('style','');

$('#cell9_7').attr('style','');

$('#cell9_8').attr('style','');

$('#cell9_9').attr('style','');

$('#cell9_10').attr('style','');

$('#cell9_11').attr('style','');

$('#cell9_12').attr('style','');

$('#cell9_13').attr('style','');

$('#cell9_14').attr('style','');

$('#cell9_15').attr('style','');

$('#cell9_16').attr('style','');

$('#cell9_17').attr('style','');

$('#cell9_18').attr('style','');

$('#cell9_19').attr('style','');

$('#cell9_20').attr('style','');

$('#cell10_0').attr('style','text-align: right;');

$('#cell10_1').attr('style','');

$('#cell10_2').attr('style','');

$('#cell10_3').attr('style','');

$('#cell10_4').attr('style','');

$('#cell10_5').attr('style','');

$('#cell10_6').attr('style','');

$('#cell10_7').attr('style','');

$('#cell10_8').attr('style','');

$('#cell10_9').attr('style','');

$('#cell10_10').attr('style','');

$('#cell10_11').attr('style','');

$('#cell10_12').attr('style','');

$('#cell10_13').attr('style','');

$('#cell10_14').attr('style','');

$('#cell10_15').attr('style','');

$('#cell10_16').attr('style','');

$('#cell10_17').attr('style','');

$('#cell10_18').attr('style','');

$('#cell10_19').attr('style','');

$('#cell10_20').attr('style','');

$('#cell11_0').attr('style','text-align: right;');

$('#cell11_1').attr('style','');

$('#cell11_2').attr('style','');

$('#cell11_3').attr('style','');

$('#cell11_4').attr('style','');

$('#cell11_5').attr('style','');

$('#cell11_6').attr('style','');

$('#cell11_7').attr('style','');

$('#cell11_8').attr('style','');

$('#cell11_9').attr('style','');

$('#cell11_10').attr('style','');

$('#cell11_11').attr('style','');

$('#cell11_12').attr('style','');

$('#cell11_13').attr('style','');

$('#cell11_14').attr('style','');

$('#cell11_15').attr('style','');

$('#cell11_16').attr('style','');

$('#cell11_17').attr('style','');

$('#cell11_18').attr('style','');

$('#cell11_19').attr('style','');

$('#cell11_20').attr('style','');

$('#cell12_0').attr('style','text-align: right;');

$('#cell12_1').attr('style','');

$('#cell12_2').attr('style','');

$('#cell12_3').attr('style','');

$('#cell12_4').attr('style','');

$('#cell12_5').attr('style','');

$('#cell12_6').attr('style','');

$('#cell12_7').attr('style','');

$('#cell12_8').attr('style','');

$('#cell12_9').attr('style','');

$('#cell12_10').attr('style','');

$('#cell12_11').attr('style','');

$('#cell12_12').attr('style','');

$('#cell12_13').attr('style','');

$('#cell12_14').attr('style','');

$('#cell12_15').attr('style','');

$('#cell12_16').attr('style','');

$('#cell12_17').attr('style','');

$('#cell12_18').attr('style','');

$('#cell12_19').attr('style','');

$('#cell12_20').attr('style','');

$('#cell13_0').attr('style','text-align: right;');

$('#cell13_1').attr('style','');

$('#cell13_2').attr('style','');

$('#cell13_3').attr('style','');

$('#cell13_4').attr('style','');

$('#cell13_5').attr('style','');

$('#cell13_6').attr('style','');

$('#cell13_7').attr('style','');

$('#cell13_8').attr('style','');

$('#cell13_9').attr('style','');

$('#cell13_10').attr('style','');

$('#cell13_11').attr('style','');

$('#cell13_12').attr('style','');

$('#cell13_13').attr('style','');

$('#cell13_14').attr('style','');

$('#cell13_15').attr('style','');

$('#cell13_16').attr('style','');

$('#cell13_17').attr('style','');

$('#cell13_18').attr('style','');

$('#cell13_19').attr('style','');

$('#cell13_20').attr('style','');

$('#cell14_0').attr('style','text-align: right;');

$('#cell14_1').attr('style','');

$('#cell14_2').attr('style','');

$('#cell14_3').attr('style','');

$('#cell14_4').attr('style','');

$('#cell14_5').attr('style','');

$('#cell14_6').attr('style','');

$('#cell14_7').attr('style','');

$('#cell14_8').attr('style','');

$('#cell14_9').attr('style','');

$('#cell14_10').attr('style','');

$('#cell14_11').attr('style','');

$('#cell14_12').attr('style','');

$('#cell14_13').attr('style','');

$('#cell14_14').attr('style','');

$('#cell14_15').attr('style','');

$('#cell14_16').attr('style','');

$('#cell14_17').attr('style','');

$('#cell14_18').attr('style','');

$('#cell14_19').attr('style','');

$('#cell14_20').attr('style','');

$('#cell15_0').attr('style','font-weight: bold;');

$('#cell15_1').attr('style','');

$('#cell15_2').attr('style','');

$('#cell15_3').attr('style','text-decoration: underline;');

$('#cell15_4').attr('style','text-decoration: underline;');

$('#cell15_5').attr('style','text-decoration: underline;');

$('#cell15_6').attr('style','text-decoration: underline;');

$('#cell15_7').attr('style','text-decoration: underline;');

$('#cell15_8').attr('style','text-decoration: underline;');

$('#cell15_9').attr('style','text-decoration: underline;');

$('#cell15_10').attr('style','text-decoration: underline;');

$('#cell15_11').attr('style','text-decoration: underline;');

$('#cell15_12').attr('style','text-decoration: underline;');

$('#cell15_13').attr('style','text-decoration: underline;');

$('#cell15_14').attr('style','text-decoration: underline;');

$('#cell15_15').attr('style','text-decoration: underline;');

$('#cell15_16').attr('style','text-decoration: underline;');

$('#cell15_17').attr('style','text-decoration: underline;');

$('#cell15_18').attr('style','text-decoration: underline;');

$('#cell15_19').attr('style','text-decoration: underline;');

$('#cell15_20').attr('style','text-decoration: underline;');

$('#cell16_0').attr('style','');

$('#cell16_1').attr('style','');

$('#cell16_2').attr('style','');

$('#cell16_3').attr('style','');

$('#cell16_4').attr('style','');

$('#cell16_5').attr('style','');

$('#cell16_6').attr('style','');

$('#cell16_7').attr('style','');

$('#cell16_8').attr('style','');

$('#cell16_9').attr('style','');

$('#cell16_10').attr('style','');

$('#cell16_11').attr('style','');

$('#cell16_12').attr('style','');

$('#cell16_13').attr('style','');

$('#cell16_14').attr('style','');

$('#cell16_15').attr('style','');

$('#cell16_16').attr('style','');

$('#cell16_17').attr('style','');

$('#cell16_18').attr('style','');

$('#cell16_19').attr('style','');

$('#cell16_20').attr('style','');

$('#cell17_0').attr('style','font-weight: bold;');

$('#cell17_1').attr('style','');

$('#cell17_2').attr('style','');

$('#cell17_3').attr('style','');

$('#cell17_4').attr('style','');

$('#cell17_5').attr('style','');

$('#cell17_6').attr('style','');

$('#cell17_7').attr('style','');

$('#cell17_8').attr('style','');

$('#cell17_9').attr('style','');

$('#cell17_10').attr('style','');

$('#cell17_11').attr('style','');

$('#cell17_12').attr('style','');

$('#cell17_13').attr('style','');

$('#cell17_14').attr('style','');

$('#cell17_15').attr('style','');

$('#cell17_16').attr('style','');

$('#cell17_17').attr('style','');

$('#cell17_18').attr('style','');

$('#cell17_19').attr('style','');

$('#cell17_20').attr('style','');

$('#cell18_0').attr('style','text-align: right;');

$('#cell18_1').attr('style','');

$('#cell18_2').attr('style','');

$('#cell18_3').attr('style','');

$('#cell18_4').attr('style','');

$('#cell18_5').attr('style','');

$('#cell18_6').attr('style','');

$('#cell18_7').attr('style','');

$('#cell18_8').attr('style','');

$('#cell18_9').attr('style','');

$('#cell18_10').attr('style','');

$('#cell18_11').attr('style','');

$('#cell18_12').attr('style','');

$('#cell18_13').attr('style','');

$('#cell18_14').attr('style','');

$('#cell18_15').attr('style','');

$('#cell18_16').attr('style','');

$('#cell18_17').attr('style','');

$('#cell18_18').attr('style','');

$('#cell18_19').attr('style','');

$('#cell18_20').attr('style','');

$('#cell19_0').attr('style','text-align: right;');

$('#cell19_1').attr('style','');

$('#cell19_2').attr('style','');

$('#cell19_3').attr('style','');

$('#cell19_4').attr('style','');

$('#cell19_5').attr('style','');

$('#cell19_6').attr('style','');

$('#cell19_7').attr('style','');

$('#cell19_8').attr('style','');

$('#cell19_9').attr('style','');

$('#cell19_10').attr('style','');

$('#cell19_11').attr('style','');

$('#cell19_12').attr('style','');

$('#cell19_13').attr('style','');

$('#cell19_14').attr('style','');

$('#cell19_15').attr('style','');

$('#cell19_16').attr('style','');

$('#cell19_17').attr('style','');

$('#cell19_18').attr('style','');

$('#cell19_19').attr('style','');

$('#cell19_20').attr('style','');

$('#cell20_0').attr('style','text-align: right;');

$('#cell20_1').attr('style','');

$('#cell20_2').attr('style','');

$('#cell20_3').attr('style','');

$('#cell20_4').attr('style','');

$('#cell20_5').attr('style','');

$('#cell20_6').attr('style','');

$('#cell20_7').attr('style','');

$('#cell20_8').attr('style','');

$('#cell20_9').attr('style','');

$('#cell20_10').attr('style','');

$('#cell20_11').attr('style','');

$('#cell20_12').attr('style','');

$('#cell20_13').attr('style','');

$('#cell20_14').attr('style','');

$('#cell20_15').attr('style','');

$('#cell20_16').attr('style','');

$('#cell20_17').attr('style','');

$('#cell20_18').attr('style','');

$('#cell20_19').attr('style','');

$('#cell20_20').attr('style','');

$('#cell21_0').attr('style','text-align: right;');

$('#cell21_1').attr('style','');

$('#cell21_2').attr('style','');

$('#cell21_3').attr('style','');

$('#cell21_4').attr('style','');

$('#cell21_5').attr('style','');

$('#cell21_6').attr('style','');

$('#cell21_7').attr('style','');

$('#cell21_8').attr('style','');

$('#cell21_9').attr('style','');

$('#cell21_10').attr('style','');

$('#cell21_11').attr('style','');

$('#cell21_12').attr('style','');

$('#cell21_13').attr('style','');

$('#cell21_14').attr('style','');

$('#cell21_15').attr('style','');

$('#cell21_16').attr('style','');

$('#cell21_17').attr('style','');

$('#cell21_18').attr('style','');

$('#cell21_19').attr('style','');

$('#cell21_20').attr('style','');

$('#cell22_0').attr('style','text-align: right;');

$('#cell22_1').attr('style','');

$('#cell22_2').attr('style','');

$('#cell22_3').attr('style','');

$('#cell22_4').attr('style','');

$('#cell22_5').attr('style','');

$('#cell22_6').attr('style','');

$('#cell22_7').attr('style','');

$('#cell22_8').attr('style','');

$('#cell22_9').attr('style','');

$('#cell22_10').attr('style','');

$('#cell22_11').attr('style','');

$('#cell22_12').attr('style','');

$('#cell22_13').attr('style','');

$('#cell22_14').attr('style','');

$('#cell22_15').attr('style','');

$('#cell22_16').attr('style','');

$('#cell22_17').attr('style','');

$('#cell22_18').attr('style','');

$('#cell22_19').attr('style','');

$('#cell22_20').attr('style','');

$('#cell23_0').attr('style','text-align: right;');

$('#cell23_1').attr('style','');

$('#cell23_2').attr('style','');

$('#cell23_3').attr('style','');

$('#cell23_4').attr('style','');

$('#cell23_5').attr('style','');

$('#cell23_6').attr('style','');

$('#cell23_7').attr('style','');

$('#cell23_8').attr('style','');

$('#cell23_9').attr('style','');

$('#cell23_10').attr('style','');

$('#cell23_11').attr('style','');

$('#cell23_12').attr('style','');

$('#cell23_13').attr('style','');

$('#cell23_14').attr('style','');

$('#cell23_15').attr('style','');

$('#cell23_16').attr('style','');

$('#cell23_17').attr('style','');

$('#cell23_18').attr('style','');

$('#cell23_19').attr('style','');

$('#cell23_20').attr('style','');

$('#cell24_0').attr('style','text-align: right;');

$('#cell24_1').attr('style','');

$('#cell24_2').attr('style','');

$('#cell24_3').attr('style','');

$('#cell24_4').attr('style','');

$('#cell24_5').attr('style','');

$('#cell24_6').attr('style','');

$('#cell24_7').attr('style','');

$('#cell24_8').attr('style','');

$('#cell24_9').attr('style','');

$('#cell24_10').attr('style','');

$('#cell24_11').attr('style','');

$('#cell24_12').attr('style','');

$('#cell24_13').attr('style','');

$('#cell24_14').attr('style','');

$('#cell24_15').attr('style','');

$('#cell24_16').attr('style','');

$('#cell24_17').attr('style','');

$('#cell24_18').attr('style','');

$('#cell24_19').attr('style','');

$('#cell24_20').attr('style','');

$('#cell25_0').attr('style','text-align: right;');

$('#cell25_1').attr('style','');

$('#cell25_2').attr('style','');

$('#cell25_3').attr('style','');

$('#cell25_4').attr('style','');

$('#cell25_5').attr('style','');

$('#cell25_6').attr('style','');

$('#cell25_7').attr('style','');

$('#cell25_8').attr('style','');

$('#cell25_9').attr('style','');

$('#cell25_10').attr('style','');

$('#cell25_11').attr('style','');

$('#cell25_12').attr('style','');

$('#cell25_13').attr('style','');

$('#cell25_14').attr('style','');

$('#cell25_15').attr('style','');

$('#cell25_16').attr('style','');

$('#cell25_17').attr('style','');

$('#cell25_18').attr('style','');

$('#cell25_19').attr('style','');

$('#cell25_20').attr('style','');

$('#cell26_0').attr('style','text-align: right;');

$('#cell26_1').attr('style','');

$('#cell26_2').attr('style','');

$('#cell26_3').attr('style','');

$('#cell26_4').attr('style','');

$('#cell26_5').attr('style','');

$('#cell26_6').attr('style','');

$('#cell26_7').attr('style','');

$('#cell26_8').attr('style','');

$('#cell26_9').attr('style','');

$('#cell26_10').attr('style','');

$('#cell26_11').attr('style','');

$('#cell26_12').attr('style','');

$('#cell26_13').attr('style','');

$('#cell26_14').attr('style','');

$('#cell26_15').attr('style','');

$('#cell26_16').attr('style','');

$('#cell26_17').attr('style','');

$('#cell26_18').attr('style','');

$('#cell26_19').attr('style','');

$('#cell26_20').attr('style','');

$('#cell27_0').attr('style','font-weight: bold;');

$('#cell27_1').attr('style','');

$('#cell27_2').attr('style','');

$('#cell27_3').attr('style','text-decoration: underline;');

$('#cell27_4').attr('style','text-decoration: underline;');

$('#cell27_5').attr('style','text-decoration: underline;');

$('#cell27_6').attr('style','text-decoration: underline;');

$('#cell27_7').attr('style','text-decoration: underline;');

$('#cell27_8').attr('style','text-decoration: underline;');

$('#cell27_9').attr('style','text-decoration: underline;');

$('#cell27_10').attr('style','text-decoration: underline;');

$('#cell27_11').attr('style','text-decoration: underline;');

$('#cell27_12').attr('style','text-decoration: underline;');

$('#cell27_13').attr('style','text-decoration: underline;');

$('#cell27_14').attr('style','text-decoration: underline;');

$('#cell27_15').attr('style','text-decoration: underline;');

$('#cell27_16').attr('style','text-decoration: underline;');

$('#cell27_17').attr('style','text-decoration: underline;');

$('#cell27_18').attr('style','text-decoration: underline;');

$('#cell27_19').attr('style','text-decoration: underline;');

$('#cell27_20').attr('style','text-decoration: underline;');

$('#cell28_0').attr('style','');

$('#cell28_1').attr('style','');

$('#cell28_2').attr('style','');

$('#cell28_3').attr('style','');

$('#cell28_4').attr('style','');

$('#cell28_5').attr('style','');

$('#cell28_6').attr('style','');

$('#cell28_7').attr('style','');

$('#cell28_8').attr('style','');

$('#cell28_9').attr('style','');

$('#cell28_10').attr('style','');

$('#cell28_11').attr('style','');

$('#cell28_12').attr('style','');

$('#cell28_13').attr('style','');

$('#cell28_14').attr('style','');

$('#cell28_15').attr('style','');

$('#cell28_16').attr('style','');

$('#cell28_17').attr('style','');

$('#cell28_18').attr('style','');

$('#cell28_19').attr('style','');

$('#cell28_20').attr('style','');

$('#cell29_0').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_1').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_2').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_3').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_4').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_5').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_6').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_7').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_8').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_9').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_10').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_11').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_12').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_13').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_14').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_15').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_16').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_17').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_18').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_19').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell29_20').attr('style','font-weight: bold; background-color: rgb(166, 202, 240);');

$('#cell30_0').attr('style','');

$('#cell30_1').attr('style','');

$('#cell30_2').attr('style','');

$('#cell30_3').attr('style','');

$('#cell30_4').attr('style','');

$('#cell30_5').attr('style','');

$('#cell30_6').attr('style','');

$('#cell30_7').attr('style','');

$('#cell30_8').attr('style','');

$('#cell30_9').attr('style','');

$('#cell30_10').attr('style','');

$('#cell30_11').attr('style','');

$('#cell30_12').attr('style','');

$('#cell30_13').attr('style','');

$('#cell30_14').attr('style','');

$('#cell30_15').attr('style','');

$('#cell30_16').attr('style','');

$('#cell30_17').attr('style','');

$('#cell30_18').attr('style','');

$('#cell30_19').attr('style','');

$('#cell30_20').attr('style','');

$('#cell31_0').attr('style','font-weight: bold;');

$('#cell31_1').attr('style','');

$('#cell31_2').attr('style','');

$('#cell31_3').attr('style','');

$('#cell31_4').attr('style','');

$('#cell31_5').attr('style','');

$('#cell31_6').attr('style','');

$('#cell31_7').attr('style','');

$('#cell31_8').attr('style','');

$('#cell31_9').attr('style','');

$('#cell31_10').attr('style','');

$('#cell31_11').attr('style','');

$('#cell31_12').attr('style','');

$('#cell31_13').attr('style','');

$('#cell31_14').attr('style','');

$('#cell31_15').attr('style','');

$('#cell31_16').attr('style','');

$('#cell31_17').attr('style','');

$('#cell31_18').attr('style','');

$('#cell31_19').attr('style','');

$('#cell31_20').attr('style','');

$('#cell32_0').attr('style','text-align: right;');

$('#cell32_1').attr('style','');

$('#cell32_2').attr('style','');

$('#cell32_3').attr('style','');

$('#cell32_4').attr('style','');

$('#cell32_5').attr('style','');

$('#cell32_6').attr('style','');

$('#cell32_7').attr('style','');

$('#cell32_8').attr('style','');

$('#cell32_9').attr('style','');

$('#cell32_10').attr('style','');

$('#cell32_11').attr('style','');

$('#cell32_12').attr('style','');

$('#cell32_13').attr('style','');

$('#cell32_14').attr('style','');

$('#cell32_15').attr('style','');

$('#cell32_16').attr('style','');

$('#cell32_17').attr('style','');

$('#cell32_18').attr('style','');

$('#cell32_19').attr('style','');

$('#cell32_20').attr('style','');

$('#cell33_0').attr('style','text-align: right;');

$('#cell33_1').attr('style','');

$('#cell33_2').attr('style','');

$('#cell33_3').attr('style','');

$('#cell33_4').attr('style','');

$('#cell33_5').attr('style','');

$('#cell33_6').attr('style','');

$('#cell33_7').attr('style','');

$('#cell33_8').attr('style','');

$('#cell33_9').attr('style','');

$('#cell33_10').attr('style','');

$('#cell33_11').attr('style','');

$('#cell33_12').attr('style','');

$('#cell33_13').attr('style','');

$('#cell33_14').attr('style','');

$('#cell33_15').attr('style','');

$('#cell33_16').attr('style','');

$('#cell33_17').attr('style','');

$('#cell33_18').attr('style','');

$('#cell33_19').attr('style','');

$('#cell33_20').attr('style','');

$('#cell34_0').attr('style','text-align: right;');

$('#cell34_1').attr('style','');

$('#cell34_2').attr('style','');

$('#cell34_3').attr('style','');

$('#cell34_4').attr('style','');

$('#cell34_5').attr('style','');

$('#cell34_6').attr('style','');

$('#cell34_7').attr('style','');

$('#cell34_8').attr('style','');

$('#cell34_9').attr('style','');

$('#cell34_10').attr('style','');

$('#cell34_11').attr('style','');

$('#cell34_12').attr('style','');

$('#cell34_13').attr('style','');

$('#cell34_14').attr('style','');

$('#cell34_15').attr('style','');

$('#cell34_16').attr('style','');

$('#cell34_17').attr('style','');

$('#cell34_18').attr('style','');

$('#cell34_19').attr('style','');

$('#cell34_20').attr('style','');

$('#cell35_0').attr('style','text-align: right;');

$('#cell35_1').attr('style','');

$('#cell35_2').attr('style','');

$('#cell35_3').attr('style','');

$('#cell35_4').attr('style','');

$('#cell35_5').attr('style','');

$('#cell35_6').attr('style','');

$('#cell35_7').attr('style','');

$('#cell35_8').attr('style','');

$('#cell35_9').attr('style','');

$('#cell35_10').attr('style','');

$('#cell35_11').attr('style','');

$('#cell35_12').attr('style','');

$('#cell35_13').attr('style','');

$('#cell35_14').attr('style','');

$('#cell35_15').attr('style','');

$('#cell35_16').attr('style','');

$('#cell35_17').attr('style','');

$('#cell35_18').attr('style','');

$('#cell35_19').attr('style','');

$('#cell35_20').attr('style','');

$('#cell36_0').attr('style','text-align: right;');

$('#cell36_1').attr('style','');

$('#cell36_2').attr('style','');

$('#cell36_3').attr('style','');

$('#cell36_4').attr('style','');

$('#cell36_5').attr('style','');

$('#cell36_6').attr('style','');

$('#cell36_7').attr('style','');

$('#cell36_8').attr('style','');

$('#cell36_9').attr('style','');

$('#cell36_10').attr('style','');

$('#cell36_11').attr('style','');

$('#cell36_12').attr('style','');

$('#cell36_13').attr('style','');

$('#cell36_14').attr('style','');

$('#cell36_15').attr('style','');

$('#cell36_16').attr('style','');

$('#cell36_17').attr('style','');

$('#cell36_18').attr('style','');

$('#cell36_19').attr('style','');

$('#cell36_20').attr('style','');

$('#cell37_0').attr('style','font-weight: bold;');

$('#cell37_1').attr('style','');

$('#cell37_2').attr('style','');

$('#cell37_3').attr('style','');

$('#cell37_4').attr('style','');

$('#cell37_5').attr('style','');

$('#cell37_6').attr('style','');

$('#cell37_7').attr('style','');

$('#cell37_8').attr('style','');

$('#cell37_9').attr('style','');

$('#cell37_10').attr('style','');

$('#cell37_11').attr('style','');

$('#cell37_12').attr('style','');

$('#cell37_13').attr('style','');

$('#cell37_14').attr('style','');

$('#cell37_15').attr('style','');

$('#cell37_16').attr('style','');

$('#cell37_17').attr('style','');

$('#cell37_18').attr('style','');

$('#cell37_19').attr('style','');

$('#cell37_20').attr('style','');

$('#cell38_0').attr('style','font-weight: bold; text-decoration: underline;');

$('#cell38_1').attr('style','');

$('#cell38_2').attr('style','');

$('#cell38_3').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_4').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_5').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_6').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_7').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_8').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_9').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_10').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_11').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_12').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_13').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_14').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_15').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_16').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_17').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_18').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_19').attr('style','text-decoration: underline; font-weight: bold;');

$('#cell38_20').attr('style','text-decoration: underline; font-weight: bold;');




