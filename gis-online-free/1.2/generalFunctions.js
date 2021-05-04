const toNumbers = arr => arr.map(Number);

function loadSidePanel() {
    let openbtn = createElementAttributes("button", "openbtn", {
            onclick: function(){openNav();},
            id: "openbtn", 
            innerHTML: "&rtrif;",
            // innerHTML: "&#8942;"
        }), 
        closebtn = createElementAttributes("button", "closebtn", {
            onclick: function(){closeNav();},
            innerHTML: "&ltrif;",
            id: "closebtn", 
        }), 
        segments = createElementAttributes("div", null, { id: "segments" }), 
        uploadExportSeg = createElementAttributes("div", null, { id: "uploadExportSeg" }), 
        datasetListSeg = createElementAttributes("div", null, { id: "datasetListSeg" }), 
        mapStyleSeg = createElementAttributes("div", null, { id: "mapStyleSeg" }),
        addLoadExportButtons = createElementAttributes("div", "add-load-export-buttons", {}), 
        imageContainer = createElementAttributes("div", "image-container", { id: "imageContainer" }), 
        exportContainer = createElementAttributes("div", "export-container", { id: "exportContainer" }), 
        fileUpload = createElementAttributes("input", "form-control-file", { id: "fileUpload" }), 
        uploadButton = createElementAttributes("button", "upload-button", {
            id: "uploadButton", 
            innerHTML: "<strong>新增資料庫</strong><br/><i><small>( csv, geojson )</small></i>",
            type: "button"
        }), 
        loadButton = createElementAttributes("button", "load-button", {
            id: "loadButton", 
            innerHTML: "<strong>載入範例<br/>資料庫</strong>",
            type: "button"
        }), 
        exportButton = createElementAttributes("button", "export-button", {
            id: "exportButton", 
            innerHTML: "<strong>匯出地圖<br/>HTML</strong>",
            type: "button",
        });
    addLoadExportButtons.append(fileUpload, uploadButton, loadButton, exportButton);
    uploadExportSeg.append(addLoadExportButtons, imageContainer, exportContainer);
    segments.append(uploadExportSeg, datasetListSeg, mapStyleSeg);
    $("#mySidepanel").append(openbtn, closebtn, segments);
    $("#fileUpload").prop({
        "type": "file", 
        "accept": ".csv, .geojson", 
        "hidden": true
    });
    let datasetTemp = Object.keys(datasetTemplates);
    for ( let i=0; i<datasetTemp.length; i++ ) {
        let flexItem = createElementAttributes("div", "flex-item", {}), 
            figure = createElementAttributes("figure", null, {}), 
            img = createElementAttributes("img", null, {
                src: datasetTemplates[datasetTemp[i]]["src"], 
                name: datasetTemp[i],
                onclick: function(){loadDatebaseTemp(this.name);},
            }), 
            figcaption = createElementAttributes("figcaption", null, {
                innerHTML: datasetTemplates[datasetTemp[i]]["figcaption"],
            }), 
            entries = createElementAttributes("figcaption", null, {
                innerHTML: datasetTemplates[datasetTemp[i]]["entries"],
            });
        figure.append(img, figcaption, entries);
        flexItem.append(figure);   
        $("#imageContainer").append(flexItem);
    }    
    for ( let [key, value] of Object.entries(exportFig) ) {
        let flexItem = createElementAttributes("div", "flex-item", {}), 
            figure = createElementAttributes("figure", null, {}), 
            img = createElementAttributes("img", null, {
                src: value["src"], 
                name: key,
                onclick: function(){exportHTML(value["hide"]);},
            }), 
            caption = createElementAttributes("figcaption", null, {
                innerHTML: value["caption"],
            });
        figure.append(img, caption);
        flexItem.append(figure);   
        $("#exportContainer").append(flexItem);
    }      
}
function openExportOptions() {
    closeDatabaseTemp();
    if ($("#exportButton").text() != "關閉") {
        $(".export-container").css("display", "flex");
        $("#exportButton").html("關閉");
    } else {
        closeExportOptions()
    }    
}
function closeExportOptions() {
    $(".export-container").css("display", "none");
    $("#exportButton").html("<strong>匯出地圖<br/>HTML</strong>");
}
function openDatabaseTemp() {
    closeExportOptions();
    if ($("#loadButton").text() != "關閉") {
        $(".image-container").css("display", "flex");
        $("#loadButton").html("關閉");
    } else {
        closeDatabaseTemp()
    }    
}
function closeDatabaseTemp() {
    $(".image-container").css("display", "none");
    $("#loadButton").html("<strong>載入範例<br/>資料庫</strong>");
}
function loadDatebaseTemp(DATABASETEMP) {
    closeDatabaseTemp();
    loadTemplate(DATABASETEMP);
}
function loadTemplate(DATABASETEMP) {
    let xhr = new XMLHttpRequest(),
        method = 'GET',
        overrideMimeType = 'text/csv',
        url = datasetTemplates[DATABASETEMP]["url"];
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let data = Papa.parse(xhr.responseText, {header : false}), 
                datasetNumber = "dataset" + datasetNo, 
                fileType = datasetTemplates[DATABASETEMP]["fileType"],
                fileName = datasetTemplates[DATABASETEMP]["fileName"];
            console.log(data);
            datasetNo += 1;
            addCsvToDatasets(data, datasetNumber, fileType, fileName);
            addDatasetToSeg(datasetNumber, fileType, fileName);
            addTemplateLayers(DATABASETEMP, datasetNumber);              
            $("#loading").html("");
        }
    };
    $("#loading").html('<div class="loading"><img src="https://cdn.jsdelivr.net/gh/dubidub/dubidub.github.io/gis-online-free/1.2/resources/loading.gif" /></div>');
    xhr.open(method, url, true);
    xhr.send();
}
function addTemplateLayers(DATABASETEMP, datasetNumber) {
    let LAYERS = datasetTemplates[DATABASETEMP]["layers"];
    for ( let i=0; i<LAYERS.length; i++ ) {
        addLayer(datasetNumber, false, false);
        let LAYERNUMBER = "layer" + (layerNo - 1),
            LAYERNAME = LAYERS[i]["layerName"], 
            LAYERTYPE = LAYERS[i]["layerType"], 
            COORDINATES = LAYERS[i]["coordinates"],
            ATTRIBUTES = LAYERS[i]["attributes"], 
            FILTERROWS = LAYERS[i]["filterRows"], 
            FILTERNUMBER = "filter" + (filterNo - 1);
        $('#layerName'+LAYERNUMBER).val(LAYERNAME);
        $("input[name=layerType" + LAYERNUMBER + "][value=" + LAYERTYPE + "]").click();
        for ( let [key, value] of Object.entries(COORDINATES) ) {
            $('#'+`${key}`+LAYERNUMBER).val(`${value}`);
        }            
        checkCoordFilled(datasetNumber, LAYERTYPE, LAYERNUMBER);
        for ( let [key, value] of Object.entries(ATTRIBUTES) ) {
            $("#layerAttributes"+LAYERNUMBER+" input#"+`${key}`).val(`${value}`);
        } 
        if ( FILTERROWS.length != 0 ) {
            filterGroups[FILTERNUMBER]["rows"] = FILTERROWS;                    
        }
        submitLayer(LAYERNUMBER, datasetNumber);
    }
    $("#layerTypes").val(datasetTemplates[DATABASETEMP]["tilelayer"]);
    updateTileLayer();    
}
function openNav() {
    if ( $( window ).width() > 520 ) {
        $("#mySidepanel").css("width", "415px");
    } else {
        $("#mySidepanel").css("width", "100vw");
    }
    $("#openbtn").css("display", "none");
    $("#closebtn").css("display", "block");
}
function closeNav() {
    $("#mySidepanel").css("width", "0");
    $("#openbtn").css("display", "block");
    $("#closebtn").css("display", "none");
}
function exportHTML(hideBtn) { 
    $("#variables").empty();
    $("#variables").append(
        "var tilelayerType = '" + $("#layerTypes").val() + "';" +
        "var config = " + JSON.stringify(config) + ";" +
        "var filterGroups = " + JSON.stringify(filterGroups) + ";" +
        "var datasets = " + JSON.stringify(datasets) + ";" +
        "var layerGroups = {};" +
        "var layerNo = " + layerNo + ";" +
        "var datasetNo = " + datasetNo + ";" +
        "var filterNo = " + filterNo + ";"
    );
    if ( hideBtn == true) {
        $("#variables").append( "var hideOpenBtn = true;" )
    }
    let content = $('html').html(),
        a = document.createElement('a'),
        blob = new Blob([content], {'type':'text/plain'});
    a.href = window.URL.createObjectURL(blob);
    a.download = "new.html";
    a.click();
    closeExportOptions();
}
function updateTileLayer() {
    try { map.removeLayer(layerGroups['tileLayer']); } catch (e) { console.log(e) };
    let layerType = $("#layerTypes").val();
    layerGroups['tileLayer'] = L.tileLayer(
        tileLayers[layerType]['url'], 
        tileLayers[layerType]['option']
    ).addTo(map);
}
function addMapStyles() {
    let ele1 = createElementAttributes("div", "map-style", {
            id: "mapStyle"
            }),        
        layerLabel = createElementAttributes("label", null, {
                for: "layerTypes", 
                innerHTML: "地圖類型　"
            }),
        layerSelect = createElementAttributes("select", "layer-select", {
            id: "layerTypes", 
            name: "layerTypes",
            onchange: function(){updateTileLayer();},
            }),
        layerTypes = Object.keys(tileLayers);
        for (let i=0; i<layerTypes.length; i++) {
            let optionEle = createElementAttributes("option", null, {
                    value: layerTypes[i],
                    innerHTML: tileLayers[layerTypes[i]]['name']
                });
            layerSelect.appendChild(optionEle);
        }        
        ele1.append(layerLabel, layerSelect);
        $("#mapStyleSeg").append(ele1);
}
function createElementAttributes(ELE, CLASS, ATTR) {
    let ele = document.createElement(ELE);
    Object.assign(ele, ATTR);
    ele.classList.add(CLASS);
    return ele
}
function generateModal(objectName) {
    let ele = createElementAttributes("div", null, {
        id: "modal" + objectName
    });
    let ele1 = createElementAttributes("div", null, {
        id: "modalDialog" + objectName, 
    });
    let ele1_1 = createElementAttributes("div", "modal-content", {
        id: "modalContent" + objectName, 
    });
    let ele1_1_1 = createElementAttributes("div", "modal-header", {
        id: "modalHeader" + objectName, 
    });    
    let ele1_1_1_1 = createElementAttributes("h3", "modal-title", {
        id: "modalTitle" + objectName, 
    }); 
    let ele1_1_1_2 = createElementAttributes("button", "close", {
        id: "modalX" + objectName, 
        innerHTML: '<span aria-hidden="true">&times;</span>'
    }); 
    ele1_1_1.append( ele1_1_1_1, ele1_1_1_2 );
    let ele1_1_2 = createElementAttributes("div", "modal-body", {
        id: "modalBody" + objectName, 
    }); 
    let ele1_1_3 = createElementAttributes("div", "modal-footer", {
        id: "modalFooter" + objectName, 
    }); 
    ele1_1.append(ele1_1_1, ele1_1_2, ele1_1_3);
    ele1.appendChild(ele1_1);
    ele.appendChild(ele1);
    $("#Modal").append(ele);
    $("#modal"+objectName).attr({
        class: "modal fade",
        tabindex: "-1", 
        role: "dialog"
    });
    $("#modalDialog"+objectName).attr({
        class: "modal-dialog modal-lg",
        role: "document"
    });
    $("#modalX"+objectName).attr({
        "data-dismiss": "modal",
        "aria-label": "Close"
    });
}
// $(document).ready(function() {  
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//             loadCoord = [position.coords.latitude, position.coords.longitude];
//             map.setView(loadCoord, 8)
//         });        
//     }    
// });