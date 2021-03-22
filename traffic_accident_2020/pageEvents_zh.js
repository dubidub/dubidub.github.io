window.addEventListener('load', function () {      
    loadDatasets("臺南市");
    loadCarType();
    loadMonths();
    loadCounties();
})

function loadCarType() {
    let carType = document.getElementById('carType');
    let carTypes = Object.keys(carTypeDict);
    carType.innerHTML = '<option value="all">--全選--</option>';
    for (let i = 0; i < carTypes.length; i++) {
        carType.innerHTML = carType.innerHTML +
        '<option value="' + carTypes[i] + '">' + carTypes[i] + '</option>';
    }
}

function loadMonths() {
    let selectMonth = document.getElementById('selectMonth');
    let months = Object.keys(monthDict);
    selectMonth.innerHTML = '<option value="all">--全選--</option>';
    for (let i = 0; i < months.length; i++) {
        selectMonth.innerHTML = selectMonth.innerHTML +
        '<option value="' + months[i] + '">' + months[i] + '</option>';
    }  
}

function loadCounties() {
    let selectCounty = document.getElementById('selectCounty');
    let counties = Object.keys(countyDict);
    selectCounty.innerHTML = '<option value="">--其他縣市--</option>';
    for (let i = 0; i < counties.length; i++) {
        if ( !['臺北市', '桃園市', '新北市', '臺中市', '臺南市', '高雄市'].includes(counties[i]) ) {
        selectCounty.innerHTML = selectCounty.innerHTML +
                                    '<option value="' + counties[i] + '">' + counties[i] + '</option>';
        }        
    }
}

function selectCarSubType() {
    let carType = document.getElementById('carType');
    let carSubType = document.getElementById('carSubType');
    carSubType.innerHTML = '<option value="all">--全選--</option>';
    if ( carType.value != "all" ) {
        let subTypes = carTypeDict[carType.value];
        for (let i = 0; i < subTypes.length; i++) {
        carSubType.innerHTML = carSubType.innerHTML +
            '<option value="' + subTypes[i] + '">' + subTypes[i] + '</option>';
        }
    }
    resetConfig();
}

function clearFilters() {      
    document.getElementById("accType").checked = false;
    document.getElementById("carType").value = "all";
    document.getElementById("carSubType").innerHTML = "";
    document.getElementById("selectMonth").value = "all";
    document.getElementById("dateAnimation").checked = false;
    resetConfig();
}

function openNav() {
    document.getElementById("mySidepanel").style.width = "20em";
    document.getElementById("openbtn").style.display = "none";
}

function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
    document.getElementById("openbtn").style.display = "block";
}