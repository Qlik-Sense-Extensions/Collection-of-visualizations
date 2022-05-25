define([
  'qlik',
  'jquery',
  '../export_data/bootstrap.min',
  'text!../export_data/css/scoped-bootstrap.css',
  '../export_data/FileSaver.min',
  './js/senseUtils'],
  function(qlik, $, bootstrap, bootstrapcssContent) {
    'use strict';
    $( "<style>" ).html( bootstrapcssContent ).appendTo( "head" );
    return {
      initialProperties: {
        version: 1.0,
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qInitialDataFetch: [{
            qWidth: 6,
            qHeight: 1500
          }]
        }
      },
      definition: {
        type: 'items',
        component: 'accordion',
        items: {
          dimensions: {
            uses: 'dimensions',
            min: 0
          },
          measures: {
            uses: 'measures',
            min: 0
          },
          sorting: {
            uses: 'sorting'
          },
          settings: {
            uses: 'settings',
            items: {
              ButtonName: {
                // Number of choropleth classes
                type: 'string',
                label: 'Button Label',
                ref: 'buttonname',
                defaultValue: 'Export Table'
              },
            }
          }
        }
      },
      snapshot: {
        canTakeSnapshot: true
      },
      paint: function($element, layout) {
        var self = this;
        // Disable caching - otherwise can't repeatedly call getData()
        self.backendApi.cacheCube.enabled = false;

        if (layout.qHyperCube.qSize.qcy <= 500000) {

          // Call viz
          var id = senseUtils.setupContainer($element, layout,
              'export_data');
          $('#' + id).empty();
          var outerdiv = $('<div/>').attr('class', 'bootstrap_inside');
		  if (!layout.buttonname) {
		  	layout.buttonname = "Export Table";
		  }
          // Add export button
          var btn = $('<button/>')
            .attr('id', 'ExportButton1')
            .attr('class', 'btn btn-primary')
            .append('<span class="glyphicon glyphicon-save"></span> ' + layout.buttonname)
            .on('click', function() {

              if (layout.qHyperCube.qSize.qcy <= 500000) {
                $('#ExportButton1').prop('disabled', true);
                $("body").css("cursor", "progress");
                var qTotalData = [];
                // Get arrays of all dimensions & fields
                var dimFields = layout.qHyperCube.qDimensionInfo.map(function(d) {
                  return d.qFallbackTitle; });
                var measFields = layout.qHyperCube.qMeasureInfo.map(function(d) {
                  return d.qFallbackTitle; });
                var columns = layout.qHyperCube.qSize.qcx;
                var pageheight = Math.floor(10000 / columns);
                // Maximum of 10000 cells at one time, so break it up into pages
                var numberOfPages = Math.ceil(layout.qHyperCube.qSize.qcy / pageheight);
                var ctr = 0;
				console.log("Exporting " + layout.qHyperCube.qSize.qcy + " rows and " + columns + " columns.");
                // Loop through the pages and offset each page by the prescribed
                // amount. Call getData() on each
                Array.apply(null, Array(numberOfPages)).map(function(data, index) {
                  var page = [{
                    qTop: (pageheight * index),
                    qLeft: 0,
                    qWidth: columns,
                    qHeight: pageheight
                  }];

                  return self.backendApi.getData(page).then(function(data2) {
                    // Push this page's matrix into the combined matrix
                    for (var k = 0; k < data2[0].qMatrix.length; k++) {
                      qTotalData.push(data2[0].qMatrix[k])
                    }
                    ctr++;
                    // If reached the last page, call viz
                    if (ctr == numberOfPages) {
                      // Set combined matrix as default
                      layout.qHyperCube.qDataPages[0].qMatrix = qTotalData;

                      senseUtils.extendLayout(layout, self);
                      // Set up column headers (dims)
                      var result = dimFields.join(',');
                      if (measFields.length > 0) {
                        // If measures exist, add those as well
                        result += ',' + measFields.join(',');
                      }
                      result += '\n';
                      // Loop through all data and append to CSV string
                      qTotalData.forEach(function(obj, i) {
                        obj.forEach(function(f, j) {
                          if (j != 0) {
                            result += ',';
                          }
                          result += '"' + f.qText + '"';
                        });
                        result += '\n';
                      });
                      //Save as blob
                      var blob = new Blob([result],
                        { type: 'text/csv;charset=utf-8;' });
                      //FileSaver.saveAs
                      saveAs(blob, 'table_export.csv');
                      $("body").css("cursor", "default");

                    }
                  });
                }, this)
              } else {
                alert('Please filter table to less than 500,000 records.')
              }

          });
          outerdiv.append(btn);
          $('#' + id).append(outerdiv);
        }

      },
      resize: function($el, layout) {
        this.paint($el, layout);
      }
    };

  });