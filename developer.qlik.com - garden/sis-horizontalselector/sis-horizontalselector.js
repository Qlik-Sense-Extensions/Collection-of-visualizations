define([
  "jquery",
  "qlik",
  "./properties",
  "./initialproperties",
  "text!./template.ng.html",
  "text!./css/main.css",
  "./js/clTouch",
], function ($, qlik, props, initProps, ngTemplate, cssContent, clTouch) {
  "use strict";
  var app = qlik.currApp();

  $("<style>").html(cssContent).appendTo("head");
  return {
    definition: props,
    initialProperties: initProps,
    snapshot: { canTakeSnapshot: true },
    template: ngTemplate,
    controller: [
      "$scope",
      function ($scope) {
        $scope.dimData = [];
        $scope.swipeSelections = {};
        $scope.component.model.Validated.bind(function () {
          $scope.getFields();
        });


        // Collect fields data from $scope.fields
        $scope.getFields = function () {
          $scope.dimData = [];
          $scope.layout.lists.forEach((field) => {
            if (field.qListObject.qDataPages.length > 0) {
              var newDimension = {
                fieldType: field.fieldType,
                showLabel: field.showFieldLabel,
                label: field.fieldLabel,
                labelPos: field.fieldLabelPos,
                name: field.qListObject.qDimensionInfo.qFallbackTitle,
                values: field.qListObject.qDataPages[0].qMatrix.map((value) => {
                  return {
                    index: value[0].qElemNumber,
                    value: value[0].qText,
                    qNum: value[0].qNum,
                    state: value[0].qState,
                  };
                }),
              };

              newDimension.activeValues = newDimension.values;

              $scope.dimData.push(newDimension);
            }
          });
        };

        $scope.filterOptions = function(){
          var filter = this.dropdownSearch.toLowerCase();
          this.dimension.activeValues = this.dimension.values.filter((option)=> {
            return option.value.toLowerCase().includes(filter);
          });

          /* var index = -1;
          $scope.dimData.forEach((el, i) => {
            if(el.$$hashKey == this.dimension.$$hashKey){
              index = i;
              return;
            }
          });

          $scope.dimData[index].activeValues = newValues; */
        };

        var setParentIndex = function (value) {
          $(document.body)
            .find(".qv-object-sis-horizontalselector")
            .parent()
            .parent()
            .parent()
            .parent()
            .css("z-index", value);
        };

        var getTargetValue = function (target) {
          var dataValue = target.attr("data-qIndex");
          /* var qNum = target.attr("data-qnum");
          return !isNaN(qNum) ? parseInt(qNum) : dataValue; */
          return parseInt(dataValue);
        };

        // Add value to queue and select/deselect
        var selectSwipeValue = function (target, value) {
          if (
            $scope.swipeSelections.isSelectOperation &&
            !target[0].classList.contains("S")
          ) {
            //Select
            $scope.swipeSelections.selectValues.push(value);
            target.removeClass("A X O");
            target.addClass("P");
          } else if (
            !$scope.swipeSelections.isSelectOperation &&
            target[0].classList.contains("S")
          ) {
            //Deselect
            $scope.swipeSelections.selectValues.push(value);
            target.removeClass("S");
            target.addClass("X");
          }
        };

        var initializeSwipeSelections = function (dimension, target) {
          $scope.swipeSelections.selectedDimension = dimension;
          $scope.swipeSelections.selectValues = [];
          $scope.swipeSelections.isSelectOperation = !target[0].classList.contains(
            "S"
          );
        };

        $scope.onSwipeStart = function (event) {
          var target = $(event.originalEvent.target);
          var dimension = target.attr("data-dim");

          // If first swipe: set dimension to current hovered object
          initializeSwipeSelections(dimension, target);
          // selectSwipeValue(target, value);
        };

        // Add elements hovered to selectionsQueue
        $scope.onSwipeUpdate = function (event) {
          var target = $(event.originalEvent.target);
          var dimension = target.attr("data-dim");

          // Add value to selections queue
          if (dimension == $scope.swipeSelections.selectedDimension) {
            var value = getTargetValue(target);
            if (!$scope.swipeSelections.selectValues.includes(value)) {
              selectSwipeValue(target, value);
            }
          }
        };

        var selectValues = function(dimension, values){
          // console.log('SELECCIONANDO VALORES ', dimension, values)
          app.field(dimension).select(values, true, true);
        }

        // On swipe end: selectValues
        $scope.onSwipe = function (event) {
          if ($scope.swipeSelections.selectValues) {
            selectValues($scope.swipeSelections.selectedDimension, $scope.swipeSelections.selectValues)
            /* app
              .field($scope.swipeSelections.selectedDimension)
              .selectValues($scope.swipeSelections.selectValues, true, true); */
          }
          $scope.swipeSelections = {};
        };

        $scope.onDropdownSwipe = function (event) {
          // End swipe selection on dropdown
        };

        // onClickEvent: Create the selections
        $scope.onClickButton = function (event) {
          var target = $(event.target);
          var dimension = target.attr("data-dim");
          var value = getTargetValue(target);

          selectValues(dimension, [value]);
          /* app.field(dimension).selectValues([value], true, true); */
        };

        // Toggle Dropdown
        $scope.onDropdownToggleClick = function (event) {
          //Close open popovers
          var popover = $(event.target).parent().find(".popover");
          $(document.body)
            .find(".popover")
            .each((_, item) => {
              !$(item).is(popover) ? $(item).removeClass("active") : "";
            });
          $scope.swipeSelections = {};

          if (popover.hasClass("active")) {
            popover.removeClass("active");
            $scope.getFields();
            setParentIndex(0);
          } else {
            popover.addClass("active");
            setParentIndex("2147483629");
          }
        };

        // Single click on dropdown option
        $scope.onDropdownOptionClick = function (event) {
          var target = $(event.target);
          var value = getTargetValue(target);
          var dimension = target.attr("data-dim");

          // If pre-selected: remove
          if (target.hasClass("P")) {
            var valuePos = $scope.swipeSelections.selectValues.indexOf(value);
            if (valuePos > -1) {
              $scope.swipeSelections.selectValues.splice(valuePos, 1);
            }
            target.removeClass("P");
          } else {
            // Else: Select
            if (!$scope.swipeSelections.selectedDimension) {
              initializeSwipeSelections(dimension, target);
            }

            selectSwipeValue(target, value);
          }
        };

        // Cancel dropdown selections
        $scope.onCancelDropdownSelection = function (event) {
          //Remove current selections
          app.field($(event.target).attr("data-dim")).selectValues([]);
          $scope.swipeSelections = {};

          //Close
          $(event.target).parent().parent().removeClass("active");
          setParentIndex("0");
        };

        // Confirm dropdown selection
        $scope.onConfirmDropdownSelection = function (event) {
          // Select values
          if ($scope.swipeSelections.selectValues) {
            selectValues($scope.swipeSelections.selectedDimension, $scope.swipeSelections.selectValues)
            /* app
              .field($scope.swipeSelections.selectedDimension)
              .selectValues($scope.swipeSelections.selectValues, true, true); */
          }
          $scope.swipeSelections = {};

          //Close
          $(event.target).parent().parent().removeClass("active");
        };
      },
    ],
  };
});
