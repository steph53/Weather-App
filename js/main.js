const APISERVER = "https://api.openweathermap.org/data/2.5/forecast?"
const APIKEY = "7eb89794063ff124eee3ab9fc63d3056"

let searchBtn = document.getElementById("search")
let cityInput = document.getElementById("cityname")
let cards = document.getElementById("card_container")
let title = document.getElementById("title")
searchBtn.addEventListener("click", ()=>{
    cards.classList.add("show")
    title.classList.add("show")
    let city 
    if(cityInput.value === ''  || isBlank(cityInput.value))
        city = 'Berlin'
    else
        city = cityInput.value

    cityInput.value = ""
    title.innerText = city

    fetchData(city)
})

function fetchData(city){
    let request = APISERVER+ "q=" +city+"&appid="+ APIKEY +"&lang=de_de&&units=metric"
    fetch(request).then((promise) =>{
        promise.json().then((res)=>{
            if(res.cod === "404"){
                console.log("This city name doesn't exist !")
                fetchData("Berlin")
            }
            else{
                let jsonData = res
                let dates = []
                dates[0] = getCurrentDate(0)
                dates[1] = getCurrentDate(1)
                dates[2] = getCurrentDate(2)
                dates[3] = getCurrentDate(3)
                dates[4] = getCurrentDate(4)

                let data = []
                data[0] = getElementsWithDate(jsonData.list, dates[0])[0]
                data[1] = getElementsWithDate(jsonData.list, dates[1])[4]
                data[2] = getElementsWithDate(jsonData.list, dates[2])[4]
                data[3] = getElementsWithDate(jsonData.list, dates[3])[4]
                data[4] = getElementsWithDate(jsonData.list, dates[4])[4]
                
                for(let i=0; i< data.length; i++){
                    document.getElementById("temp"+i).innerText = data[i].main.temp
                    let deg = document.createElement("span")
                    deg.appendChild(document.createTextNode('c'))
                    document.getElementById("temp"+i).appendChild(deg)
                    
                    document.getElementById("date"+i).innerText = dates[i]
                    document.getElementById("minTemp"+i).innerText = data[i].main.temp_min
                    document.getElementById("maxTemp"+i).innerText = data[i].main.temp_max
                    document.getElementById("description"+i).innerText = data[i].weather[0].description
                }
            }
        })
    })
}

function getElementsWithDate(json,date){
    let dataList = []
    json.forEach(element => {
        if(element.dt_txt.includes(date))
            dataList.push(element)
    });

    return dataList
}

function isBlank(str){
    return (!str || /^\s*$/.test(str))
}

function getCurrentDate(gap){
    let today = new Date();
    today.setDate(today.getDate() + gap)
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today
}