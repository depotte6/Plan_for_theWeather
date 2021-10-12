var APIKey = "09aa00c5fb117d6a47b132ca6f599e84";
var weatherRootUrl = "https://api.openweathermap.org";
var searchCityInput=$("#city");
var cityList = [];
var fiveDay=$(".card-deck");

var searchForm = document.querySelector('#search-from');
var searchCityInput = document.querySelector('#search-input');
var todayDisplay = document.querySelector('#today');
var futureDisplay = document.querySelector('#future');
var searchHistoryDisplay= document.querySelector('#history');


dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

$(document).ready(function(event) {
    $("#search-btn").on("click", function(event) { 
        event.preventDefault();
        var searchCity = $("#city").val().trim();
        console.log(searchCity); 
        currentConditions(searchCity);
        searchCityInput.val("");
  
    function searchHistoryDisplay() {
        searchHistory.innerHTML = "";
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
    function currentConditions(city, weather, timezone) {
        event.preventDefault();
        var date = dayjs().tz(timezone).format("M/D/YYYY");

        var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
        var iconDescription = weather.weather[0].description || weather[0].main;
        var humidity = weather.humidity;
        var uv = weather.uvi;
        var windSpeed = weather.wind_speed;
        var temp = weather.temp;
        var weatherIcon = document.createElement("img");
        var tempEL = document.createElement("p");
        var humidityEL  = document.createElement("p");
        var windSpeedEL = document.createElement("p");
        var uvEL = document.createElement("p");
        var uvBadge = document.createElement("button");
        var card = document.createElement("div");
        var cardBody = document.createElement("div");
        var heading = document.createElement("h1");

        heading.setAttribute("class", "h3 card-title");
        tempEL.setAttribute("class", "card-text");
        windSpeedEL.setAttribute("class", "card-text");
        humidityEL.setAttribute("class", "card-text");

        heading.textContent = `${city} (${date})`;
        tempEL.textContent = `Temp: ${temp}`;
        windSpeedEL.textContent = `Wind: ${windSpeed}`;
        humidityEL.textContent = `Humidity: ${humidity}`;
        cardBody.append(heading, tempEL, windEL, humidityEL);

        weatherIcon.setAttribute("src", iconUrl);

        card.setAttribute("class", "card");
        cardBody.setAttribute("class", "card-body");
        card.append(cardBody);

        todayDisplay.innerHTML = "";
        todayDisplay.append(card);
    }


        function fetchWeather(location) {
            var { lat } = location;
            var { lon } = location;
            var city = location.name;
            var apiUrl = `${weatherRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${APIKey}`;
          
            fetch(apiUrl)
              .then(function (res) {
                return res.json();
              })
              .then(function (data) {
                renderItems(city, data);
              })
              .catch(function (err) {
                console.error(err);
              });
        }

              function fetchCoords(search) {
                var apiUrl = `${weatherRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${APIKey}`;
              
                fetch(apiUrl)
                  .then(function (res) {
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
              
              function handleSearchHistoryClick(e) {
                // Don't do search if current elements is not a search history button
                if (!e.target.matches('.btn-history')) {
                  return;
                }
              
                var btn = e.target;
                var search = btn.getAttribute('data-search');
                fetchCoords(search);
              }
              
              initSearchHistory();
              searchForm.addEventListener('submit', handleSearchFormSubmit);
              searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);
              
            })
        
     /*   var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=" + APIKey;
        fetch(queryURL)
        .then(function (data) {
        
            return data.json();
        })
        .then(function(data) {
     
            console.log(data);
            var city = data.name;
            current.append($("<h3>").html(city + " (" + date +")"));
            var temp = data.main.temp;
            current.append($("<p>").html("Temp: " + temp));
            var wind = data.wind.speed;
            current.append($("<p>").html("Wind: " + wind));
            var humidity =data.main.humidity;
            current.append($("<p>").html("Humidity: " + humidity));
            var UVIndex =data.clouds.all;
            current.append($("<p>").html("UV Index: " + UVIndex));

        currentConditions(city);
        });
    

        var queryURL1 = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&units=imperial&appid=" + APIKey;
        fetch(queryURL1)
        .then(function(response) {
            event.preventDefault();
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
    getItems();
        function getItems() {*/
            
        /*    var listHistory = JSON.parse(localStorage.getItem("searchHistory"));
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
*/
})
initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);
