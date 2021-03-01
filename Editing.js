require([
    "esri/map",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/dijit/editing/Editor",
    "esri/dijit/editing/AttachmentEditor",        
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
    function (Map, Draw, Graphic, Editor, AttachmentEditor, GeometryService, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, Color, dom, ready, parser, on, array) {

  ready(function () {

      parser.parse();

      mapMain = new Map("divMap", {
        basemap: "topo",
        center: [-6.5225, 40.596944],
        zoom: 12
    });

    mapMain.infoWindow.setContent("<div id='content' style='width:100%'></div>");
    mapMain.infoWindow.resize(350,275);

    var attachmentEditor = new AttachmentEditor({}, dom.byId("content"));
    attachmentEditor.startup();

    var params = {
        settings: {
        map: mapMain,
        layerInfos: featureLayerInfos
        }
  };

  var editorWidget = new Editor(params, 'editorDiv');

  editorWidget.startup();

    

    });
});