function myFunction(num) {
  document.getElementById("myDropdown"+num).classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function tp_maplink1() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident/resources/hexbin_tp";
}
function tp_maplink2() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident/resources/customizable_tp";
}
function tc_maplink1() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident/resources/hexbin_motion_tc";
}
function tc_maplink2() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident/resources/customizable_tc";
}
function kh_maplink1() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident/resources/heatmap_motion_kh";
}
function kh_maplink2() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident/resources/customizable_kh";
}
