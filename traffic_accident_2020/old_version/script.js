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

function home_map() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident_2020/resources/3_city_overview_2020.html";
}
function tp_maplink1() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident_2020/resources/hexbin_tp_2020";
}
function tp_maplink2() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident_2020/resources/detail_tp_2020";
}
function tc_maplink1() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident_2020/resources/hexbin_tc_2020";
}
function tc_maplink2() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident_2020/resources/detail_tc_2020";
}
function kh_maplink1() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident_2020/resources/hexbin_kh_2020";
}
function kh_maplink2() {
  var map = document.getElementById('map');
  map.src = "https://dubidub.github.io/traffic_accident_2020/resources/detail_kh_2020";
}
