window.onload = loadAwesomeplete();

var loadCoord = [35.8, -85.4];
var map = L.map('mapid', {
  worldCopyJump: true,
}).setView(loadCoord, 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

drawLegend();
// document.getElementsByClassName("legend").style.display = "none";

var markerLayer = L.layerGroup().addTo(map);
var routeLayer = L.layerGroup().addTo(map);
var highlightLayer = L.layerGroup().addTo(map);
var legendLayer = L.layerGroup().addTo(map);

function loadAwesomeplete() {
  var input = document.getElementById("mylist");
  var all_airports = Object.keys(airports_dict);
  var datalist_text = "";
  for ( var i=0; i<all_airports.length; i++ ) {
    var airport = all_airports[i];
    datalist_text = datalist_text.concat(
      "<option>" + airport + ", " + airports_dict[airport]['city'] + " (" +
      airports_dict[airport]['name'] +")</option>"
    );
  }
  input.innerHTML = datalist_text;
}

function drawLegend() {
  var legend = L.control({ position: "topright" });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Airports</h4>";
    div.innerHTML += '<i class="circleDirect"></i><span>Direct</span><br>';
    div.innerHTML += '<i class="circleOneStop"></i><span>One Stop</span><br>';
    return div;
  };
  legend.addTo(map);
}
