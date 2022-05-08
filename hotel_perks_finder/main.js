window.onload = loadAwesomeplete();

var loadCoord = [35.8, -85.4];
var map = L.map('mapid', {
  worldCopyJump: true,
  zoomControl: false
}).setView(loadCoord, 4);

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var markerLayer = L.layerGroup().addTo(map);

function loadAwesomeplete() {
  let input = document.getElementById("mylist");
  let visa_hotels = Object.keys(visalx_cat);
  let datalist_text = "";
  for ( let i=0; i<visa_hotels.length; i++ ) {
    let hotel = visa_hotels[i];
    datalist_text = datalist_text.concat(
      "<option>" + hotel + "</option>"
    );
  }
  input.innerHTML = datalist_text;

  let input_hotel = document.getElementById("hotellist");
  let hotels = Object.keys(visalx_hotels);
  let hotellist_text = "";
  for ( let i=0; i<hotels.length; i++ ) {
    let hotel = hotels[i];
    hotellist_text = hotellist_text.concat(
      "<option>" + visalx_hotels[hotel]['name'] + "</option>"
    );
  }
  input_hotel.innerHTML = hotellist_text;
}

document.getElementById('input_ori').addEventListener('awesomplete-selectcomplete',function(){
  inputOrigin();
});

document.getElementById('input_hotel').addEventListener('awesomplete-selectcomplete',function(){
  inputHotel();
});
