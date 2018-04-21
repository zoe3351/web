require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "dojo/domReady!"
  ], function(
    Map, MapView, FeatureLayer, Legend
  ) {
    var defaultSymbol = {
      type: "simple-line",
      style: "short-dash-dot",
      color: "white",
      width: 3
    };

    var symbol1 = {
      type: "simple-line",
      style: "short-dash-dot",
      color: "black",
      width: 3
    };

    var symbol2 = {
      type: "simple-line",
      style: "short-dash-dot",
      color: "blue",
      width: 3
    };

    var symbol3 = {
      type: "simple-line",
      style: "short-dash-dot",
      color: "green",
      width: 3
    };

    var symbol4 = {
      type: "simple-line",
      style: "short-dash-dot",
      color: "yellow",
      width: 3
    };

    var symbol5 = {
      type: "simple-line",
      style: "short-dash-dot",
      color: "red",
      width: 3
    };

    var symbol6 = {
      type: "simple-line",
      style: "short-dash-dot",
      color: "grey",
      width: 3
    };

    var symbol7 = {
      type: "simple-line",
      style: "short-dash-dot",
      color: "purple",
      width: 3
    };

    //create renderer
    var renderer = {
      type: "unique-value",
      field: "OBJECTID",
      defaultSymbol: defaultSymbol,
      uniqueValueInfos: [{
          value: "1", // code for interstates/freeways
          symbol: symbol1,
          label: "District 1"
        }, {
          value: "2", // code for U.S. highways
          symbol: symbol2,
          label: "District 2"
        }, {
          value: "3", // code for U.S. highways
          symbol: symbol3,
          label: "District 3"
        }, {
          value: "4", // code for U.S. highways
          symbol: symbol4,
          label: "District 4"
        }, {
          value: "5", // code for U.S. highways
          symbol: symbol5,
          label: "District 5"
        }, {
          value: "6", // code for U.S. highways
          symbol: symbol6,
          label: "District 6"
        }, {
          value: "7", // code for U.S. highways
          symbol: symbol7,
          label: "District 7"
        }]
    };

    var featureLayer = new FeatureLayer({
      url: "https://gisdata.kingcounty.gov/arcgis/rest/services/OpenDataPortal/district___base/MapServer/2237/query?outFields=*&where=1%3D1",
      renderer: renderer
    });

    var map = new Map({
      basemap: "streets",
      layers: [featureLayer]
    });

    // map.addLayer(featureLayer);

    var view = new MapView({
      container: "proposalMap",
      map: map,
      zoom: 11,
      center: [-122.3321, 47.6062], // longitude, latitude
    });
  });