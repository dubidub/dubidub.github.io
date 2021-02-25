function drawStopsMarker(stops, color, radius) {
  for ( var i=0; i<stops.length; i++ ) {
    var stop = stops[i];
    var stop_coord = [airports_dict[stop]['lat'],airports_dict[stop]['lng']];
    var circleMarker = L.circleMarker(stop_coord, {
      color: 'black',
      weight: 1,
      fillColor: color,
      fillOpacity: 1,
      radius: radius
    }).addTo(markerLayer).on('click', function(e) {
      highlightRoutes(ori, des, stops);
      drawStopsMarker(stops, color, radius);
      drawCircleMarker(ori, 'red', 6);
      drawCircleMarker(des, 'blue', 4);
    });
  }
}

function drawStopMarker(iata, color, radius) {
  var latlng = [airports_dict[iata]['lat'],airports_dict[iata]['lng']];
  // var city = airports_dict[iata]['city'];
  var circleMarker = L.circleMarker(latlng, {
    color: 'black',
    weight: 1,
    fillColor: color,
    fillOpacity: 1,
    radius: radius
  }).addTo(markerLayer).on('click', function(e) {
    highlightRoute(ori, des, iata);
    drawStopMarker(iata, color, radius);
    drawCircleMarker(ori, 'red', 6);
    drawCircleMarker(des, 'blue', 4);
  });
}

function calDistance(iata1, iata2) {
  var lat1 = airports_dict[iata1]['lat'];
  var lng1 = airports_dict[iata1]['lng'];
  var lat2 = airports_dict[iata2]['lat'];
  var lng2 = airports_dict[iata2]['lng'];
  const φ1 = lat1 * Math.PI/180,
        φ2 = lat2 * Math.PI/180,
        Δλ = (lng2-lng1) * Math.PI/180,
        R = 6371e3;
  const d = Math.round((Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R)/1000);
  return d;
}

function createSegText(city1, city2) {
  var carriers = routes_dict[city1][city2];
  var dis_seg = calDistance(city1, city2);
  var text_seg = "";
  for ( var i=0; i < carriers.length; i++ ) {
    var carrier = airlines_dict[carriers[i]];
    text_seg = text_seg.concat(
      "<tr><td><strong>"+carrier['iata']+"</strong></td><td>"+carrier['name']+"</td></tr>");
  };
  var html_text_seg = '<h4>' + city1 + ' (' + airports_dict[city1]['city'] + ') >> ' +
                      city2 + ' (' + airports_dict[city2]['city'] + ')</h4>' +
                      '<i>' + dis_seg + ' km</i>' +
                      '<table><tbody>'+text_seg+'</tbody></table>';
  return html_text_seg;
}

function findShortestStops(iata1, iata2, stops) {
  var shortest_dis = 1000000;
  for ( var i=0; i<stops.length; i++ ) {
    var stop0 = stops[i][0];
    var stop1 = stops[i][1];
    var dis_seg_1 = calDistance(iata1, stop0);
    var dis_seg_2 = calDistance(stop0, stop1);
    var dis_seg_3 = calDistance(stop1, iata2);
    var total_dis = dis_seg_1 + dis_seg_2 + dis_seg_3;
    if ( total_dis < shortest_dis) {
      var shortest_stops = stops[i];
      shortest_dis = total_dis;
    }
  }
  return shortest_stops;
}

function findShortestStop(iata1, iata2, stops) {
  var shortest_dis = 1000000;
  for ( var i=0; i<stops.length; i++ ) {
    var stop = stops[i];
    var dis_seg_1 = calDistance(stop, iata1);
    var dis_seg_2 = calDistance(stop, iata2);
    var total_dis = dis_seg_1 + dis_seg_2;
    if ( total_dis < shortest_dis) {
      var shortest_stop = stop;
      shortest_dis = total_dis;
    }
  }
  return shortest_stop;
}

function highlightRoute(iata1, iata2, stop) {
  highlightLayer.clearLayers();
  var ori_coord = [airports_dict[iata1]['lat'],airports_dict[iata1]['lng']]
  var des_coord = [airports_dict[iata2]['lat'],airports_dict[iata2]['lng']]
  var stop_coord = [airports_dict[stop]['lat'],airports_dict[stop]['lng']]
  var flightRoute = L.polyline([ori_coord,stop_coord,des_coord], {
    color:'red',
    weight:4.5,
  }).addTo(highlightLayer);
  var html_text = '<h3>FLIGHT INFO</h3>' +
                  createSegText(iata1,stop) + createSegText(stop,iata2);
  var popup_text = L.popup().setContent(html_text);
  map.fitBounds(flightRoute.getBounds());
  flightRoute.bindPopup(popup_text).openPopup();
}

function highlightRoutes(iata1, iata2, stops) {
  highlightLayer.clearLayers();
  var stop0 = stops[0];
  var stop1 = stops[1];
  var ori_coord = [airports_dict[iata1]['lat'],airports_dict[iata1]['lng']]
  var des_coord = [airports_dict[iata2]['lat'],airports_dict[iata2]['lng']]
  var stop0_coord = [airports_dict[stop0]['lat'],airports_dict[stop0]['lng']]
  var stop1_coord = [airports_dict[stop1]['lat'],airports_dict[stop1]['lng']]

  var flightRoute = L.polyline([ori_coord,stop0_coord,stop1_coord,des_coord], {
    color:'red',
    weight:4.5,
  }).addTo(highlightLayer);
  var html_text = '<h3>FLIGHT INFO</h3>' + createSegText(iata1,stop0) +
                  createSegText(stop0,stop1) + createSegText(stop1,iata2);
  var popup_text = L.popup().setContent(html_text);
  map.fitBounds(flightRoute.getBounds());
  flightRoute.bindPopup(popup_text).openPopup();
}

function drawTwoStopRoute(iata1, iata2, stops) {
  var stop0 = stops[0];
  var stop1 = stops[1];
  var ori_coord = [airports_dict[iata1]['lat'],airports_dict[iata1]['lng']]
  var des_coord = [airports_dict[iata2]['lat'],airports_dict[iata2]['lng']]
  var stop0_coord = [airports_dict[stop0]['lat'],airports_dict[stop0]['lng']]
  var stop1_coord = [airports_dict[stop1]['lat'],airports_dict[stop1]['lng']]
  var flightRoute = L.polyline([ori_coord,stop0_coord,stop1_coord,des_coord], {
    color:'gray',
    weight: 2.5,
    opacity: 0.8,
  }).addTo(routeLayer).on('click', function(e) {
    highlightRoutes(ori, des, stops);
    drawStopsMarker(stops, 'gray', 4);
    drawCircleMarker(ori, 'red', 6);
    drawCircleMarker(des, 'blue', 4);
  });
  // var html_text = '<h3>FLIGHT INFO</h3>' + createSegText(iata1,stop0) +
  //                 createSegText(stop0,stop1) + createSegText(stop1,iata2);
  // var popup_text = L.popup().setContent(html_text);
  // flightRoute.bindPopup(popup_text);
}

function drawOneStopRoute(iata1, iata2, stop) {
  var ori_coord = [airports_dict[iata1]['lat'],airports_dict[iata1]['lng']]
  var des_coord = [airports_dict[iata2]['lat'],airports_dict[iata2]['lng']]
  var stop_coord = [airports_dict[stop]['lat'],airports_dict[stop]['lng']]
  var flightRoute = L.polyline([ori_coord,stop_coord,des_coord], {
    color:'gray',
    weight: 2.5,
    opacity: 0.8,
  }).addTo(routeLayer).on('click', function(e) {
    highlightRoute(ori, des, stop);
    drawStopMarker(stop, 'gray', 4);
    drawCircleMarker(ori, 'red', 6);
    drawCircleMarker(des, 'blue', 4);
  });
  // var html_text = '<h3>FLIGHT INFO</h3>' +
  //                 createSegText(iata1,stop) + createSegText(stop,iata2);
  // var popup_text = L.popup().setContent(html_text);
  // flightRoute.bindPopup(popup_text);
}

// function drawOneStopRoutes(iata1, iata2, stops) {
//   var ori_lat = airports_dict[iata1]['lat'];
//   var ori_lng = airports_dict[iata1]['lng'];
//   var des_lat = airports_dict[iata2]['lat'];
//   var des_lng = airports_dict[iata2]['lng'];
//   for ( var i=0; i<stops.length; i++ ) {
//     var stop = stops[i];
//     var stop_lat = airports_dict[stop]['lat'];
//     var stop_lng = airports_dict[stop]['lng'];
//     var flightRoute = L.polyline([[ori_lat,ori_lng],[stop_lat,stop_lng],[des_lat,des_lng]], {
//       color:'gray',
//       weight: 2.5,
//       opacity: 0.8,
//     }).addTo(routeLayer);
//     var html_text = '<h3>FLIGHT INFO</h3>' +
//                     createSegText(iata1,stop) + createSegText(stop,iata2);
//     var popup_text = L.popup().setContent(html_text);
//     flightRoute.bindPopup(popup_text);
//   }
// }

function drawDirectRoute(iata1, iata2) {
  var ori_lat = airports_dict[iata1]['lat'];
  var ori_lng = airports_dict[iata1]['lng'];
  var des_lat = airports_dict[iata2]['lat'];
  var des_lng = airports_dict[iata2]['lng'];
  var dis = calDistance(iata1, iata2);
  var lng_diff = ori_lng - des_lng;
  // var flightRoute = L.polyline([[ori_lat,ori_lng],[des_lat,des_lng]], {
  //   color:'red',
  //   weight: 3
  // }).addTo(routeLayer);
  // // map.fitBounds(flightRoute.getBounds());
  // map.flyTo([(ori_lat+des_lat)/2, (ori_lng+des_lng)/2], 3);
  // var html_text = '<h3>FLIGHT INFO</h3>' +
  //                 createSegText(iata1,iata2);
  // var popup_text = L.popup().setContent(html_text);
  // flightRoute.bindPopup(popup_text).openPopup();
  if ( lng_diff>=-180 && lng_diff<=180 ) {
    var flightRoute = L.polyline([[ori_lat,ori_lng],[des_lat,des_lng]], {
      color:'red',
      weight: 3
    }).addTo(routeLayer);
    var html_text = '<h3>FLIGHT INFO</h3>' + createSegText(iata1,iata2);
    var popup_text = L.popup().setContent(html_text);
    flightRoute.bindPopup(popup_text).openPopup();
    map.flyTo([(ori_lat+des_lat)/2, (ori_lng+des_lng)/2], 3);
    drawCircleMarker(ori, 'red', 6);
    drawCircleMarker(des, 'blue', 4);
  } else if ( lng_diff>180 ) {
    var flightRoute1 = L.polyline([[ori_lat,ori_lng],[des_lat,des_lng+360]], {
      color:'red',
      weight: 3
    }).addTo(routeLayer);
    var html_text = '<h3>FLIGHT INFO</h3>' + createSegText(iata1,iata2);
    var popup_text = L.popup().setContent(html_text);
    var flightRoute2 = L.polyline([[ori_lat,ori_lng-360],[des_lat,des_lng]], {
      color:'red',
      weight: 3
    }).addTo(routeLayer);
    var html_text = '<h3>FLIGHT INFO</h3>' + createSegText(iata1,iata2);
    var popup_text = L.popup().setContent(html_text);
    drawCircleMarkerCoord(ori_lat, ori_lng, 'red', 6);
    drawCircleMarkerCoord(des_lat, des_lng+360, 'blue', 4);
    drawCircleMarkerCoord(ori_lat, ori_lng-360, 'red', 6);
    drawCircleMarkerCoord(des_lat, des_lng, 'blue', 4);
    if ( Math.abs(ori_lng) > Math.abs(des_lng) ) {
      flightRoute1.bindPopup(popup_text).openPopup();
      flightRoute2.bindPopup(popup_text);
      // map.fitBounds(flightRoute1.getBounds());
      map.flyTo([(ori_lat+des_lat)/2, (ori_lng+des_lng+360)/2], 3);
    } else {
      flightRoute1.bindPopup(popup_text);
      flightRoute2.bindPopup(popup_text).openPopup();
      // map.fitBounds(flightRoute2.getBounds());
      map.flyTo([(ori_lat+des_lat)/2, (ori_lng-360+des_lng)/2], 3);
    }
  } else {
    var flightRoute1 = L.polyline([[ori_lat,ori_lng],[des_lat,des_lng-360]], {
      color:'red',
      weight: 3
    }).addTo(routeLayer);
    var html_text = '<h3>FLIGHT INFO</h3>' + createSegText(iata1,iata2);
    var popup_text = L.popup().setContent(html_text);
    var flightRoute2 = L.polyline([[ori_lat,ori_lng+360],[des_lat,des_lng]], {
      color:'red',
      weight: 3
    }).addTo(routeLayer);
    var html_text = '<h3>FLIGHT INFO</h3>' + createSegText(iata1,iata2);
    var popup_text = L.popup().setContent(html_text);
    drawCircleMarkerCoord(ori_lat, ori_lng, 'red', 6);
    drawCircleMarkerCoord(des_lat, des_lng-360, 'blue', 4);
    drawCircleMarkerCoord(ori_lat, ori_lng+360, 'red', 6);
    drawCircleMarkerCoord(des_lat, des_lng, 'blue', 4);
    if ( Math.abs(ori_lng) > Math.abs(des_lng) ) {
      flightRoute1.bindPopup(popup_text).openPopup();
      flightRoute2.bindPopup(popup_text);
      // map.fitBounds(flightRoute1.getBounds());
      map.flyTo([(ori_lat+des_lat)/2, (ori_lng+des_lng-360)/2], 3);
    } else {
      flightRoute1.bindPopup(popup_text);
      flightRoute2.bindPopup(popup_text).openPopup();
      // map.fitBounds(flightRoute2.getBounds());
      map.flyTo([(ori_lat+des_lat)/2, (ori_lng+360+des_lng)/2], 3);
    }
  }
}

function drawCircleMarkerCoord(lat, lng, color, radius) {
  var circleMarker = L.circleMarker([lat, lng], {
      color: 'black',
      weight: 1,
      fillColor: color,
      fillOpacity: 1,
      radius: radius
  }).addTo(markerLayer);
}

function drawCircleMarker(iata, color, radius) {
  try {
    var lat = airports_dict[iata]['lat'];
    var lng = airports_dict[iata]['lng'];
    var city = airports_dict[iata]['city'];
    var circleMarker = L.circleMarker([lat, lng], {
        color: 'black',
        weight: 1,
        fillColor: color,
        fillOpacity: 1,
        radius: radius
    }).addTo(markerLayer);
    circleMarker.bindPopup(iata+' ('+city+')');
    circleMarker.on('mouseover', function (e) {
      this.openPopup();
    });
    circleMarker.on('mouseout', function (e) {
      this.closePopup();
    });
  } catch (e) {
    console.log(e);
  }
}

function mapCenter(iata, zoom) {
  var lat = airports_dict[iata]['lat'];
  var lng = airports_dict[iata]['lng'];
  map.flyTo([lat, lng], zoom);
}
