// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken:  API_KEY
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
// Load in GeoJSON data
// Handle circles with pointToLayer
d3.json(queryUrl, d => {
  L.geoJSON(d.features, {
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
      layer.bindPopup("Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag)
    }
  }).addTo(myMap);
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
