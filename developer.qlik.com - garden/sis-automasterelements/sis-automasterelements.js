define(["qlik", "jquery", "text!./template.html", "css!./css/main.css"], function (
  qlik,
  $,
  template,
  cssContent
) {
  const app = qlik.currApp();
  const enigma = app.model.enigmaModel;

  $( '<style>' ).html(cssContent).appendTo( 'head' );

  return {
    template: template,
    support: {
      snapshot: true,
      export: true,
      exportData: false,
    },
    /* paint: function ($element) {
      return qlik.Promise.resolve();
    }, */
    resize: function(){
      var scope = angular.element($('#sis-masterelements-container')).scope();

      scope.init();
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        $scope.fields = $scope.measures = [];
        $scope.activeFields = $scope.activeVariables = [];
        $scope.toggleSelectAll = false;
        $scope.hideLinkedVariables = false;
        $scope.activeTab = "dimensions-tab";
        $scope.searchText = "";

        // Initialize
        $scope.init = async function () {
          await $scope.loadFields();
          await $scope.loadVariables();

          $scope.activeFields = $scope.fields;
          $scope.activeVariables = $scope.variables;
          $scope.searchText = "";
        };

        $scope.loadFields = async function(){
          // --  Dimensions
          $scope.dimensions = await enigma.getDimensionList();
          $scope.fields = await enigma.getFieldList();

          // Find the fields´ master dimensions
          $scope.fields.map((field) => {
            // Check if field has already a master element
            field.masterField = getMasterDimension(field.qName);
            field.hasDimension = field.masterField ? true : false;
          });
        }

        $scope.filterFields = function(){
          const lowerSearchInput = $scope.searchText.toLowerCase();
          $scope.activeFields = $scope.fields.filter((item) => {
            const lowerItemName = item.qName.toLowerCase();
            const lowerItemLabel = item.masterField && item.masterField.label ?  item.masterField.label.toLowerCase() : "";
            return lowerItemName.includes(lowerSearchInput) || lowerItemLabel.includes(lowerSearchInput);
          });

          $scope.activeVariables = $scope.variables.filter(item => {
            const lowerItemName = item.qName.toLowerCase();
            const lowerItemLabel = item.masterMeasure && item.masterMeasure.label ? item.masterMeasure.label.toLowerCase() : "";
            return lowerItemName.includes(lowerSearchInput) || lowerItemLabel.includes(lowerSearchInput);
          });
        };

        $scope.loadVariables = async function(){
          // -- variables
          $scope.variables = await enigma.getVariableList();
          $scope.measures = await enigma.getMeasureList();

          // Remove reserved variables
          $scope.variables = $scope.variables.filter((v) => {
            return !v.qIsReserved;
          });

          // Find the variables' master measures
          $scope.variables.map(async (variable) => {
            variable.masterMeasure = getMasterMeasure(variable.qName);
            variable.hasMeasure = variable.masterMeasure ? true : false;

            // Get measure properties
            if(variable.hasMeasure){
              const modelMeasure = await enigma.getMeasure(variable.masterMeasure.id);
              variable.props = await modelMeasure.getProperties()
              variable.measureType = variable.props.qMeasure.qNumFormat.qType;
            }
          });
        }

        // Submit selected dimensions and measures
        $scope.submitFields = function () {
          if($scope.activeTab == "dimensions-tab"){
            $scope.fields.forEach((field) => {
              if (field.update) {
                // Update or create master dimension
                updateDimension(field);
                field.update = false;
              }
            });  
          }
          else if($scope.activeTab == "measures-tab"){
            $scope.variables.forEach(variable => {
              if(variable.update){
                updateMeasure(variable);
                variable.update = false;
              }
            })
          }
          
          $scope.saveDoc();
        };

        // Submit single field
        $scope.submitField = function (field) {
          updateDimension(field);
          // $scope.saveDoc();
        };

        $scope.submitMeasure = function (measure) {
          updateMeasure(measure);
          // $scope.saveDoc();
        };

        // Select all fields or variables
        $scope.selectAll = function () {
          var selectCheckboxes = "#" + $scope.activeTab + " .update-checkbox";
          var selections = $scope.getActiveTabFields();

          $(selectCheckboxes).each((i, el) => {
            selections.forEach((field) => {
              field.update = $scope.toggleSelectAll;
            });
          });
        };

        // Return the active tab fields
        $scope.getActiveTabFields = function(){
          return $scope.activeTab == "dimensions-tab" ? $scope.activeFields : $scope.activeVariables;
        }

        // Unlinck single dimension
        $scope.unlinckDimension = async function (masterField) {
          await enigma.destroyDimension({ qId: masterField.id });
          $scope.saveDoc();
        };

        // Unlink single measure
        $scope.unlinckMeasure = async function(masterMeasure){
          await enigma.destroyMeasure({ qId: masterMeasure.id });
          $scope.saveDoc();
        };

        // Unlinck selected dimensions
        $scope.unlinckDimensions = function () {
          if($scope.activeTab == "dimensions-tab"){
            $scope.fields.forEach(async (field) => {
              if (field.update) {
                await enigma.destroyDimension({ qId: field.masterField.id });
              }
            });  
          }
          else if($scope.activeTab == "measures-tab"){
            $scope.variables.forEach(async (variable) => {
              if(variable.update){
                await enigma.destroyMeasure({ qId: variable.masterMeasure.id })
              }
            });
          }
          
          $scope.saveDoc();
        };

        $scope.saveDoc = function saveDoc() {
          app.doSave().then(res => {
            console.log(res);
            $scope.init();
          });
          
        };

        $scope.openTab = function (target) {
          const tab = $(target).attr("data-tab");
          $scope.activeTab = tab;
        };

        async function updateDimension(field) {
          // If exists -> update label
          if (field.masterField && field.masterField.id) {
            const modelDimension = await enigma.getDimension(field.masterField.id);
            var properties = await modelDimension.getProperties();

            properties.qDim.qFieldLabels = [field.masterField.label];
            properties.qDim.title = field.masterField.label;
            properties.qMetaDef.title = field.masterField.label;
            await modelDimension.setProperties(properties);
          } // Else -> create master dimension
          else {
            var dimName = 
              field.masterField && field.masterField.label 
              ? field.masterField.label 
              : field.qName;
            await createDimension(field.qName, dimName);
          }

          $scope.saveDoc();
        }

        async function updateMeasure(measure) {
          if (measure.masterMeasure && measure.masterMeasure.id) {
            const modelMeasure = await enigma.getMeasure(measure.masterMeasure.id);
            var properties = await modelMeasure.getProperties();

            properties.qMeasure.qLabel = measure.masterMeasure.label;
            properties.qMeasure.qNumFormat.qType = measure.measureType;
            properties.qMeasure.qNumFormat.qFmt = measure.measureFormat;
            properties.qMetaDef.title = measure.masterMeasure.label;
            await modelMeasure.setProperties(properties);
          } else {
            const measureLabel =
              measure.masterMeasure && measure.masterMeasure.label
                ? measure.masterMeasure.label
                : measure.qName;
            await createMeasure(measure, measureLabel);
          }
          $scope.saveDoc();
        }

        async function createDimension(field, label) {
          await enigma.createDimension({
            qProp: {
              qDim: {
                qFieldDefs: [field],
                qFieldLabels: [label],
                title: label,
              },
              qInfo: {
                qType: "dimension",
              },
              qMetaDef: {
                title: label,
                tags: ["Created by Sistel extension."],
              },
            },
          });
        }

        function getMasterDimension(fieldName) {
          var masterDimension = null;
          $scope.dimensions.forEach((dim) => {
            var dimName = dim.qData.info[0].qName;
            if (fieldName == dimName) {
              masterDimension = {
                label: dim.qData.title,
                id: dim.qInfo.qId,
              };
              return;
            }
          });

          return masterDimension;
        }

        function getMasterMeasure(variableName) {
          var masterMeasure = null;
          $scope.measures.forEach((measure) => {
            const id = measure.qInfo.qId;
            if (id == variableName) {
              masterMeasure = {
                id: id,
                label: measure.qMeta.title,
                format: "TO-DO",
              };
              return;
            }
          });
          return masterMeasure;
        }

        async function createMeasure(variable, label) {
          const config = {
            qProp: {
              qInfo: {
                qId: variable.qName,
                qType: "measure",
              },
              qMeasure: {
                qLabel: label,
                qDef: variable.qDefinition,
                qNumFormat: { 
                  qType: variable.measureType,
                  qFmt: variable.measureFormat
                }
              },
              qMetaDef: {
                title: label,
                tags: ["Created by Sistel extension"],
              },
            },
          };

          await enigma.createMeasure(config);
        }
      },
    ],
  };
});
