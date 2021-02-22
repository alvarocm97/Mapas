var myMap;
var basemapToggle;
var featureLayer;
var dynamicMap;
var basemapGallery
// var legend
var scalebar

require(["esri/map", "esri/geometry/Extent", "esri/dijit/BasemapToggle",  "esri/layers/FeatureLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/dijit/BasemapGallery", "esri/dijit/Legend", "esri/dijit/Scalebar",

"dojo/ready",
"dojo/parser",
"dojo/on",

"dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"], function(Map, Extent, BasemapToggle, FeatureLayer, ArcGISDynamicMapServiceLayer, BasemapGallery, Legend, Scalebar, parser) {

    parser.parse();

    myMap = new Map("divMap", {
    basemap : "osm",
        // center : [-6.52277, 40.5972],
        // zoom: 14
    extent: new Extent({
                xmin: -13866326.8344688,
                ymin: 3658902.11881168,
                xmax: -8270073.39330937,
                ymax: 6352535.17310248,
                spatialReference:{wkid:102100}            
        }
        )        
    });
        basemapToggle = new BasemapToggle({        
        map: myMap,        
        basemap: "hybrid"
      }, "BasemapToggle")
      basemapToggle.startup();

      featureLayer = new FeatureLayer ("https://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0")
      featureLayer.setDefinitionExpression("MAGNITUDE >= 2");
      myMap.addLayer(featureLayer);
      
      dynamicMap = new ArcGISDynamicMapServiceLayer ("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {        
        opacity : 0.2        
      })
      myMap.addLayer(dynamicMap);

      basemapGallery = new BasemapGallery({
          map: myMap,
          basemapsGroup: { owner: "esri", title: "Community Basemaps" }
      }, "BasemapGallery")
      basemapGallery.add(basemapGallery);

    //   legend = new Legend ({
    //       map: myMap,
    //       layerInfos: [{
    //         layer: dynamicMap,
    //         title: "USA"
    //       }]
    //   }, "Legend")
    //   legend.startup();

      scalebar = new Scalebar ({
          map: myMap,
          attachTo: "bottom-center,",
          scalebarStyle: "ruler",
          scalebarUnit: "dual"
      }, "Scalebar")
      scalebar.startup();
});

myMap.on("layers-add-result", function(){
    var legend = new Legend ({
        map: myMap
    }, "Legend")
})
