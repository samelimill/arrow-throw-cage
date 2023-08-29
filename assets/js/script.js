const searchInput = document.querySelector('#search-input');
const submitButton = document.querySelector('#submit');
const clearHistoryButton = document.querySelector('#clear-history');
const apiKey = "302d05c6f5d859a7057c6224b7b6b172";

var historyList = document.querySelector('#history-list');
var mainHeader = document.querySelector('#main-header');
var searchOptionList = document.querySelector('#search-options-list');
var searchOptionContainer = document.querySelector('#search-option-container');
var weatherDisplay = document.querySelector('#weather-display');
var currentWeather = document.querySelector('#current-weather');
var forecastContainer = document.querySelector('#forecast-container');
var forecast = document.querySelector('#forecast');
var storedList = [];

clearHistoryButton.addEventListener('click', clearHistory);

document.onload=getHistory();

function hideCards(){
    searchOptionContainer.style.display = 'none';
    weatherDisplay.style.display = 'none';
};

// Submit button fetches geocoding for possible results
submitButton.addEventListener('click', fetchChoices);

function fetchChoices(event) {
    event.preventDefault();
    clearOptions();
   // hideCards();
    searchOptionContainer.style.display = 'block';
    let searchValue = searchInput.value.trim();
    if (searchValue){
        fetch ('http://api.openweathermap.org/geo/1.0/direct?q='+searchValue+'&limit=5&appid='+apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                mainHeader.textContent = 'Please select from the following:'
                for (var i = 0; i<=data.length; i++){
                    var name = data[i].name;
                    var country = data[i].country;
                    var state = data[i].state;
                    var lat = data[i].lat;
                    var lon = data[i].lon;
                    var optionString = '<button id="optionSelect" data-lat='+lat+' data-lon='+lon+' class="btn btn-outline-primary bg-info fw-bold fs-5 border rounded p-2 h-25 m-2 w-100 " aria-label="option"">'+name+", "+state+", "+country+'</button>';
                    var optionListItem = document.createElement('li');
                    optionListItem.innerHTML = optionString;
                    searchOptionList.appendChild(optionListItem);
                }
            });
    } else {
        alert('Please enter a city');
    };
};

function getHistory(){
    storedList = JSON.parse(localStorage.getItem('history'));
    historyList.innerHTML = storedList.join('');
}



function clearOptions() {
    searchOptionList.innerHTML="";
    mainHeader.innerHTML="";
}

searchOptionList.addEventListener('click', getWeather);

function getWeather(event){
    if (event.target.matches('#optionSelect') ){
        clearOptions();
        mainHeader.textContent = event.target.textContent;
        var latSingle = event.target.getAttribute('data-lat');
        var lonSingle = event.target.getAttribute('data-lon');
        addHistory(event.target);
        getHistory();
        fetch ('http://api.openweathermap.org/data/2.5/forecast?lat='+latSingle+'&lon='+lonSingle+'&appid='+apiKey+"&units=imperial")
            .then(function(response) {
                return response.json();
            })
            .then (function(data){
                hideCards();
                weatherDisplay.style.display = 'block';
                showWeather(data);
                showForecast(data);
            })
    };
};

function addHistory(choice) {
    if (storedList==null){
        storedList=[];
    }
    var choiceName = choice.textContent;
    var choiceCity = choiceName.split(",");
    var latStorage = choice.getAttribute('data-lat');
    var lonStorage = choice.getAttribute('data-lon');
    var storageString = '<button id="option-select" data-lat='+latStorage+' data-lon='+lonStorage+' class="btn btn-outline-primary bg-info fw-bold fs-5 border rounded p-2 h-25 w-100 " aria-label="option"">'+choiceCity[0]+', '+choiceCity[1]+'</button>';
    storedList.push(storageString);
    localStorage.setItem('history', JSON.stringify(storedList));
}
function clearHistory(){
    localStorage.setItem('history', '[]');
    getHistory();
}

var optionSelect = document.querySelector('#option-select');

function showWeather(data){
    console.log(data);
    currentWeather.innerHTML= 
        data.list[0].weather[0].description + '<br/>' +
        'Temperature: '+data.list[0].main.temp+' F <br/>' + 
        'Wind Speed: '+data.list[0].wind.speed+' MPH <br/>' +
        'Humidity: '+data.list[0].main.humidity+'%';
};

function showForecast(data){
    var forecastArr = [];
    for (var i = 7; i<=40; i+=8){
        var date = data.list[i].dt_txt.slice(5, 10);
        var weather = data.list[i].weather[0].description;
        var temp = data.list[i].main.temp;
        var wind = data.list[i].wind.speed;
        var singleCard = '<div class="border col-2 align-items-center"><h4>'+date+'</h4><br/>'+weather+"<br/> temp: "+temp+"<br/> wind speed: "+wind+'</div>';
        forecastArr.push(singleCard);
    }
    console.log(forecastArr);
    forecast.innerHTML = forecastArr.join('');
};