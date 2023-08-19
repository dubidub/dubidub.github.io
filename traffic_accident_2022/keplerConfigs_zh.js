function changeConfig() {
    // console.log(config);
    (function customize(keplerGl, store) {
        var loadedData = keplerGl.KeplerGlSchema.load(
            datasets,
            config
        );
        store.dispatch(keplerGl.addDataToMap({
            datasets: loadedData.datasets,
            config: loadedData.config,
            options: {
            centerMap: false
            }
        }));
    }(KeplerGl, store))
}

function loadDatasets(elmnt) {
    highlightDatasets(elmnt);
    let filename = countyDict[elmnt][0];
    let countyLat = countyDict[elmnt][1][0];
    let countyLng = countyDict[elmnt][1][1];
    let hyperlink = 'https://dubidub.github.io/traffic_accident_2022/resources/' + filename + '.json';
    var xhr = new XMLHttpRequest(),
        method = 'GET',
        overrideMimeType = 'application/json',
        url = hyperlink;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        document.getElementById("loading").innerHTML = '';
        document.getElementById("openbtn").innerHTML = '&vellip;　' + elmnt;
        datasets = [JSON.parse(xhr.responseText)];
        console.log(datasets);
        config["config"]["mapState"] = {
            "bearing":15.923076923076922,
            "dragRotate":true,
            "latitude":countyLat,
            "longitude":countyLng,
            "pitch":48.65751616910994,
            "zoom":12,
            "isSplit":false
        },
        selectLayer("事故頻率 (3D)");
        config["config"]["mapState"] = {};
      }
    };
    document.getElementById("loading").innerHTML = '<div class="loading"><img src="resources/loading.gif" /></div>';
    xhr.open(method, url, true);
    xhr.send();
}

function highlightDatasets(elmnt) {
  let btData = document.getElementsByClassName('bt-data');
  for (var i = 0; i < btData.length; i++) {
    btData[i].style.border = 'none';
  }
  if ( Object.keys(idValueDict).includes(elmnt) ) {
    document.getElementById(idValueDict[elmnt]).style.border = "1.5px solid rgb(240, 97, 97)";
  } else {
    document.getElementById("selectCounty").style.border = "1.5px solid rgb(240, 97, 97)";
  }
}

function selectLayer(elmnt) {
    let btLayer = document.getElementsByClassName('bt-layer');
    for (var i = 0; i < btLayer.length; i++) {
      btLayer[i].style.border = 'none';
    }
    let layers = [];
    if ( elmnt == "事故頻率 (3D)" ) {
      document.getElementById("hexbin").style.border = "1.5px solid rgb(240, 97, 97)";
      let hexbinLayer = {
        "id":"mruiy3i",
        "type":"hexagon",
        "config":{
          "dataId":"fi4bu3mll",
          "label":"交通事故數",
          "color":[218,112,191],
          "columns":{"lat":"緯度","lng":"經度"},
          "isVisible":true,
          "visConfig":{
            "opacity":0.6,
            "worldUnitSize":0.055,
            "resolution":8,
            "colorRange":{
              "name":"Global Warming 5",
              "type":"sequential",
              "category":"Uber",
              "colors":["#5A1846","#831A3D","#AC1C17","#D55D0E","#FFC300"]
            },
            "coverage":1,
            "sizeRange":[0,200],
            "percentile":[0,100],
            "elevationPercentile":[0,100],
            "elevationScale":5,
            "colorAggregation":"count",
            "sizeAggregation":"count",
            "enable3d":true
          },
          "hidden":false,
          "textLabel":[{"field":null,"color":[255,255,255],"size":18,"offset":[0,0],"anchor":"start","alignment":"center"}]
        },
        "visualChannels":{"colorField":null,"colorScale":"quantize","sizeField":null,"sizeScale":"linear"}
      };
      layers.push(hexbinLayer);
    }

    if ( elmnt == "事故細節" ) {
      document.getElementById("pointsFreq").style.border = "1.5px solid rgb(240, 97, 97)";
      let pointsFreqLayer = {
        "id":"1pe1mk",
        "type":"point",
        "config":{
          "dataId":"fi4bu3mll",
          "label":"事故細節",
          "color":[34,63,154],
          "columns":{"lat":"緯度","lng":"經度","altitude":null},
          "isVisible":true,
          "visConfig":{
            "radius":10,
            "fixedRadius":false,
            "opacity":0.8,
            "outline":false,
            "thickness":2,
            "strokeColor":null,
            "colorRange":{"name":"Global Warming","type":"sequential","category":"Uber","colors":["#5A1846","#900C3F","#C70039","#E3611C","#F1920E","#FFC300"]},
            "strokeColorRange":{"name":"Global Warming","type":"sequential","category":"Uber","colors":["#5A1846","#900C3F","#C70039","#E3611C","#F1920E","#FFC300"]},
            "radiusRange":[0,50],
            "filled":true
          },
          "hidden":false,
          "textLabel":[{"field":null,"color":[255,255,255],"size":18,"offset":[0,0],"anchor":"start","alignment":"center"}]
        },
        "visualChannels":{"colorField":null,"colorScale":"quantile","strokeColorField":null,"strokeColorScale":"quantile","sizeField":null,"sizeScale":"linear"}
      };
      layers.push(pointsFreqLayer);
    }

    config["config"]["visState"]["layers"] = layers;
    changeConfig();
}


function resetConfig() {
    let filters = [];

    let accType = document.getElementById('accType');
    if ( accType.checked ) {
      let accTypeFilter = {
        "dataId":["fi4bu3mll"],
        "name":["事故類別名稱"],
        "type":"multiSelect",
        "value":["A1"],
      };
      filters.push(accTypeFilter);
    }

    let carType = document.getElementById('carType');
    if ( carType.value != "all" ) {
      let carSubType = document.getElementById('carSubType');
      let carSubTypes;
      if ( carSubType.value == "all" ) {
        carSubTypes = carTypeDict[carType.value];
      } else {
        carSubTypes = [carSubType.value];
      };
      let carTypeFilter = {
        "dataId":["fi4bu3mll"],
        "name":[carType.value],
        "type":"multiSelect",
        "value":carSubTypes,
      };
      filters.push(carTypeFilter);
    }

    // let selectMonth = document.getElementById('selectMonth');
    // if ( selectMonth.value != "all" ) {
    //   let start = new Date(monthDict[selectMonth.value][0]);
    //   let end = new Date(monthDict[selectMonth.value][1]);
    //   let selectMonthFilter = {
    //     "dataId":["fi4bu3mll"],
    //     "name":["日期"],
    //     "type":"multiSelect",
    //     "value":getDatesBetweenDates(start, end),
    //   };
    //   filters.push(selectMonthFilter);
    // }

    let dateAnimation = document.getElementById('dateAnimation');
    if ( dateAnimation.checked ) {
      let dateAnimationFilter = {
        "dataId":["fi4bu3mll"],
        "name":["時間"],
        "type":"timeRange",
        "enlarged":true,
        "speed":1,
      };
      filters.push(dateAnimationFilter);
    };

    config["config"]["visState"]["filters"] = filters;
    changeConfig();
}
