define([], function () {
  return {
    //==================================================================================================================================================//	
    //***********************************<Start>**********************************************************************************************************//
    //==================================================================================================================================================//
    luiConfirm: function luiConfirm(luiPopover, props) {
      var sHeader = props.header != undefined ? props.header : 'Confirmation';
      var sBody = props.body != undefined ? props.body : 'Are you sure you sure?';
      var eTemplate = "<lui-popover style=\"max-width: 450px;\">\n\t  <lui-popover-header>\n\t\t<lui-popover-title>".concat(sHeader, "</lui-popover-title>\n\t  </lui-popover-header>\n\t  <lui-popover-body>\n\t\t").concat(sBody, "\n\t  </lui-popover-body>\n\t  <lui-popover-footer>\n\t\t<button class=\"lui-button lui-popover__button lui-button--success\" ng-click=\"confirm();\">Yes</button>\n\t\t<button class=\"lui-button lui-popover__button lui-button--danger\" ng-click=\"close();\">No</button>\n\t  </lui-popover-footer>\n\t</lui-popover><div></div>");
      luiPopover.show({
        template: eTemplate,
        closeOnEscape: false,
        dock: "bottom",
        alignTo: props.element,
        close: function close() {
          alert('closing');
        },
        "function": function _function() {
          console.log('test', this);
        },
        controller: ['$scope', '$element', function ($scope, $element) {
          $scope.confirm = function () {
            /*console.log($scope);
            console.log(luiPopover);
            console.log($element);
            console.log(this);
            */
            props.confirm();
            this.close();
            return 'Yes';
          };
        }]
      });
    },
    //-----------------------------------------------------
    luiCopy: function luiCopy(luiPopover, props) {
      var sHeader = props.header != undefined ? props.header : 'Confirmation';
      var sBody = props.body != undefined ? props.body : 'Are you sure you sure?';
      var eTemplate = "<lui-popover style=\"max-width: 450px;\">\n\t  <lui-popover-header>\n\t\t<lui-popover-title>".concat(sHeader, "</lui-popover-title>\n\t  </lui-popover-header>\n\t  <lui-popover-body>\n\t\t<label class=\"lui-label\">Enter # of copies you want to make or provide a list of names:</label>\n\t\t<textarea name=\"description\" class=\"lui-textarea\"></textarea>\n\t  </lui-popover-body>\n\t  <lui-popover-footer>\n\t\t<button class=\"lui-button lui-popover__button lui-button--success\" ng-click=\"confirm();\">Apply</button>\n\t\t<button class=\"lui-button lui-popover__button lui-button--danger\" ng-click=\"close();\">Cancel</button>\n\t  </lui-popover-footer>\n\t</lui-popover><div></div>");
      luiPopover.show({
        template: eTemplate,
        closeOnEscape: false,
        dock: "bottom",
        alignTo: props.element,
        close: function close() {
          alert('closing');
        },
        "function": function _function() {
          console.log('test', this);
        },
        controller: ['$scope', '$element', function ($scope, $element) {
          $scope.confirm = function () {
            /*
            console.log('Scope',$scope);
            console.log('Popover',luiPopover);
            console.log('element',$element[0]);
            console.log('this',this);
            */
            var popoverElement = $element[0];
            var paramValue = popoverElement.getElementsByClassName('lui-textarea')[0].value;
            this.close();
            props.confirm(paramValue);
            return 'Yes';
          };
        }]
      });
    },
    //-----------------------------------------------------
    luiVariableEdit: function luiVariableEdit(luiPopover) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        header: undefined
      };
      var sHeader = props['header'] != undefined ? props['header'] : 'Edit Item';
      var eTemplate = "\n\t\t<lui-popover style=\"min-width: 600px;\">\n\t\t<lui-popover-header><lui-popover-title>".concat(sHeader, "</lui-popover-title></lui-popover-header>\n\t\t<lui-popover-body style=\"overflow:scroll;\">\n\t\t<label class=\"lui-label\">Name</label>\n\t\t<input name=\"name\" class=\"lui-input\"/>\n\t\t<label class=\"lui-label\">Label</label>\n\t\t<input name=\"label\" class=\"lui-input\"/>\n\t\t<label class=\"lui-label\">Description</label>\n\t\t<textarea name=\"description\" class=\"lui-textarea\"></textarea>\n\t\t<label class=\"lui-label\">Definition</label>\n\t\t<textarea name=\"defintion\" class=\"lui-textarea\"></textarea>\n\t\t<label class=\"lui-label\">Tags</label>\n\t\t<input name=\"tags\" class=\"lui-input\"/>\n\t\t</lui-popover-body>\n\t\t<lui-popover-footer>\n\t\t<button class=\"lui-button lui-popover__button lui-button--success\" ng-click=\"confirm();\">Apply</button>\n\t\t<button class=\"lui-button lui-popover__button lui-button--danger\" ng-click=\"close();\">Cancel</button>\n\t\t</lui-popover-footer>\n\t\t</lui-popover><div></div>");
      luiPopover.show({
        template: eTemplate,
        closeOnEscape: false,
        dock: "bottom",
        alignTo: props.element,
        close: function close() {
          alert('closing');
        },
        "function": function _function() {
          console.log('test', this);
        },
        controller: ['$scope', '$element', function ($scope, $element) {
          $scope.confirm = function () {
            /*console.log($scope);
            console.log(luiPopover);
            console.log($element);
            console.log(this);
            */
            console.log(variableList); //props.confirm();

            this.close();
            return 'Yes';
          };
        }]
      });
    } //==================================================================================================================================================//
    //***********************************<END>**********************************************************************************************************//
    //==================================================================================================================================================//

  };
});