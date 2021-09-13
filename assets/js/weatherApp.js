// Search Bar Elements
const searchFormEl = document.querySelector('#citySearchForm');
const searchInputVal = document.querySelector('#inputCity');
const searchBtn = document.querySelector('#citySearch');
const popularCityEl = document.querySelector('.list-group-1');
const usersCityEl = document.querySelector('.list-group-2');
// Weather Content Elements
const weatherContentEl = document.querySelector('#weatherContent');
const cardDivEl = document.querySelector('.card');
const cardTitleEl = document.querySelector('.card-title');
const weatherIconEl = document.querySelector('#icon');
const uvIndexEl = document.querySelector('#uvIndex');
// OPEN WEATHER API-KEY:
const API_KEY = 'cc1fceed251df796bcf2e58da0d4a719';

const existingEntries = JSON.parse(localStorage.getItem('cities'));
const topCities = [
    'Charleston',
    'New York',
    'London',
    'Hong Kong',
];

window.onload = function init() {
    if (localStorage.getItem('cities') != null) {
        for (let i = 0; i < existingEntries.length; i++) {
            addCitySearch(existingEntries[i], usersCityEl);
        }
    }
    for (let i = 0; i < topCities.length; i++) {
        addCitySearch(topCities[i], popularCityEl);
    }
}

// Function to handle search event
const handleSearch = (event) => {
    event.preventDefault();

    let cityInput = searchInputVal.value.trim();

    if (!cityInput) {
        // search err alert
        errorMessage('Please enter a valid city name', searchFormEl, 2000);
        return; 
    } else {
        console.log(`${cityInput} searched:`);
        getWeatherData(cityInput, API_KEY, existingEntries);
        addCitySearch(cityInput, usersCityEl);
        getForecastData(cityInput, API_KEY);
    }
}

const getWeatherData = (cityName, API_KEY, existingEntries) => {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`;

      fetch(currentWeatherURL)
        .then((response) => {
            if(!response.ok) {
                console.log(`Error, Status: ${response.status}`);
                errorMessage(`No results for ${cityName}, Check spelling and try again.`, weatherContentEl, 3000);
                return;
            } else {
                return response.json();
            }
        })
        .then((weatherData) => {
            console.log(`Weather Obj: \n ${weatherData}`);
            console.log("------------------------------------------------");
            displayCurrentWeather(weatherData);
        

        let isNew = true;
        if (localStorage.getItem("cities") !== null) {
            for (let i = 0; i < existingEntries.length; i++) {
              if (existingEntries[i] === weatherData.name) {
                isNew = false;
              }
            }
            for (var i = 0; i < topCities.length; i++) {
              if (topCities[i] === weatherData.name) {
                isNew = false;
              }
            }
            if (isNew) {
              existingEntries.push(weatherData.name);
              localStorage.setItem("cities", JSON.stringify(existingEntries));
              console.log(`${existingEntries} added to local storage!!!`);
              addCitySearch(weatherData.name, usersCityEl);
            }
          } else {
            existingEntries = [];
            existingEntries.push(weatherData.name);
            localStorage.setItem("cities", JSON.stringify(existingEntries));
            addCitySearch(weatherData.name, usersCityEl);
          }
        })
        .catch(function (error) {
          console.log("There is an error: " + error);
        });
}

// addCitySearch function takes cities from top city list and user input to populate clickable list of cities on search bar
const addCitySearch = (cityName, location) => {
    console.log(`adding ${cityName} to ${location}`);
    let cityBtnEl = document.createElement('button');
    cityBtnEl.setAttribute('type', 'button');
    cityBtnEl.classList.add('list-group-item', 'list-group-item-action');
    cityBtnEl.textContent = cityName;
    cityBtnEl.setAttribute('value', cityName);
    location.prepend(cityBtnEl);

    cityBtnEl.addEventListener('click', function() {
        const allCityBtns = document.querySelectorAll('.list-group-item');
        for (let i = 0; i < allCityBtns.length; i++) {
            allCityBtns[i].classList.remove('active');
        }
        getWeatherData(cityBtnEl.value, API_KEY);
        getForecastData(cityBtnEl.value, API_KEY);
        cityBtnEl.classList.add('active');  
    });
}

const getForecastData = (cityName, API_KEY) => {
    const forecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=imperial`;

    fetch(forecastWeatherURL)
    .then((response) => {
        if(!response.ok) {
            console.log(`Error, fetching forecast data Status: ${response.status}`);
            return;
        } else {
            return response.json();
        }
    })
    .then((forecastData) => {
        // console.log(`Forecast Obj: \n ${forecastData}`);
        // console.log("------------------------------------------------");
        let forecastObj = [];
        
        for (let i = 0; i < forecastData.list.length; i++) {
            if (i % 8 === 0) {            
                forecastObj.push({
                    date: forecastData.list[i].dt_txt.split(' ')[0],
                    icon: forecastData.list[i].weather[0].icon,
                    iconAlt: forecastData.list[i].weather[0].description,
                    temp: forecastData.list[i].main.temp,
                    humidity: forecastData.list[i].main.humidity,
                })
            }
        }
        for (let i = 0; i < forecastObj.length; i++) {
            let dateTitle = document.querySelectorAll('.date-title');
            let iconEl = document.querySelectorAll('#forecastIcon');
            let tempSpan = document.querySelectorAll("#tempForecast");
            let humiditySpan = document.querySelectorAll("#humidityForecast");    
            
            dateTitle[i].textContent = forecastObj[i].date;
            iconEl[i].setAttribute(
                "src",
                "https://openweathermap.org/img/wn/" +
                  forecastObj[i].icon +
                  "@2x.png"
              );
              iconEl[i].setAttribute("alt", forecastObj[i].iconAlt);
              tempSpan[i].textContent = forecastObj[i].temp + " °F";
              console.log(forecastObj[i].temp);
              humiditySpan[i].textContent = forecastObj[i].humidity + "%";
        }
        console.log(`here is our forecast: ${forecastObj}`);
        
    })
     .catch(function (error) {
         console.log(error);
     });
}

const displayCurrentWeather = (weatherData) => {
    // Update City name in weather element
    cardTitleEl.textContent = `${weatherData.name}: `
    // Shows icon of current weather with description
    weatherIconEl.setAttribute('src', `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`);
    weatherIconEl.setAttribute("alt", weatherData.weather[0].description);
    cardTitleEl.append(weatherIconEl);

    let tempEl = document.querySelector("#temp");
    let humidityEl = document.querySelector("#humidity");
    let windSpeedEl = document.querySelector("#windSpeed");
  
    // Adding temperature information if temperature data exists
    if (weatherData.main.temp) {
      tempEl.textContent = weatherData.main.temp + " °F";
    } else {
      tempEl.textContent = "No temperature for this city.";
    }
  
    // Adding humidity information if humidity data exists
    if (weatherData.main.humidity) {
      humidityEl.textContent = weatherData.main.humidity + "%";
    } else {
      humidityEl.textContent = "No humidity for this city.";
    }
  
    // Adding wind speed information if wind speed data exists
    if (weatherData.wind.speed) {
      windSpeedEl.textContent = weatherData.wind.speed + " MPH";
    } else {
      windSpeedEl.textContent = "No wind speed for this city.";
    }

      // Adding uv index data if exists
    if (weatherData.coord.lat && weatherData.coord.lon) {
        let lat = weatherData.coord.lat;
        let lon = weatherData.coord.lon;
        getUVIndex(lat, lon, API_KEY);
    } else {
        uvIndexEl.textContent = "No UV index for this city.";
  }
}
// gets UV index for city and color codes depending on level
const getUVIndex = (lat, lon, API_KEY) => {
    const uvCurrentURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(uvCurrentURL)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
              }
              return response.json();
            })
            .then(function (uvData) {
              console.log("Here is the object containing the current UV Index");
              console.log(uvData);
              console.log("------------------------------------------------");
              var uvIndex = uvData.value;
        
              // change color to indicate whether the uv conditions are favorable, moderate, or severe
              if (uvIndex <= 2) {
                colorClass = "green";
              } else if (uvIndex <= 5) {
                colorClass = "yellow";
              } else if (uvIndex <= 7) {
                colorClass = "orange";
              } else if (uvIndex <= 10) {
                colorClass = "red";
              } else if (uvIndex > 10) {
                colorClass = "violet";
              }
              document.querySelector("#uvIndex").setAttribute("class", colorClass);
              uvIndexEl.textContent = uvIndex;
            })
            .catch(function (error) {
              console.log("There is a error: " + error);
            });
}



const errorMessage = (msg, location, duration) => {
    let alertErrorDiv = document.createElement('div');

    alertErrorDiv.classList.add(
        'alert',
        'alert-danger',
        'text-center',
        'pt-2',
        'pb-0'
    );
    alertErrorDiv.innerHTML = `<p><strong>${msg}</strong></p>`;

    setTimeout(function() {
        alertErrorDiv.parentElement.removeChild(alertErrorDiv);
    }, duration);

    location.prepend(alertErrorDiv);
}


searchBtn.addEventListener('click', handleSearch);