// Define variables for our tile layers
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var pirates = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.pirates",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
  Satellite: satellite,
  Pirates: pirates,
  Outdoors: outdoors
};

// Store our API endpoints
var url1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Perform a GET request to the query URLs
d3.json(url1, (err, data) => {

  if (err) throw err;

  var earthquakes = L.geoJSON(data.features, {
    pointToLayer: function (feature, latlng) {
      return L.circle(latlng, {
        color: "black",
        weight: .5,
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .8,
        radius: feature.properties.mag*20000
      });
    },
    onEachFeature: function (feature, layer){
      layer.bindPopup("Location: " + feature.properties.place + "<br> Magnitude: " + feature.properties.mag)
    }
  });

  d3.json(url2, (err, data) => {
    if (err) throw err;
    var plates = L.geoJSON(data.features, {
      style: {
        color: "orange",
        fillColor: "none"
      }
    });

    createMap(earthquakes, plates);
  });
});

// Write a function to get circle color based on magnitude
function getColor(d) {
  return d > 5 ? "#bd0026" :
         d > 4 ? "#f03b20" :
         d > 3 ? "#fd8d3c" :
         d > 2 ? "#feb24c" :
         d > 1 ? "#fed976" :
                  "#ffffb2";
}

// Write a function to create the map
function createMap(earthquakes, plates) {

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Fault Lines": plates,
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [satellite, plates, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Add a legend
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}
