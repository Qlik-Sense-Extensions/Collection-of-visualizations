define( ["text!./template.html"],
function ( template ) {

	return {
		template : template,
		controller:['$scope', function($scope){
			//add your rendering code here
			$scope.html = "Hello World";
		}]
	};

} );

