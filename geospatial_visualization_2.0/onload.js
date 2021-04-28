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
    updateTileLayer();    
    $("#uploadButton").click( function() {
        $('#fileUpload').click();
    }); 
    $("#loadButton").click(openDatabaseTemp); 
    $("#fileUpload").change(uploadDataset); 
});