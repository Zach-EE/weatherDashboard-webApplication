console.log("loaded")
var searchForm_el = document.querySelector("#searchForm");
var cityInput = document.querySelector("#searchInput");
var searchBtn = document.querySelector("#citySearch");
var weatherCard = document.querySelector("#weatherCard");
var card_el = document.querySelector(".card");
var cardTitle_el = document.querySelector(".card-title");
var weatherIcon_el = document.querySelector("#icon");


var openWeatherQueryUrl = "https://api.openweathermap.org/data/2.5/";
var apiKey = "66fcfa1d817633c15bf549048210a95c";




function handleSearch(event) {
    event.preventDefault();
    var searchInput = cityInput.value.trim();

    if (!searchInput) {
        console.log("User, Pease enter VALID city name", searchForm_el, 3000);
        return;
    }else {
        weatherCurrent(searchInput, apiKey);
    }
}
    
function weatherCurrent(cityName, apiKey) {
    console.log("__click__");
    var url = openWeatherQueryUrl+"weather?q="+cityName+"&appid="+apiKey+"&units=imperial";

    fetch(url)
        .then(function (response) {
            if(!response.ok){
                console.log("REEEEEEEEERROR CODE: " + response.status);
                return;
            }else{
                return response.json();
            }
        })
        .then(function (weatherData){
            console.log("weather-data obj")
            console.log(weatherData);
            console.log("- - - - - - - - - -")
        });
        console.log("weather-data obj")
        console.log(weatherData);
        console.log("- - - - - - - - - -")
}

searchBtn.addEventListener("click", handleSearch);

function displayWeather(data) {
    console.log("In Display Weather");
    alert("shit");
    var temp_el = document.querySelector("#temp");


    card_el.textContent = data.name + "(" + getDate(todaysDate) + ")";

    weatherIcon_el.setAttribute( "src", "https://openweather.org/img/wn/" + data.weather[0].icon + "@2x.png");
    weatherIcon_el.querySelector.setAttribute("alt", data.weather[0].description);
    cardTitle_el.append(weatherIcon_el);

    if (data.main.temp) {
        temp_el.textContent = data.main.temp + " F"
    }else{
        temp_el.textContent = "no data...."
    }
}