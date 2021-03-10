function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
}
function onReaderLoad(event){
    var obj = JSON.parse(event.target.result);
    datasets = obj;
    dataFieldSelect();
    if (typeof datasets['features'][0]['geometry']['coordinates'][0][0][0][0] == 'number') {
      for ( let i = 0; i < datasets['features'].length; i++ ) {
        let coordinates_p = datasets['features'][i]['geometry']['coordinates'][0][0];
        let coordinates_p_inv = [];
        for ( let j = 0; j < coordinates_p.length; j++ ) {
          let coordinate = [ coordinates_p[j][1], coordinates_p[j][0] ];
          coordinates_p_inv.push(coordinate);
        }
        drawPolygon(coordinates_p_inv, map, datasets['features'][i]['properties'], "#000");
      }
    } else if (typeof datasets['features'][0]['geometry']['coordinates'][0][0][0] == 'number') {
      for ( let i = 0; i < datasets['features'].length; i++ ) {
        let coordinates_p = datasets['features'][i]['geometry']['coordinates'][0];
        let coordinates_p_inv = [];
        for ( let j = 0; j < coordinates_p.length; j++ ) {
          let coordinate = [ coordinates_p[j][1], coordinates_p[j][0] ];
          coordinates_p_inv.push(coordinate);
        }
        drawPolygon(coordinates_p_inv, map, datasets['features'][i]['properties'], "#000");
      }
    }
}
function uniqueIDSelect() {
  let uniqueIDDropdown = document.getElementById('uniqueID');
  uniqueID = uniqueIDDropdown.value;
  let quickSearch = document.getElementById('quickSearch');
  quickSearch.placeholder = "輸入 " + uniqueID + " 快速查詢"
}

function inputID() {
  let quickSearch = document.getElementById('quickSearch');
  let match = 0;
  if (typeof datasets['features'][0]['geometry']['coordinates'][0][0][0][0] == 'number') {
    for ( let i = 0; i < datasets['features'].length; i++ ) {
      if ( datasets['features'][i]['properties'][uniqueID] == quickSearch.value ) {
        let coordinates_map = datasets['features'][i]['geometry']['coordinates'][0][0];
        let coordinates_map_inv = [];
        for ( var j = 0; j < coordinates_map.length; j++ ) {
          let coordinate = [ coordinates_map[j][1], coordinates_map[j][0] ];
          coordinates_map_inv.push(coordinate);
        };
        match++;
        highlightPolygon(coordinates_map_inv, map, datasets['features'][i]['properties'], "#ffff00");
        map.flyTo(coordinates_map_inv[0], 14);
      }
    };
  } else if (typeof datasets['features'][0]['geometry']['coordinates'][0][0][0] == 'number') {
    for ( let i = 0; i < datasets['features'].length; i++ ) {
      if ( datasets['features'][i]['properties'][uniqueID] == quickSearch.value ) {
        let coordinates_map = datasets['features'][i]['geometry']['coordinates'][0];
        let coordinates_map_inv = [];
        for ( var j = 0; j < coordinates_map.length; j++ ) {
          let coordinate = [ coordinates_map[j][1], coordinates_map[j][0] ];
          coordinates_map_inv.push(coordinate);
        };
        match++;
        highlightPolygon(coordinates_map_inv, map, datasets['features'][i]['properties'], "#ffff00");
        map.flyTo(coordinates_map_inv[0], 14);
      }
    };
  }
  if ( match == 0 ) {
    alert("資料不存在");
  }
}
function clickID(id) {
  if (typeof datasets['features'][0]['geometry']['coordinates'][0][0][0][0] == 'number') {
    for ( let i = 0; i < datasets['features'].length; i++ ) {
      if ( datasets['features'][i]['properties'][uniqueID] == id ) {
        let coordinates_map = datasets['features'][i]['geometry']['coordinates'][0][0];
        let coordinates_map_inv = [];
        for ( var j = 0; j < coordinates_map.length; j++ ) {
          let coordinate = [ coordinates_map[j][1], coordinates_map[j][0] ];
          coordinates_map_inv.push(coordinate);
        };
        highlightPolygon(coordinates_map_inv, map, datasets['features'][i]['properties'], "#ffff00");
        map.flyTo(coordinates_map_inv[0], 14);
      }
    }
  } else if (typeof datasets['features'][0]['geometry']['coordinates'][0][0][0] == 'number') {
    for ( let i = 0; i < datasets['features'].length; i++ ) {
      if ( datasets['features'][i]['properties'][uniqueID] == id ) {
        let coordinates_map = datasets['features'][i]['geometry']['coordinates'][0];
        let coordinates_map_inv = [];
        for ( var j = 0; j < coordinates_map.length; j++ ) {
          let coordinate = [ coordinates_map[j][1], coordinates_map[j][0] ];
          coordinates_map_inv.push(coordinate);
        };
        highlightPolygon(coordinates_map_inv, map, datasets['features'][i]['properties'], "#ffff00");
        map.flyTo(coordinates_map_inv[0], 14);
      }
    }
  }

}
function clearInput() {
  document.getElementById('quickSearch').value = "";
}
function highlightPolygon(coordinates, map, properties, color) {
  let polygon = L.polygon(coordinates, {
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
  let popup_text = L.popup().setContent(html_text);
  polygon.bindPopup(popup_text).openPopup();
  polygon.on('mouseover', function (e) {
    this.openPopup();
  });
  polygon.on('mouseout', function (e) {
    this.closePopup();
  });
}
function drawPolygon(coordinates, map, properties, color) {
  let polygon = L.polygon(coordinates, {
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
  let popup_text = L.popup().setContent(html_text);
  polygon.bindPopup(popup_text);
  polygon.on('mouseover', function (e) {
    this.openPopup();
  });
  polygon.on('mouseout', function (e) {
    this.closePopup();
  });
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
