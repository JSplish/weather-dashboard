function initPage() {
    const city = document.getElementById("enter-city");
    const search = document.getElementById("search-button")
    const currentPicture = document.getElementById("current-pic");
    const currentTemp = document.getElementById("temperature")
    const currentHumidity = document.getElementById("humidity");
    const currentWind = document.getElementById("wind-speed");
    const currentUv = document.getElementById("UV-index");
    const clearHistory = document.getElementById("clear-history");
    const historyEl = document.getElementById("history");
    const nameEl = document.getElementById("city-name");
    var weatherToday = document.getElementById("today-weather");
    var fiveday = document.getElementById("fiveday-header");
    let history = JSON.parse(localStorage.getItem("search")) || [];


    // Unique API key
    const APIKey = "e7c9a6c1e200e70e07d3d9c7208425ac";

    function getWeather(cityName) {

        // Get current weather from API
        let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryUrl)
            .then(function (res) {
                weatherToday.classList.remove("d-none");

                // Display current weather
                const currentDate = new Date(res.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = res.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPicture = res.data.weather[0].icon;
                currentPicture.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPicture + "@2x.png");
                currentPicture.setAttribute("alt", res.data.weather[0].description);
                currentTemp.innerHTML = "Temperature: " + k2f(res.data.main.temp) + " &#176F";
                currentHumidity.innerHTML = "Humidity: " + res.data.main.humidity + "%";
                console.log(res.data.wind.speed);
                currentWind.innerHTML = "Wind Speed: " + res.data.wind.speed + "MPH";
                

                // UV Index
                let latitude = res.data.coord.lat;
                let longitude = res.data.coord.lon;
                let UV = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey + "&cnt=1";
                axios.get(UV)
                    .then(function (res) {
                        let UVIndex = document.createElement("span");

                        // UV Index good=green, decent=yellow, bad=red
                        if(res.data[0].value < 4) {
                            UVIndex.setAttribute("class", "badge badge-success");
                        }
                        else if(res.data[0].value < 8) {
                            UVIndex.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            UVIndex.setAttribute("class", "badge badge-danger");
                        }
                        UVIndex.innerHTML = res.data[0].value;
                        currentUv.innerHTML = "UV Index: ";
                        currentUv.append(UVIndex);
                    });

                    // 5 day forecast
                    let cityID = res.data.id;
                    let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                    axios.get(forecastUrl)
                    .then(function (response) {
                        fiveday.classList.remove("d-none");

                        const forecastEl = document.querySelectorAll(".forecast");
                        let forecastIndex = 0
                        for (i = 0; i<forecastEl.length; i++) {
                            // forecastEl[i].innerHTML = "";
                             forecastIndex += 4
                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.textContent = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEl[i].appendChild(forecastDateEl);

                            // Icon for current weather
                            const forecastWeather = document.createElement("img");
                            forecastWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeather.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastEl[i].append(forecastWeather);
                            const forecastTemp = document.createElement("p");
                            forecastTemp.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                            forecastEl[i].append(forecastTemp);
                            const forecastHumidity = document.createElement("p");
                            forecastHumidity.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEl[i].append(forecastHumidity);
                        }
                    })
            });
    }
    // local storage
    search.addEventListener("click", function() {
        const userSearch = city.value;
        getWeather(userSearch);
        history.push(userSearch);
        localStorage.setItem("search", JSON.stringify(history));
        displayHistory();
    })

    // Clear History
    clearHistory.addEventListener("click", function() {
        localStorage.clear();
        history = [];
        displayHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    //Saved Searches
    function displayHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < history.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", "true");
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", history[i]);
            historyItem.addEventListener("click", function() {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);

        }
    }

    displayHistory();
    if(history.length > 0) {
        getWeather(history[history.length - 1]);
    }
}

initPage();