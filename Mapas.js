var myMap;
var basemapToggle;

require(["esri/map", "esri/geometry/Extent", "esri/dijit/BasemapToggle",  "dojo/domReady!"], function(Map, Extent, BasemapToggle) {
        myMap = new Map("divMap", {
        basemap : "osm",
        // center : [-6.52277, 40.5972],
        // zoom: 14
        extent: new Extent(
            {
            xmin:-1010895.0294663996,ymin:5276081.293600973,xmax:-1006184.5975982015,ymax:5279530.514502432,spatialReference:{wkid:102100}
        }
        )        
    });
        basemapToggle = new BasemapToggle({
        
        map: myMap,
        
        basemap: "hybrid"
      }, "BasemapToggle")
      basemapToggle.startup();
});



