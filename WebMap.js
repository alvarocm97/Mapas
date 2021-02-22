var map
var webMapID = "95a0746db08c4659a4b9aee3fc30b985"
var search
var locator
var myAddress = {"Single Line Input": "100 Main Street"};
var loc_params = {
    address: myAddress
};

require(["esri/arcgis/utils", "esri/dijit/Legend", "esri/dijit/Search", "esri/tasks/locator"
], function(arcgisUtils, Legend, Search, Locator){
    arcgisUtils.createMap(webMapID, "mapDiv")
    .then(function(response){
        var legendLayers = arcgisUtils.getLegendLayers(response);
        var leyenda = new Legend ({
            map: response.map,
            layerInfos: legendLayers
        }, "legendDiv");
        leyenda.startup();
    });
    search = new Search ({
        map: map
    }, "divWidget")
    search.startup();
    
    locator = new Locator (" http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer")

    locator.on("address-to-location-complete", showResults);

    locator.addresstoLocations(loc_params);

    function showResults(evt){

    }
});