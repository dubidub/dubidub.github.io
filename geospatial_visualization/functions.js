function switchLatLng(coordinates) {
  let coordinates_inv = [];
  for ( let j = 0; j < coordinates.length; j++ ) {
    let coordinate = [ coordinates[j][1], coordinates[j][0] ];
    coordinates_inv.push(coordinate);
  }
  return coordinates_inv;
}

function geojsonFormatCheck(data_sets) {
  if (typeof data_sets['features'][0]['geometry']['coordinates'][0][0][0][0] == 'number') {
    for ( let i = 0; i < data_sets['features'].length; i++ ) {
      let coordinates = data_sets['features'][i]['geometry']['coordinates'][0][0];
      data_sets['features'][i]['geometry']['coordinates'] = switchLatLng(coordinates);
    }
  } else if (typeof datasets['features'][0]['geometry']['coordinates'][0][0][0] == 'number') {
    for ( let i = 0; i < data_sets['features'].length; i++ ) {
      let coordinates = data_sets['features'][i]['geometry']['coordinates'][0];
      data_sets['features'][i]['geometry']['coordinates'] = switchLatLng(coordinates);
    }
  }
}

function loadTemplate() {
  var xhr = new XMLHttpRequest(),
      method = 'GET',
      overrideMimeType = 'application/json',
      url = 'https://dubidub.github.io/geospatial_visualization/resources/tp_landuse.geojson';
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      document.getElementById("templateLoading").innerHTML = '';
      datasets = JSON.parse(xhr.responseText);
      dataFieldSelect();
      geojsonFormatCheck(datasets);
      for ( let i = 0; i < datasets['features'].length; i++ ) {
        let coordinates = datasets['features'][i]['geometry']['coordinates'];
        drawPolygon(coordinates, map, datasets['features'][i]['properties'], "#000");
      }
    }
  };
  document.getElementById("templateLoading").innerHTML = '<img src="resources/loading.gif" />';
  xhr.open(method, url, true);
  xhr.send();
}

function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event){
    var obj = JSON.parse(event.target.result);
    datasets = obj;
    dataFieldSelect();
    geojsonFormatCheck(datasets);
    for ( let i = 0; i < datasets['features'].length; i++ ) {
      let coordinates = datasets['features'][i]['geometry']['coordinates'];
      drawPolygon(coordinates, map, datasets['features'][i]['properties'], "#000");
    }
}

function uniqueIDSelect() {
  let uniqueIDDropdown = document.getElementById('uniqueID');
  uniqueID = uniqueIDDropdown.value;
  let quickSearch = document.getElementById('quickSearch');
  quickSearch.placeholder = "輸入 " + uniqueID + " 快速查詢";
}

function inputID() {
  let quickSearch = document.getElementById('quickSearch');
  let match = 0;
  for ( let i = 0; i < datasets['features'].length; i++ ) {
    if ( datasets['features'][i]['properties'][uniqueID] == quickSearch.value ) {
      let coordinates = datasets['features'][i]['geometry']['coordinates'];
      match++;
      drawPolygon(coordinates, map, datasets['features'][i]['properties'], "#ffff00", true);
    }
  };
  if ( match == 0 ) {
    alert("資料不存在");
  }
}

function clearInput() {
  document.getElementById('quickSearch').value = "";
}

function drawPolygon(coordinates, map, properties, color, highlight) {
  var polygon = L.polygon(coordinates, {
    "color": color,
    "fill": true,
    "fillColor": color,
    "fillOpacity": 0.2,
    "opacity": 1.0,
    "stroke": true,
    "weight": 2
  }).addTo(map);
  let ob_keys = Object.keys(properties);
  let ob_values = Object.values(properties);
  let ob_text = "";
  for ( let k=0; k < ob_keys.length; k++ ) {
    ob_text = ob_text.concat("<br>- <strong>"+ob_keys[k].toString()+"</strong>: "+ob_values[k].toString());
  };
  let html_text = $('<div id="html1" style="width: 100.0%; height: 100.0%;"><h5> '+ob_text+'</h5></div>')[0];
  var popup_text = L.popup().setContent(html_text);
  polygon.on('mouseover', function (e) { this.openPopup(); });
  polygon.on('mouseout', function (e) { this.closePopup(); });
  if ( highlight == true ) {
    polygon.bindPopup(popup_text).openPopup();
    map.flyTo(coordinates[0], 14);
  } else {
    polygon.bindPopup(popup_text);
  }
}

function dataFieldSelect() {
  let dataField = Object.keys(datasets['features'][0]['properties']);
  let uniqueIDDropdown = document.getElementById('uniqueID');
  let dataFieldDropdown = document.getElementById('dataField');
  for (let i = 0; i < dataField.length; i++) {
    uniqueIDDropdown.innerHTML = uniqueIDDropdown.innerHTML +
      '<option value="' + dataField[i] + '">' + dataField[i] + '</option>';
    dataFieldDropdown.innerHTML = dataFieldDropdown.innerHTML +
      '<option value="' + dataField[i] + '">' + dataField[i] + '</option>';
  }
}

function dataFilterSelect() {
  let dataFieldDropdown = document.getElementById('dataField');
  let filterFieldDropdown = document.getElementById('filterField');
  filterFieldDropdown.innerHTML = '<option value="">--選擇篩選內容--</option>';
  let filterField = [];
  for (let i=0; i<datasets['features'].length; i++) {
    let dataValue = datasets['features'][i]['properties'][dataFieldDropdown.value];
    if ( !filterField.includes(dataValue) ) {
      filterField.push(dataValue);
    }
  }
  for (let i = 0; i < filterField.length; i++) {
    filterFieldDropdown.innerHTML = filterFieldDropdown.innerHTML +
      '<option value="' + filterField[i] + '">' + filterField[i] + '</option>';
  }
}

function showFilterData() {
  let dataField = Object.keys(datasets['features'][0]['properties']);
  let dataFieldDropdown = document.getElementById('dataField');
  let filterFieldDropdown = document.getElementById('filterField');
  let table = document.getElementById('table');
  table.innerHTML = "";
  let filteredData = [];
  for (let i=0; i<datasets['features'].length; i++) {
    if ( datasets['features'][i]['properties'][dataFieldDropdown.value] == filterFieldDropdown.value ) {
      filteredData.push(i);
    }
  }
  let tableHead = "";
  for (let i = 0; i < dataField.length; i++) {
    tableHead = tableHead + '<th>' + dataField[i] + '</th>';
  }
  let tableBody = "";
  for (let i = 0; i < filteredData.length; i++) {
    let dataProperties = datasets['features'][filteredData[i]]['properties'];
    let oneRowData = "";
    for (let j = 0; j < dataField.length; j++) {
      if ( dataField[j] == uniqueID ) {
        oneRowData = oneRowData + '<td>' +
                     '<input type="button" id="submit" onclick="clickID(' +
                     dataProperties[dataField[j]] + ')" value="' +
                     dataProperties[dataField[j]] + '"></td>';
      } else {
        oneRowData = oneRowData + '<td>' + dataProperties[dataField[j]] + '</td>';
      }
    }
    tableBody = tableBody + '<tr>' + oneRowData + '</tr>';
  }
  table.innerHTML = table.innerHTML +
                    '<thead><tr>' + tableHead + '</tr></thead>' +
                    '<tbody>' + tableBody + '</tbody>';
}

function clickID(id) {
  for ( let i = 0; i < datasets['features'].length; i++ ) {
    if ( datasets['features'][i]['properties'][uniqueID] == id ) {
      let coordinates = datasets['features'][i]['geometry']['coordinates'];
      drawPolygon(coordinates, map, datasets['features'][i]['properties'], "#ffff00", true);
    }
  }
}
