var config = {},
    filterGroups = {},
    datasets = {},
    layerGroups = {},
    layerNo = 0,
    datasetNo = 0,
    filterNo = 0,
    loadCoord = [23.707398117586052, 120.98712417755992];
var tileLayers = {
    OpenStreetMap_Mapnik: {
        name: "街道1 - OpenStreetMap",
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        option: {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    },
    Esri_WorldStreetMap: {
        name: "街道2 - ESRI",
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        option: {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
        }
    },
    Street_CartoDB_PositronNoLabels: {
        name: "街道3 - CartoDB",
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
        option: {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }
    },
    OpenTopoMap: {
        name: "地形1 - OpenTopoMap",
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        option: {
            maxZoom: 17,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }
    },
    Stamen_Terrain: {
        name: "地形2 - Stamen",
        url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
        option: {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 18,
            // ext: 'png'
        }
    },
    Esri_WorldTopoMap: {
        name: "地形3 - ESRI",
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        option: {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        }
    },
    Stamen_TonerLite: {
        name: "淺色1 - Stamen",
        url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
        option: {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            // ext: 'png'
        }
    },
    Esri_WorldGrayCanvas: {
        name: "淺色2 - ESRI",
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        option: {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	        maxZoom: 16
        }
    },
    CartoDB_PositronNoLabels: {
        name: "淺色3 - CartoDB",
        url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
        option: {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }
    },
    Dark_CartoDB_DarkMatter: {
        name: "深色1 - CartoDB",
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        option: {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }
    },
    Dark_CartoDB_PositronNoLabels: {
        name: "深色2 - CartoDB",
        url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
        option: {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }
    },
    Esri_WorldImagery: {
        name: "衛星 - ESRI",
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        option: {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }
    },
};
var layerAttributes = {
    "fill": {
        "fillColor": {
            type: "color", 
            name: "fillColor", 
            id: "fillColor", 
            value: "#ffff00",
        },        
        "fillOpacity": {
            type: "number", 
            name: "fillOpacity", 
            id: "fillOpacity", 
            value: 0.4,
            step: .05,
            max: 1, 
            min: 0
        },
    },
    "stroke": {
        "strokeWeight": {
            type: "number", 
            name: "weight", 
            id: "strokeWeight", 
            value: 2,
            step: .5,
            max: 10, 
            min: 0
        },
        "strokeColor": {
            type: "color", 
            name: "color", 
            id: "strokeColor", 
            value: "#ffff00",
        },
        "strokeOpacity": {
            type: "number", 
            name: "opacity", 
            id: "strokeOpacity", 
            value: 1,
            step: .05,
            max: 1, 
            min: 0
        },
    },
    "size": {
        "radius": {
            type: "number", 
            name: "radius", 
            id: "radius", 
            value: 10,
            step: 1,
            max: 100, 
            min: 1
        },
    },
}
var layerTypes = {
    "pointLayer": {
        "coordinates": ["latitude", "longitude"],
        "attributes": ["fill", "stroke", "size"],
    },
    "lineLayer": {
        "coordinates": ["sourceLatitude", "sourceLongitude", "targetLatitude", "targetLongitude"], 
        "attributes": ["stroke"],
    },
    "polygonLayer": {
        "coordinates": ["coordinates"],
        "attributes": ["fill", "stroke"],
    },
}
var names = {
    "pointLayer": {
        "zh": "點",
    }, 
    "lineLayer": {
        "zh": "線",
    }, 
    "polygonLayer": {
        "zh": "多邊形",
    }, 
    "latitude": {
        "zh": "緯度　", 
    },
    "longitude": {
        "zh": "經度　", 
    },
    "sourceLatitude": {
        "zh": "起點緯度　", 
    },
    "sourceLongitude": {
        "zh": "起點經度　", 
    },
    "targetLatitude": {
        "zh": "終點緯度　", 
    },
    "targetLongitude": {
        "zh": "終點經度　", 
    },
    "coordinates": {
        "zh": "座標　", 
    },
    "fill": {
        "zh": "圖案填滿",
    }, 
    "fillColor": {
        "zh": "顏色　　",
    }, 
    "fillOpacity": {
        "zh": "透明度　",
    }, 
    "stroke": {
        "zh": "圖案外框",
    }, 
    "strokeWeight": {
        "zh": "粗細　　",
    }, 
    "strokeColor": {
        "zh": "顏色　　",
    }, 
    "strokeOpacity": {
        "zh": "透明度　",
    }, 
    "size": {
        "zh": "圖案大小",
    }, 
    "radius": {
        "zh": "半徑　　",
    }, 
}
var dataTablesLang = {
    "emptyTable":     "無資料",
    "info":           "共 _TOTAL_ 筆資料，顯示第 _START_ 到 _END_ 筆",
    "infoEmpty":      "無資料",
    "infoFiltered":   "(原 _MAX_ 筆資料)",
    "lengthMenu":     "每頁顯示 _MENU_ 筆",
    "loadingRecords": "載入中...",
    "processing":     "處理中...",
    "search":         "搜尋:",
    "zeroRecords":    "無符合資料",
    "paginate": {
        "first":      "首頁",
        "last":       "尾頁",
        "next":       "下一頁",
        "previous":   "上一頁"
    },
    searchBuilder: {
        add: '添加',
        condition: '條件',
        clearAll: '重設',
        deleteTitle: '刪除',
        data: '欄位',
        leftTitle: '上一層',
        logicAnd: '交集',
        logicOr: '聯集',
        rightTitle: '下一層',
        title: {
            0: '篩選',
            _: '共 (%d) 筆篩選條件'
        },
        value: '輸入值',
        valueJoiner: 'et', 
        conditions :{
            date: {
                before: '早於',
                after: '晚於',
                equals: '等於',
                not: '不等於',
                between: '之間',
                notBetween: '不在...之間',
                empty: '空白',
                notEmpty: '非空白'
            },
            moment: {
                before: '早於',
                after: '晚於',
                equals: '等於',
                not: '不等於',
                between: '之間',
                notBetween: '不在...之間',
                empty: '空白',
                notEmpty: '非空白'
            },
            number: {
                equals: '等於',
                not: '不等於',
                gt: '大於',
                gte: '大於等於',
                lt: '小於',
                lte: '小於等於',
                between: '之間',
                notBetween: '不在...之間',
                empty: '空白',
                notEmpty: '非空白'
            },
            string: {
                contains: '包含',
                empty: '空白',
                notEmpty: '非空白',
                equals: '完全等於',
                not: '不等於',
                endsWith: '結尾',
                startsWith: '開頭'
            },
        },
    }
}
var datasetTemplates = {
    "tw-road-safety-2020": {
        "src": "https://raw.githubusercontent.com/dubidub/dubidub.github.io/master/geospatial_visualization_2/resources/2020-traffic-accidents.PNG", 
        "figcaption": "2020年台灣A1交通事故",
        "entries": "(1,806筆資料, 304KB)",
        "url": "https://raw.githubusercontent.com/dubidub/dubidub.github.io/master/geospatial_visualization_2/resources/tw-road-safety-2020.csv",
        "fileName": "台灣A1交通事故2020",
        "fileType": "csv"
    }, 
    "flight-routes-2014": {
        "src": "https://raw.githubusercontent.com/dubidub/dubidub.github.io/master/geospatial_visualization_2/resources/flight-routes-2014.PNG", 
        "figcaption": "2014年全球航線資料",
        "entries": "(67,663筆資料, 10.9MB)",
        "url": "https://raw.githubusercontent.com/dubidub/dubidub.github.io/master/geospatial_visualization_2/resources/flight-routes-2014.csv",
        "fileName": "全球航線",
        "fileType": "csv"
    }, 
    "taipei-landuse": {
        "src": "https://raw.githubusercontent.com/dubidub/dubidub.github.io/master/geospatial_visualization_2/resources/taipei-landuse.PNG", 
        "figcaption": "台北市土地分區使用",
        "entries": "(15,538筆資料, 16.9MB)",
        "url": "https://raw.githubusercontent.com/dubidub/dubidub.github.io/master/geospatial_visualization_2/resources/taipei-landuse.csv",
        "fileName": "台北土地使用",
        "fileType": "csv"
    }, 
}