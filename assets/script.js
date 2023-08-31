// Establish global variables for search form and API use
const searchInput = document.querySelector('#search-input');
const submitButton = document.querySelector('#submit');
const clearHistoryButton = document.querySelector('#clear-history');
const apiKey = "302d05c6f5d859a7057c6224b7b6b172";

// Variables for fields to be filled by JavaScript
var historyList = document.querySelector('#history-list');
var mainHeader = document.querySelector('#main-header');
var weatherDisplay = document.querySelector('#weather-display');
var searchOptionContainer = document.querySelector('#search-option-container');
var searchOptionList = document.querySelector('#search-options-list');
var forecastContainer = document.querySelector('#forecast-container');
var currentWeather = document.querySelector('#current-weather');
var forecast = document.querySelector('#forecast');

// Populates history list on load
var storedList = getHistory();

function getHistory(){
    var storage = JSON.parse(localStorage.getItem('history'));
    historyList.innerHTML = storage.join('');
    return storage;
};

// Submit button fetches geocoding for possible results
submitButton.addEventListener('click', fetchChoices);

function fetchChoices(event) {
    event.preventDefault();
    clearOptions();
    hideCards();
    searchOptionContainer.style.display = 'flex';
    // Removes any spaces from the search value
    let searchValue = searchInput.value.trim();
    // Either does an api search for the input or alerts the user to enter a city
    if (searchValue){
        fetch ('https://api.openweathermap.org/geo/1.0/direct?q='+searchValue+'&limit=5&appid='+apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                mainHeader.textContent = 'Please select from the following:'
                // For loop generates a list of up to five possible cities returned by the api 
                for (var i = 0; i<=data.length; i++){
                    var name = data[i].name;
                    var country = data[i].country;
                    var state = data[i].state;
                    var lat = data[i].lat;
                    var lon = data[i].lon;
                    // Constructs a button as a string, contains all needed data for later functions
                    var optionString = '<button id="option-select" data-lat=' +lat+' data-lon='+lon+' class="btn btn-light fs-5 border rounded p-2 h-25 m-2 w-100 " aria-label="option"">'+name+", "+state+", "+country+'</button>';
                    var optionListItem = document.createElement('li');
                    optionListItem.innerHTML = optionString;
                    searchOptionList.appendChild(optionListItem);
                }
            });
    } else {
        alert('Please enter a city');
    };
};

// Function to hide all cards, cards are displayed via other functions
function hideCards(){
    searchOptionContainer.style.display = 'none';
    forecastContainer.style.display = 'none';
};

// clears header text for main element
function clearOptions() {
    searchOptionList.innerHTML="";
    mainHeader.innerHTML="";
};

// Event listener for buttons in the returns search options and history list, both go to the same function
searchOptionList.addEventListener('click', getWeather);
historyList.addEventListener('click', getWeather);

function getWeather(event){
    if (event.target.matches('#option-select') || event.target.matches('#option-selected')){
        clearOptions();
        mainHeader.textContent = event.target.textContent;
        var latSingle = event.target.getAttribute('data-lat');
        var lonSingle = event.target.getAttribute('data-lon');
        // Only adds search to history and updates history list if results obtained from search options
        if (event.target.matches('#option-select')){
            addHistory(event.target);
            getHistory();
        }; 
        fetch ('https://api.openweathermap.org/data/2.5/forecast?lat=' + latSingle + '&lon=' + lonSingle + '&appid=' + apiKey + "&units=imperial")
            .then(function(response) {
                return response.json();
            })
            .then (function(data){
                hideCards();
                forecastContainer.style.display = 'block';
                showForecast(data);
            })
    };
};

// Function adds new button to history list, constructed from data obtained from the button pushed in the option list
function addHistory(choice) {
    var choiceName = choice.textContent;
    var choiceCity = choiceName.split(",");
    var latStorage = choice.getAttribute('data-lat');
    var lonStorage = choice.getAttribute('data-lon');
    // Button as a string containing information gleaned from the button pressed in option list
    var storageString = '<button id="option-selected" data-lat=' + latStorage + ' data-lon=' + lonStorage + ' class="btn btn-light fs-5 rounded border p-2 h-25 col-12 my-1" aria-label="option"">' + choiceCity[0] + ', ' + choiceCity[1] + '</button>';
    storedList.push(storageString);
    localStorage.setItem('history', JSON.stringify(storedList));
}

clearHistoryButton.addEventListener('click', clearHistory);

function clearHistory(){
    localStorage.setItem('history', '[]');
    // Prevents list from repopulating if the user searches after clearing history but before reload
    storedList = [];
    getHistory();
}

// Function gathers data directly from whichever button is pressed in the history list or the search options list
function showForecast(data){
    console.log(data);
    // Weather for current day
    currentWeather.innerHTML= 
        '<div class="border col-12 bg-opacity-10 bg-info text-center m-2 p-3"><h2>' + data.list[0].dt_txt.slice(5, 10) + '</h2><br/>' + '<img src="http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png" alt="Icon"/><br/><h2>' + data.list[0].weather[0].description + '</h2><br/><br/>' + 'Temperature: ' + data.list[0].main.temp + ' F <br/>' + 'Wind Speed: ' + data.list[0].wind.speed + ' MPH <br/>' + 'Humidity: ' + data.list[0].main.humidity + '%</div>';
    // Constructs an array of div elements as strings, which are added to the forecast row
    var forecastArr = [];
    for (var i = 7; i<=40; i+=8){
        var date = data.list[i].dt_txt.slice(5, 10);
        var weatherIcon = data.list[i].weather[0].icon;
        var weather = data.list[i].weather[0].description;
        var temp = data.list[i].main.temp;
        var wind = data.list[i].wind.speed;
        var humidity = data.list[i].main.humidity
        var singleCard = '<div class="border bg-primary bg-opacity-10 col-s-12 col-md-5 col-xl-2 m-2 p-3 text-center"><h3>' + date + '</h3><br/>' + '<img src="http://openweathermap.org/img/w/' + weatherIcon + '.png" alt="Icon""/><br/>' + weather + '<br/><br/><u>Temp:</u><br/>' + temp + 'F<br/><u>Wind speed:</u><br/>' + wind + 'MPH<br/><u>Humidity:</u><br/>' + humidity + '%</div>';
        forecastArr.push(singleCard);
    };
    forecast.innerHTML = forecastArr.join('');
};