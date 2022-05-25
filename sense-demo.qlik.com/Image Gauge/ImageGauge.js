define(["jquery", "qlik", "./lib/utils", "./gauge-properties", "./lib/paper-full.min"],
  // core.utils/theme n'est pas officielement supporté mais permet d'utiliser le colorPicker
  function($, qlik, utils, properties) {

    return {
      //type : "Gauge",
      //Refer to the properties file

      definition: properties,
      initialProperties: {
        version: 1.4,
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],

          qInitialDataFetch: [{
            qTop: 0,
            qLeft: 0,
            qHeight: 300,
            qWidth: 3
          }]
        }
      },

      paint: function($element, layout) {


        var qId = layout.qInfo.qId,
          qFallBackTitle = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
          qVal = layout.qHyperCube.qGrandTotalRow[0].qNum,
          qTxt = layout.qHyperCube.qGrandTotalRow[0].qText,
          minVal = layout.measureAxis.min,
          maxVal = layout.measureAxis.max,
          mode = layout.gauge.props.presentation,
          orientation = layout.gauge.props.orientation,
          opacity = layout.gauge.props.opacity,
          reversed = layout.gauge.props.reversed,
          fillColor,
          html = "<canvas id='" + qId + "' style='width:100%;height:100%'></canvas>",
          self = this;

        if (layout.gauge.props.fillColor != undefined) {
          fillColor = getColor(layout.gauge.props.fillColor);
        };

        if (utils.isInEditState() || layout.gauge.scope == undefined || $element.html() == '' || self._inEditState || layout.gauge.prevWidth != $element.width() || layout.gauge.prevHeight != $element.height()) {
          layout.gauge.scope = new paper.PaperScope();
          $element.html(html);
          layout.gauge.scope.setup(qId);
          layout.gauge.prevWidth = $element.width();
          layout.gauge.prevHeight = $element.height();
          with(layout.gauge.scope) {
            if (layout.gauge.props.imgSourceType == "local") {
              imgSrc = layout.gauge.props.imgLocalSource
            } else {
              imgSrc = layout.gauge.props.imgOnlineSource
            }

            layout.gauge.raster = new Raster({
              crossOrigin: 'anonymous',
              source: imgSrc,
              visible: false
                //position:  [0,0]
            });

            self.gaugify = function(val, min, max, orientation, reversed) { //sets gauge rectangle
              if(isNaN(val)){
                val = 0;
              }
              ratio = Math.min(1, (val - min) / (max - min));
              if (mode == "colorFill") {
                draw_backgroundFill(ratio, orientation, reversed);
              } else if (mode == "alpha") {
                draw_alpha(ratio, orientation, reversed);
              }
              render_label(val);

            };

            var render_label = function(val) {

              val = layout.qHyperCube.qGrandTotalRow[0].qText;
              displayValue = layout.gauge.props.displayValue;
              displayLabel = layout.gauge.props.displayLabel;
              if (layout.gauge.text == undefined || layout.gauge.label == undefined) {

                layout.gauge.text = new PointText(layout.gauge.raster.bounds.bottomCenter.add(new Point(0, 35)));
                layout.gauge.text.fillColor = 'black'
                layout.gauge.text.fontSize = displayValue ? 35 : 0;
                layout.gauge.text.justification = 'center';
                layout.gauge.text.fontFamily = 'QlikView Sans';
                layout.gauge.text.content = val;

                layout.gauge.label = new PointText(layout.gauge.text.bounds.bottomCenter.add(new Point(0, layout.gauge.text.fontSize * .4)));
                layout.gauge.label.fillColor = 'grey'
                layout.gauge.label.fontSize = displayLabel ? layout.gauge.text.fontSize * .5 : 0;
                layout.gauge.label.justification = 'center';
                layout.gauge.label.fontFamily = 'QlikView Sans';
                layout.gauge.label.content = qFallBackTitle;

              } else {
                layout.gauge.goalContent=
                layout.gauge.text.content = val;
                layout.gauge.label.content = qFallBackTitle;
                //layout.gauge.text.fitBounds(layout.gauge.labelRect);
              }


              while (layout.gauge.text.fontSize > 0 && (layout.gauge.raster.bounds.intersects(layout.gauge.text.bounds) || !layout.gauge.scope.view.bounds.contains(layout.gauge.label.bounds))) {
                layout.gauge.text.fontSize--;
                layout.gauge.label.fontSize = displayLabel ? layout.gauge.text.fontSize * .5 : 0;
                layout.gauge.text.position.y--;
                layout.gauge.label.position.y = layout.gauge.text.bounds.bottomCenter.add(new Point(0, layout.gauge.text.fontSize * .5)).y;
              }
              if (layout.gauge.text.fontSize < 15) {
                layout.gauge.text.fontSize = 0;
                layout.gauge.label.fontSize = 0;
              }


            };

            var draw_alpha = function(ratio, orientation, reversed) {
              if (layout.gauge.rectangle == undefined) {
                layout.gauge.rectangle = new Shape.Rectangle(layout.gauge.raster.bounds);
              }
              layout.gauge.goalRectangle = getRect(ratio, orientation, !reversed);
              layout.gauge.rectangle.strokeColor = 'white';
              layout.gauge.rectangle.fillColor = 'white';
              layout.gauge.rectangle.opacity = 1 - opacity;
            };

            var draw_backgroundFill = function(ratio, orientation, reversed) {
              if (layout.gauge.rectangle == undefined) {
                layout.gauge.rectangle = new Shape.Rectangle(layout.gauge.raster.bounds);
              }
              layout.gauge.goalRectangle = getRect(ratio, orientation, reversed);
              //layout.gauge.rectangle.fitBounds(getRect(ratio, orientation, reversed));
              layout.gauge.rectangle.strokeColor = 'white';
              layout.gauge.rectangle.fillColor = getColor(layout.gauge.props.fillColor);
              layout.gauge.rectangle.sendToBack();
              //  layout.gauge.scope.refresh();


            };

            var getRect = function(ratio, orientation, reversed) {
              raster = layout.gauge.raster;
              bottomLeft = raster.bounds.bottomLeft;
              topRight = raster.bounds.topRight;
              bottomRight = raster.bounds.bottomRight;
              topLeft = raster.bounds.topLeft;
              width = topRight.x - topLeft.x;
              height = bottomLeft.y - topLeft.y;
              xMax = raster.handleBounds.topRight.x;
              yMax = raster.handleBounds.bottomRight.y;

              if (orientation == "vertical") {
                rect = new Rectangle(bottomLeft, new Point(bottomRight.x, topLeft.y + height * (1 - ratio)));
                p = rect.topLeft;
                layout.gauge.anchor = rect.bottomLeft;
              } else if (orientation == "horizontal") {
                rect = new Rectangle(topLeft, new Point(topLeft.x + width * ratio, yMax));
                p = rect.bottomRight;
                layout.gauge.anchor = rect.topLeft;
              }

              if (reversed == true) {
                rect = new Rectangle(topRight, p);
                layout.gauge.anchor = rect.topRight;
              }

              return rect;

            };
          }


        } else {
          with(layout.gauge.scope) {


            self.gaugify(qVal, minVal, maxVal, orientation, reversed);
          }
        }

        with(layout.gauge.scope) {
          layout.gauge.raster.onLoad = function() {
            raster = layout.gauge.raster;
            raster.fitBounds(view.bounds);
            raster.scale(0.8, raster.bounds.topCenter);

            if (layout.gauge.rectangle != undefined) {
              layout.gauge.rectangle.remove();
              layout.gauge.rectangle = undefined;
              layout.gauge.text = undefined;
              layout.gauge.label = undefined
            }
            raster.visible = true;
            self.gaugify(qVal, minVal, maxVal, orientation, reversed);
            //view.draw();

          };
          view.onFrame = function(event) {
            if (event.count % 2 == 0) {



              if (layout.gauge.rectangle != undefined && layout.gauge.goalRectangle != undefined) {

                hScale = Math.sqrt(Math.cbrt(layout.gauge.goalRectangle.width / layout.gauge.rectangle.bounds.width));
                vScale = Math.sqrt(Math.cbrt(layout.gauge.goalRectangle.height / layout.gauge.rectangle.bounds.height));
                if (Number.isNaN(hScale) || !Number.isFinite(hScale) || hScale == 0) {
                  layout.gauge.rectangle.width = 0.1;
                  hScale = Math.sqrt(Math.cbrt(layout.gauge.goalRectangle.width + .1 / layout.gauge.rectangle.bounds.width + .1));

                }
                if (Number.isNaN(vScale) || !Number.isFinite(vScale) || vScale == 0) {
                  //layout.gauge.rectangle.size.height = 0.1;
                  vScale = Math.sqrt(Math.cbrt(layout.gauge.goalRectangle.height + .1 / layout.gauge.rectangle.bounds.height + .1));

                }
                layout.gauge.rectangle.scale(hScale, vScale, layout.gauge.anchor);

              }
            }
          }

        }

      }
    }
  });
