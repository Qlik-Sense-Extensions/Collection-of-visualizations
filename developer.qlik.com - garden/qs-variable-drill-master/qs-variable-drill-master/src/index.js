import fontawesome from '@fortawesome/fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import "./style.css";
import {
	initialProperties,
	template,
	definition,
	controller,
	paint
} from "./methods";

// This is the object that is ultimately returned to qlik -- this is the extension 

window.define(['qlik', 'jquery'], async function(qlik, $) {

	// UTILS
	const getVariableList = () => {
		return qlik.currApp().createGenericObject({
			qVariableListDef: {
				qType: 'variable'
			}
		})
		.then(reply => {
			let variableList = reply.layout.qVariableList.qItems.map(item => item.qName);
			variableList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
			variableList = variableList.map(value => {
				return {
					label: value,
					value: value
				}
			})
			return variableList;
		});
	}

	let variableList; 
	if(!variableList){
		variableList = await getVariableList();
	}


	return {
		initialProperties,
		template,
		definition: definition(variableList),
		controller,
		paint: function($element, layout){
			return paint($element, layout, this, qlik, $);
		},
		support: {
			snapshot: true
		}
	}
})
