const loadCoord = [23.707398117586052, 120.98712417755992];
const map = L.map('mapid', {
  worldCopyJump: true,
}).setView(loadCoord, 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
var datasets;
$("#inputFile").change(function(e) {
    onChange(e);
});
var uniqueID;
