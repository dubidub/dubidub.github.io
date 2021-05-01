function addLayer(DATASET) {
    // generate a new layer modal
    let layerNumber = "layer" + layerNo; 
    layerNo += 1;
    generateModal(layerNumber);
    $("#modal"+layerNumber).css({
        "overflow-y": "auto",
    });
    $("#modalDialog"+layerNumber).attr({
        class: "modal-dialog"
    });
    $('#modal'+layerNumber).modal();
    // add modal title
    $( "#modalTitle"+layerNumber ).html("圖層 ");
    let lName = createElementAttributes("input", "input-modal-title", {
            id: "layerName"+layerNumber, 
            type: "text",
            name: "layerName",
            value: layerNumber
        });    
    $( "#modalTitle"+layerNumber ).append(lName);
    // add modal body
    let ele1 = createElementAttributes("div", "layer", {
            id: "layerDataset"+layerNumber
        }),
        ele2 = createElementAttributes("h4", null, {
            innerHTML:"資料庫"
        }),
        layerContent = createElementAttributes("div", "layer-content", {
            id: "layerContentDataset"+layerNumber
        }),
        ele3 = createElementAttributes("input", "input-readonly", {
            id: "dataset"+layerNumber, 
            type: "text",
            name: "datasetFilename",
            value: datasets[DATASET]['fileName'] + "." + datasets[DATASET]['fileType'],
        }),
        filterButton = createElementAttributes("button", "filter-button", {
            id: "filter"+layerNumber,
            onclick: function(){showFilter(layerNumber);},
            // onclick: function(){showFilter(layerNumber);},
            innerHTML: "添加篩選"
        });
    layerContent.append(ele3, filterButton);
    ele1.append(ele2, layerContent);
    $( "#modalBody"+layerNumber ).append(ele1);
    $( "#dataset"+layerNumber ).prop("readonly", true);
    $( "#advanceFilter"+layerNumber ).attr({
            class: "btn btn-secondary"
        });
    showLayerTypes(DATASET, layerNumber)
    // add confirm button 
    addConfirmButtonToModal(layerNumber, DATASET);
    // add filters
    addFilter(DATASET, layerNumber);
}

function addConfirmButtonToModal(LAYERNUMBER, DATASET) {
    let confirmButton = createElementAttributes("button", null, {
            id: "confirmButton"+LAYERNUMBER, 
            innerHTML: "確認",
            onclick: function(){submitLayer(LAYERNUMBER, DATASET);},
            type: "button"
        });   
    $( "#modalFooter"+LAYERNUMBER ).append(confirmButton);
    $( "#confirmButton"+LAYERNUMBER ).attr({
            class: "btn btn-primary",
            "data-dismiss": "modal"
        });
}

function showLayerTypes(DATASET, LAYERNUMBER) {
    try { document.getElementById("layerType"+LAYERNUMBER).remove(); } catch (e) {}
    try { document.getElementById("layerCoordinates"+LAYERNUMBER).remove(); } catch (e) {}
    try { document.getElementById("layerAttributes"+LAYERNUMBER).remove(); } catch (e) {}

    let ele1 = createElementAttributes("div", "layer", {
            id: "layerType"+LAYERNUMBER
        }),
        ele2 = createElementAttributes("h4", null, {
            innerHTML: "圖層類型"
        }), 
        layerContent = createElementAttributes("div", "layer-content", {});
    ele1.appendChild(ele2);
    let layers = Object.keys(layerTypes);
    for (let i=0; i<layers.length; i++) {
        let typeInput = createElementAttributes("input", null, {
                type: "radio",
                name: "layerType"+LAYERNUMBER,
                value: layers[i],
                onclick: function(){showLayerCoordinates(DATASET, this.value, LAYERNUMBER);}
            }),
            typeSpan = createElementAttributes("span", null, {
                innerHTML: names[layers[i]]["zh"],
            }),
            typeLabel = createElementAttributes("label", "box-radio-input", {});  
        typeLabel.append(typeInput, typeSpan);
        layerContent.append(typeLabel);
    }
    ele1.append(layerContent);
    $( "#modalBody"+LAYERNUMBER ).append(ele1);
}

function showLayerCoordinates(DATASET, LAYERTYPE, LAYERNUMBER) {
    try { document.getElementById("layerCoordinates"+LAYERNUMBER).remove(); } catch (e) {}
    try { document.getElementById("layerAttributes"+LAYERNUMBER).remove(); } catch (e) {}
    let FIELDS = datasets[DATASET]['fields'],
        ele1 = createElementAttributes("div", "layer", {
            id: "layerCoordinates"+LAYERNUMBER
        }),
        ele2 = createElementAttributes("h4", null, {
            innerHTML: "座標欄位"
        });  
    ele1.appendChild(ele2);
    let coordinates = layerTypes[LAYERTYPE]['coordinates'], 
        br = document.createElement("br");
    for (let i=0; i<coordinates.length; i++) {
        let selectInput = createElementAttributes("div", "layer-content", {}),
            coordLabel = createElementAttributes("label", null, {
                // for: coordinates[i]+LAYERNUMBER, 
                innerHTML: names[coordinates[i]]["zh"]
            }),
            coordSelect = createElementAttributes("select", "layer-select", {
                id: coordinates[i]+LAYERNUMBER, 
                name: coordinates[i]+LAYERNUMBER,
                onchange: function(){checkCoordFilled(DATASET, LAYERTYPE, LAYERNUMBER);},
                innerHTML: "<option value='default'>--選擇欄位--</option>"
            });
        for (let i=0; i<FIELDS.length; i++) {
            let optionEle = createElementAttributes("option", null, {
                    value: i,
                    innerHTML: FIELDS[i]["title"]
                });
            coordSelect.appendChild(optionEle);
        }        
        selectInput.append(coordLabel, coordSelect, br);
        ele1.append(selectInput);
    }
    $( "#modalBody"+LAYERNUMBER ).append(ele1);
}

function checkCoordFilled(DATASET, LAYERTYPE, LAYERNUMBER) {
    let coordinates = layerTypes[LAYERTYPE]['coordinates'],
        unfilled = 0;
    for (let i=0; i<coordinates.length; i++) {
        let coordValue = $("#"+coordinates[i]+LAYERNUMBER).val();
        if (coordValue == "default") {
            unfilled += 1;
        }
    }
    if (unfilled == 0) {
        showLayerAttributes(DATASET, LAYERTYPE, LAYERNUMBER);
    } 
}

function showLayerAttributes(DATASET, LAYERTYPE, LAYERNUMBER) {
    try { document.getElementById("layerAttributes"+LAYERNUMBER).remove(); } catch (e) {}
    
    let ele1 = createElementAttributes("div", "layer", {
            id: "layerAttributes"+LAYERNUMBER
        }),
        ele2 = createElementAttributes("h4", null, {
            innerHTML: "圖案設定"
        });   
    ele1.appendChild(ele2);
    let attrs = layerTypes[LAYERTYPE]['attributes'];
    for (let i=0; i<attrs.length; i++) {
        let ele3 = addAttributes(attrs[i], LAYERNUMBER);
        ele1.appendChild(ele3);
    }
    $( "#modalBody"+LAYERNUMBER ).append(ele1);
}

function addAttributes(ATTR, LAYERNUMBER) {
    let ele1 = createElementAttributes("div", "attributes", {
            id: ATTR+"Attribute"+LAYERNUMBER
        }),
        ele2 = createElementAttributes("h5", null, {
            innerHTML: names[ATTR]['zh']
        }); 
    ele1.appendChild(ele2);
    let attrs = Object.keys(layerAttributes[ATTR]);
    for (let i=0; i<attrs.length; i++) {
        let selectInput = createElementAttributes("div", "sub-attributes", {}),
            attrLabel = createElementAttributes("label", null, {
                for: attrs[i], 
                innerHTML: names[attrs[i]]["zh"]
            }),
            attrInput = createElementAttributes("input", null, {
                // id: attrs[i] + LAYERNUMBER,
                ...layerAttributes[ATTR][attrs[i]]
            });              
        selectInput.append(attrLabel, attrInput);
        ele1.append(selectInput);
    }
    return ele1
}

function submitLayer(LAYERNUMBER, DATASET) {
    let LAYERNAME = $('#layerName'+LAYERNUMBER).val(),
        LAYERTYPE = $( "input[type=radio][name=layerType"+LAYERNUMBER+"]:checked" ).val(),
        COORDINATES = [],
        layerCoordinates = layerTypes[LAYERTYPE]['coordinates'],
        ATTRIBUTES = [],
        attributes = layerTypes[LAYERTYPE]['attributes'];
    for (let i=0; i<layerCoordinates.length; i++) {
        let clmnNO = $("#"+layerCoordinates[i]+LAYERNUMBER).val();
        COORDINATES.push(clmnNO);
    }    
    for (let i=0; i<attributes.length; i++) {
        let attrs = JSON.parse(JSON.stringify(Object.values(layerAttributes[attributes[i]])));
        ATTRIBUTES.push(...attrs); 
    }   
    for (let i=0; i<ATTRIBUTES.length; i++) {
        let attr = ATTRIBUTES[i]['id'];  
        ATTRIBUTES[i]['value'] = $("#layerAttributes"+LAYERNUMBER+" input#"+attr).val();
    }
    addLayerList(DATASET, LAYERNUMBER, LAYERNAME, LAYERTYPE, ATTRIBUTES);
    config[LAYERNUMBER] = {}; 
    config[LAYERNUMBER]["dataset"] = DATASET;
    config[LAYERNUMBER]["name"] = LAYERNAME;
    config[LAYERNUMBER]["layerType"] = LAYERTYPE;
    config[LAYERNUMBER]["coordColumns"] = COORDINATES;
    config[LAYERNUMBER]["attributes"] = ATTRIBUTES;
    console.log(config);
    layerToMap(config, LAYERNUMBER);
}

function addLayerList(DATASET, LAYERNUMBER, LAYERNAME, LAYERTYPE, ATTR) {
    if ( !document.getElementById("list"+LAYERNUMBER) ) {
        let newElement = createElementAttributes("LI", "list", { id: "list"+LAYERNUMBER })
        $("#layers_"+DATASET).append(newElement);
    } 
    $( "#list"+LAYERNUMBER ).html("");
    let hideButton = createElementAttributes("button", "hide-button", {
            id: "hideShow" + LAYERNUMBER,
            innerHTML: "隱藏",
            onclick: function(){showHideLayer(LAYERNUMBER);}
        }),
        editButton = createElementAttributes("button", "edit-button", {
            innerHTML: "修改",
            onclick: function(){editLayer(LAYERNUMBER);}
        }),
        deleteButton = createElementAttributes("button", "delete-layer-button", {
            innerHTML: "刪除",
            onclick: function(){deleteLayer(LAYERNUMBER);}
        }),
        layerName = createElementAttributes("input", "input-readonly", {
            id: "listLayerName"+LAYERNUMBER
        });    
    Object.assign(layerName.style, {height: '28px'})
    $( "#list"+LAYERNUMBER ).append(hideButton, editButton, deleteButton, layerName);
    $( "#listLayerName"+LAYERNUMBER ).attr({
        type: "text",
        readonly: true, 
        value: LAYERNAME
    });
    let legendSpan = createElementAttributes("span", null, {}), 
        legendI = createElementAttributes("i", null, {});
    if ( LAYERTYPE == "pointLayer" ) {    
        Object.assign(legendI.style, {
            background: ATTR[0]['value'],
            border:'3px solid'+ATTR[3]['value'], 
            width:'20px',
            height:'20px',
            opacity: 0.6,            
            'border-radius': '10px',
            float: 'right',
            margin: '4.5px 12px 4.5px 10px',
        });
    } else if ( LAYERTYPE == "polygonLayer" ) {
        Object.assign(legendI.style, {
            background: ATTR[0]['value'],
            border:'3px solid'+ATTR[3]['value'],  
            width:'24px',
            height:'24px',                      
            opacity: 0.6,            
            float: 'right',
            'margin': '2px 10px',
        });
    } else {
        legendI.innerHTML = "━";
        Object.assign(legendI.style, {
            color: ATTR[1]['value'],
            'font-size': '50px',   
            'line-height':'14px',
            padding: '0 3px',
            float: 'right',
            // margin: '0 10px',
        });
    }        
    legendSpan.append(legendI);
    $( "#list"+LAYERNUMBER ).append(legendSpan);
}

function showHideLayer(LAYERNUMBER) {
    console.log(layerGroups);
    if ($("#hideShow"+LAYERNUMBER).html() == "隱藏") {
        map.removeLayer(layerGroups[LAYERNUMBER]);
        $("#hideShow"+LAYERNUMBER).html("顯示");
    } else {
        map.addLayer(layerGroups[LAYERNUMBER]);
        $("#hideShow"+LAYERNUMBER).html("隱藏");
    }
}

function editLayer(LAYERNUMBER) {
    $('#modal'+LAYERNUMBER).modal();
}

function deleteLayer(LAYERNUMBER) {
    let filterNumber = matchFilterLayer(LAYERNUMBER);
    $("#modal"+filterNumber).remove();
    delete filterGroups[filterNumber];
    $("#modal"+LAYERNUMBER).remove();
    $("#list"+LAYERNUMBER).remove();
    delete config[LAYERNUMBER];   
    try {layerGroups[LAYERNUMBER].clearLayers();} catch(e) {};  
}