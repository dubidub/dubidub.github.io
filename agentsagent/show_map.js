function show_map() {
  document.getElementsByClassName("hotelPanel")[0].style.display = "none";
  document.getElementsByClassName("mapid")[0].style.display = "inline";
  document.getElementById("showmap_box_handle").innerHTML = 'Close map';
  document.getElementById("showmap_box").className = 'hidemap_box';
  document.getElementById("showmap_box").setAttribute('onClick', 'hide_map()');
  // due to some unknown reason the map cannot show properly, so need to do the following map re-do
  map.invalidateSize(true);
  if (document.getElementById('shortlist_box_handle').innerHTML != 'Close shortlist') {
    // inputOrigin();
    let searchresults = getCookie('searchresults_properties').split(','),
        searchresults_properties = searchresults.filter( n => n);
    show_search_results(searchresults_properties);
  } else {
    let shortlist = getCookie('shortlist_properties').split(','),
        shortlist_properties = shortlist.filter( n => n);
    show_search_results(shortlist_properties);
  }
}

function hide_map() {
  document.getElementsByClassName("hotelPanel")[0].style.display = "block";
  document.getElementsByClassName("mapid")[0].style.display = "none";
  document.getElementById("showmap_box_handle").innerHTML = 'Show on map';
  document.getElementById("showmap_box").className = 'showmap_box';
  document.getElementById("showmap_box").setAttribute('onClick', 'show_map()');
}
