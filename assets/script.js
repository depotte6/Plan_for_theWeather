var APIKey = "ca2dc2e2fa9d729bac6bea4c5614b4ae";
var weatherRootUrl = "https://api.openweathermap.org";
var searchCityInput = $("#city");
var searchHistoryList = [];
var searchForm = document.querySelector('#search-form');
var searchCityInput = document.querySelector('#search-input');
var todayDisplay = document.querySelector('#today');
var searchHistoryDisplay = document.querySelector('#history');
var fiveDay = document.querySelector('#future');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function findWeather(search) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&units=imperial&appid=" + APIKey;
    fetch(queryURL)
        .then(function (data) {

            return data.json();
        })
        .then(function (data) {
            var date = dayjs().format("M/D/YYYY");
            console.log(date);
            var card = document.createElement("div");
            var cardBody = document.createElement("div");
            card.setAttribute("class", "card");
            cardBody.setAttribute("class", "card-body");

            console.log(data);
            var city = data.name;
            console.log(city);
            var heading = document.createElement("h2");
            heading.setAttribute("class", "card-title");
            heading.textContent = `${city} (${date})`;


            var temp = data.main.temp;
            console.log(temp);
            var tempEL = document.createElement("p");
            tempEL.setAttribute("class", "card-text");
            tempEL.textContent = `Temp: ${temp} °F`;

            var windSpeed = data.wind.speed;
            console.log(windSpeed);
            var windSpeedEL = document.createElement("p");
            windSpeedEL.setAttribute("class", "card-text");
            windSpeedEL.textContent = `Wind: ${windSpeed} MPH`;

            var humidity = data.main.humidity;
            console.log(humidity);
            var humidityEL = document.createElement("p");
            humidityEL.setAttribute("class", "card-text");
            humidityEL.textContent = `Humidity: ${humidity} %`;



            weatherIcon = data.weather[0].icon;
            var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            var weatherIcon = document.createElement("img");
            weatherIcon.setAttribute("src", iconUrl);

            cardBody.append(heading, weatherIcon, tempEL, windSpeedEL, humidityEL);
            card.append(cardBody);

            todayDisplay.innerHTML = "";
            todayDisplay.append(card);
            var lat = data.coord.lat;
            console.log(lat);
            var lon = data.coord.lon;
            console.log(lon);

            var apiUrl = `${weatherRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current,alerts&units=imperial&appid=${APIKey}`;

            fetch(apiUrl)
                .then((data) => {
                    console.log(data);
                    return data.json()

                })
                .then((data) => {
                    var uvi = data.daily[0].uvi;
                    console.log(uvi);
                    var uvEL = document.createElement("p");
                    var uvBadge = document.createElement("btn");
                    uvEL.textContent = 'UV Index: ';
                    uvBadge.classList.add('btn', 'btn-sm');

                    if (uvi < 3) {
                        uvBadge.classList.add('btn-success');
                    } else if (uvi < 7) {
                        uvBadge.classList.add('btn-warning');
                    } else {
                        uvBadge.classList.add('btn-danger');
                    }

                    uvBadge.textContent = uvi;
                    uvEL.append(uvBadge);
                    cardBody.append(uvEL);

                    todayDisplay.innerHTML = '';
                    todayDisplay.append(card);
                });
            getFiveDayForecast(data)

        });
}

function getFiveDayForecast(data) {
    var lat = data.coord.lat;
    console.log(lat);
    var lon = data.coord.lon;
    console.log(lon);
    var apiUrl = `${weatherRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current,alerts&units=imperial&appid=${APIKey}`;

    fetch(apiUrl)
        .then(function (data) {

            return data.json();
        })
        .then(function (data) {
            console.log(data);
            var daily = data.daily;
            console.log(daily);
            console.log(daily.length);
            for (let i = 0; i < 5; i++) {
                var headingFive = document.createElement('div');
                var heading = document.createElement('div');
                headingFive.setAttribute('class', 'col-12');
                heading.textContent = '5 Day Forecast';
                headingFive.append(heading);

                var temp = data.daily[i].temp.day;
                var humidity = data.daily[i].humidity;
                console.log(humidity);
                var windMph = data.daily[i].wind_speed;
                var weatherIcon = data.daily[i].weather[0].weatherIcon
                var iconUrl = `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;
                var iconDescription = data.daily[i].weather[0].description
                var col = document.createElement('div');
                var card = document.createElement('div');
                var cardBody = document.createElement('div');
                var cardTitle = document.createElement('h5');
                var weatherIcon = document.createElement('img');
                var tempEl = document.createElement('p');
                var windEl = document.createElement('p');
                var humidityEl = document.createElement('p');

                col.append(card);
                card.append(cardBody);
                cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

                col.setAttribute('class', 'col-md');
                col.classList.add('five-day-card');
                card.setAttribute('class', 'card bg-primary text-white');
                cardBody.setAttribute('class', 'card-body p-2');
                cardTitle.setAttribute('class', 'card-title');
                tempEl.setAttribute('class', 'card-text');
                windEl.setAttribute('class', 'card-text');
                humidityEl.setAttribute('class', 'card-text');

                // Add content to elements
                cardTitle.textContent = dayjs().add(i, 'day').format('M/D/YYYY');
                weatherIcon.setAttribute('src', iconUrl);
                weatherIcon.setAttribute('alt', iconDescription);
                tempEl.textContent = `Temp: ${temp} °F`;
                windEl.textContent = `Wind: ${windMph} MPH`;
                humidityEl.textContent = `Humidity: ${humidity} %`;

                fiveDay.append(col);
            }
            fiveDay = '';



        });
};

function handleSearchFormSubmit(e) {
    if (!searchCityInput.value) {
        return;
    }

    e.preventDefault();
    var search = searchCityInput.value.trim();
    if (!searchHistoryList.includes(search)) {
        searchHistoryList.push(search);
        var searchedCity = document.createElement('button');
        searchedCity.classList.add('history-btn');
        searchedCity.textContent = search;
        searchHistoryDisplay.append(searchedCity);
    };
    
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
    console.log(search);
    searchCityInput.value = "";
   
    findWeather(search);

}

function handleSearchHistoryClick(e) {
    if (!e.target.matches('.btn-history')) {
    return;
    }
    var btn = e.target;
    var search = btn.getAttribute('data-search');
    appendToHistory(search);
    findWeather(search);
}

searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryDisplay.addEventListener('click', handleSearchHistoryClick);