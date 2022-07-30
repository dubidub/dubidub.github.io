function clearInputOri() {
  try {
    document.getElementById('input_ori').value = "";
    // document.getElementById('input_hotel').value = "";
    close_info_modal();
  } catch (e) {
    console.log(e);
  }
}

function inputOrigin() {
  document.getElementById("hotelPanel").innerHTML = '';
  markerLayer.clearLayers();
  let bounds = L.latLngBounds();
  try {
    let search_input = document.getElementById('input_ori').value,
        hotels = search_key[search_input];
    for ( let i=0; i<hotels.length; i++ ) {
      let hotel_info = matched_hotels[hotels[i]],
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

      document.getElementById("hotelPanel").innerHTML += addHotelList(name, desc, elites, og_image, hotels[i]);

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
        document.getElementById('hotel_info_modal').innerHTML = hotel_perk_info(name, elites);
        document.getElementById("info_modal_overlay").style.display = "block";
        document.getElementById("hotel_info_modal").style.display = "block";
        // document.getElementById("close_button").style.display = "block";
      });
    }
  } catch (e) {
    console.log(e);
  }
  map.fitBounds(bounds);
}

function get_ep_filter() {
  var array = []
  var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

  for (var i = 0; i < checkboxes.length; i++) {
    array.push(checkboxes[i].value)
  }
}

function addHotelList(name, desc, elites, og_image, hotel_id) {
  let elite_list = "",
      e_prog = Object.keys(elites);
  for ( let i=0; i<e_prog.length; i++ ) {
    let prog_text = '<li>' + elite_desc[e_prog[i]] + '</li>';
    elite_list = elite_list + prog_text;
  }

  let property_info = '<div class="fst-filter" onclick="property_onclick(' + hotel_id +
                      ')" onmousemove="property_onhover(' + hotel_id +
                      ')"><div class="wrap"><div class="property_image"><img src="' +
                      og_image +
                      '"></div><div class="property_text"><div class="property_title"><h3>' +
                      name +
                      '</h3></div><div class="property_desc">' +
                      desc +
                      '</div><div class="wrapper"><div class="property_elites"><h4>Hotel Collection</h4>' +
                      elite_list +
                      '</div></div>';

  return property_info;
}

function property_onclick(hotel_id) {
  let hotel_info = matched_hotels[hotel_id],
      name = hotel_info['name'],
      elites = hotel_info['elites'];
  document.getElementById('hotel_info_modal').innerHTML = hotel_perk_info(name, elites);
  document.getElementById("info_modal_overlay").style.display = "block";
  document.getElementById("hotel_info_modal").style.display = "block";
}

function property_onhover(hotel_id) {
  let hotel_info = matched_hotels[hotel_id],
      lat = hotel_info['geo']['lat'],
      lng = hotel_info['geo']['lon'];
  map.flyTo([lat, lng], 16);
}

function hotel_perk_info(name, elites) {
  var html_text_seg = add_close_button() +
                      '<h1>' + name + '</h1><table>' +
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
          prog_text = '<td><a href="' + all_elite_perks[program][id]['link'] + '" target="_blank"><button>BOOK</button></a></td>';
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
          // prog_text = '<td>' + all_elite_perks[program][id]['perks'][perk_short] + '</td>'
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

//
// function inputHotel() {
//   markerLayer.clearLayers();
//   let bounds = L.latLngBounds();
//   try {
//     let hotel = document.getElementById('input_hotel').value,
//         rev_hotel = {};
//     for(let key in matched_hotels) {
//       rev_hotel[matched_hotels[key]['name']] = key;
//     }
//     let code = rev_hotel[hotel],
//         hotel_info = matched_hotels[code],
//         lat = hotel_info['lat'],
//         lng = hotel_info['lng'],
//         name = hotel_info['name'],
//         og_image = hotel_info['og_image'],
//         marker = L.marker([lat, lng], {
//             riseOnHover : true,
//         }).addTo(markerLayer);
//     bounds.extend([lat, lng]);
//     marker.bindPopup(
//       '<img src="' + og_image + '" style="min-width: 200px;width:100%;height:100%;">' +
//       '<h3>' + name + '</h3>'
//     );
//     marker.on('mouseover', function (e) {
//       this.openPopup();
//     });
//     marker.on('mouseout', function (e) {
//       this.closePopup();
//     });
//     marker.on('click', function (e) {
//       map.flyTo([lat, lng]);
//       document.getElementById('hotel_info_modal').innerHTML = hotel_perk_info(code);
//       document.getElementById("hotel_info_modal").style.display = "block";
//       document.getElementById("close_button").style.display = "inline";
//     });
//   } catch (e) {
//     console.log(e);
//   }
//   map.fitBounds(bounds);
// }

//
// function search_box(city_or_property) {
//   if ( city_or_property == "search_by_city" ) {
//     document.getElementById("input_ori").style.display = "inline";
//     document.getElementById("input_hotel").style.display = "none";
//   }
//   if ( city_or_property == "search_by_property" ) {
//     document.getElementById("input_ori").style.display = "none";
//     document.getElementById("input_hotel").style.display = "inline";
//   }
// }

function close_info_modal() {
  document.getElementById("info_modal_overlay").style.display = "none";
  document.getElementById("hotel_info_modal").style.display = "none";
  // document.getElementById("option_modal").style.display = "none";
  // document.getElementById("close_button").style.display = "none";
  document.getElementById("option_modal").style.display = "none";
}
function open_option_modal() {
  // close_info_modal();
  document.getElementById("option_modal").style.display = "block";
  document.getElementById("info_modal_overlay").style.display = "block";
  // document.getElementById("close_button").style.display = "inline";
}

function close_option_modal() {
  document.getElementById("option_modal").style.display = "none";
  document.getElementById("info_modal_overlay").style.display = "none";
}
