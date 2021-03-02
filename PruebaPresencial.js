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


        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/_base/array",

        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "dijit/layout/BorderContainer",
        "dojo/domReady!"],
        function(
          Map, FeatureLayer, Extent, BasemapGallery, Legend, Scalebar, Search, OverviewMap, ready, parser, on, array, TabContainer, ContentPane, BorderContainer

        ) {

        ready(function () {

        parser.parse();


        on(dojo.byId("progButtonNode"),"click",fQueryEstados);
        
        function fQueryEstados(){
         alert("Evento del botón Seleccionar ciudades")
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
        
    //   var basemapGallery = new BasemapGallery({
    //       map: map,
    //       basemapsGroup: { owner: "esri", title: "Community Basemaps" }
    //   }, "BasemapGallery");

    //   basemapGallery.add(basemapGallery);

    var cities = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0", {outFields : ["*"]});

    var highways = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1", {outFields : ["*"]});

    var states = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2", {outFields : ["*"]});

    var counties = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3", {outFields : ["*"]});

    map.addLayers([cities, highways, states, counties]);

    // var scalebar = new Scalebar ({
    //     map: map,
    //     attachTo: "bottom-center,",
    //     scalebarStyle: "ruler",
    //     scalebarUnit: "dual"
    // }, "Scalebar")

    // scalebar.startup();
    

    // var legend = new Legend ({
    //     map: map
    // }, "legendDiv")

    // legend.startup();

    });

      });