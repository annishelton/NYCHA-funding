var defaultCenter = [40.678034,-74.027596];
var defaultZoom = 11;

var map = L.map('my-map').setView(defaultCenter, defaultZoom);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

console.log(NYCHA)

const lookupPhase = function(projectpha) {
  switch(projectpha) {
  case 'construction':
    return {
      color: "#2b259e",
      description: 'In Construction'
    }
  case 'procurement':
    return {
      color: "#257b9e",
      description: 'In Procurement'
    }
  case 'design':
    return {
      color: "#259e97",
      description: 'In Design'
    }
    case 'complete':
      return {
        color: "#7a259e",
        description: 'Completed'
      }
    }

// add geojson using jquery's $.getJSON()
///$.getJSON('data/study_boundary.geojson', function(study_boundary) {
///  L.geoJSON(study_boundary, {
    ///style: {
    ///  dashArray: '3 10',
      ///color: 'white',
    ///  fillOpacity: 0,
  ///  }
///  }).addTo(map);

  // Use L.geoJSON to load PLUTO parcel data that we clipped in QGIS and change the CRS from 2263 to 4326
  // this was moved inside the getJSON callback so that the parcels will load on top of the study area study_boundary
  var blocksGeojson = L.geoJSON(NYCHA, {
      style: function(feature) {

          return {
            color: 'white',
            fillColor: lookupPhase(feature.properties.LandUse).color,
            fillOpacity: 0.8,
            weight: 1,
          }
      },
    onEachFeature: function(feature, layer) {
      const description = lookupLandUse(feature.properties.LandUse).description;

      layer.bindPopup(`${feature.properties.Address}<br/>${description}`, {
        closeButton: false,
        minWidth: 60,
        offset: [0, -10]
      });
      layer.on('mouseover', function (e) {
        this.openPopup();

        e.target.setStyle({
          weight: 3,
          color: '#FFF',
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
      });
      layer.on('mouseout', function (e) {
        this.closePopup();
        blocksGeojson.resetStyle(e.target);
      });
    }
  }).addTo(map);
}
