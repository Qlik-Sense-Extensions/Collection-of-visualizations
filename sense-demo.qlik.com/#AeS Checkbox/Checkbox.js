var app;


define(["jquery", "qlik", "text!./css/myStyle.css"], function($,qlik, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	debugger;
	app = qlik.currApp();
	return {
		definition: {
			type: "items",
			component: "accordion",
			items: {
			customProperties : {
				 component: "expandable-items",
				  label: "Custom Properties",
				  type : "items",
				  items:{	
					Label:{
						ref: "output_lbl_name",
						label: "Label Text",
						type: "string",								
						expression: "optional",
						defaultValue: "Label"
					},
					VariableName:{
								ref: "output_variable_name",
								label: "Variable Name",
								type: "string",								
								expression: "optional",
								defaultValue: ""
							},
					State:{
							ref: "selection_state",
							label:"Current Selection",
							component: "dropdown",
							show: false,
							defaultValue: "",
							options: [
								{
									value: "1",
									label: "Checked"
								},
								{
									value: "0",
									label: "UnChecked"
								}
								
							]
					}
				  }
			 }
			}
		},
		
		
		paint: function ($element,layout){
		var me = this;	
			
		var id=layout.qInfo.qId+"-AeScheckbox-id";
		var lbl_text;
		if (typeof layout.output_lbl_name == 'undefined'){lbl_text="Label";}
		else{lbl_text=layout.output_lbl_name;}
		
		var html =	'<table> <tr>'+
					'<td>'+		
						'<span style="font-size: 18px;font-weight: bold;">'+lbl_text+'</span>'+
					'</td>'+
					'<td> </td>'+
					'<td>'+
						'<div class="AeSonoffswitchCheckbox">'+
								'<input type="checkbox" name="AeSonoffswitchCheckbox" class="AeSonoffswitchCheckbox-checkbox"  id="'+id+'" checked>'+
								'<label class="AeSonoffswitchCheckbox-label" for="'+id+'"></label>'+
						'</div>'+
					'</td>'+
					'</tr> </table>';		
			
						
			$element.html(html);
			
			if (app.variable.getByName) 
			{
				app.variable.getByName(layout.output_variable_name).then(function () {
				
				}, function () {
				
				app.variable.create(layout.output_variable_name);
				
				app.variable.setContent(layout.output_variable_name,'0');
				});
			} 
			else {
				
				app.variable.create(layout.output_variable_name);
			}
			
			
			me.backendApi.getProperties().then(function(reply)
					{	
							
							if(reply.selection_state==1)
							{
								document.getElementById(id).checked = true;
								app.variable.setContent(layout.output_variable_name,'1');			
							}
							else 
							{
								document.getElementById(id).checked = false;
								app.variable.setContent(layout.output_variable_name,'0');
							}						
							//me.backendApi.setProperties(reply);
							
					});
					
					
		  $("#"+id).click(
				function(event){					
					
						if (document.getElementById(id).checked)
					    {
							 me.backendApi.getProperties().then(function(reply)
							{	
								reply.selection_state="1";
								me.backendApi.setProperties(reply);
							
							});
							app.variable.setContent(layout.output_variable_name,'1'); 
						}
					    else
						{
							me.backendApi.getProperties().then(function(reply)
							{	
								reply.selection_state="0";
								me.backendApi.setProperties(reply);
							
							});
							app.variable.setContent(layout.output_variable_name,'0');
						}
					
				  }		
								
		);
					
		}
  };	
});
	




