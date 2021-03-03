var map;
    var tb;
    require(["esri/map",
        "esri/layers/FeatureLayer",
        "esri/geometry/Extent",
        "esri/dijit/BasemapGallery",
        "esri/dijit/Legend",
        "esri/dijit/Scalebar",
        "esri/dijit/Search",
        "esri/dijit/OverviewMap",
        "esri/dijit/PopupTemplate",
        "esri/tasks/query",


        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/_base/array",
        "dojo/dom",

        "dijit/layout/TabContainer",
        "dijit/TitlePane",
        "dijit/layout/ContentPane",
        "dijit/layout/BorderContainer",
        "dojo/domReady!"],
        function(
          Map, FeatureLayer, Extent, BasemapGallery, Legend, Scalebar, Search, OverviewMap, PopupTemplate, Query, ready, parser, on, array, dom, TabContainer, TitlePane, ContentPane, BorderContainer) {

        ready(function () {

        // parser.parse();


        on(dojo.byId("progButtonNode"),"click",fQueryEstados);
        
        function fQueryEstados(){
                  
         var estados = new Query();   
         
         var texto = dom.byId("dtb").value

         estados.where = "State_Name = '" + texto + "'"

            states.selectFeatures(estados, FeatureLayer.SELECTION_NEW);

            states.on("selection-complete", focusOnMap)            
        };
        function focusOnMap(params){
          
          var newExtent = params.features[0].geometry.getExtent(); 

          map.setExtent(newExtent);

        };

        map = new Map("map", {
          basemap: "topo",        
          extent: new Extent({
            xmin: -13866326.8344688,
            ymin: 3658902.11881168,
            xmax: -8270073.39330937,
            ymax: 6352535.17310248,
            spatialReference:{wkid:102100}}),
          sliderStyle: "small"
        });

        map.on("load",function(evt){
          map.resize();
          map.reposition();

        });

        var search = new Search ({
            map: map,
            autoComplete : true
        }, "divSearch")

        search.startup(); 

        var overview = new OverviewMap({
            map: map

        }, "divOverView")

        overview.startup();
        
        var basemapGallery = new BasemapGallery({
          showArcGISBasemaps: true,
          map: map
        }, "basemapGallery");

        console.log("Si")

        basemapGallery.startup();

        var template = new PopupTemplate({
          "title": "STATE:  {STATE_NAME}",
          "fieldInfos": [ {
              "fieldName": "POP2000",
              "format": {
                  "places": 2,
                  "digitSeparator": true
              }
          },
          {"fieldName": "POP00_SQMI",
          "format": {
              "places": 2,
              "digitSeparator": true
          }},
          {"fieldName": "ss6.gdb.States.area",
          "format": {
              "places": 2,
              "digitSeparator": true
          }}],
            "description": "Población total: {POP2000}<br>Densidad de población: {POP00_SQMI}<br>Area: {ss6.gdb.States.area}"
      });

    var cities = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0", {outFields : ["*"]});

    var highways = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1", {outFields : ["*"]});

    var states = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2", {outFields : ["*"], infoTemplate: template});

    var counties = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3", {outFields : ["State_Name"], opacity: 0.3});

    map.addLayers([cities, highways, states, counties]);

    var scalebar = new Scalebar ({
        map: map,
        attachTo: "bottom-center",
        scalebarStyle: "line",
        scalebarUnit: "metric"         
    });

    var legend = new Legend ({
        map: map,      
    }, "legendDiv")

    legend.startup();

    });

      });