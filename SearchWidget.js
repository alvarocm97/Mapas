var mapMain;
var search
var taskLocator
var printer
var printTask
var params
var template
var directions

// @formatter:off
require([
        "esri/map",
        "esri/dijit/Search",
        "esri/tasks/locator",
        

        "esri/symbols/SimpleMarkerSymbol",        
        "esri/symbols/Font",
        "esri/graphic",
        "esri/symbols/TextSymbol",
        

        
        "esri/tasks/PrintTemplate",
        "esri/dijit/Print",        
        "esri/dijit/Directions",

        "dojo/_base/Color",
        "dojo/_base/array",

        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "dojo/ready",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, Search, Locator, 
              SimpleMarkerSymbol, Font, Graphic, TextSymbol,PrintTemplate, Print, Directions,
              Color, array,
              dom, on, parser, ready,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // Create the map
            mapMain = new Map("pCenter", {
                basemap: "topo",
                center: [-117.19, 34.05],
                zoom: 13
            });

            /*
             * Step: Add the Search widget
             */

            search = new Search ({
                map: mapMain
            }, "divSearch")
            search.startup();  
            
            /*
            * Step: Construct and bind the Locator task
            */

            taskLocator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer")


            /*
            * Step: Wire the button's onclick event handler
            */
           on(dom.byId("btnLocate"), "click", doAddressToLocations);


            /*
            * Step: Wire the task's completion event handler
            */
           taskLocator.on("address-to-location-complete", showResults);


            function doAddressToLocations() {
                mapMain.graphics.clear();

                /*
                * Step: Complete the Locator input parameters
                */
                var objAddress = {"SingleLine" : dom.byId("taAddress").value}
                var params = {address : objAddress,
                    outFields : ["Loc_name"]}
                /*
                * Step: Execute the task
                */
               taskLocator.addressToLocations(params);

            }

            function showResults(candidates) {
                // Define the symbology used to display the results
                var symbolMarker = new SimpleMarkerSymbol();
                symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
                symbolMarker.setColor(new Color([255, 0, 0, 0.75]));
                var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Helvetica");

                // loop through the array of AddressCandidate objects
                var geometryLocation;
                array.every(candidates.addresses, function (candidate) {

                    // if the candidate was a good match
                    if (candidate.score > 80) {

                        // retrieve attribute info from the candidate
                        var attributesCandidate = {
                            address: candidate.address,
                            score: candidate.score,
                            locatorName: candidate.attributes.Loc_name
                        };

                        /*
                        * Step: Retrieve the result's geometry
                        */
                       geometryLocation = candidate.location;

                        /*
                        * Step: Display the geocoded location on the map
                        */
                       var graphicResult = new Graphic(geometryLocation, symbolMarker, attributesCandidate);
                       mapMain.graphics.add(graphicResult);

                        // display the candidate's address as text
                        var sAddress = candidate.address;
                        var textSymbol = new TextSymbol(sAddress, font, new Color("#FF0000"));
                        textSymbol.setOffset(0, -22);
                        mapMain.graphics.add(new Graphic(geometryLocation, textSymbol));

                        // exit the loop after displaying the first good match
                        return false;
                    }
                });

                // Center and zoom the map on the result
                if (geometryLocation !== undefined) {
                    mapMain.centerAndZoom(geometryLocation, 15);
                }
        };
        /*
             * Step: create an array of JSON objects that will be used to create print templates
             */

            var myLayouts = [{
             "name" : "Letter ANSI A Landscape",
             "label" : "Landscape (PDF)",
             "format" : "pdf",
             "options" : {
             "legendLayers" : [], // empty array means no legend
             "scalebarUnit" : "Miles",
             "titleText" : "Landscape PDF"
             }
             }, {
             "name" : "Letter ANSI A Portrait",
             "label" : "Portrait (JPG)",
             "format" : "jpg",
             "options" : {
             "legendLayers" : [],
             "scaleBarUnit" : "Miles",
             "titleText" : "Portrait JPG"
             }
             }];
            
            /*
             * Step: create the print templates
             */

            var myTemplates = [];
             dojo.forEach(myLayouts, function(lo) {
             var t = new PrintTemplate();
             t.layout = lo.name;
             t.label = lo.label;
             t.format = lo.format;
             t.layoutOptions = lo.options
             myTemplates.push(t);
             });                 

            /*
             * Step: Add the Print widget
             */
            printer = new Print({
                map : mapMain,
                url : "http://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute",
                templates : myTemplates
              }, "divPrint");
              printer.startup();

              /*
             * Step: Add the Directions widget
             */
                 
          directions = new Directions({
            map: mapMain,
            routeTaskUrl: "http://utility.arcgis.com/usrsvcs/appservices/OM1GNiiACNJceMRn/rest/services/World/Route/NAServer/Route_World"},
            "directionsDiv");
          directions.startup(); 
    });

});         