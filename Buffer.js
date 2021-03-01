require([
    "esri/map",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/tasks/BufferParameters",        
    "esri/tasks/GeometryService",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",

    "dojo/_base/Color",
    "dojo/dom",
    "dojo/ready",
    "dojo/parser",
    "dojo/on",
    "dojo/_base/array"],
    function (Map, Draw, Graphic, BufferParameters, GeometryService, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, Color, dom, ready, parser, on, array) {

  ready(function () {

      parser.parse();

      var geomService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

      mapMain = new Map("divMap", {
          basemap: "topo",
          center: [-6.5225, 40.596944],
          zoom: 12
      });

      mapMain.on("load", initDrawing);

      function initDrawing(){
          const toolbar = new Draw(mapMain);
          toolbar.activate(Draw.LINE);
          toolbar.on("draw-end", addtoMap);
      };

      function addtoMap(params){
          console.log(params)
        
        var geometryInput = params.geometry

        var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 255, 0]), 2);

        mapMain.graphics.clear();

        var graphic = new Graphic(geometryInput, symbol);

        mapMain.graphics.add(graphic);  

        
        var parametros = new BufferParameters();

        parametros.geometries = [geometryInput];

        parametros.distances = [10];

        parametros.unit = GeometryService.UNIT_KILOMETER;
        
        parametros.outSpatialReference = mapMain.spatialReference;
            
        geomService.buffer(parametros, showBuffer);
        // geomService.on("buffer-complete", showBuffer)

      };
        
        function showBuffer(bufferedGeometries){
            
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255,0.35])));

        array.forEach(bufferedGeometries, function(geometry){
            console.log(geometry)
        
            var grafico = new Graphic(geometry, symbol);

            mapMain.graphics.add(grafico);

        });    
          
    };

    });
});