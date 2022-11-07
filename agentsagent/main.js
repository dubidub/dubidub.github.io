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
  let search_key_city_hotel = Object.keys(search_key);
  let datalist_text = "";
  for ( let i=0; i<search_key_city_hotel.length; i++ ) {
    let search_key_result = search_key_city_hotel[i];
    datalist_text = datalist_text.concat(
      "<option>" + search_key_result + "</option>"
    );
  }
  input.innerHTML = datalist_text;
}

document.getElementById('input_ori').addEventListener('awesomplete-selectcomplete',function(){
  inputOrigin();
});

window.onload = function(){
    console.log(document.cookie);
    let input_origin = getCookie('input_origin');
    if (input_origin == '') {
      document.getElementById('input_ori').value = 'New York';
    } else {
      document.getElementById('input_ori').value = input_origin;
    }
    inputOrigin();
    let shortlist = getCookie('shortlist_properties').split(','),
        shortlist_properties = shortlist.filter( n => n);
    document.getElementById('shortlist_box_handle').innerHTML = 'Shortlist: ' + shortlist_properties.length;
}

document.addEventListener('keydown', function(e) {
    let keyCode = e.keyCode;
    if (keyCode === 27) {//keycode is an Integer, not a String
      close_info_modal()
    }
});
