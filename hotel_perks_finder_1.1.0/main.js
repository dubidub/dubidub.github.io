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
  // Below is for search by City
  // now can also search by property name
  let input = document.getElementById("mylist");
  let search_key_city_hotel = Object.keys(search_key);
  let datalist_text = "";
  for ( let i=0; i<search_key_city_hotel.length; i++ ) {
    let search_key_result = search_key_city_hotel[i];
    datalist_text = datalist_text.concat(
      "<option>" + search_key_result + "</option>"
    );
  }
  input.innerHTML = datalist_text;

  // Below is for search by property name
  // let input_hotel = document.getElementById("hotellist");
  // let hotels = Object.keys(matched_hotels);
  // let hotellist_text = "";
  // for ( let i=0; i<hotels.length; i++ ) {
  //   let hotel = hotels[i];
  //   hotellist_text = hotellist_text.concat(
  //     "<option>" + matched_hotels[hotel]['name'] + "</option>"
  //   );
  // }
  // input_hotel.innerHTML = hotellist_text;
}

document.getElementById('input_ori').addEventListener('awesomplete-selectcomplete',function(){
  inputOrigin();
});

// document.getElementById('input_hotel').addEventListener('awesomplete-selectcomplete',function(){
//   inputHotel();
// });
window.onload=function(){
    document.getElementById('input_ori').value = 'New York';
    inputOrigin();
}
