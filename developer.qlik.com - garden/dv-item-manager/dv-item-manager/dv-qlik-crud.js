define([], function () {
  return {
    //==================================================================================================================================================//	
    //***********************************<Start>**********************************************************************************************************//
    //==================================================================================================================================================//
    getProperties: function getProperties(ext, type, id) {
      switch (type) {
        case 'dimension':
          return ext.backendApi.model.enigmaModel.app.engineApp.getDimension(id).then(function (result) {
            return result.getProperties().then(function (props) {
              return props;
            });
          });
          break;

        case 'measure':
          return ext.backendApi.model.enigmaModel.app.engineApp.getMeasure(id).then(function (result) {
            return result.getProperties().then(function (props) {
              return props;
            });
          });
          break;

        case 'variable':
          return ext.backendApi.model.enigmaModel.app.engineApp.getVariableById(id).then(function (result) {
            return result.getProperties().then(function (props) {
              return props;
            });
          });
          break;
      }

      return o.getProperties().then(function (props) {
        return props;
      });
    },
    //-----------------------------------------------------
    createVariable: function createVariable(ext, name) {
      var definition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var comment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var tags = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
      //myExtension.backendApi.model.enigmaModel.app.engineApp.destroyVariableByName(name).then(function(v){console.log(v)})
      var param = {
        "qInfo": {
          "qId": name,
          "qType": "variable"
        },
        "qName": name,
        "qDefinition": definition,
        "qComment": comment,
        "tags": tags
      };
      ext.backendApi.model.enigmaModel.app.engineApp.createVariableEx(param).then(function (v) {});
    },
    //-----------------------------------------------------
    deleteVariable: function deleteVariable(ext, name) {
      return ext.backendApi.model.enigmaModel.app.engineApp.destroyVariableByName(name).then(function (v) {
        return v;
      });
    },
    //-----------------------------------------------------
    deleteMeasure: function deleteMeasure(ext, id) {
      return ext.backendApi.model.enigmaModel.app.engineApp.destroyMeasure(id).then(function (v) {
        return v;
      });
    },
    //-----------------------------------------------------
    deleteDimension: function deleteDimension(ext, id) {
      return ext.backendApi.model.enigmaModel.app.engineApp.destroyDimension(id).then(function (v) {
        return v;
      });
    },
    //-----------------------------------------------------
    cloneDimension: function cloneDimension(ext, id) {
      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ClonedDimension';
      return ext.backendApi.model.enigmaModel.app.engineApp.cloneDimension(id).then(function (result) {
        ext.backendApi.model.enigmaModel.app.engineApp.getDimension(result.qCloneId).then(function (dimension) {
          dimension.getProperties().then(function (props) {
            props.qDim.title = name;
            props.qMetaDef.title = name;
            dimension.setProperties(props);
          });
        });
      });
    },
    //-----------------------------------------------------
    cloneMeasure: function cloneMeasure(ext, id) {
      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ClonedMeasure';
      return ext.backendApi.model.enigmaModel.app.engineApp.cloneMeasure(id).then(function (result) {
        ext.backendApi.model.enigmaModel.app.engineApp.getMeasure(result.qCloneId).then(function (measure) {
          measure.getProperties().then(function (props) {
            props.qMeasure.qLabel = name;
            props.qMetaDef.title = name;
            measure.setProperties(props);
          });
        });
      });
    },
    //-----------------------------------------------------
    cloneVariable: function cloneVariable(ext, id) {
      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ClonedVariable';
      qCRUD = this;
      ext.backendApi.model.enigmaModel.app.engineApp.getVariableById(id).then(function (v) {
        v.getProperties().then(function (props) {
          qCRUD.createVariable(ext, name, props.qDefinition, props.qComment, props.tags);
        });
      });
    },
    //-----------------------------------------------------
    updateVariable: function updateVariable(ext, id, name, definition, comment, tags) {
      ext.backendApi.model.enigmaModel.app.engineApp.getVariableById(id).then(function (v) {
        v.getProperties().then(function (props) {
          props.qName = name;
          props.qIncludeInBookmark = true;
          props.qDefinition = definition;
          props.qComment = comment;
          props.tags = tags;
          v.setProperties(props);
        });
      });
    },
    //-----------------------------------------------------
    updateMeasure: function updateMeasure(ext, id, name, label, description, definition, tags) {
      return ext.backendApi.model.enigmaModel.app.engineApp.getMeasure(id).then(function (m) {
        m.getProperties().then(function (props) {
          props.qMeasure.qDef = definition;
          props.qMeasure.qLabel = name;
          props.qMeasure.qLabelExpression = label;
          props.qMetaDef.title = name;
          props.qMetaDef.description = description;
          props.qMetaDef.tags = tags;
          m.setProperties(props).then(function (sResult) {
            console.log('set', sResult);
          });
        });
      });
    },
    //-----------------------------------------------------
    updateDimension: function updateDimension(ext, id, name, label, description, definition, tags) {
      return ext.backendApi.model.enigmaModel.app.engineApp.getDimension(id).then(function (d) {
        d.getProperties().then(function (props) {
          props.qDim.qFieldDefs = definition;
          props.qDim.title = name;
          props.qDim.qLabelExpression = label;
          props.qMetaDef.title = name;
          props.qMetaDef.description = description;
          props.qMetaDef.tags = tags;
          d.setProperties(props).then(function (sResult) {
            console.log('set', sResult);
          });
        });
      });
    },
    //-----------------------------------------------------
    retrieveVariable: function retrieveVariable(v, num) {
      return {
        "num": num,
        "show": true,
        "type": {
          value: 'variable',
          display: '<span title="Variable" class="lui-icon lui-icon--expression"></span>'
        },
        "id": v.qInfo.qId,
        "name": {
          value: v.qName,
          display: ''
        },
        "label": {
          value: null,
          display: null
        },
        //"bookmark": v.qIncludeBookmark == true ? false : true,
        "description": {
          value: v.qDescription == undefined ? '' : v.qDescription,
          display: ''
        },
        "definition": {
          value: v.qDefinition == undefined ? '' : v.qDefinition,
          display: ''
        },
        "tags": {
          value: v.qData.tags == "" ? [] : Array.from(v.qData.tags),
          display: ''
        },
        "origin": {
          value: v.qIsScriptCreated == true ? 'Script' : 'App',
          display: v.qIsScriptCreated == true ? '<span title="Script" class="lui-icon lui-icon--script"></span>' : '<span title="App" class="lui-icon lui-icon--application"></span>'
        }
      };
    },
    //-----------------------------------------------------
    retrieveMeasure: function retrieveMeasure(m, num) {
      return {
        "num": num,
        "show": true,
        "type": {
          value: 'measure',
          display: '<span title="Measure" class="lui-icon lui-icon--measure"></span>'
        },
        "id": m.qInfo.qId,
        "name": {
          value: m.qMeta.title.toString(),
          display: ''
        },
        "label": {
          value: m.qData.qMeasure.qLabelExpression,
          display: ''
        },
        "description": {
          value: m.qMeta.description == undefined ? '' : m.qMeta.description,
          display: ''
        },
        "definition": {
          value: m.qData.qMeasure.qDef == undefined ? '' : m.qData.qMeasure.qDef,
          display: ''
        },
        "tags": {
          value: m.qMeta.tags == "" ? [] : Array.from(m.qMeta.tags),
          display: ''
        },
        "origin": {
          value: 'App',
          display: '<span title="App" class="lui-icon lui-icon--application"></span>'
        },
        "other": {
          coloring: m.qData.qMeasure.coloring
        }
      };
    },
    retrieveDimension: function retrieveDimension(d, num) {
      return {
        "num": num,
        "show": true,
        "type": {
          value: 'dimension',
          display: '<span title="Dimension" class="lui-icon lui-icon--data-model"></span>'
        },
        "id": d.qInfo.qId,
        "name": {
          value: d.qData.title.toString(),
          display: ''
        },
        "label": {
          value: d.qData.qDim.qLabelExpression == undefined ? '' : d.qData.qDim.qLabelExpression,
          display: ''
        },
        "description": {
          value: d.qMeta.description,
          display: ''
        },
        "definition": {
          value: Array.isArray(d.qData.qDim.qFieldDefs) ? Array.from(d.qData.qDim.qFieldDefs) : d.qData.qDim.qFieldDefs.toString(),
          display: d.qData.qDim.qFieldDefs.toString()
        },
        "tags": {
          value: d.qMeta.tags == "" ? [] : Array.from(d.qMeta.tags),
          display: ''
        },
        "origin": {
          value: 'App',
          display: '<span title="App" class="lui-icon lui-icon--application"></span>'
        },
        "other": {
          coloring: d.qData.coloring,
          grouping: d.qData.qDim.qGrouping
        }
      };
    }
  };
});