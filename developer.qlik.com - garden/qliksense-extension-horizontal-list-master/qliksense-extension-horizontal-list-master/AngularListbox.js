define(["./properties", "./initialproperties","text!./template.html", "text!./styles.css"],
    function(props, initProps, template, css) {
    	'use strict';
        $("<style>").html(css).appendTo("head");
        return {
            definition: props,
            initialProperties: initProps,
            snapshot: {canTakeSnapshot: false},
            template: template,
            controller: ['$scope', function($scope) {
            	
                $scope.valuesArr = [];

                $scope.mousedown = function(event, value) {
                    $scope.mouseIsDown = true;
                    event.target.classList.add("active");
                    $scope.valuesArr.push(value);
                };
                $scope.mousemove = function(event, value) {
                    if ($scope.mouseIsDown) {
                        event.target.classList.add("active");
                        $scope.valuesArr.push(value);
                    }
                };
                $scope.mouseup = function() {
                    $scope.mouseIsDown = false;
                    this.backendApi.selectValues(0, $scope.valuesArr, true)
                    $scope.valuesArr = [];
                };

                $scope.mouseout = function() {
                    if ($scope.mouseIsDown) {
                        $scope.mouseIsDown = false;
                        this.backendApi.selectValues(0, $scope.valuesArr, true)
                        $scope.valuesArr = [];
                    }
                };

                $scope.$watch('layout.qListObject.qDataPages[0].qMatrix', function(data) {
                    $scope.listRows = _.flatten(data);

                    if($scope.listRows.find(x => x.qState === "L")){
                        $scope.locked = "table-locked"
                    }
                    else{
                        $scope.locked = ""
                    }
                });
            }]
        };

    });