console.log("loaded")
var searchForm_el = document.querySelector("#searchForm");
var cityInput = document.querySelector("#searchInput");
var searchBtn = document.querySelector("#citySearch");


var openWeatherQueryUrl = "https://api.openweathermap.org/data/2.5/";
var apiKey = "66fcfa1d817633c15bf549048210a95c";




function handleSearch(event) {
    event.preventDefault();
    var searchInput = cityInput.value.trim();

    if (!searchInput) {
        errorMessage("User, Pease enter VALID city name", searchForm_el, 3000);
        return;
    }else {
        weatherCurrent(searchInput, apiKey);
    }
}
    
function weatherCurrent(cityName, apiKey) {
    console.log("click")
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
            console.log(weatherData);
        });
}

searchBtn.addEventListener("click", handleSearch);