var datasets;
var config = {
    "version":"v1",
    "config":{
    "visState":{
        "filters":[],
        "layers":[],
        "interactionConfig":{
            "tooltip":{
                "fieldsToShow":{
                "fi4bu3mll":[
                    {"name":"Date_Time","format":null},
                    {"name":"Death","format":null},
                    {"name":"Injury","format":null},
                    // {"name":"車種","format":null}
                ]},
                "compareMode":false,
                "compareType":"absolute",
                "enabled":true
            },
            "brush":{"size":0.5,"enabled":false},
            "geocoder":{"enabled":false},
            "coordinate":{"enabled":false}},
            "layerBlending":"additive",
            "splitMaps":[],
            "animationConfig":{"currentTime":null,"speed":1}
            },
        "mapStyle":{
            "styleType":"light",
            "topLayerGroups":{},
            "visibleLayerGroups":{"label":true,"road":true,"border":false,"building":true,"water":true,"land":true,"3d building":false},
            "threeDBuildingColor":[9.665468314072013,17.18305478057247,31.1442867897876],
            "mapStyles":{}
        }        
    }
};

const idValueDict = {
    "Taipei":"taipei",
    "N Taipei":"newTaipei",
    "Taoyuan":"taoyuan",
    "Taichung":"taichung",
    "Tainan":"tainan",
    "Kaohsiung":"kaohsiung",
  }
  
const carTypeDict = {
    'Man': ['行人', '其他人', '乘客'],
    'Full Trailer': ['自用', '營業用'],
    'Others': ['拖車(架)', '火車', '拼裝車', '農耕用車(或機械)', '其他車', '動力機械'],
    'Semi Trailer': ['自用', '營業用'],
    'Bus': ['民營公車', '自用大客車', '遊覽車', '民營客運', '公營公車', '公營客運'],
    'Truck': ['自用', '營業用'],
    'Car': ['自用', '租賃車', '計程車'],
    'Pick-up Truck': ['自用', '營業用'],
    'Slow (eg. Bike)': ['電動自行車', '人力車', '其他慢車', '獸力車', '電動輔助自行車', '腳踏自行車'],
    'Tractor': ['自用', '營業用'],
    'Motorcycles': ['大型重型2(250~550C.C.)', '普通重型', '小型輕型', '大型重型1(550C.C.以上)', '普通輕型'],
    'Special Purpose': ['其他特種車', '消防車', '救護車', '工程車', '警備車'],
    'Military': ['載重車', '大客車', '小型車']
};

const monthDict = {
    'Jan': ["2020-01-01", "2020-02-01"], 
    'Feb': ["2020-02-01", "2020-03-01"],
    'Mar': ["2020-03-01", "2020-04-01"], 
    'Apr': ["2020-04-01", "2020-05-01"],
    'May': ["2020-05-01", "2020-06-01"], 
    'Jun': ["2020-06-01", "2020-07-01"],
    'Jul': ["2020-07-01", "2020-08-01"], 
    'Aug': ["2020-08-01", "2020-09-01"],
    'Sep': ["2020-09-01", "2020-10-01"], 
    'Oct': ["2020-10-01", "2020-11-01"],
    'Nov': ["2020-11-01", "2020-12-01"], 
    'Dec': ["2020-12-01", "2021-01-01"]};

const countyDict = {
    'Taitung':['ttx',[22.775481944188066, 121.06401508445383]],
    'Tainan':['tns',[23.009594627596382, 120.22560044372621]],
    'Keelung':['kls',[25.12751784300647, 121.7386105730662]],
    'Hsinchu County':['hcx',[24.839184024562645, 121.01805275355595]],
    'Penghu':['phx',[23.57233319752079, 119.57696711633714]],
    'Yunlin':['ylx',[23.71472487275197, 120.41800745241785]],
    'Taoyuan':['tys',[24.99341818647773, 121.29687715882831]],
    'Pingtung':['ptx',[22.550901265648296, 120.5343648302878]],
    'Kaohsiung':['khs',[22.630233940647365, 120.30165007353534]],
    'Lienchiang':['lcx',[26.16241296146613, 119.95258401926624]],
    'Chiayi County':['cyx',[23.448944702883946, 120.2389961010698]],
    'Hsinchu City':['hcs',[24.816813130043645, 120.96875443687992]],
    'N Taipei':['nts',[25.01677584278663, 121.46256325590495]],
    'Miaoli':['mlx',[24.562424618241057, 120.81396476472885]],
    'Changhua':['chx',[24.086127363007307, 120.55040316817312]],
    'Nantou':['ntx',[23.961483293693956, 120.98067816204518]],
    'Yilan':['lyx',[24.703711110778496, 121.73677213570892]],
    'Kinmen':['kmx',[24.450886040473296, 118.37540629044638]],
    'Taipei':['tps',[25.06171707762224, 121.55077845541885]],
    'Chiayi City':['cys',[23.481786157153703, 120.44306904160656]],
    'Hualien':['hlx',[23.989289558008657, 121.6054277782498]],
    'Taichung':['tcs',[24.14834345943802, 120.67060076278258]]
};

const fields = [
    {"name":"0","type":"integer","format":"","analyzerType":"INT"},
    {"name":"Date_Time","type":"timestamp","format":"YYYY-M-D H:m:s","analyzerType":"DATETIME"},
    {"name":"Location","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Death_Injury","type":"string","format":"","analyzerType":"STRING"},
    {"name":"CarType","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Longitude","type":"real","format":"","analyzerType":"FLOAT"},
    {"name":"Latitude","type":"real","format":"","analyzerType":"FLOAT"},
    {"name":"Date","type":"date","format":"YYYY-M-D","analyzerType":"DATE"},
    {"name":"Time","type":"timestamp","format":"H:m:s","analyzerType":"TIME"},
    {"name":"Death","type":"integer","format":"","analyzerType":"INT"},
    {"name":"Injury","type":"integer","format":"","analyzerType":"INT"},
    {"name":"Motorcycles","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Pick-up Truck","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Slow (eg. Bike)","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Man","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Car","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Truck","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Others","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Tractor","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Full Trailer","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Semi Trailer","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Bus","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Special Purpose","type":"string","format":"","analyzerType":"STRING"},
    {"name":"Military","type":"string","format":"","analyzerType":"STRING"},
    {"name":"County","type":"string","format":"","analyzerType":"STRING"},
    {"name":"AccidentType","type":"string","format":"","analyzerType":"STRING"}
]

const getDatesBetweenDates = (startDate, endDate) => {
    let dates = []
    //to avoid modifying the original date
    const theDate = new Date(startDate)
    while (theDate < endDate) {
    let dd = theDate.getDate();
    let mm = theDate.getMonth()+1;
    const yyyy = theDate.getFullYear();
    dates = [...dates, yyyy + '-' + (mm>9 ? '' : '0') + mm + '-' + (dd>9 ? '' : '0') + dd]
    theDate.setDate(theDate.getDate() + 1)
    }
    return dates
}
