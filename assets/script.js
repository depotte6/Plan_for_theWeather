

var APIKey = "09aa00c5fb117d6a47b132ca6f599e84";
var weatherRootUrl = "https://api.openweathermap.org";
var searchCityInput=$("#city");
var cityList = [];

var searchForm = document.querySelector('#search-form');
var searchCityInput = document.querySelector('#search-input');
var todayDisplay = document.querySelector('#today');
var futureDisplay = document.querySelector('#future');
var searchHistory= document.querySelector('#history');


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
            heading.setAttribute("class", "h2 card-title");
            heading.textContent = `${city} (${date})`;


            var temp = data.main.temp;
            console.log(temp);
            var tempEL = document.createElement("p");
            tempEL.setAttribute("class", "card-text");
            tempEL.textContent = `Temp: ${temp}`;
         
            var windSpeed = data.wind.speed;
            console.log(windSpeed);
            var windSpeedEL = document.createElement("p");
            windSpeedEL.setAttribute("class", "card-text");  
            windSpeedEL.textContent = `Wind: ${windSpeed}`;        
            
            var humidity =data.main.humidity;
            console.log(humidity);
            var humidityEL  = document.createElement("p");
            humidityEL.setAttribute("class", "card-text");
            humidityEL.textContent = `Humidity: ${humidity}`;
            
            var UVIndex =data.clouds.all;
            console.log(UVIndex);
            var uvEL = document.createElement("p");
            var uvBadge = document.createElement("button");
                   
            weatherIcon= data.weather.icon;
            var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            var weatherIcon = document.createElement("img");
            weatherIcon.setAttribute("src", iconUrl);
                
            cardBody.append(heading, tempEL, windSpeedEL, humidityEL, weatherIcon);           
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




    /*function getSearchHistory(searchHistory) {
       // searchHistory.innerHTML = "";
        for(var i = searchHistory.length -1; i>=0; i--) {
            var button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("aria-controls", "today's forecase");
            button.classList.add("history-button", "button-history");
            button.setAttribute("data-search", searchHistory[1]);
            button.textContent = searchHistory[i];
            searchHistoryDisplay.append(button);
        }
    }

    function initSearchHistory() {
        var searchHistory = localStorage.getItem("search-history");
        if(searchHistory) {
            searchHistory = JSON.parse(searchHistory);
            console.log(searchHistory);
        }
        getSearchHistory(searchHistory);
    }*/
    

    function renderForecastCard(data) {
        // variables for data from api
        var unixTs = data.daily.dt;
        var iconUrl = `https://openweathermap.org/img/w/${data.daily[1].weather.icon}.png`;
        var iconDescription = data.daily[1].weather.description;
        var dailyTemp = data.daily[1].temp.day;
        console.log(dailyTemp)
        var { humidity } = data.daily[1].humidity;
        var windMph = data.daily[1].wind_speed;
      
        // Create elements for a card
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
        card.setAttribute('class', 'card bg-primary h-100 text-white');
        cardBody.setAttribute('class', 'card-body p-2');
        cardTitle.setAttribute('class', 'card-title');
        tempEl.setAttribute('class', 'card-text');
        windEl.setAttribute('class', 'card-text');
        humidityEl.setAttribute('class', 'card-text');
      
        // Add content to elements
        cardTitle.textContent = dayjs.unix(unixTs).format('M/D/YYYY');
        weatherIcon.setAttribute('src', iconUrl);
        weatherIcon.setAttribute('alt', iconDescription);
        tempEl.textContent = `Temp: ${dailyTemp} °F`;
        windEl.textContent = `Wind: ${windMph} MPH`;
        humidityEl.textContent = `Humidity: ${humidity} %`;
      
        futureDisplay.innerHTML = "";
        futureDisplay.append(card);

      }
      
      

    function renderItems(city, data) {
        renderCurrent(city, data.current, data.timezone);
        renderForecast(data.daily, data.timezone);
    }
      
    function fetchWeather(lat, lon) {
        var apiUrl = `${weatherRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIKey}`;
          
        fetch(apiUrl)
        .then(function (res) {
            console.log(res);
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            renderForecastCard(data);
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

//initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
//getSearchHistory.addEventListener('click', handleSearchHistoryClick);
        
     
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

function fetchCoords(search) {
        var apiUrl = `${weatherRootUrl}/data/2.5/onecall?q=${search}&appid=${APIKey}`;
              
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
                fetchWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
    }
*/

