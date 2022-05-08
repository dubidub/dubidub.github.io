function clearInputOri() {
  document.getElementById('input_ori').value = "";
  document.getElementById('input_hotel').value = "";
}

function clearInputDes() {
  document.getElementById('input_des').value = "";
}

function inputOrigin() {
  markerLayer.clearLayers();
  let bounds = L.latLngBounds();
  try {
    let region = document.getElementById('input_ori').value;
    let hotels = visalx_cat[region];
    for ( let i=0; i<hotels.length; i++ ) {
      let hotel_info = visalx_hotels[hotels[i]];
      let lat = hotel_info['lat'];
      let lng = hotel_info['lng'];
      bounds.extend([lat, lng]);
      let name = hotel_info['name'];
      let marker = L.marker([lat, lng], {
          riseOnHover : true,
      }).addTo(markerLayer);
      marker.bindPopup(name);
      marker.on('mouseover', function (e) {
        this.openPopup();
      });
      marker.on('mouseout', function (e) {
        this.closePopup();
      });
      marker.on('click', function (e) {
        var popup = L.popup()
          .setLatLng([lat, lng])
          .setContent(hotel_perk_info(hotels[i]))
          .openOn(map);
      });
    }
  } catch (e) {
    console.log(e);
  }
  map.fitBounds(bounds);
}

function inputHotel() {
  markerLayer.clearLayers();
  let bounds = L.latLngBounds();
  try {
    let hotel = document.getElementById('input_hotel').value;

    var rev_hotel = {};
    for(let key in visalx_hotels) {
      rev_hotel[visalx_hotels[key]['name']] = key;
    }

    let code = rev_hotel[hotel];

    let hotel_info = visalx_hotels[code];
    let lat = hotel_info['lat'];
    let lng = hotel_info['lng'];
    bounds.extend([lat, lng]);
    let name = hotel_info['name'];
    let marker = L.marker([lat, lng], {
        riseOnHover : true,
    }).addTo(markerLayer);
    marker.bindPopup(name);
    marker.on('mouseover', function (e) {
      this.openPopup();
    });
    marker.on('mouseout', function (e) {
      this.closePopup();
    });
    marker.on('click', function (e) {
      var popup = L.popup()
        .setLatLng([lat, lng])
        .setContent(hotel_perk_info(code))
        .openOn(map);
    });
  } catch (e) {
    console.log(e);
  }
  map.fitBounds(bounds);
}

function hotel_perk_info(code) {
  var html_text_seg = '<img src="' + visalx_hotels[code]['og_image'] + '" style="width:100%;height:100%;">' +
                      '<h1>' + visalx_hotels[code]['name'] + '</h1>' +
                      '<p>' + visalx_hotels[code]['address'] + '</p>' +
                      '<table><thead><tr><th>&nbsp;</th><th><h2>VISA</h2><p>Luxury Hotel Collection</p></th></tr></thead>' +
                      '<tfoot><tr><th>&nbsp;</th><td>' +
                      '<a href="' + visalx_hotels[code]['link'] + '" target="_blank"><button>BOOK</button></a></td></tr></tfoot>' +
                      '<tbody>' +
                      '<tr><th>Breakfast</th><td>' + perks_break(code, 'CBF') + '</td></tr>' +
                      '<tr><th>Room Upgrades</th><td>' + perks_break(code, 'CRU') + '</td></tr>' +
                      '<tr><th>Check-in</th><td>' + perks_break(code, 'ECI') + '</td></tr>' +
                      '<tr><th>Check-out</th><td>' + perks_break(code, 'LCO') + '</td></tr>' +
                      '<tr><th>Credit</th><td>' + perks_break(code, 'FCD') + '</td></tr>' +
                      '<tr><th>In-room Gift</th><td>' + perks_break(code, 'IRG') + '</td></tr>' +
                      '<tr><th>Welcome Gift</th><td>' + perks_break(code, 'WGA') + '</td></tr>' +
                      '<tr><th>Internet</th><td>' + perks_break(code, 'CIN') + '</td></tr>' +
                      '<tr><th>Other</th><td>' + perks_break(code, 'OTH') + '</td></tr>' +
                      '</tbody>'
                      ;
  return html_text_seg;
}

function perks_break(code, perk) {
  perk_text = "";
  for (let i = 0; i < visalx_perks[code][perk].length; i++) {
    perk_text = perk_text.concat(
      visalx_perks[code][perk][i] + '<br>'
    );
  }
  return perk_text;
}

function search_box() {
  let search_opt = document.getElementById('search_option').value;
  if ( search_opt == "region" ) {
    document.getElementById("input_ori").style.display = "block";
    document.getElementById("input_hotel").style.display = "none";
  }
  if ( search_opt == "hotel" ) {
    document.getElementById("input_ori").style.display = "none";
    document.getElementById("input_hotel").style.display = "block";
  }
}
