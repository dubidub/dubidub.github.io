function uploadDataset(evt) {  
	$("#loading").html('<div class="loading"><img src="https://cdn.jsdelivr.net/gh/dubidub/dubidub.github.io/gis-online-free/1.2/resources/loading.gif" /></div>');
    try {
        let file = evt.target.files[0],
            fileFullname = file.name.split("."),
            fileName = fileFullname[0],
            fileType = fileFullname[1],
            datasetNumber = "dataset" + datasetNo;
        datasetNo += 1;
        // readCSV(file, datasetNumber, fileType, fileName);
        if (fileType == "csv") {
            readCSV(file, datasetNumber, fileType, fileName);
        } else if (fileType == "geojson") {
            readGeojson(file, datasetNumber, fileType, fileName);
        }
        addDatasetToSeg(datasetNumber, fileType, fileName);
    } catch(e) {
        $("#loading").html("");
    }    
}
function addDatasetToSeg(DATASETNUMBER, FILETYPE, FILENAME) {
    let datasetWrapper = createElementAttributes("div", "fst-filter", {
            id: "wrapper_"+DATASETNUMBER
        }),
        dList = createElementAttributes("div", "wrap-title", {
            id: "list_"+DATASETNUMBER, 
        }),
        ele2 = createElementAttributes("a", null, {
            innerHTML:"資料庫 "
        }),
        ele3 = createElementAttributes("input", "input-readonly", {
            id: "input_"+DATASETNUMBER, 
            type: "text",
            name: "datasetName",
            value: FILENAME+"."+FILETYPE,
        }),
        layersList = createElementAttributes("div", "wrap", {
            id: "layers_"+DATASETNUMBER, 
        }),  
        addLayerButton = createElementAttributes("div", "wrap-addlayer", {
            id: "addLayer_"+DATASETNUMBER, 
        }),  
        layerButton = createElementAttributes("button", "add-button", {
            onclick: function(){addLayer(DATASETNUMBER, true, false);},
            innerHTML: "新增圖層"
        }),
        viewButton = createElementAttributes("button", "view-button", {
            id: "viewButton_"+DATASETNUMBER, 
            innerHTML: "檢視"
        }),    
        deleteButton = createElementAttributes("button", "delete-button", {
            onclick: function(){deleteDataset(DATASETNUMBER);},
            innerHTML: "刪除"
        });
    Object.assign(viewButton.style, {float:'right'});
    Object.assign(deleteButton.style, {float:'right'});
    ele2.append(ele3);         
    dList.append(ele2, viewButton, deleteButton);
    addLayerButton.append(layerButton);
    datasetWrapper.append(dList, layersList, addLayerButton);
    $("#datasetListSeg").append(datasetWrapper);
    $( "#input_"+DATASETNUMBER ).prop("readonly", true);
    $("#viewButton_"+DATASETNUMBER).attr({
        "data-toggle": "modal",
        "data-target": "#modal"+DATASETNUMBER
    }); 
}
function readCSV(CsvFile, datasetNumber, fileType, fileName) {
    let reader = new FileReader();
    reader.readAsText(CsvFile);
    reader.onload = function(event) {
        let csvData = event.target.result,	
            data = Papa.parse(csvData, {header : false});
        addCsvToDatasets(data, datasetNumber, fileType, fileName);
    };
    reader.onerror = function() {
        alert('無法讀取');
    }; 
}
function addCsvToDatasets(csv, datasetNumber, fileType, fileName) {
    let dataset = {};     
    dataset['fileType'] = fileType;
    dataset['fields'] = [];
    for (let i=0; i<csv['data'][0].length; i++) {
        let field = {};
        field['title'] = csv['data'][0][i];
        dataset['fields'].push(field);
    }
    dataset['allData'] = csv['data'].slice(1,-1);
    dataset['fileName'] = fileName;
    datasets[datasetNumber] = dataset;       
    addDatasetModal(datasetNumber, fileType, fileName); 
    console.log(datasets);    
}
function addDatasetModal(datasetNumber, fileType, fileName) {
    generateModal(datasetNumber);
    // Add Modal Title
    $( "#modalTitle"+datasetNumber ).html(fileName + "." + fileType);
    // Add Modal Content
    let newTable = createElementAttributes("table", "table-responsive", {
            id: "table"+datasetNumber, 
            style: "width:100%"
        });
    $( "#modalBody"+datasetNumber ).append(newTable);
    $('#table'+datasetNumber).DataTable( {
        "bDestroy": true,
        data: datasets[datasetNumber]['allData'],
        columns: datasets[datasetNumber]['fields'],
        language: dataTablesLang,
    } );    
    $("#loading").html("");
}
function deleteDataset(datasetNumber) {
    $("#modal"+datasetNumber).remove();
    $("#wrapper_"+datasetNumber).remove();
    delete datasets[datasetNumber];    
    let layers = Object.keys(config);
    for (let i=0; i<layers.length; i++) {
        if (config[layers[i]]['dataset'] == datasetNumber) {
            deleteLayer(layers[i]);
        }
    }
}
function readGeojson(GeoJSON, datasetNumber, fileType, fileName) {
    let reader = new FileReader();
    reader.readAsText(GeoJSON);
    reader.onload = function(event) {
        let geojsonData = event.target.result,	
            data = JSON.parse(geojsonData);
        console.log(data);
        addGeojsonToDatasets(data, datasetNumber, fileType, fileName);
    };
    reader.onerror = function() {
        alert('無法讀取 ' + fileName + '.' + fileType);
    }; 
}
function addGeojsonToDatasets(geojson, datasetNumber, fileType, fileName) {
    let dataset = {},   
        fieldsProp = Object.keys(geojson['features'][0]['properties']),
        fieldsGeo = Object.keys(geojson['features'][0]['geometry']),
        fields = fieldsProp.concat(fieldsGeo),
        n = removeArrayStructure(geojson['features'][0]['geometry']['coordinates']);
    dataset['fileType'] = fileType;
    dataset['fields'] = [];    
    for (let i=0; i<fields.length; i++) {
        let field = {};
        field['title'] = fields[i];
        dataset['fields'].push(field);
    }
    dataset['allData'] = [];
    for (let i=0; i<geojson['features'].length; i++) {
        let entryProp = Object.values(geojson['features'][i]['properties']),
            entryGeoType = geojson['features'][i]['geometry']['type'],
            entryGeoCoord = geojson['features'][i]['geometry']['coordinates'];  
        entryGeoCoord = entryGeoCoord.flat(n);
        let entryGeoCoordRev = switchLatLng(entryGeoCoord);
        entryProp.push(entryGeoType, entryGeoCoordRev);
        dataset['allData'].push(entryProp);
    }
    dataset['fileName'] = fileName;
    datasets[datasetNumber] = dataset;
    addDatasetModal(datasetNumber, fileType, fileName); 
    console.log(datasets);
}
function switchLatLng(coordinates) {
    let coordinates_inv = [];
    for ( let j = 0; j < coordinates.length; j++ ) {
        let coordinate = [ coordinates[j][1], coordinates[j][0] ];
        coordinates_inv.push(coordinate);
    }
    return coordinates_inv;
}