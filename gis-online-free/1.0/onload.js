var loadCoord = [23.707398117586052, 120.98712417755992];

$("#Modal").html("");
$("#mySidepanel").html("");
$("#mapid").html("");

const map = L.map('mapid', {
    worldCopyJump: true,
    zoomControl: false
}).setView(loadCoord, 8);

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

$(document).ready( function() {
    loadSidePanel();
    addMapStyles();
    $("#layerTypes").val(tilelayerType);
    updateTileLayer();   
    $("#uploadButton").click( function() {
        $('#fileUpload').click();
    }); 
    $("#loadButton").click(openDatabaseTemp); 
    $("#exportButton").click(openExportOptions); 
    $("#fileUpload").change(uploadDataset); 
    // Swipe Event
    var start = null;
    $("#mySidepanel").on("touchstart",function(event){
        if ( event.touches.length === 1 ) {
            start = event.touches.item(0).clientX;
        } else {
            start = null;
        }
    });
    $("#mySidepanel").on("touchend",function(event){
        var offset = 100;
        if ( start ) {
            var end = event.changedTouches.item(0).clientX;        
            if ( end < start - offset ){
                closeNav();
            }
        }
    });
    // Load Exported HTML
    if ( Object.keys(datasets).length != 0 ) {
        loadConfigLayer();
    }    
});

function loadConfigLayer(){
    for ( let [key, value] of Object.entries(datasets) ) {
        addDatasetToSeg(key, value["fileType"], value["fileName"]);
        let datasetLAYERS = findLayersByDataset(key);
        for ( let i=0; i<datasetLAYERS.length; i++ ) {            
            let LAYERNUMBER = datasetLAYERS[i],
                LAYERNAME = config[LAYERNUMBER]["name"], 
                LAYERTYPE = config[LAYERNUMBER]["layerType"], 
                COORDINATES = config[LAYERNUMBER]["coordColumns"],
                ATTRIBUTES = config[LAYERNUMBER]["attributes"], 
                FILTERNUMBER = findFilterByLayer(LAYERNUMBER),
                FILTERROWS = filterGroups[FILTERNUMBER]["rows"];
            addLayer(key, false, LAYERNUMBER);
            $('#layerName'+LAYERNUMBER).val(LAYERNAME);
            $("input[name=layerType" + LAYERNUMBER + "][value=" + LAYERTYPE + "]").click();
            for ( let i=0; i<COORDINATES.length; i++ ) {                
                $('#'+layerTypes[LAYERTYPE]['coordinates'][i]+LAYERNUMBER).val(COORDINATES[i]);
            }            
            checkCoordFilled(key, LAYERTYPE, LAYERNUMBER);
            for ( let i=0; i<ATTRIBUTES.length; i++ ) {
                $("#layerAttributes"+LAYERNUMBER+" input#"+ATTRIBUTES[i]["id"]).val(ATTRIBUTES[i]["value"]);
            } 
            if ( FILTERROWS.length != 0 ) {
                filterGroups[FILTERNUMBER]["rows"] = FILTERROWS;                    
            }
            submitLayer(LAYERNUMBER, key);            
        }
    }
    try {
        if ( hideOpenBtn == true) {
            closeNav();
            $('#openbtn').remove();
        } 
    } catch(e) {}       
}
function findLayersByDataset(DATASET) {
    let LAYERS = [];
    for ( let [key, value] of Object.entries(config) ) {
        if ( value["dataset"] == DATASET ) {
            LAYERS.push(key);
        }
    }
    return LAYERS
}
function findFilterByLayer(LAYERNUMBER) {
    let FILTER;
    for ( let [key, value] of Object.entries(filterGroups) ) {
        if ( value["layer"] == LAYERNUMBER ) {
            FILTER = key;
        }
    }
    return FILTER
}