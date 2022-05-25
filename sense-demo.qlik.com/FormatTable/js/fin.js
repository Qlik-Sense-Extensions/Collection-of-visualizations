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

mergeCells(0, 1, 0, 5);
mergeCells(0, 7, 0, 11);
mergeCells(2,0, 2, 11);
mergeCells(11,0, 11, 11);
mergeCells(15,0, 15, 11);

$('#cell1_6').text('..');


$('#head0').attr('style','border: 1px solid black;');

$('#head1').attr('style','border: 1px solid black;');

$('#head2').attr('style','border: 1px solid black;');

$('#head3').attr('style','border: 1px solid black;');

$('#head4').attr('style','border: 1px solid black;');

$('#head5').attr('style','border: 1px solid black;');

$('#head6').attr('style','border: 1px solid black;');

$('#head7').attr('style','border: 1px solid black;');

$('#head8').attr('style','border: 1px solid black;');

$('#head9').attr('style','border: 1px solid black;');

$('#head10').attr('style','border: 1px solid black;');

$('#head11').attr('style','border: 1px solid black;');

$('#head12').attr('style','visibility: hidden; border: 1px solid black; background-color: lightblue;');

$('#cell0_0').attr('style','font-weight: bold; border: 1px solid black; background-color: lightblue;');

$('#cell0_1').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_2').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_3').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_4').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_5').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_6').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_7').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_8').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_9').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_10').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_11').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell0_12').attr('style','visibility: hidden; font-weight: bold; border: 1px solid black; background-color: lightblue;');

$('#cell1_0').attr('style','font-weight: bold; border: 1px solid black; background-color: lightblue;');

$('#cell1_1').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_2').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_3').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_4').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_5').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_6').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_7').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_8').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_9').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_10').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_11').attr('style','font-weight: bold; text-align: center; border: 1px solid black; background-color: lightblue;');

$('#cell1_12').attr('style','visibility: hidden; font-weight: bold; border: 1px solid black; background-color: lightblue;');

$('#cell2_0').attr('style','font-weight: bold; color: rgb(255, 255, 255); border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_1').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_2').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_3').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_4').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_5').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_6').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_7').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_8').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_9').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_10').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_11').attr('style','font-weight: bold; color: rgb(255, 255, 255); text-align: center; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell2_12').attr('style','visibility: hidden; font-weight: bold; color: rgb(255, 255, 255); border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell3_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell3_1').attr('style','border: 1px solid black;');

$('#cell3_2').attr('style','border: 1px solid black;');

$('#cell3_3').attr('style','border: 1px solid black;');

$('#cell3_4').attr('style','border: 1px solid black;');

$('#cell3_5').attr('style','border: 1px solid black;');

$('#cell3_6').attr('style','border: 1px solid black;');

$('#cell3_7').attr('style','border: 1px solid black;');

$('#cell3_8').attr('style','border: 1px solid black;');

$('#cell3_9').attr('style','border: 1px solid black;');

$('#cell3_10').attr('style','border: 1px solid black;');

$('#cell3_11').attr('style','border: 1px solid black;');

$('#cell3_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell4_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell4_1').attr('style','border: 1px solid black;');

$('#cell4_2').attr('style','border: 1px solid black;');

$('#cell4_3').attr('style','border: 1px solid black;');

$('#cell4_4').attr('style','border: 1px solid black;');

$('#cell4_5').attr('style','border: 1px solid black;');

$('#cell4_6').attr('style','border: 1px solid black;');

$('#cell4_7').attr('style','border: 1px solid black;');

$('#cell4_8').attr('style','border: 1px solid black;');

$('#cell4_9').attr('style','border: 1px solid black;');

$('#cell4_10').attr('style','border: 1px solid black;');

$('#cell4_11').attr('style','border: 1px solid black;');

$('#cell4_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell5_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell5_1').attr('style','border: 1px solid black;');

$('#cell5_2').attr('style','border: 1px solid black;');

$('#cell5_3').attr('style','border: 1px solid black;');

$('#cell5_4').attr('style','border: 1px solid black;');

$('#cell5_5').attr('style','border: 1px solid black;');

$('#cell5_6').attr('style','border: 1px solid black;');

$('#cell5_7').attr('style','border: 1px solid black;');

$('#cell5_8').attr('style','border: 1px solid black;');

$('#cell5_9').attr('style','border: 1px solid black;');

$('#cell5_10').attr('style','border: 1px solid black;');

$('#cell5_11').attr('style','border: 1px solid black;');

$('#cell5_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell6_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell6_1').attr('style','border: 1px solid black;');

$('#cell6_2').attr('style','border: 1px solid black;');

$('#cell6_3').attr('style','border: 1px solid black;');

$('#cell6_4').attr('style','border: 1px solid black;');

$('#cell6_5').attr('style','border: 1px solid black;');

$('#cell6_6').attr('style','border: 1px solid black;');

$('#cell6_7').attr('style','border: 1px solid black;');

$('#cell6_8').attr('style','border: 1px solid black;');

$('#cell6_9').attr('style','border: 1px solid black;');

$('#cell6_10').attr('style','border: 1px solid black;');

$('#cell6_11').attr('style','border: 1px solid black;');

$('#cell6_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell7_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell7_1').attr('style','border: 1px solid black;');

$('#cell7_2').attr('style','border: 1px solid black;');

$('#cell7_3').attr('style','border: 1px solid black;');

$('#cell7_4').attr('style','border: 1px solid black;');

$('#cell7_5').attr('style','border: 1px solid black;');

$('#cell7_6').attr('style','border: 1px solid black;');

$('#cell7_7').attr('style','border: 1px solid black;');

$('#cell7_8').attr('style','border: 1px solid black;');

$('#cell7_9').attr('style','border: 1px solid black;');

$('#cell7_10').attr('style','border: 1px solid black;');

$('#cell7_11').attr('style','border: 1px solid black;');

$('#cell7_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell8_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell8_1').attr('style','border: 1px solid black;');

$('#cell8_2').attr('style','border: 1px solid black;');

$('#cell8_3').attr('style','border: 1px solid black;');

$('#cell8_4').attr('style','border: 1px solid black;');

$('#cell8_5').attr('style','border: 1px solid black;');

$('#cell8_6').attr('style','border: 1px solid black;');

$('#cell8_7').attr('style','border: 1px solid black;');

$('#cell8_8').attr('style','border: 1px solid black;');

$('#cell8_9').attr('style','border: 1px solid black;');

$('#cell8_10').attr('style','border: 1px solid black;');

$('#cell8_11').attr('style','border: 1px solid black;');

$('#cell8_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell9_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell9_1').attr('style','border: 1px solid black;');

$('#cell9_2').attr('style','border: 1px solid black;');

$('#cell9_3').attr('style','border: 1px solid black;');

$('#cell9_4').attr('style','border: 1px solid black;');

$('#cell9_5').attr('style','border: 1px solid black;');

$('#cell9_6').attr('style','border: 1px solid black;');

$('#cell9_7').attr('style','border: 1px solid black;');

$('#cell9_8').attr('style','border: 1px solid black;');

$('#cell9_9').attr('style','border: 1px solid black;');

$('#cell9_10').attr('style','border: 1px solid black;');

$('#cell9_11').attr('style','border: 1px solid black;');

$('#cell9_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell10_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell10_1').attr('style','border: 1px solid black;');

$('#cell10_2').attr('style','border: 1px solid black;');

$('#cell10_3').attr('style','border: 1px solid black;');

$('#cell10_4').attr('style','border: 1px solid black;');

$('#cell10_5').attr('style','border: 1px solid black;');

$('#cell10_6').attr('style','border: 1px solid black;');

$('#cell10_7').attr('style','border: 1px solid black;');

$('#cell10_8').attr('style','border: 1px solid black;');

$('#cell10_9').attr('style','border: 1px solid black;');

$('#cell10_10').attr('style','border: 1px solid black;');

$('#cell10_11').attr('style','border: 1px solid black;');

$('#cell10_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell11_0').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_1').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_2').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_3').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_4').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_5').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_6').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_7').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_8').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_9').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_10').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_11').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell11_12').attr('style','visibility: hidden; color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell12_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell12_1').attr('style','border: 1px solid black;');

$('#cell12_2').attr('style','border: 1px solid black;');

$('#cell12_3').attr('style','border: 1px solid black;');

$('#cell12_4').attr('style','border: 1px solid black;');

$('#cell12_5').attr('style','border: 1px solid black;');

$('#cell12_6').attr('style','border: 1px solid black;');

$('#cell12_7').attr('style','border: 1px solid black;');

$('#cell12_8').attr('style','border: 1px solid black;');

$('#cell12_9').attr('style','border: 1px solid black;');

$('#cell12_10').attr('style','border: 1px solid black;');

$('#cell12_11').attr('style','border: 1px solid black;');

$('#cell12_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell13_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell13_1').attr('style','border: 1px solid black;');

$('#cell13_2').attr('style','border: 1px solid black;');

$('#cell13_3').attr('style','border: 1px solid black;');

$('#cell13_4').attr('style','border: 1px solid black;');

$('#cell13_5').attr('style','border: 1px solid black;');

$('#cell13_6').attr('style','border: 1px solid black;');

$('#cell13_7').attr('style','border: 1px solid black;');

$('#cell13_8').attr('style','border: 1px solid black;');

$('#cell13_9').attr('style','border: 1px solid black;');

$('#cell13_10').attr('style','border: 1px solid black;');

$('#cell13_11').attr('style','border: 1px solid black;');

$('#cell13_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell14_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell14_1').attr('style','border: 1px solid black;');

$('#cell14_2').attr('style','border: 1px solid black;');

$('#cell14_3').attr('style','border: 1px solid black;');

$('#cell14_4').attr('style','border: 1px solid black;');

$('#cell14_5').attr('style','border: 1px solid black;');

$('#cell14_6').attr('style','border: 1px solid black;');

$('#cell14_7').attr('style','border: 1px solid black;');

$('#cell14_8').attr('style','border: 1px solid black;');

$('#cell14_9').attr('style','border: 1px solid black;');

$('#cell14_10').attr('style','border: 1px solid black;');

$('#cell14_11').attr('style','border: 1px solid black;');

$('#cell14_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell15_0').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_1').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_2').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_3').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_4').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_5').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_6').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_7').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_8').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_9').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_10').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_11').attr('style','color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell15_12').attr('style','visibility: hidden; color: rgb(255, 255, 255); font-weight: bold; border: 1px solid black; background-color: rgb(0, 102, 204);');

$('#cell16_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell16_1').attr('style','border: 1px solid black;');

$('#cell16_2').attr('style','border: 1px solid black;');

$('#cell16_3').attr('style','border: 1px solid black;');

$('#cell16_4').attr('style','border: 1px solid black;');

$('#cell16_5').attr('style','border: 1px solid black;');

$('#cell16_6').attr('style','border: 1px solid black;');

$('#cell16_7').attr('style','border: 1px solid black;');

$('#cell16_8').attr('style','border: 1px solid black;');

$('#cell16_9').attr('style','border: 1px solid black;');

$('#cell16_10').attr('style','border: 1px solid black;');

$('#cell16_11').attr('style','border: 1px solid black;');

$('#cell16_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell17_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell17_1').attr('style','border: 1px solid black;');

$('#cell17_2').attr('style','border: 1px solid black;');

$('#cell17_3').attr('style','border: 1px solid black;');

$('#cell17_4').attr('style','border: 1px solid black;');

$('#cell17_5').attr('style','border: 1px solid black;');

$('#cell17_6').attr('style','border: 1px solid black;');

$('#cell17_7').attr('style','border: 1px solid black;');

$('#cell17_8').attr('style','border: 1px solid black;');

$('#cell17_9').attr('style','border: 1px solid black;');

$('#cell17_10').attr('style','border: 1px solid black;');

$('#cell17_11').attr('style','border: 1px solid black;');

$('#cell17_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell18_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell18_1').attr('style','border: 1px solid black;');

$('#cell18_2').attr('style','border: 1px solid black;');

$('#cell18_3').attr('style','border: 1px solid black;');

$('#cell18_4').attr('style','border: 1px solid black;');

$('#cell18_5').attr('style','border: 1px solid black;');

$('#cell18_6').attr('style','border: 1px solid black;');

$('#cell18_7').attr('style','border: 1px solid black;');

$('#cell18_8').attr('style','border: 1px solid black;');

$('#cell18_9').attr('style','border: 1px solid black;');

$('#cell18_10').attr('style','border: 1px solid black;');

$('#cell18_11').attr('style','border: 1px solid black;');

$('#cell18_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell19_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell19_1').attr('style','border: 1px solid black;');

$('#cell19_2').attr('style','border: 1px solid black;');

$('#cell19_3').attr('style','border: 1px solid black;');

$('#cell19_4').attr('style','border: 1px solid black;');

$('#cell19_5').attr('style','border: 1px solid black;');

$('#cell19_6').attr('style','border: 1px solid black;');

$('#cell19_7').attr('style','border: 1px solid black;');

$('#cell19_8').attr('style','border: 1px solid black;');

$('#cell19_9').attr('style','border: 1px solid black;');

$('#cell19_10').attr('style','border: 1px solid black;');

$('#cell19_11').attr('style','border: 1px solid black;');

$('#cell19_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell20_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell20_1').attr('style','border: 1px solid black;');

$('#cell20_2').attr('style','border: 1px solid black;');

$('#cell20_3').attr('style','border: 1px solid black;');

$('#cell20_4').attr('style','border: 1px solid black;');

$('#cell20_5').attr('style','border: 1px solid black;');

$('#cell20_6').attr('style','border: 1px solid black;');

$('#cell20_7').attr('style','border: 1px solid black;');

$('#cell20_8').attr('style','border: 1px solid black;');

$('#cell20_9').attr('style','border: 1px solid black;');

$('#cell20_10').attr('style','border: 1px solid black;');

$('#cell20_11').attr('style','border: 1px solid black;');

$('#cell20_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell21_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell21_1').attr('style','border: 1px solid black;');

$('#cell21_2').attr('style','border: 1px solid black;');

$('#cell21_3').attr('style','border: 1px solid black;');

$('#cell21_4').attr('style','border: 1px solid black;');

$('#cell21_5').attr('style','border: 1px solid black;');

$('#cell21_6').attr('style','border: 1px solid black;');

$('#cell21_7').attr('style','border: 1px solid black;');

$('#cell21_8').attr('style','border: 1px solid black;');

$('#cell21_9').attr('style','border: 1px solid black;');

$('#cell21_10').attr('style','border: 1px solid black;');

$('#cell21_11').attr('style','border: 1px solid black;');

$('#cell21_12').attr('style','visibility: hidden; border: 1px solid black;');

$('#cell22_0').attr('style','border: 1px solid black; font-weight: bold;');

$('#cell22_1').attr('style','border: 1px solid black;');

$('#cell22_2').attr('style','border: 1px solid black;');

$('#cell22_3').attr('style','border: 1px solid black;');

$('#cell22_4').attr('style','border: 1px solid black;');

$('#cell22_5').attr('style','border: 1px solid black;');

$('#cell22_6').attr('style','border: 1px solid black;');

$('#cell22_7').attr('style','border: 1px solid black;');

$('#cell22_8').attr('style','border: 1px solid black;');

$('#cell22_9').attr('style','border: 1px solid black;');

$('#cell22_10').attr('style','border: 1px solid black;');

$('#cell22_11').attr('style','border: 1px solid black;');

$('#cell22_12').attr('style','visibility: hidden; border: 1px solid black;');






