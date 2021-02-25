window.onload = loadAwesomeplete();

function loadAwesomeplete() {
  var input = document.getElementById("mylist");
  var all_airports = Object.keys(airports_dict);
  var datalist_text = "";
  for ( var i=0; i<all_airports.length; i++ ) {
    var airport = all_airports[i];
    datalist_text = datalist_text.concat(
      "<option>" + airport + " (" + airports_dict[airport]['name'] +")</option>"
    );
  }
  input.innerHTML = datalist_text;
}

var loadCoord = [23.46, 120.58];
var map = L.map('mapid', {
  worldCopyJump: true,
}).setView(loadCoord, 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var markerLayer = L.layerGroup().addTo(map);
var routeLayer = L.layerGroup().addTo(map);
var highlightLayer = L.layerGroup().addTo(map);
var legendLayer = L.layerGroup().addTo(map);
