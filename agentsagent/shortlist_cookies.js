function setCookie(cname, cvalue) {
  let d = new Date();
  d.setTime(d.getTime() + (365*24*60*60*1000));
  let expires = "expires" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + "; SameSite=None; Secure";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function show_shortlist() {
  hide_map();
  let shortlist = getCookie('shortlist_properties').split(','),
      shortlist_properties = shortlist.filter( n => n);
  show_search_results(shortlist_properties);
  document.getElementById("shortlist_box_handle").innerHTML = 'Close shortlist';
  document.getElementById("shortlist_box").className = 'close_shortlist';
  document.getElementById("shortlist_box").setAttribute('onClick', 'close_shortlist()');
}

function close_shortlist() {
  hide_map();
  inputOrigin();
  let shortlist = getCookie('shortlist_properties').split(','),
      shortlist_properties = shortlist.filter( n => n);
  document.getElementById("shortlist_box_handle").innerHTML = 'Shortlist: ' + shortlist_properties.length;
  document.getElementById("shortlist_box").className = 'shortlist_box';
  document.getElementById("shortlist_box").setAttribute('onClick', 'show_shortlist()');
}

function shortlist_item(hotel_id) {
  let shortlist = getCookie('shortlist_properties').split(','),
      shortlist_properties = shortlist.filter( n => n);
  if ( !shortlist_properties.includes(hotel_id) ) {
    shortlist_properties.push(hotel_id);
    setCookie('shortlist_properties', shortlist_properties);
  }
  let elementid = 'shortlist' + hotel_id;
  document.getElementById(elementid).innerHTML = 'Remove';
  document.getElementById(elementid).className = 'actions_shortlist_remove';
  document.getElementById(elementid).setAttribute('onClick', 'delist_item("' + hotel_id + '")');
  document.getElementById('shortlist_box_handle').innerHTML = 'Shortlist: ' + shortlist_properties.length;
}

function delist_item(hotel_id) {
  let shortlist = getCookie('shortlist_properties').split(','),
      shortlist_properties = shortlist.filter( n => n);
  if ( shortlist_properties.includes(hotel_id) ) {
    let index = shortlist_properties.indexOf(hotel_id);
    shortlist_properties.splice(index, 1);
    setCookie('shortlist_properties', shortlist_properties);
  }
  let elementid = 'shortlist' + hotel_id;
  document.getElementById(elementid).innerHTML = 'Shortlist';
  document.getElementById(elementid).className = 'actions_shortlist';
  document.getElementById(elementid).setAttribute('onClick', 'shortlist_item("' + hotel_id + '")');
  let innertext = document.getElementById('shortlist_box_handle').innerHTML;
  if (innertext != 'Close shortlist') {
    document.getElementById('shortlist_box_handle').innerHTML = 'Shortlist: ' + shortlist_properties.length;
  }
  // document.getElementById('shortlist_box_handle').innerHTML = 'Shortlist: ' + shortlist_properties.length;
}
