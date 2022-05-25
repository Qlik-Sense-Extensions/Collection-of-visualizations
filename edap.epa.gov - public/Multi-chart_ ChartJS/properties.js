define(["./lib/js/contents"],function(e){"use strict";var o={uses:"dimensions",min:0},t={uses:"measures",min:0},l={uses:"sorting"},a={uses:"addons",items:{dataHandling:{uses:"dataHandling"}}},r={uses:"settings",items:{ChartDropDown:{type:"string",component:"dropdown",label:"Chart Selection",ref:"chart",options:chart_options,defaultValue:1},ChartSettings:{type:"items",label:"Chart Settings",items:{ShowAsDoughnutChart:{label:"Show As Doughnut Chart",component:"switch",ref:"pie_doughnut",type:"string",options:[{value:"doughnut",label:"ON"},{value:"pie",label:"OFF"}],defaultValue:"pie",show:function(e){return"8"==e.chart}},Colors:{label:"Colors",component:"switch",ref:"colors",type:"string",options:[{value:"auto",label:"Auto"},{value:"custom",label:"Custom"}],defaultValue:"auto"},ColorSelection:{type:"string",component:"dropdown",label:"Color Selection",ref:"color_selection",options:[{value:"twelve",label:"12 Colors"},{value:"one-handred",label:"100 Colors"}],defaultValue:"twelve",show:function(e){return"auto"==e.colors&&("2"==e.chart||"4"==e.chart||"6"==e.chart||"7"==e.chart||"8"==e.chart||"9"==e.chart)}},ColorPicker:{label:"Color",component:"color-picker",ref:"color",type:"integer",defaultValue:3,show:function(e){return"auto"==e.colors&&("1"==e.chart||"3"==e.chart||"5"==e.chart||"10"==e.chart)}},CustomColors:{ref:"custom_colors",label:"Custom Colors",type:"string",defaultValue:"51,34,136 - 102,153,204 - 136,204,238 - 68,170,153 - 17,119,51 - 153,153,51 - 221,204,119 - 102,17,0 - 204,102,119 - 170,68,102 - 136,34,85 - 170,68,153",show:function(e){return"custom"==e.colors}},BackgroundColorSwitch:{label:"Fill Background Color",component:"switch",ref:"background_color_switch",type:"boolean",options:[{value:!0,label:"ON"},{value:!1,label:"OFF"}],defaultValue:!1,show:function(e){return"3"==e.chart||"4"==e.chart||"5"==e.chart||"6"==e.chart||"9"==e.chart}},BackgroundColor:{label:"Background Color",component:"color-picker",ref:"background_color",type:"integer",defaultValue:3,show:function(e){return"auto"==e.colors&&1==e.background_color_switch&&("3"==e.chart||"5"==e.chart)}},CustomBackgroundColor:{ref:"custom_background_color",label:"Custom Background Color",type:"string",defaultValue:"51,34,136 - 102,153,204 - 136,204,238 - 68,170,153 - 17,119,51 - 153,153,51 - 221,204,119 - 102,17,0 - 204,102,119 - 170,68,102 - 136,34,85 - 170,68,153",show:function(e){return"custom"==e.colors&&1==e.background_color_switch&&("3"==e.chart||"5"==e.chart)}},ColorOpacity:{type:"number",component:"slider",label:"Color Opacity",ref:"opacity",min:0,max:1,step:.1,defaultValue:.8},BubbleSize:{type:"number",component:"slider",label:"Bubble Size",ref:"bubble_size",min:1,max:50,step:1,defaultValue:2,show:function(e){return"10"==e.chart}},SortByAlphabet:{label:"Sort by Alphabetic Order on 2nd Dim",component:"switch",ref:"sort",type:"boolean",options:[{value:!0,label:"ON"},{value:!1,label:"OFF"}],defaultValue:!1,show:function(e){return"2"==e.chart||"4"==e.chart||"6"==e.chart||"9"==e.chart}},PointRadiusSize:{type:"number",component:"slider",label:"Point Raduis Size",ref:"point_radius_size",min:1,max:20,step:1,defaultValue:2,show:function(e){return"3"==e.chart||"4"==e.chart||"5"==e.chart||"6"==e.chart||"9"==e.chart}},marginTop:{ref:"properties.marginTop",label:"Margin Top (px)",type:"integer",defaultValue:20,show:!1},marginRight:{ref:"properties.marginRight",label:"Margin Right (px)",type:"integer",defaultValue:20,show:!1},marginBottom:{ref:"properties.marginBottom",label:"Margin Bottom (px)",type:"integer",defaultValue:30},marginLeft:{ref:"properties.marginLeft",label:"Margin Left (px)",type:"integer",defaultValue:40,show:!1},CumulativeSwitch:{type:"boolean",component:"switch",label:"Cumulative Calculation",ref:"cumulative",options:[{value:!0,label:"ON"},{value:!1,label:"OFF"}],defaultValue:!1,show:function(e){return"10"!=e.chart}},LegendPotision:{type:"string",component:"dropdown",label:"Legend Position",ref:"legend_position",options:[{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"right",label:"Right"},{value:"left",label:"Left"},{value:"hide",label:"Hide"}],defaultValue:"top"},DataLabelSwitch:{type:"boolean",component:"switch",label:"Show Data Label",ref:"datalabel_switch",options:[{value:!0,label:"ON"},{value:!1,label:"OFF"}],defaultValue:!1,show:function(e){return"1"==e.chart||"2"==e.chart||"3"==e.chart||"4"==e.chart||"9"==e.chart||"10"==e.chart}},TitleSwitch:{type:"boolean",component:"switch",label:"Show Title",ref:"title_switch",options:[{value:!0,label:"ON"},{value:!1,label:"OFF"}],defaultValue:!1},beginAtZero:{type:"boolean",component:"switch",label:"Begin At Zero",ref:"begin_at_zero_switch",options:[{value:!0,label:"ON"},{value:!1,label:"OFF"}],defaultValue:!0},XScaleModeForBubble:{type:"string",component:"dropdown",label:"XScale Mode",ref:"xscale_mode_bubble",options:[{value:"category",label:"Category"},{value:"linear",label:"Linear"}],defaultValue:"linear",show:function(e){return"10"==e.chart}},XScaleMode:{type:"string",component:"dropdown",label:"XScale Mode",ref:"xscale_mode",options:[{value:"category",label:"Category"},{value:"linear",label:"Linear"}],defaultValue:"category",show:function(e){return"3"==e.chart}},DecimalSeparator:{type:"string",component:"dropdown",label:"Decimal Separator",ref:"decimal_separator",options:[{value:".",label:"."},{value:",",label:","}],defaultValue:"."},ThousandSeparator:{type:"string",component:"dropdown",label:"Thousand Separator",ref:"thousand_separator",options:[{value:",",label:","},{value:".",label:"."},{value:" ",label:"Space"}],defaultValue:","},LineWidth:{type:"number",component:"slider",label:"Line Width",ref:"line_width",min:0,max:10,step:1,defaultValue:2,show:function(e){return"3"==e.chart||"10"==e.chart}},LineColors:{label:"Line Colors",component:"switch",ref:"line_color_switch",type:"string",options:[{value:"auto",label:"Auto"},{value:"custom",label:"Custom"}],defaultValue:"auto",show:function(e){return"3"==e.chart||"10"==e.chart}},LineColorSelection:{type:"string",component:"dropdown",ref:"line_color_selection",options:[{value:"single",label:"Single Color"},{value:"measure",label:"By Measure"}],defaultValue:"single",show:function(e){return"custom"==e.line_color_switch&&("3"==e.chart||"10"==e.chart)}},LineColorPicker:{label:"Line Color",component:"color-picker",ref:"line_color_picker",type:"integer",defaultValue:7,show:function(e){return"custom"==e.line_color_switch&&"single"==e.line_color_selection&&("3"==e.chart||"10"==e.chart)}},LineColorSelectionForMeasure:{type:"string",component:"dropdown",label:"Color Selection",ref:"line_color_selection_for_measure",options:[{value:"twelve",label:"12 Colors"},{value:"one-handred",label:"100 Colors"},{value:"custom",label:"Custom Colors"}],defaultValue:"twelve",show:function(e){return"custom"==e.line_color_switch&&"measure"==e.line_color_selection&&("3"==e.chart||"10"==e.chart)}},LineCustomColor:{ref:"line_custom_color",label:"Custom Colors",type:"string",defaultValue:"51,34,136 - 102,153,204 - 136,204,238 - 68,170,153 - 17,119,51 - 153,153,51 - 221,204,119 - 102,17,0 - 204,102,119 - 170,68,102 - 136,34,85 - 170,68,153",show:function(e){return"custom"==e.line_color_switch&&"measure"==e.line_color_selection&&"custom"==e.line_color_selection_for_measure&&("3"==e.chart||"10"==e.chart)}}}}}};return{type:"items",component:"accordion",items:{dimensions:o,measures:t,sorting:l,addons:a,settings:r}}});