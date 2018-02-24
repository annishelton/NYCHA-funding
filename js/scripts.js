var defaultCenter = [40.678034,-74.027596];
var defaultZoom = 11;

var map = L.map('my-map').setView(defaultCenter, defaultZoom);

// tile layer gives you tile sets
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
      color: "purple",
      description: 'In Construction'
    }
  case 'procurement':
    return {
      color: "green",
      description: 'In Procurement'
    }
  case 'design':
    return {
      color: "cadetblue",
      description: 'In Design'
    }
    case 'complete':
      return {
        color: "orange",
        description: 'Completed'
      }
    }
	}


var Marker = L.AwesomeMarkers.icon({
	icon: "dollar-sign",
	markerColor: "green",
	iconColor: "white",
});

NYCHA.features.forEach(function(feature) {
	var centroid = turf.centerOfMass(feature);
	L.marker([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]], {icon: Marker}).addTo(map)
})


  // Use L.geoJSON to load PLUTO parcel data that we clipped in QGIS and change the CRS from 2263 to 4326
  // this was moved inside the getJSON callback so that the parcels will load on top of the study area study_boundary
  var blocksGeojson = L.geoJSON(NYCHA, {
      style: function(feature) {

          return {
            color: 'white',
            fillColor: lookupPhase(feature.properties.projectpha).color,
            weight: 1,
						fillOpacity: 0.8,
          }
      },

    onEachFeature: function(feature, layer) {
      const description = lookupPhase(feature.properties.projectpha).description;

      layer.bindPopup(`Total Project Cost = <br/>${feature.properties.Fedfunds}`, {
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
