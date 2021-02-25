var myMap;
var featureLayer;
var dynamicMap;



require(["esri/map",
"esri/layers/ArcGISDynamicMapServiceLayer",
"esri/layers/FeatureLayer",

"esri/symbols/SimpleFillSymbol",
"esri/symbols/SimpleLineSymbol",
"esri/symbols/SimpleMarkerSymbol",

"esri/toolbars/draw",
"esri/graphic",
"esri/tasks/query",

"esri/Color",
"esri/renderers/SimpleRenderer",
"esri/renderers/ClassBreaksRenderer",
"esri/layers/LayerDrawingOptions",

"dojo/ready",
"dojo/parser",
"dojo/on",
"dojo/dom",

"dojo/store/Memory",
"dojo/date/locale",

"dojo/_base/Color",
"dojo/_base/declare",
"dojo/_base/array",

"dgrid/OnDemandGrid",
"dgrid/Selection",

"dijit/layout/BorderContainer", 
"dijit/layout/ContentPane", 
"dijit/form/Button"], function(Map, ArcGISDynamicMapServiceLayer, FeatureLayer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Draw,  Graphic, Query, Color, SimpleRenderer, ClassBreaksRenderer, LayerDrawingOptions, ready, parser, on, dom, Memory, locale, Color, declare, array, Grid, Selection,  BorderContainer, ContentPane, Button) {
    ready(function () {

    parser.parse();

    var gridQuakes = new (declare([Grid, Selection]))({
        bufferRows: Infinity,
        columns: {
            EQID: "ID",
            UTC_DATETIME: {
                "label": "Date/Time",
                "formatter": function (dtQuake) {
                    return locale.format(new Date(dtQuake));
                }
            },
            MAGNITUDE: "Mag",
            PLACE: "Place"
        }
    }, "divGrid");

    myMap = new Map("divMap", {
    basemap : "osm",
        center : [-119.65, 36.87],
        zoom: 4           
    });      

      dynamicMap = new ArcGISDynamicMapServiceLayer ("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {        
        opacity : 0.2        
      });
      dynamicMap.setVisibleLayers([0, 1, 3]);

      var outFieldsQuakes = ["EQID", "UTC_DATETIME", "MAGNITUDE", "PLACE"];      

      featureLayer = new FeatureLayer ("https://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0", {outFields: outFieldsQuakes});

      featureLayer.setDefinitionExpression("MAGNITUDE >= 2");

      myMap.addLayer(dynamicMap);

      myMap.addLayer(featureLayer);

      myMap.on("load", initDrawing);

      function initDrawing(){
          const toolbar = new Draw(myMap);
          toolbar.activate(Draw.POLYGON);
          toolbar.on("draw-end", addToMap);
      }

      function addToMap(params){
        console.log('terminé de pintar', params); 
        
        var geometryInput = params.geometry

        const symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.2]));

        myMap.graphics.clear();
                        
        var grafico = new Graphic(geometryInput, symbol);

        myMap.graphics.add(grafico);

        selectQuakes(geometryInput)
      };

         // Call the next function
        
        function selectQuakes(geometryInput) {

            // Define symbol for selected features (using JSON syntax for improved readability!)
            var symbolSelected = new SimpleMarkerSymbol({
                "type": "esriSMS",
                "style": "esriSMSCircle",
                "color": [255, 115, 0, 128],
                "size": 6,
                "outline": {
                    "color": [255, 0, 0, 214],
                    "width": 1
                }
            });
            /*
             * Step: Set the selection symbol
             */
            featureLayer.setSelectionSymbol(symbolSelected);
            /*
             * Step: Initialize the query
             */
            var queryQuakes = new Query();
            queryQuakes.geometry = geometryInput;
            /*
             * Step: Wire the layer's selection complete event
             */

            featureLayer.on("selection-complete", populateGrid);

            /*
             * Step: Perform the selection
             */

            featureLayer.selectFeatures(queryQuakes, FeatureLayer.SELECTION_NEW);

        }

        function populateGrid(results) {
           
            var gridData;

            dataQuakes = array.map(results.features, function (feature) {
                var outFieldsQuakes = ["EQID", "UTC_DATETIME", "MAGNITUDE", "PLACE"];
                return {              
                    /*
                     * Step: Reference the attribute field values
                     */
                    "EQID": feature.attributes[outFieldsQuakes[0]],
                    "UTC_DATETIME": feature.attributes[outFieldsQuakes[1]],
                    "MAGNITUDE": feature.attributes[outFieldsQuakes[2]],
                    "PLACE": feature.attributes[outFieldsQuakes[3]],

                }
            });
            console.log(dataQuakes)

            // Pass the data to the grid
            var memStore = new Memory({
                data: dataQuakes
            });
            gridQuakes.set("store", memStore);

            console.log("Hola")
        };
        
        // Construct and wire a button to apply the renderer
        myMap.on("layers-add-result", function () {
            console.log("Bien");

            var btnApplyRenderer = new Button({
                label: "Show County Population Density",
                onClick: changeCountiesRenderer
            }, "progButtonNode");

            // on(dom.byId("progButtonNode"), "click", changeCountiesRenderer)

            //update earthquakes using a renderer
            changeQuakesRenderer();

        });

        function changeQuakesRenderer() {

            // construct a  symbol for earthquake features
            var quakeSymbol = new SimpleMarkerSymbol();
            quakeSymbol.setColor(new Color([255, 0, 0, 0.5]));
            quakeSymbol.setOutline(null);


            /*
             * Step: Construct and apply a simple renderer for earthquake features
             */

            var earthquakeFeature = new SimpleRenderer(quakeSymbol);
            dynamicMap.setRenderer(earthquakeFeature);

            /*
             * Step: Construct symbol size info parameters for the quake renderer
             */
            var sizeInfo = {
                field: "MAGNITUDE",
                valueUnit: "unknown",
                minSize: 1,
                maxSize: 50,
                minDataValue: 0,
                maxDataValue: 9
            };

            /*
             * Step: Apply symbol size info to the quake renderer
             */

             earthquakeFeature.setSizeInfo(sizeInfo);

        };


        function changeCountiesRenderer() {
            console.log("boton")

            var symDefault = new SimpleFillSymbol().setColor(new Color([255, 255, 0]));

            /*
             * Step: Construct a class breaks renderer
             */

             var cbrCountyPopDensity = new ClassBreaksRenderer (symDefault, "pop00_sqmi");

            /*
             * Step: Define the class breaks
             */

            cbrCountyPopDensity.addBreak({
                minValue: 0,
                maxValue: 10,
                symbol: new SimpleFillSymbol().setColor(new Color([254, 240, 217]))
            });
            cbrCountyPopDensity.addBreak({
                minValue: 10,
                maxValue: 100,
                symbol: new SimpleFillSymbol().setColor(new Color([253, 204, 138]))
            });
            cbrCountyPopDensity.addBreak({
                minValue: 100,
                maxValue: 1000,
                symbol: new SimpleFillSymbol().setColor(new Color([252, 141, 89]))
            });
            cbrCountyPopDensity.addBreak({
                minValue: 1000,
                maxValue: 10000,
                symbol: new SimpleFillSymbol().setColor(new Color([227, 74, 51]))
            });
            cbrCountyPopDensity.addBreak({
                minValue: 10000,
                maxValue: 100000,
                symbol: new SimpleFillSymbol().setColor(new Color([179, 0, 0]))
            });


            /*
             * Step: Apply the renderer to the Counties layer
             */

            var arrayLayerDrawingOptionsUSA = [];
            var layerDrawingOptionsCounties = new LayerDrawingOptions();
            layerDrawingOptionsCounties.renderer = cbrCountyPopDensity;
            arrayLayerDrawingOptionsUSA[3] = layerDrawingOptionsCounties;
            dynamicMap.setLayerDrawingOptions(arrayLayerDrawingOptionsUSA)

        };

    });
    
});