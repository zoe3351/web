function initMap() {require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/Graphic",
    "esri/geometry/Point",
    "dojo/on",
    "dojo/domReady!"
  ], function(
    Map, MapView, FeatureLayer, Legend, Graphic, Point, on
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

    let proposals = angular.element($('[ng-view]')).scope().proposals;
    
    let featureLayer = new FeatureLayer({
      url: "https://gisdata.kingcounty.gov/arcgis/rest/services/OpenDataPortal/district___base/MapServer/2237/query?outFields=*&where=1%3D1",
      renderer: renderer
    });

    // Create a symbol for drawing the point
    var markerSymbol = {
      type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
      url: "./images/pin.png",
      width: "35px",
      height: "35px"
    };

    let graphics = [];
    proposals.forEach(element => {
      var point = {
        type: "point", // autocasts as new Point()
        longitude: element['proposal_longitude'],
        latitude: element['proposal_latitude']
      };

      var graphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: {
          id: element['draft_id'],
          longitude: element['proposal_longitude'],
          latitude: element['proposal_latitude']
        }
      });

      graphics.push(graphic)
    });

        // var pointGraphics = [graphic1, graphic2];

        var map = new Map({
            basemap: "streets",
            layers: [featureLayer]
        });

        var view = new MapView({
            container: "proposalMap",
            map: map,
            zoom: 11,
            center: [-122.3321, 47.6062], // longitude, latitude
        });

        view.graphics.addMany(graphics);

        let newProposalGraphic;

        let blueMarkerSymbol = {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          url: "./images/bluepin.png",
          width: "35px",
          height: "35px"
        };

        view.on("click", event => {
          let tab = $('#myTab > li.nav-item > a.active').html()
          view.hitTest(event.screenPoint)
            .then(function(response){
              if (tab === "Proposals") {
                var graphic = response.results[0].graphic;
                if (graphic) {
                  view.zoom = 18;
                  view.center = [graphic.attributes['longitude'], graphic.attributes['latitude']];

                  if(graphic.attributes['id']) {
                    let parent = document.getElementById("scrollbody");
                    let someElement = document.getElementById(`p${graphic.attributes['id']}`);
                    parent.scrollTop -= parent.scrollHeight;
                    parent.scrollTop += someElement.offsetTop - 2* someElement.offsetHeight;
                    someElement.children[1].classList.add('show');
                  }
                  // alert(`ID: ${}`);
                }
              } else if (tab === "New Proposal") {
                view.graphics.remove(newProposalGraphic);
                
                let mapPoint = view.toMap(event.screenPoint);
                view.zoom = 16;
                view.center = [mapPoint.longitude, mapPoint.latitude];
                $('[name="newProposalForm"]').find('input[name="latitude"]').val(mapPoint.latitude);
                $('[name="newProposalForm"]').find('input[name="longitude"]').val(mapPoint.longitude);
                
                // newProposalGraphic["geometry"] = mapPoint;
                // newProposalGraphic["symbol"] = blueMarkerSymbol;
                // console.log(newProposalGraphic);
                newProposalGraphic = new Graphic({
                  geometry: mapPoint,
                  symbol: blueMarkerSymbol
                });
                view.graphics.add(newProposalGraphic);
              }
            });
        });

        let proposal = $('[ng-repeat="pro in proposals"] > a');
        proposal.each(index => {
          proposal[index].addEventListener("click", function(){
            view.goTo({
              target: new Point({
                        latitude: this.getAttribute('latitude'),
                        longitude: this.getAttribute('longitude')
                      }),
              zoom: 18
            });
          });
        });
  });
}