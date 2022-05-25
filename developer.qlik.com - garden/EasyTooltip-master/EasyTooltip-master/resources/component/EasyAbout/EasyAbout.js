define(["client.property-panel/components/components", "client.property-panel/component-utils",
	"text!./easyneo_transparent.svg"],
function(components, componentUtils,
	svg){
	
	return function() {
		if(!components.hasComponent("EasyAbout")) {
			let logo = '' +
				'<div>' +
					'<a href="https://www.easyneo.fr" target="_blank" title="Click here to learn more about us" style="height:0px;">' +
						svg +
					'</a>' +
				'</div>' +
			'';
			
			let copyright = '' +
				'<div style="padding:4px;">' +
					'Copyright EasyNeo, no changes allowed, free to use' +
				'</div>' +
			'';

			let html = logo + copyright;
			
			let aboutComponent = {
				template: html,
				controller: ["$scope", function(scope){
					let data = function(){
						return scope.data;
					};
					componentUtils.defineLabel(scope, scope.definition, data, scope.args.handler),
					componentUtils.defineVisible(scope, scope.args.handler),
					componentUtils.defineReadOnly(scope, scope.args.handler),
					componentUtils.defineChange(scope, scope.args.handler),
					componentUtils.defineValue(scope, scope.definition, data),
					scope.getDescription = function(description){
						return "About" === description;
					}
				}]
			};
			return components.addComponent("EasyAbout", aboutComponent), aboutComponent;
		}
	}
});