window.onload = townSelect();

function townSelect() {
  var towns = ['松山區', '信義區', '大安區', '中山區', '中正區', '大同區', '萬華區', '文山區', '南港區', '內湖區', '士林區', '北投區'];
  
  var towns_id = ['63000010', '63000020', '63000030', '63000040', '63000050', '63000060', '63000070', '63000080', '63000090', '63000100', '63000110', '63000120', ];
  
  var town = document.getElementById('town');
  for (var i = 0; i < towns.length; i++) {
    town.innerHTML = town.innerHTML +
      '<option value="' + towns_id[i] + '">' + towns[i] + '</option>';
  }
}

function villageSelect() {  
  var vill = document.getElementById('vill');
  vill.innerHTML = "<option value=''>---- 里 ----</option>";
  
  var xhr = new XMLHttpRequest(), 
      method = 'GET',
      overrideMimeType = 'application/json',
      url = 'https://dubidub.github.io/tp_landuse/tp_dict.json';        
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var villages = JSON.parse(xhr.responseText);     
      for (var i = 0; i < villages[town.value]['vill_code'].length; i++) {
        // BIND DATA TO <select> ELEMENT.
        vill.innerHTML = vill.innerHTML +
          '<option value="' + villages[town.value]['vill_code'][i] + '">' + villages[town.value]['village'][i] + '</option>';
      }
    }
  };
  xhr.open(method, url, true);
  xhr.send();   
}

function villageShow() {
  var stats = document.getElementById('stats');
  var map = document.getElementById('map');
  stats.src = "https://dubidub.github.io/tp_landuse/Stats/" + vill.value + "_stats.html";
  map.src = "https://dubidub.github.io/tp_landuse/Maps/" + vill.value + "_map.html";
}