define(["qlik", "jquery", "qvangular", "./dv-qlik-crud", "./dv-qlik-dialog", "text!./style.css", "text!./template-toolbar.html", "text!./template-table.html"], function (qlik, $, qvangular, qCRUD, qDialog, cssContent, toolbarTemplate, tableTemplate) {
  $("<style>").html(cssContent).appendTo("head");
  return {
    initialProperties: {
      qVariableListDef: {
        qType: 'variable',
        qShowReserved: false,
        qShowConfig: false,
        qData: {
          tags: "/tags"
        }
      },
      qMeasureListDef: {
        qType: "measure",
        qData: {
          qMeasure: "/qMeasure"
        }
      },
      qDimensionListDef: {
        qType: "dimension",
        qData: {
          qDim: "/qDim",
          qDimInfos: "/qDimInfos"
        }
      }
    },
    //definition:props,
    support: {
      snapshot: false,
      "export": false,
      exportData: false
    },
    paint: function paint($element, layout) {
      //=====================================================================================================//
      try {
        //$element[0].innerText='test';
        //console.log(navigator.userAgent,navigator.appName, navigator.appVersion)
        var fields = ['num', 'type', 'name', 'label', 'definition', 'description', 'origin', 'tags'];
        var headers = ['#', 'Type', 'Name', 'Label', 'Definition', 'Description', 'Origin', 'Tags', 'Actions'];
        var luiPopover = qvangular.getService('luiPopover');
        var luiTooltip = qvangular.getService('luiTooltip');
        var myExtension = this;
        var container = $element[0];
        var objectList = [];
        var nameList = [];
        var toolbar;
        var table;
        var body;
        var outputField;
        var inputSearchName;
        var inputSearchTags;
        var inputSearchDescription;
        var inputSearchOrigin;
        var inputFindText;
        var inputReplaceText;
        var inputFindField;
        var inputApplyField;
        var inputApplyText;
        var inputTypeCheckboxes;
        if (this.painted) return;
        $element.empty();
        this.painted = true;
        createToolbar();
        refreshObjects();
        createTable();
        renderTableBody();
        container.appendChild(toolbar);
        var tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        tableContainer.appendChild(table);
        container.appendChild(tableContainer);
      } catch (err) {
        console.log(err);
        $element[0].innerText = 'Error: ' + err.message;
      } //-----------------------------------------------------


      function write() {
        sField = inputApplyField.value;
        sValue = inputApplyText.value;
        objectList.forEach(function (obj) {
          if (obj['show'] == true && obj[sField].value !== null) {
            xx = Array.isArray(obj[sField].value);

            if (!Array.isArray(obj[sField].value)) {
              obj[sField].value = sValue;
              obj[sField].display = "<mark style=\"background-color:#db94ca;\">".concat(sValue, "</mark>");
            } else {
              addArrayItem(obj, sField, sValue);
            }
          }
        });
        renderTableBody();
      } //-----------------------------------------------------


      function replaceArrayItem(obj, sField, regex, sText) {
        for (i = 0; i < obj[sField].value.length; i++) {
          sValue = obj[sField].value[i];
          sNewValue = sValue.replace(regex, sText);

          if (!sNewValue == '') {
            obj[sField].value[i] = sNewValue;
          } else {
            obj[sField].value.splice(i, 1);
          }
        }
      } //-----------------------------------------------------


      function addArrayItem(obj, sField, sTags) {
        obj[sField].display = obj[sField].value.toString();
        sTags.split(',').forEach(function (sTag) {
          if (!obj[sField].value.includes(sTag)) {
            sDisplayNew = "<mark style=\"background-color:#db94ca;\">".concat(sTag, "</mark>");
            sDisplay = obj[sField].display;
            obj[sField].display = sDisplay == '' ? sDisplay + sDisplayNew : sDisplay + ',' + sDisplayNew;
            obj[sField].value.push(sTag);
          }
        });
      } //-----------------------------------------------------


      function stripInvalidRegex(inputString) {
        var specialChar = ['[', '\\', '^', '$', '.', '|', '?', '*', '+', '(', ')'];
        var output = [];
        var outputString;

        var _char;

        console.log(specialChar);

        for (i = 0; i < inputString.length; i++) {
          _char = inputString.charAt(i);

          if (specialChar.includes(_char)) {
            output.push('\\');
          }

          output.push(_char);
        }

        outputString = output.join('');
        return outputString;
      } //-----------------------------------------------------


      function findReplace(sMode) {
        var sCurrentField = inputFindField.value;
        outputField = sCurrentField;
        sFind = stripInvalidRegex(inputFindText.value);
        sReplace = inputReplaceText.value;
        sRegexParameters = 'g';
        bHasMatch = false;
        sCurrentValue = '';
        var myRegExp = new RegExp(sFind, sRegexParameters);
        objectList.forEach(function (obj) {
          if (obj[sCurrentField].value !== null) {
            sCurrentValue = obj[sCurrentField].value.toString();
            obj.show = false;
            matches = sCurrentValue.match(myRegExp);

            if (matches != null && checkAll(obj)) {
              bHasMatch = true;
              obj.show = true;

              if (sMode == 'find') {
                obj[sCurrentField].display = sCurrentValue.replace(myRegExp, "<mark style=\"background-color:#68b5de;\">".concat(matches[0], "</mark>"));
              } else {
                //replace
                obj[sCurrentField].display = sCurrentValue.replace(myRegExp, "<mark style=\"background-color:#fab761;\">".concat(sReplace, "</mark>"));

                if (Array.isArray(obj[sCurrentField].value)) {
                  replaceArrayItem(obj, sCurrentField, myRegExp, sReplace);
                } else {
                  obj[sCurrentField].value = sCurrentValue.replace(myRegExp, sReplace);
                }
              }
            }
          }
        });

        if (bHasMatch) {
          renderTableBody();
        }

        ;
      } //-----------------------------------------------------


      function saveAll() {
        qDialog.luiConfirm(luiPopover, {
          element: this,
          body: 'Are you sure you want to update all visible varaibles?',
          confirm: function confirm() {
            objectList.forEach(function (v) {
              updateObject(v);
            });
          }
        });
      } //-----------------------------------------------------


      function removeTableRow(num) {
        body.querySelector("[data-num='".concat(num, "']")).remove();
      } //-----------------------------------------------------


      function updateObject(obj) {
        if (obj.show) {
          switch (obj.type.value) {
            case 'variable':
              qCRUD.updateVariable(myExtension, obj['id'], obj['name'].value, obj['definition'].value, obj['description'].value, obj['tags'].value);
              break;

            case 'dimension':
              qCRUD.updateDimension(myExtension, obj['id'], obj['name'].value, obj['label'].value, obj['description'].value, obj['definition'].value, obj['tags'].value);
              break;

            case 'measure':
              qCRUD.updateMeasure(myExtension, obj['id'], obj['name'].value, obj['label'].value, obj['description'].value, obj['definition'].value, obj['tags'].value);
              break;
          }
        }
      } //-----------------------------------------------------


      function cloneObject(obj, param) {
        //isNaN(num) 
        var nameList = []; //if numeric repeat current name x number of times. If string split by comma and create copy for each

        if (isNaN(param)) {
          //non numeric
          nameList = param.split(',');
        } else {
          //numeric
          copyCount = param;

          for (i = 0; i < copyCount; i++) {
            nameList.push(obj.name.value + (i + 1).toString());
          }
        } //console.log(nameList);


        nameList.forEach(function (newName) {
          if (obj.show) {
            switch (obj.type.value) {
              case 'variable':
                qCRUD.cloneVariable(myExtension, obj.id, newName);
                break;

              case 'dimension':
                qCRUD.cloneDimension(myExtension, obj.id, newName);
                break;

              case 'measure':
                qCRUD.cloneMeasure(myExtension, obj.id, newName);
                break;
            }
          }
        });
      } //-----------------------------------------------------


      function deleteObject(obj) {
        var num = obj.num;

        if (obj.show) {
          switch (obj.type.value) {
            case 'variable':
              qCRUD.deleteVariable(myExtension, obj.name.value).then(function (r) {
                if (r.qSuccess) {
                  removeTableRow(num);
                }

                ;
              });
              break;

            case 'dimension':
              qCRUD.deleteDimension(myExtension, obj.id).then(function (r) {
                if (r.qSuccess) {
                  removeTableRow(num);
                }

                ;
              });
              break;

            case 'measure':
              qCRUD.deleteMeasure(myExtension, obj.id).then(function (r) {
                if (r.qSuccess) {
                  removeTableRow(num);
                }

                ;
              });
              break;
          }
        }
      } //-----------------------------------------------------


      function deleteAll() {
        qDialog.luiConfirm(luiPopover, {
          element: this,
          body: 'Are you sure you want to delete the selected items(s)?',
          confirm: function confirm() {
            objectList.forEach(function (obj) {
              deleteObject(obj);
            });
          }
        });
      } //-----------------------------------------------------


      function createVariableMultiple() {
        for (i = 1; i <= 10; i++) {
          createVariable("vNewVar".concat(i));
        }
      } //-----------------------------------------------------


      function refresh() {
        refreshObjects();
        search();
      } //-----------------------------------------------------


      function search() {
        objectList.forEach(function (obj) {
          obj['show'] = false; //console.log(obj);

          if (checkAll(obj)) {
            obj['show'] = true;
          }
        });
        renderTableBody();
      } //-----------------------------------------------------


      function checkAll(oobj) {
        var aTypes = getTypeSelections();

        if (checkMatch(oobj, 'tags', inputSearchTags.value, aTypes) && checkMatch(oobj, 'name', inputSearchName.value, aTypes) && checkMatch(oobj, 'origin', inputSearchOrigin.value, aTypes)) {
          return true;
        } else {
          return false;
        }
      } //-----------------------------------------------------


      function checkMatch(obj, sField, sPattern, aTypes) {
        var sValue = obj[sField].value.toString();
        var bResult = false;

        if (!aTypes.includes(obj.type.value)) {
          bResult = false;
        } else if (sPattern == '') {
          bResult = true;
        } else if (sPattern == 'All') {
          bResult = true;
        } else if (sValue == sPattern) {
          bResult = true;
        } else if (sValue.search(sPattern) >= 0) {
          bResult = true;
        } else {
          bResult = false;
        }

        ; //console.log(sField,sValue,sPattern,bResult);

        return bResult;
      } //-----------------------------------------------------


      function cellClick() {
        var field = this.getAttribute('data-field');
        var num = this.parentElement.getAttribute('data-num');
        toClipboard(objectList[num - 1][field].value);
      } //-----------------------------------------------------


      function renderTableBody() {
        var sCurrentField = outputField;
        body.innerHTML = '';
        var eFrag = document.createDocumentFragment();
        var sValue;
        objectList.forEach(function (obj) {
          if (obj['show'] == true) {
            var eRow = document.createElement('tr');
            eRow.setAttribute('data-num', obj.num);
            eRow.setAttribute('data-id', obj.id);
            fields.forEach(function (field) {
              var eCell = document.createElement('td');
              var span = document.createElement('span');
              eCell.appendChild(span);
              eCell.setAttribute('data-field', field);
              eCell.addEventListener('click', cellClick);
              eRow.appendChild(eCell); //console.log(field,typeof(obj[field].value),Array.isArray(obj[field].value))

              try {
                sValue = field == 'num' ? obj.num : obj[field].display == '' ? obj[field].value.toString() : obj[field].display;
                span.innerHTML = sValue;
              } catch (_unused) {
                console.warn(field, obj);
              }

              ;
            });
            var eCell = document.createElement('td');
            eCell.appendChild(addRowButtons(obj['num'] - 1));
            eRow.appendChild(eCell);
            eFrag.appendChild(eRow);
          }
        });
        body.appendChild(eFrag);
      } //-----------------------------------------------------


      function toClipboard(sText) {
        navigator.clipboard.writeText(sText).then(function () {
          /* clipboard successfully set */
        }, function () {
          /* clipboard write failed */
        });
      } //-----------------------------------------------------


      function addRowButtons(index) {
        var btnGroup = document.createElement('div');
        btnGroup.className = 'lui-buttongroup';
        var icons = ['save', 'remove', 'copy', 'debug'];
        var styles = ['', '', '', ''];
        var titles = ['Save', 'Delete', 'Copy', 'Debug'];

        for (i = 0; i < icons.length; i++) {
          var btn = document.createElement('button');
          btn.className = "lui-button lui-button--".concat(styles[i], " lui-buttongroup__button");
          btn.setAttribute('data-index', index);
          btn.title = titles[i];
          btn.addEventListener('click', rowButtonClick);
          btn.innerHTML = "<span class=\"lui-button__icon  lui-icon  lui-icon--".concat(icons[i], "\"></span>");
          btnGroup.appendChild(btn);
        }

        return btnGroup;
      } //-----------------------------------------------------


      function rowButtonClick() {
        vIndex = this.getAttribute('data-index'); //console.log(this.getAttribute('data-index'));
        //console.log(this.name)

        switch (this.title) {
          case 'Edit':
            qDialog.luiVariableEdit(luiPopover, {
              element: this
            });
            break;

          case 'Save':
            qDialog.luiConfirm(luiPopover, {
              element: this,
              confirm: function confirm() {
                updateObject(objectList[vIndex]);
              },
              header: "Save ".concat(objectList[vIndex].type.value, " ").concat(objectList[vIndex].type.display),
              body: 'Are you sure you want to save this variable?'
            }); // code block

            break;

          case 'Delete':
            qDialog.luiConfirm(luiPopover, {
              element: this,
              confirm: function confirm() {
                deleteObject(objectList[vIndex]);
              },
              header: "Delete ".concat(objectList[vIndex].type.value, " ").concat(objectList[vIndex].type.display),
              body: 'Are you sure you want to delete this variable?'
            });
            break;

          case 'Copy':
            qDialog.luiCopy(luiPopover, {
              element: this,
              confirm: function confirm(name) {
                console.log('Clone', name);
                cloneObject(objectList[vIndex], name);
                ;
              },
              header: "Copy ".concat(objectList[vIndex].type.value, " ").concat(objectList[vIndex].type.display),
              body: 'Are you sure you want to delete this variable?'
            }); // code block

            break;

          case 'Debug':
            qCRUD.getProperties(myExtension, objectList[vIndex].type.value, objectList[vIndex].id).then(function (result) {
              console.log(result);
            });
            break;
        }
      } //-----------------------------------------------------


      function refreshObjects() {
        var num = 0;
        nameList = [];
        objectList = []; //Variables

        layout.qVariableList.qItems.forEach(function (v) {
          num += 1;
          nameList.push(v.qName);
          objectList.push(qCRUD.retrieveVariable(v, num));
        }); //Measures

        layout.qMeasureList.qItems.forEach(function (m) {
          num++;
          objectList.push(qCRUD.retrieveMeasure(m, num));
        }); //Dimensions

        layout.qDimensionList.qItems.forEach(function (d) {
          num++; //console.log(d)

          objectList.push(qCRUD.retrieveDimension(d, num));
        }); //console.log(layout.qVariableList.qItems);
        //console.log(objectList)
      } //-----------------------------------------------------


      function createTable() {
        table = document.createElement('table');
        table.innerHTML = tableTemplate;
        body = table.getElementsByTagName('tbody')[0];
      } //-----------------------------------------------------


      function createToolbar() {
        toolbar = document.createElement('div');
        toolbar.style = 'padding:1rem;';
        toolbar.innerHTML = toolbarTemplate;
        clearButtons = toolbar.getElementsByClassName('lui-search__clear-button');

        for (i = 0; i < clearButtons.length; i++) {
          clearButtons[i].addEventListener('click', function () {
            this.previousSibling.previousSibling.value = '';
          });
        }

        inputFindText = toolbar.getElementsByClassName('txtFind')[0];
        inputReplaceText = toolbar.getElementsByClassName('txtReplace')[0];
        inputFindField = toolbar.getElementsByClassName('fndrplField')[0];
        inputApplyField = toolbar.getElementsByClassName('applyField')[0];
        inputApplyText = toolbar.getElementsByClassName('apply')[0];
        inputSearchOrigin = toolbar.querySelector('select[name="variableSource"]');
        inputSearchTags = toolbar.querySelector('input[name="searchTags"]');
        inputSearchName = toolbar.querySelector('input[name="searchName"]');
        toolbar.getElementsByClassName('btnSet')[0].addEventListener('click', write);
        toolbar.getElementsByClassName('btnFind')[0].addEventListener('click', function () {
          findReplace('find');
        });
        toolbar.getElementsByClassName('btnReplace')[0].addEventListener('click', function () {
          findReplace('replace');
        });
        inputTypeCheckboxes = toolbar.querySelectorAll('input[name="type"]');
        toolbar.getElementsByClassName('btnRefresh')[0].addEventListener('click', refresh);
        toolbar.getElementsByClassName('btnSearch')[0].addEventListener('click', search);
        toolbar.getElementsByClassName('btnSave')[0].addEventListener('click', saveAll);
        toolbar.getElementsByClassName('btnDelete')[0].addEventListener('click', deleteAll);
        toolbar.getElementsByClassName('btnClear')[0].addEventListener('click', clearFields);
      } //-----------------------------------------------------


      function clearFields() {
        inputSearchOrigin.value = 'All';
        inputSearchTags.value = '';
        inputSearchName.value = '';
        inputFindText.value = '';
        inputReplaceText.value = '';
        inputApplyText.value = '';
        inputFindField.value = 'definition';
        inputApplyField.value = 'definition'; //Reset Checkboxes

        for (var i = 0, n = inputTypeCheckboxes.length; i < n; i++) {
          inputTypeCheckboxes[i].checked = true;
        }

        refresh();
      } //-----------------------------------------------------


      function getTypeSelections() {
        var vals = [];

        for (var i = 0, n = inputTypeCheckboxes.length; i < n; i++) {
          if (inputTypeCheckboxes[i].checked) {
            vals.push(inputTypeCheckboxes[i].value);
          }
        }

        return vals;
      } //====================================================================================================//
      //needed for export


      return qlik.Promise.resolve();
    }
  };
});