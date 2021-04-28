function layerToMap(config, layer) {
    try {layerGroups[layer].clearLayers();} catch(e) {};    
    layerGroups[layer] = L.layerGroup();
    map.addLayer(layerGroups[layer]);

    let dataset = datasets[config[layer]["dataset"]],
        fields = dataset['fields'],
        filterNumber = matchFilterLayer(layer),
        filteredRows = filterGroups[filterNumber]["rows"],
        coordColumns = toNumbers(config[layer]["coordColumns"]),
        attributes = config[layer]["attributes"],
        layerType = config[layer]["layerType"],
        attr = {};
    for (let i=0; i<attributes.length; i++) {
        attr[attributes[i]['name']] = attributes[i]['value']
    }    
    if (layerType == "pointLayer") {
        addPointLayer(coordColumns, dataset, attr, fields, layerGroups[layer], filteredRows, layer);
    } else if (layerType == "lineLayer") {
        addLineLayer(coordColumns, dataset, attr, fields, layerGroups[layer], filteredRows, layer);
    } else {
        addPolygonLayer(coordColumns, dataset, attr, fields, layerGroups[layer], filteredRows, layer);
    }
}

function addPolygonLayer(coordColumns, dataset, attr, fields, layerGroup, filteredRows, layer) {
    let coordClmn = coordColumns[0],
        contained = [], 
        coordinates0 = JSON.parse(dataset["allData"][0][coordClmn]);
    let n = removeArrayStructure(coordinates0); 
    for ( let i=0; i<filteredRows.length; i++ ) {
        try {
            let entry = dataset["allData"][filteredRows[i]],
                coordinates = JSON.parse(entry[coordClmn]),
                polygon = L.polygon(coordinates.flat(n), attr);
            layerGroup.addLayer(polygon);
            addPopup(polygon, fields, entry, dataset, layer, coordColumns);    
            contained.push(coordinates);   
        } catch (e) { console.log(e) }        
    }
    map.fitBounds(contained); 
}

function removeArrayStructure(array) {
    let n = 0;
    for ( let i=0; i<10; i++ ) {
        if ( $.isNumeric(array.flat(i+1)[0]) ) {
            n = i;
            break
        }        
    }
    return n
}

function addLineLayer(coordColumns, dataset, attr, fields, layerGroup, filteredRows, layer) {
    let oriLatClmn = coordColumns[0],
        oriLngClmn = coordColumns[1],   
        desLatClmn = coordColumns[2],
        desLngClmn = coordColumns[3],  
        contained = [];
    for (let i=0; i<filteredRows.length; i++) {
        try {
            let entry = dataset["allData"][filteredRows[i]],
                coordinates = [
                    [ entry[oriLatClmn], entry[oriLngClmn] ],
                    [ entry[desLatClmn], entry[desLngClmn] ]
                ],
                line = L.polyline(coordinates, attr);    
            layerGroup.addLayer(line);
            addPopup(line, fields, entry, dataset, layer, coordColumns);   
            contained.push(coordinates);    
        } catch (e) { console.log(e) }           
    }
    map.fitBounds(contained); 
}

function addPointLayer(coordColumns, dataset, attr, fields, layerGroup, filteredRows, layer) {
    let latClmn = coordColumns[0],
        lngClmn = coordColumns[1], 
        contained =[]; 
    for (let i=0; i<filteredRows.length; i++) {
        try {
            let entry = dataset["allData"][filteredRows[i]],
                coordinates = [ entry[latClmn], entry[lngClmn] ],        
                point = L.circleMarker(coordinates, attr);
            layerGroup.addLayer(point);
            addPopup(point, fields, entry, dataset, layer, coordColumns);           
            contained.push(coordinates);  
        } catch (e) { console.log(e) }               
    }
    map.fitBounds(contained);    
}

function addPopup(object, fields, entry, dataset, layer, coordColumns) {
    let ob_text = "<h5>資料庫：" + dataset["fileName"] + "</h5>" +
                  "<h5>圖　層：" + config[layer]["name"] + "</h5>" +
                  "<table id='tablePopup'><tbody>";
    for ( let k=0; k < fields.length; k++ ) {
        if ( !coordColumns.includes(k) ) {
            ob_text = ob_text.concat(
                "<tr><td><strong>" + fields[k]['title'].toString() + 
                '</strong></td><td style="border: 1px;">' + entry[k].toString() + "</td></tr>");
        }        
    };
    let pane = map.createPane('fixed', document.getElementById('mapid')),
        html_text = $('<div id="html1" style="width: 100.0%; height: 100.0%;"> '+ob_text+'</tbody></table></div>')[0],
        popup_text = L.popup({
            pane: 'fixed', 
            className: 'popup-fixed',
            autoPan: false,
        }).setContent(html_text);
    object.bindPopup(popup_text);
    object.on({
        mouseover: function (e) { this.openPopup(); },
        mouseout: function (e) { this.closePopup(); }
    });
}