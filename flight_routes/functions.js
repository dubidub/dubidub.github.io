function clearInputOri() {
  document.getElementById('input_ori').value = "";
  document.getElementById('input_des').value = "";
}

function clearInputDes() {
  document.getElementById('input_des').value = "";
}

function inputOrigin() {
  markerLayer.clearLayers();
  routeLayer.clearLayers();
  highlightLayer.clearLayers();
  // document.getElementById('input_des').value = "";
  var ori = document.getElementById('input_ori').value.substring(0,3).toUpperCase();
  var city_dir = Object.keys(routes_dict[ori]);
  // var routes_stop_1 = findOneStop(ori);
  var city_stop_1 = Object.keys(routes_stop_1[ori]);
  for ( var i=0; i<city_stop_1.length; i++ ) {
    drawCircleMarker(city_stop_1[i], 'grey', 2);
  }
  for ( var i=0; i<city_dir.length; i++ ) {
    drawCircleMarker(city_dir[i], 'blue', 4);
  }
  drawCircleMarker(ori, 'red', 6);
  drawLegend();
  mapCenter(ori, 3);
}

function drawLegend() {
  var legend = L.control({ position: "bottomleft" });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Tegnforklaring</h4>";
    div.innerHTML += '<i style="background: #477AC2"></i><span>Water</span><br>';
    div.innerHTML += '<i style="background: #448D40"></i><span>Forest</span><br>';
    div.innerHTML += '<i style="background: #E6E696"></i><span>Land</span><br>';
    div.innerHTML += '<i style="background: #E8E6E0"></i><span>Residential</span><br>';
    div.innerHTML += '<i style="background: #FFFFFF"></i><span>Ice</span><br>';
    div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
    return div;
  };

  legend.addTo(map);
}


function inputDestination() {
  markerLayer.clearLayers();
  routeLayer.clearLayers();
  highlightLayer.clearLayers();
  var ori = document.getElementById('input_ori').value.substring(0,3).toUpperCase();
  var des = document.getElementById('input_des').value.substring(0,3).toUpperCase();
  var city_dir = Object.keys(routes_dict[ori]);
  var city_stop_1 = Object.keys(routes_stop_1[ori]);
  var city_stop_2 = findTwoStopDes(ori);
  if ( city_dir.includes(des) ) {

    drawDirectRoute(ori,des);
    drawCircleMarker(ori, 'red', 6);
    drawCircleMarker(des, 'blue', 4);

  } else if ( city_stop_1.includes(des) ) {

    var stops = routes_stop_1[ori][des];
    for ( var i=0; i<stops.length; i++ ) {
      drawOneStopRoute(ori, des, stops[i]);
    }
    var shortestStop = findShortestStop(ori, des, stops);
    highlightRoute(ori, des, shortestStop);
    for ( var i=0; i<stops.length; i++ ) {
      drawStopMarker(stops[i], 'gray', 4, ori, des);
    }
    drawCircleMarker(ori, 'red', 6);
    drawCircleMarker(des, 'blue', 4);

  } else if ( city_stop_2.includes(des) ) {

    var stops = allTwoStops(ori, des);
    for ( var i=0; i<stops.length; i++ ) {
      drawTwoStopRoute(ori, des, stops[i]);
    }
    var shortestStops = findShortestStops(ori, des, stops);
    highlightRoutes(ori, des, shortestStops);
    for ( var i=0; i<stops.length; i++ ) {
      drawStopsMarker(stops[i], 'gray', 4, ori, des);
    }
    drawCircleMarker(ori, 'red', 6);
    drawCircleMarker(des, 'blue', 4);

  } else {

    alert("No routes within 2 stops.");

  }
}

function findTwoStopDes(ori) {
  var ori_dir = Object.keys(routes_dict[ori]);
  var ori_stop_1 = Object.keys(routes_stop_1[ori]);
  var ori_degree_2 = ori_dir.concat(ori_stop_1);
  var ori_stop_2 = [];
  for ( var i=0; i<ori_stop_1.length; i++ ) {
    try {
      var stop1 = ori_stop_1[i];
      var stop1_dir = Object.keys(routes_dict[stop1]);
      for ( var j=0; j<stop1_dir.length; j++ ) {
        var stop2 = stop1_dir[j];
        if ( !ori_stop_2.includes(stop2) && !ori_degree_2.includes(stop2) ) {
          ori_stop_2.push(stop2);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  return ori_stop_2;
}

function allTwoStops(ori, des) {
  var ori_stops = [];
  var ori_dir = Object.keys(routes_dict[ori]);
  for ( var i=0; i<ori_dir.length; i++ ) {
    var stop0 = ori_dir[i];
    // var routes_stop_1 = findOneStop(stop0);
    var city_stop_2 = Object.keys(routes_stop_1[stop0]);
    if ( city_stop_2.includes(des) ) {
      var city_stop_1 = routes_stop_1[stop0][des];
      for ( var j=0; j<city_stop_1.length; j++ ) {
        var stop1 = city_stop_1[j];
        ori_stops.push([stop0, stop1]);
      }
    }
  }
  return ori_stops;
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

function calDistance(iata1, iata2) {
  var lat1 = airports_dict[iata1]['lat'];
  var lng1 = airports_dict[iata1]['lng'];
  var lat2 = airports_dict[iata2]['lat'];
  var lng2 = airports_dict[iata2]['lng'];
  const fi1 = lat1 * Math.PI/180,
        fi2 = lat2 * Math.PI/180,
        deltalambda = (lng2-lng1) * Math.PI/180,
        R = 6371e3;
  const d = Math.round((Math.acos( Math.sin(fi1)*Math.sin(fi2) + Math.cos(fi1)*Math.cos(fi2) * Math.cos(deltalambda) ) * R)/1000);
  return d;
}


function drawStopsMarker(stops, color, radius, ori, des) {
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
      drawStopsMarker(stops, color, radius, ori, des);
      drawCircleMarker(ori, 'red', 6);
      drawCircleMarker(des, 'blue', 4);
    });
  }
}

function drawStopMarker(iata, color, radius, ori, des) {
  var latlng = [airports_dict[iata]['lat'],airports_dict[iata]['lng']];
  var circleMarker = L.circleMarker(latlng, {
    color: 'black',
    weight: 1,
    fillColor: color,
    fillOpacity: 1,
    radius: radius
  }).addTo(markerLayer).on('click', function(e) {
    highlightRoute(ori, des, iata);
    drawStopMarker(iata, color, radius, ori, des);
    drawCircleMarker(ori, 'red', 6);
    drawCircleMarker(des, 'blue', 4);
  });
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
  var ori_coord = [airports_dict[iata1]['lat'],airports_dict[iata1]['lng']];
  var des_coord = [airports_dict[iata2]['lat'],airports_dict[iata2]['lng']];
  var stop_coord = [airports_dict[stop]['lat'],airports_dict[stop]['lng']];
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
  var ori_coord = [airports_dict[iata1]['lat'],airports_dict[iata1]['lng']];
  var des_coord = [airports_dict[iata2]['lat'],airports_dict[iata2]['lng']];
  var stop0_coord = [airports_dict[stop0]['lat'],airports_dict[stop0]['lng']];
  var stop1_coord = [airports_dict[stop1]['lat'],airports_dict[stop1]['lng']];
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
    highlightRoutes(iata1, iata2, stops);
    drawStopsMarker(stops, 'gray', 4, iata1, iata2);
    drawCircleMarker(iata1, 'red', 6);
    drawCircleMarker(iata2, 'blue', 4);
  });
}

function drawOneStopRoute(iata1, iata2, stop) {
  var ori_coord = [airports_dict[iata1]['lat'],airports_dict[iata1]['lng']];
  var des_coord = [airports_dict[iata2]['lat'],airports_dict[iata2]['lng']];
  var stop_coord = [airports_dict[stop]['lat'],airports_dict[stop]['lng']];
  var flightRoute = L.polyline([ori_coord,stop_coord,des_coord], {
    color:'gray',
    weight: 2.5,
    opacity: 0.8,
  }).addTo(routeLayer).on('click', function(e) {
    highlightRoute(iata1, iata2, stop);
    drawStopMarker(stop, 'gray', 4, iata1, iata2);
    drawCircleMarker(iata1, 'red', 6);
    drawCircleMarker(iata2, 'blue', 4);
  });
}

function drawDirectRoute(iata1, iata2) {
  var ori_lat = airports_dict[iata1]['lat'];
  var ori_lng = airports_dict[iata1]['lng'];
  var des_lat = airports_dict[iata2]['lat'];
  var des_lng = airports_dict[iata2]['lng'];
  var dis = calDistance(iata1, iata2);
  var lng_diff = ori_lng - des_lng;
  var flightRoute = L.polyline([[ori_lat,ori_lng],[des_lat,des_lng]], {
    color:'red',
    weight: 3
  }).addTo(routeLayer);
  map.fitBounds(flightRoute.getBounds());
  var html_text = '<h3>FLIGHT INFO</h3>' +
                  createSegText(iata1,iata2);
  var popup_text = L.popup().setContent(html_text);
  flightRoute.bindPopup(popup_text).openPopup();
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
