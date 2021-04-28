function addFilter(DATASET, LAYER) {   
    let filterNumber = "filter" + filterNo; 
    filterNo += 1;
    filterGroups[filterNumber] = {};
    filterGroups[filterNumber]['dataset'] = DATASET;
    filterGroups[filterNumber]['layer'] = LAYER;
    filterGroups[filterNumber]["rows"] = Array.from({length: datasets[DATASET]["allData"].length}, (v, i) => i);
    // generate a new filter modal
    generateModal(filterNumber);
    $("#modal"+filterNumber).attr({
        style: "overflow-y:auto;"
    });
    // Add Modal Title
    let LAYERNAME = $('#layerName'+LAYER).val();
    $( "#modalTitle"+filterNumber ).html("圖層 " + LAYERNAME + " 篩選條件" );
    // Add Modal Content
    let eleTable = createElementAttributes("table", "table-responsive", {
            id: "table"+filterNumber, 
            style: "width:100%"
        });
    $( "#modalBody"+filterNumber ).append(eleTable);
    initDatatable(DATASET, filterNumber);    
    // Add Modal Footer
    let cancelButton = createElementAttributes("button", "btn", {
            id: "cancelFilter"+filterNumber,
            onclick: function(){
                $('#modal'+filterNumber).modal("hide");    
                $('#modal'+LAYER).modal();
            },
            innerHTML: "取消"
        }),
        confirmButton = createElementAttributes("button", null, {
            id: "confirmFilter"+filterNumber,
            onclick: function(){
                $('#modal'+filterNumber).modal("hide");    
                $('#modal'+LAYER).modal();
                $('#filter'+LAYER).html("編輯篩選");
                $('#filter'+LAYER).css({
                    "background": "#23a3a7",
                    "color": "#fff"
                });
                if (! document.getElementById( "clearFilter"+LAYER )) {
                    clearFilter = createElementAttributes("button", "filter-button", {
                        id: "clearFilter"+LAYER,
                        onclick: function(){
                            let filterNumber = matchFilterLayer(LAYER);
                            $("#modal"+filterNumber).remove();
                            delete filterGroups[filterNumber];
                            $("#clearFilter"+LAYER).remove();
                            $("#filter"+LAYER).html("新增篩選");
                            $('#filter'+LAYER).css({
                                "background": "#fff",
                                "color": "#000"
                            });
                            addFilter(DATASET, LAYER);
                        },
                        innerHTML: "清除"
                    });
                    $( "#layerContentDataset"+LAYER ).append(clearFilter);
                }                
                filterGroups[filterNumber]["rows"] = $('#table'+filterNumber).DataTable().rows( { search: 'applied' } ).select()[0];
                console.log(filterGroups);
            },
            innerHTML: "套用"
        });
    $( "#modalFooter"+filterNumber ).append(cancelButton, confirmButton);
    $( "#confirmFilter"+filterNumber ).attr({
        class: "btn btn-primary"
    });
}

function initDatatable(DATASET, FILTER){
    $('#table'+FILTER).DataTable({
        "bDestroy": true,
        data: datasets[DATASET]['allData'],
        columns: datasets[DATASET]['fields'],
        dom: 'Qlfrtip',    
        language: dataTablesLang,
    });
}

function matchFilterLayer(LAYER) {
    let filterNumber,
        fList = Object.keys(filterGroups);
    for (let i=0; i<fList.length; i++) {
        if (filterGroups[fList[i]]['layer'] == LAYER ) {
            filterNumber = fList[i];
            break
        }
    }
    return filterNumber
}

function showFilter(LAYER) {
    let filterNumber = matchFilterLayer(LAYER);
    $('#modal'+LAYER).modal("hide");    
    $('#modal'+filterNumber).modal();
}