define([ "qlik", "jquery", "require", "text!./EasyTooltip.qext",
	"./resources/js/support", "./resources/js/initialproperties", "./resources/js/definition", "./resources/js/paint", "./resources/js/controller",
	"./resources/component/EasyAbout/EasyAbout"],
	
function(qlik, $, require, qext,
	support, initialproperties, definition, paint, controller,
	EasyAbout) {
		
	// Début Partie 1 : Appelé au chargement de la page
	'use strict';
	let extension = JSON.parse(qext);	// Récupération des informations du qext
	let objects = []; 					// Liste des objets de l'extension sur la page
	EasyAbout();						// Chargement du component EasyAbout
	// Fin Partie 1
	
	let general = {
		support : support,
		initialProperties: initialproperties,
		definition : definition,
		paint: function ($element, layout) {
			
			// Début partie 2 : Appelé à l'affichage d'un objet de l'extension de ce type sur la page
			// Il faut bien faire attention à prévoir le cas où il y a plusieurs objets de ce type (notamment avec le CSS, utiliser les id)			
			let object = paint($element, layout, this.$scope);
			if(objects[object.id] == undefined) objects.push(object);	// Si l'objet n'est pas encore dans la liste des objets de la page, on l'ajoute
			else objects[object.id] = object;							// Sinon, on le remplace
			return qlik.Promise.resolve();
			// Fin partie 2
			
		},
		controller: function ($scope) {
			
			// Début partie 3 : Appelé dès qu'un objet de l'extension de ce type sur la page est affiché
			// Lorsque le minimum de dimensions/mesures est atteint
			// Au chargement de la page lorsque le minimum de dimensions/mesures était déjà atteint
			controller($scope);
			// Fin partie 3
			
		}
	};
		
	return general;

});

