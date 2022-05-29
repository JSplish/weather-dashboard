function initPage() {
    const city = document.getElementById("enter-city");
    const search = document.getElementById("search-button")
    const weatherToday = document.getElementById("today-weather");
    const currentPicture = document.getElementById("current-pic");
    const currentTemp = document.getElementById("temperature")
    const currentHumidity = document.getElementById("humidity");
    const currentUv = document.getElementById("UV-index");
    const fiveday = document.getElementById("fiveday-header");
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
                    let cityId = res.data.id;
                    let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                    axios.get(forecastUrl)
                    .then(function (res) {
                        fiveday.classList.remove("d-none");

                        const forecastEl = document.querySelectorAll(".forecast");
                        for (i = 0; forecastEl.length; i++) {
                            forecastEl[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(res.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEl[i].append(forecastDateEl);
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
}