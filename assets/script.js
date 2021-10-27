var APIKey = "ca2dc2e2fa9d729bac6bea4c5614b4ae";
var weatherRootUrl = "https://api.openweathermap.org";
var searchCityInput=$("#city");
var searchHistory = [];
var searchForm = document.querySelector('#search-form');
var searchCityInput = document.querySelector('#search-input');
var todayDisplay = document.querySelector('#today');
var searchHistoryDisplay= document.querySelector('#history');
var fiveDay = document.querySelector('#future');

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
           
                var apiUrl = `${weatherRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current,alerts&units=imperial&appid=${APIKey}`;
              
                fetch(apiUrl)
                .then(function (data) {

                    return data.json();
                })
                .then(function(data) {
                    console.log(data);
                    var headingFive = document.createElement('div');
                    var heading = document.createElement('div');
                    headingFive.setAttribute('class', 'col-12');
                    heading.textContent = '5 Day Forecast';
                    headingFive.append(heading);
                    
                    var startDate = dayjs().add(1, 'day').format("M/D/YYYY");
                    console.log(startDate);
                    var endDate = dayjs().add(5, 'day').format("M/D/YYYY");
                    console.log(endDate);
                
                
                    var newCard= $("<div>").attr("class", "card col-sm-2","background-color:rgb(60, 60, 109)");
                    fiveDay.append(newCard);
                    newCard.append($("<h4>").html(date++));
                    newCard.append($("<p>").html("Temp: " ));
                    newCard.append($("</p>").html("Wind: "));
                    newCard.append($("<p>").html("Humidity: "));
                    var temp = data.daily[1].temp.day;
                    console.log(temp);
                        
                        var humidity  = data.daily[1].humidity;
                        var windMph = data.daily[1].wind_speed;
                        var weatherIcon = data.daily[1].weather[0].icon;
            
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
                        weatherIcon.setAttribute('src', iconUrl);
                        tempEl.textContent = `Temp: ${temp} °F`;
                        windEl.textContent = `Wind: ${windMph} MPH`;
                        humidityEl.textContent = `Humidity: ${humidity} %`;
                        col.append(card);
                        card.append(cardBody);
                        cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
                    
                    
        
                        fiveDay.innerHTML = "";
                        fiveDay.append(card);

                    });
                                
                            } )            //renderForecastCard(data);

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
      
  



       
      

    
    function fetchCoords(search) {
        var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
      
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
        
     

  /*  getItems();
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

*/