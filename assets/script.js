var APIKey = "09aa00c5fb117d6a47b132ca6f599e84";
var weatherRootUrl = "https://api.openweathermap.org";
var searchCityInput=$("#city");
var searchHistory = [];
var searchForm = document.querySelector('#search-form');
var searchCityInput = document.querySelector('#search-input');
var todayDisplay = document.querySelector('#today');
var futureDisplay = document.querySelector('#future');
var searchHistoryDisplay= document.querySelector('#history');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

    function findWeather(search) {
            var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + search + "&units=imperial&appid=" + APIKey;
            fetch(queryURL)
            .then(function (data) {

                return data.json();
            })
            .then(function(data) {
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
                
                var humidity =data.main.humidity;
                console.log(humidity);
                var humidityEL  = document.createElement("p");
                humidityEL.setAttribute("class", "card-text");
                humidityEL.textContent = `Humidity: ${humidity} %`;
                
                var UVIndex =data.clouds.all;
                console.log(UVIndex);
                var uvEL = document.createElement("p");
                var uvBadge = document.createElement("btn");
                    
                weatherIcon= data.weather.icon;
                var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                var weatherIcon = document.createElement("img");
                weatherIcon.setAttribute("src", iconUrl);
                    
                cardBody.append(heading, weatherIcon, tempEL, windSpeedEL, humidityEL, uvBadge);           
                card.append(cardBody);

                todayDisplay.innerHTML = "";
                todayDisplay.append(card);
                var lat = data.coord.lat;
                console.log(lat);
                var lon = data.coord.lon;
                console.log(lon);
                fetchWeather(lat, lon);
            });
        
    };




    function getSearchHistory() {
     searchHistory.innerHTML = "";
        for(var i = searchHistory.length -1; i>=0; i--) {
            var btn = document.createElement("button");
            btn.setAttribute("type", "button");
            btn.setAttribute("aria-controls", "today's forecast");
            btn.classList.add("history-btn", "btn-history");
            btn.setAttribute("data-search", searchHistory[1]);
            btn.textContent = searchHistory[i];
            searchHistoryDisplay.append(btn);
        }
    }

    function searchHistoryAppend (search) {
        if(searchHistory.indexOf(search) !== -1) {
            return;
        }
        searchHistory.push(search);
        localStorage.setItem('search-history', JSON.stringify(searchHistory));
        console.log(searchHistory)
        getSearchHistory();
    } 
    function initSearchHistory() {
        var storedHistory = localStorage.getItem('search-history');
        if (storedHistory) {
          searchHistory = JSON.parse(storedHistory);
        }
        getSearchHistory();
      }
      
    

    function renderForecastCard(data) {
        
            var startDt = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
            console.log(startDt);
            var endDt = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();
            console.log(endDt);
            // variables for data from api
            var unixTs = dailyForecast.dt;
            //var iconUrl = `https://openweathermap.org/img/w/${dailyForecast.weather.icon}.png`;
            //var iconDescription = dailyForecast.weather.description;
            
            
            var dailyTemp = dailyForecast.temp;
           
            var humidity  = dailyForecast.humidity;
            var windMph = dailyForecast.wind_speed;
        
            // Create elements for a card
            var col = document.createElement('div');
            var card = document.createElement('div');
            var cardBody = document.createElement('div');
            var cardTitle = document.createElement('h5');
            var weatherIcon = document.createElement('img');
            var tempEl = document.createElement('p');
            var windEl = document.createElement('p');
            var humidityEl = document.createElement('p');
        
            
            
            col.setAttribute('class', 'col-md');
            col.classList.add('five-day-card');
            card.setAttribute('class', 'card bg-primary h-100 text-white');
            cardBody.setAttribute('class', 'card-body p-2');
            cardTitle.setAttribute('class', 'card-title');
            tempEl.setAttribute('class', 'card-text');
            windEl.setAttribute('class', 'card-text');
            humidityEl.setAttribute('class', 'card-text');
                console.log(dailyTemp)
            // Add content to elements
            cardTitle.textContent = dayjs.unix(unixTs).tz(timezone).format('M/D/YYYY');
            //weatherIcon.setAttribute('src', iconUrl);
            //weatherIcon.setAttribute('alt', iconDescription);
            tempEl.textContent = `Temp: ${dailyTemp} °F`;
            windEl.textContent = `Wind: ${windMph} MPH`;
            humidityEl.textContent = `Humidity: ${humidity} %`;
            futureDisplay.append(card);
            card.append(cardBody);
            cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
            for (var i = 0; i < dailyForecast.length; i++) {
                if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
                    renderForecastCard(dailyForecast[i], timezone);
                  }
        
      
        futureDisplay.innerHTML = "";
        futureDisplay.append(card);

      }
    }
      

    function renderItems(city, data) {
        //renderCurrent(city, data.current, data.timezone);
        renderForecastCard(data.daily, data.timezone);
    }
      
    function fetchWeather(lat, lon) {
        var apiUrl = `${weatherRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`;
              
        fetch(apiUrl)
        .then(function (res) {
            console.log(res);
            return res.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert('Location not found');
            } else {
                appendToHistory(search);
                renderForecastCard(data);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
    }
    
    

    
              
   function handleSearchHistoryClick(e) {
        if (!e.target.matches('.btn-history')) {
            return;
        }   
        var btn = e.target;
        var search = btn.getAttribute('data-search');
        findWeather(search);
    }                     
    

    function handleSearchFormSubmit(e) {
        if(!searchCityInput.value) {
            return;
        }
            
        e.preventDefault();
        var search = searchCityInput.value.trim();
        console.log(search);
        findWeather(search);
        searchCityInput.value = "";
    };

initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryDisplay.addEventListener('click', handleSearchHistoryClick);
        
     
  /*   }
    getItems();
        function getItems() {
            
           var listHistory = JSON.parse(localStorage.getItem("searchHistory"));
            for(i = 0; i < listHistory.length; i++) {
                if(i ===8)
                break;
            }
            listHistoryBtn = $(",a.").attr({
                class: "list-group-item",
                href: "#"
            });
            listHistoryBtn.text(searchHistory[i]);
            $(".list-group").append(listHistoryBtn)
        };


        $(".list-group-item").click(function() {
            city = $(this).text();
            getData();
        });
    };

    function findFiveDay() {
var queryURL1 = "http://api.openweathermap.org/data/2.5/onecall?q=" + search + "&units=imperial&appid=" + APIKey;
fetch(queryURL1)
.then(function(response) {
    console.log(response);
    return response.json() 
    
})
.then(function(data) {

    console.log(data);
    var newCard= $("<div>").attr("class", "card col-sm-2","background-color:rgb(60, 60, 109)");
    fiveDay.append(newCard);
    newCard.append($("<h4>").html(date++));
    newCard.append($("<p>").html("Temp: " ));
    newCard.append($("</p>").html("Wind: "));
    newCard.append($("<p>").html("Humidity: "));

})
}


*/

