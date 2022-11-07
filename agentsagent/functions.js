function clearInputOri() {
  try {
    document.getElementById('input_ori').value = "";
    close_info_modal();
    clear_filters();
  } catch (e) {
    console.log(e);
  }
}

function inputOrigin() {
  let search_input = document.getElementById('input_ori').value,
      hotel_list = search_key[search_input];
  show_search_results(hotel_list);
  add_filters(hotel_list);
  setCookie('input_origin', search_input);
}

function show_search_results(hotel_list) {
  setCookie('searchresults_properties', hotel_list);
  if ( hotel_list.length > 1 ) {
    document.getElementById("hotelPanel").innerHTML =
      '<div class="hotelPanel_handle">' + hotel_list.length + ' results</div>';
  } else if ( hotel_list.length == 1 ) {
    document.getElementById("hotelPanel").innerHTML =
      '<div class="hotelPanel_handle">' + hotel_list.length + ' result</div>';
  } else if ( hotel_list.length == 0 ) {
    document.getElementById("hotelPanel").innerHTML =
      '<div class="hotelPanel_handle">No matched results</div>';
  }

  markerLayer.clearLayers();
  let bounds = L.latLngBounds();

  try {
    for ( let i=0; i<hotel_list.length; i++ ) {
      let hotel_info = matched_hotels[hotel_list[i]],
          lat = hotel_info['geo']['lat'],
          lng = hotel_info['geo']['lon'],
          name = hotel_info['name'],
          address = hotel_info['address'],
          elites = hotel_info['elites'],
          og_image = hotel_info['og_image'],
          desc = hotel_info['desc_en'],
          marker = L.marker([lat, lng], {
              riseOnHover : true,
          }).addTo(markerLayer);

      bounds.extend([lat, lng]);

      document.getElementById("hotelPanel").innerHTML += addHotelList(name, address, elites, og_image, hotel_list[i]);

      marker.bindPopup(
        '<img src="' + og_image + '" style="min-width: 200px;width:100%;height:100%;">' +
        '<h3>' + name + '</h3>'
      );
      marker.on('mouseover', function (e) {
        this.openPopup();
      });
      marker.on('mouseout', function (e) {
        this.closePopup();
      });
      marker.on('click', function (e) {
        map.flyTo([lat, lng]);
        document.getElementById('hotel_info_modal').innerHTML = hotel_perk_info(name, elites, address);
        document.getElementById("info_modal_overlay").style.display = "block";
        document.getElementById("hotel_info_modal").style.display = "block";
      });
    }
    map.fitBounds(bounds);
  } catch (e) {
    console.log(e);
  }
  document.getElementById('hotelPanel').scrollTop = 0;
}

function addHotelList(name, address, elites, og_image, hotel_id) {
  let elite_list = "",
      perk_list = "",
      e_prog = Object.keys(elites),
      e_perks = [];

  // show list of hotel collections
  for ( let i=0; i<e_prog.length; i++ ) {
    let prog_text = '<img class="icon_image" src="' + elite_icon[e_prog[i]] + '" title="' + elite_desc[e_prog[i]] + '">　';
    elite_list = elite_list + prog_text;
  }
  // find how many different perks offered by hotel collections
  for ( let i=0; i<e_prog.length; i++ ) {
    let elite = e_prog[i],
        hotel_in_elite = elites[elite]['id'],
        perks_of_hotel = all_elite_perks[elite][hotel_in_elite]['perks'],
        list_of_perks = Object.keys(perks_of_hotel);
    for ( let j=0; j<list_of_perks.length; j++ ) {
      if ( perks_of_hotel[list_of_perks[j]].length > 0 && !e_perks.includes(list_of_perks[j]) ) {
        e_perks.push(list_of_perks[j]);
      }
    }
  }
  // show list of perks
  for ( let i=0; i<e_perks.length; i++ ) {
    // let perk_text = '<li>' + perks_desc[e_perks[i]] + '</li>';
    let perk_text = '<img class="icon_image" src="' + perks_icon[e_perks[i]] + '" title="' + perks_desc[e_perks[i]] + '">　';
    perk_list = perk_list + perk_text;
  }

  // generate hotel search results
  let shortlist_properties = getCookie('shortlist_properties').split(',');
  let shortlist_status = "";

  if (shortlist_properties.includes(hotel_id)) {
    shortlist_status = '<div class="actions_shortlist_remove" id="shortlist' + hotel_id + '" onclick="delist_item(' + "'" + hotel_id + "'" + ')">Remove</div>';
  } else {
    shortlist_status = '<div class="actions_shortlist" id="shortlist' + hotel_id + '" onclick="shortlist_item(' + "'" + hotel_id + "'" + ')">Shortlist</div>';
  }
  // let property_info = '<div class="fst-filter" onmousemove="property_onhover(' + "'" + hotel_id + "'" + ')">' +
  let property_info = '<div class="fst-filter">' +
                        '<div class="wrap">' +
                          '<div class="property_image"><img src="' + og_image + '"></div>' +
                          '<div class="property_text">' +
                            '<div class="property_title">' + name + '</div>' +
                            '<div class="property_address">' + address +
                            '  [ <a href="https://www.google.com/maps/search/' + name + '" target="_blank">Google Map</a> ]</div>' +
                            '<div class="wrapper">' +
                              '<div class="wrapper_perks">' +
                                '<div class="property_elites">' +
                                  '<div class="property_elites_handle">Hotel programs</div>' + elite_list + '</div>' +
                                '<div class="property_perks">' +
                                  '<div class="property_perks_handle">Perk types</div>' + perk_list + '</div>' +
                              '</div>' +
                              '<div class="property_actions">' + shortlist_status +
                                '<div class="actions_info_modal" onclick="property_onclick(' + "'" + hotel_id + "'" + ')">' +
                                  '<div class="actions_info_modal_handle">Detail</div></div>' +
                              '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>';

  return property_info;
}

function property_onclick(hotel_id) {
  let hotel_info = matched_hotels[hotel_id],
      name = hotel_info['name'],
      address = hotel_info['address'],
      elites = hotel_info['elites'];
  document.getElementById('hotel_info_modal').innerHTML = hotel_perk_info(name, elites, address);
  document.getElementById("info_modal_overlay").style.display = "block";
  document.getElementById("hotel_info_modal").style.display = "block";
}

// function property_onhover(hotel_id) {
//   let hotel_info = matched_hotels[hotel_id],
//       lat = hotel_info['geo']['lat'],
//       lng = hotel_info['geo']['lon'];
//   map.flyTo([lat, lng], 16);
// }

function hotel_perk_info(name, elites, address) {
  var html_text_seg = add_close_button() +
                      '<div class="info_modal_name">' + name + '</div>' +
                      '<div class="info_modal_address">' + address +
                      '  [ <a href="https://www.google.com/maps/search/' + name +
                      '" target="_blank">Google Map</a> ]</div>' +
                      '<table>' +
                      table_head(elites) + table_foot(elites) + table_body(elites) +
                      '</table>' ;
  return html_text_seg;
}

function add_close_button() {
  let button_text = '<button class="close_button" id="close_button" type="button" onclick="close_info_modal()">' +
                    '<i class="fa fa-close"></i>' +
                    '</button>';
  return button_text;
}

function table_head(elites) {
  let table_head_text = '<thead><tr><th>&nbsp;</th>',
      e_progs = Object.keys(elites);
  for ( let i=0; i<e_progs.length; i++ ) {
    let prog_text = '<th><i>' + elite_desc[e_progs[i]] + '</i></th>';
    table_head_text = table_head_text + prog_text;
  }
  table_head_text = table_head_text + '</tr></thead>'
  return table_head_text;
}

function table_foot(elites) {
  let table_foot_text = '<tfoot><tr><th>&nbsp;</th>',
      e_progs = Object.keys(elites);
  for ( let i=0; i<e_progs.length; i++ ) {
    try {
      let program = e_progs[i],
          id = elites[program]['id'],
          prog_text = '<td><a href="' + all_elite_perks[program][id]['link'] + '" target="_blank"><button>Check</button></a></td>';
      table_foot_text = table_foot_text + prog_text;
    }
    catch (e) {
      console.log(e);
    }
  }
  table_foot_text = table_foot_text + '</tr></tfoot>'
  return table_foot_text;
}

function table_body(elites) {
  let table_body_text = '<tbody>',
      e_progs = Object.keys(elites),
      perk_type = Object.keys(perks_desc);

  for ( let i=0; i<perk_type.length; i++ ) {
    let perk_short = perk_type[i]
        perk_long = perks_desc[perk_short],
        perk_text = '<tr><th>' + perk_long + '</th>';
    for ( let j=0; j<e_progs.length; j++ ) {
      let program = e_progs[j],
          id = elites[program]['id'],
          prog_text = '<td>' + perks_break(program, id, perk_short) + '</td>';
      perk_text = perk_text + prog_text;
    }
    table_body_text = table_body_text + perk_text + '</tr>';
  }

  table_body_text = table_body_text + '</tbody>'
  return table_body_text;
}

function perks_break(program, id, perk_short) {
  let perk_text = "";
  for (let i = 0; i < all_elite_perks[program][id]['perks'][perk_short].length; i++) {
    perk_text = perk_text.concat(
      '<li>' + all_elite_perks[program][id]['perks'][perk_short][i] + '</li>'
    );
  }
  return perk_text;
}

function close_info_modal() {
  document.getElementById("info_modal_overlay").style.display = "none";
  document.getElementById("hotel_info_modal").style.display = "none";
  close_option_modal();
}
function open_option_modal() {
  document.getElementById("option_modal").style.display = "block";
  document.getElementById("info_modal_overlay").style.display = "block";
}

function close_option_modal() {
  document.getElementById("option_modal").style.display = "none";
  document.getElementById("info_modal_overlay").style.display = "none";
}
